#!/usr/bin/env python3
"""
Phase 2: Gradual detailed scraping over multiple days.
Fetches detailed parameter info for each node with resumable progress.
"""

import cloudscraper
import json
from bs4 import BeautifulSoup
from pathlib import Path
import time
import logging
from typing import Dict, Set
import argparse

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(message)s')
logger = logging.getLogger(__name__)


class Phase2DetailedScraper:
    """Resumable scraper for detailed blueprint node information."""

    def __init__(self, nodes_per_session=50, delay=2.0):
        self.scraper = cloudscraper.create_scraper(
            browser={'browser': 'chrome', 'platform': 'windows', 'desktop': True}
        )
        self.scraper.headers.update({
            'Referer': 'https://dev.epicgames.com/',
        })

        self.base_api_url = 'https://dev.epicgames.com/community/api/documentation'
        self.delay = delay
        self.nodes_per_session = nodes_per_session
        self.detailed_cache_dir = Path('detailed_cache')
        self.detailed_cache_dir.mkdir(exist_ok=True)
        self.progress_file = Path('phase2_progress.json')
        self.completed_urls: Set[str] = set()
        self.failed_urls: Set[str] = set()

    def load_progress(self):
        """Load progress from previous runs."""
        if self.progress_file.exists():
            with open(self.progress_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                self.completed_urls = set(data.get('completed', []))
                self.failed_urls = set(data.get('failed', []))
            logger.info(f"📂 Loaded progress: {len(self.completed_urls)} completed, {len(self.failed_urls)} failed")

    def save_progress(self):
        """Save current progress."""
        data = {
            'completed': list(self.completed_urls),
            'failed': list(self.failed_urls),
            'lastUpdate': time.strftime('%Y-%m-%d %H:%M:%S')
        }
        with open(self.progress_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2)

    def extract_path_from_url(self, url: str) -> str:
        """Extract doc path from URL."""
        import re
        match = re.search(r'/documentation/([\w-]+/[\w-]+/[\w-]+/.+?)(?:\?|$)', url)
        return match.group(1) if match else ''

    def get_cache_filename(self, url: str) -> Path:
        """Get cache filename for a URL."""
        path = self.extract_path_from_url(url)
        safe_name = path.replace('/', '_').replace('-', '_')
        return self.detailed_cache_dir / f"{safe_name}.json"

    def fetch_node_details(self, url: str) -> Dict:
        """Fetch detailed info for a single node."""
        path = self.extract_path_from_url(url)
        if not path:
            return {}

        cache_file = self.get_cache_filename(url)
        if cache_file.exists():
            with open(cache_file, 'r', encoding='utf-8') as f:
                return json.load(f)

        api_url = f"{self.base_api_url}/document.json?path={path}&application_version=5.5"

        try:
            time.sleep(self.delay)
            response = self.scraper.get(api_url, timeout=30)
            response.raise_for_status()
            data = response.json()

            # Cache it
            with open(cache_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)

            return data

        except Exception as e:
            if '500' in str(e):
                logger.warning(f"  ⚠️  500 error (server issue)")
            elif '403' in str(e):
                logger.warning(f"  ⚠️  403 error (rate limit) - sleeping 60s")
                time.sleep(60)
            else:
                logger.error(f"  ✗ Error: {e}")
            return {}

    def parse_node_details(self, data: Dict) -> Dict:
        """Parse detailed node info from API response."""
        details = {
            'inputs': [],
            'outputs': [],
            'returnValue': None,
            'detailedDescription': data.get('description', ''),
            'examples': []
        }

        if 'blocks' not in data:
            return details

        for block in data['blocks']:
            if block.get('type') == 'markdown' and 'content_html' in block:
                html = block['content_html']
                soup = BeautifulSoup(html, 'html.parser')

                # Extract detailed description
                paragraphs = soup.find_all('p')
                if paragraphs:
                    full_desc = ' '.join([p.get_text(strip=True) for p in paragraphs[:5]])
                    details['detailedDescription'] = full_desc

                # Extract parameter tables
                for table in soup.find_all('table'):
                    rows = table.find_all('tr')
                    if len(rows) <= 1:
                        continue

                    headers = [th.get_text(strip=True).lower() for th in rows[0].find_all('th')]
                    is_output = any(kw in ' '.join(headers) for kw in ['output', 'return'])

                    for row in rows[1:]:
                        cols = [td.get_text(strip=True) for td in row.find_all('td')]
                        if len(cols) >= 2:
                            param = {
                                'name': cols[0],
                                'type': cols[1],
                                'description': cols[2] if len(cols) > 2 else ''
                            }
                            if is_output:
                                details['outputs'].append(param)
                            else:
                                details['inputs'].append(param)

                # Extract code examples
                code_blocks = soup.find_all(['pre', 'code'])
                for code in code_blocks[:3]:
                    example = code.get_text(strip=True)
                    if example and len(example) > 20:
                        details['examples'].append(example)

        return details

    def scrape_session(self, nodes_to_scrape: list):
        """Run a scraping session for a batch of nodes."""
        logger.info(f"🔄 Starting session: {len(nodes_to_scrape)} nodes")
        logger.info(f"   Delay: {self.delay}s per request\n")

        successful = 0
        failed = 0
        skipped = 0

        for i, node in enumerate(nodes_to_scrape, 1):
            url = node['url']

            if url in self.completed_urls:
                skipped += 1
                continue

            if url in self.failed_urls and len(self.failed_urls) < 100:
                # Retry previously failed
                logger.info(f"  [{i}/{len(nodes_to_scrape)}] Retrying: {node['displayName']}")

            else:
                logger.info(f"  [{i}/{len(nodes_to_scrape)}] {node['displayName']}")

            data = self.fetch_node_details(url)

            if data:
                details = self.parse_node_details(data)
                node.update(details)
                node['hasDetailedInfo'] = True
                self.completed_urls.add(url)
                successful += 1
                logger.info(f"      ✓ Success ({len(details['inputs'])} inputs, {len(details['outputs'])} outputs)")
            else:
                self.failed_urls.add(url)
                failed += 1

            # Save progress every 10 nodes
            if i % 10 == 0:
                self.save_progress()

        self.save_progress()

        logger.info(f"\n📊 Session complete:")
        logger.info(f"   Successful: {successful}")
        logger.info(f"   Failed: {failed}")
        logger.info(f"   Skipped: {skipped}")
        logger.info(f"   Total progress: {len(self.completed_urls)}/{len(self.completed_urls) + len(self.failed_urls)}")

    def run(self):
        """Run Phase 2 scraper."""
        logger.info("🚀 Phase 2: Detailed Blueprint Node Scraper")
        logger.info(f"   Nodes per session: {self.nodes_per_session}")
        logger.info(f"   Delay: {self.delay}s\n")

        # Load Phase 1 data
        phase1_file = Path('ue_blueprint_nodes_phase1.json')
        if not phase1_file.exists():
            logger.error("❌ Phase 1 file not found. Run quick_extract_from_cache.py first!")
            return

        with open(phase1_file, 'r', encoding='utf-8') as f:
            phase1_data = json.load(f)

        all_nodes = phase1_data['nodes']
        logger.info(f"📚 Loaded {len(all_nodes)} nodes from Phase 1\n")

        self.load_progress()

        # Get nodes that need scraping
        pending_nodes = [n for n in all_nodes if n['url'] not in self.completed_urls]
        logger.info(f"📋 Pending nodes: {len(pending_nodes)}")

        if not pending_nodes:
            logger.info("✅ All nodes already scraped!")
            return

        # Scrape this session's batch
        batch = pending_nodes[:self.nodes_per_session]
        self.scrape_session(batch)

        # Save updated data
        output = {
            **phase1_data,
            'phase': 'Phase 2 - With Detailed Info (In Progress)',
            'lastUpdated': time.strftime('%Y-%m-%d %H:%M:%S'),
            'progress': {
                'completed': len(self.completed_urls),
                'failed': len(self.failed_urls),
                'pending': len(pending_nodes) - len(batch),
                'total': len(all_nodes)
            }
        }

        output_file = 'ue_blueprint_nodes_phase2.json'
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(output, f, indent=2, ensure_ascii=False)

        logger.info(f"\n💾 Saved to {output_file}")
        logger.info(f"\n📈 Overall Progress:")
        logger.info(f"   {len(self.completed_urls)}/{len(all_nodes)} nodes complete ({100*len(self.completed_urls)/len(all_nodes):.1f}%)")
        logger.info(f"\n💡 Run this script again tomorrow to continue scraping!")


def main():
    parser = argparse.ArgumentParser(description='Phase 2: Detailed blueprint node scraper')
    parser.add_argument('--nodes', type=int, default=50, help='Nodes to scrape per session')
    parser.add_argument('--delay', type=float, default=2.0, help='Delay between requests (seconds)')

    args = parser.parse_args()

    scraper = Phase2DetailedScraper(nodes_per_session=args.nodes, delay=args.delay)
    scraper.run()


if __name__ == '__main__':
    main()
