#!/usr/bin/env python3
"""
Recursive Blueprint Node Scraper
Handles the hierarchical structure of the Unreal Engine Blueprint API.
"""

import cloudscraper
import json
import time
import re
from bs4 import BeautifulSoup
from typing import List, Dict, Set
from pathlib import Path
import logging
import random

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(message)s'
)
logger = logging.getLogger(__name__)


class RecursiveBlueprintScraper:
    """Recursive scraper for blueprint nodes."""

    def __init__(self, version='5.5'):
        self.scraper = cloudscraper.create_scraper(
            browser={'browser': 'chrome', 'platform': 'windows', 'desktop': True}
        )
        self.scraper.headers.update({
            'Referer': 'https://dev.epicgames.com/',
            'Origin': 'https://dev.epicgames.com',
        })

        self.version = version
        self.base_api_url = 'https://dev.epicgames.com/community/api/documentation'
        self.delay_min = 0.3
        self.delay_max = 0.7
        self.nodes_data = []
        self.visited_paths: Set[str] = set()
        self.cache_dir = Path('cache')
        self.cache_dir.mkdir(exist_ok=True)
        self.request_count = 0

    def random_delay(self):
        time.sleep(random.uniform(self.delay_min, self.delay_max))

    def get_cache_path(self, path: str) -> Path:
        safe_name = path.replace('/', '_').replace('-', '_')
        return self.cache_dir / f"{safe_name}.json"

    def fetch_json_api(self, path: str) -> Dict:
        """Fetch from API or cache."""
        cache_path = self.get_cache_path(path)

        if cache_path.exists():
            with open(cache_path, 'r', encoding='utf-8') as f:
                return json.load(f)

        url = f"{self.base_api_url}/document.json?path={path}&application_version={self.version}"
        self.request_count += 1

        if self.request_count % 20 == 0:
            logger.info(f"  [Processed {self.request_count} pages, found {len(self.nodes_data)} nodes so far]")
            self.save_progress()
            time.sleep(3)

        try:
            self.random_delay()
            response = self.scraper.get(url, timeout=30)
            response.raise_for_status()
            data = response.json()

            with open(cache_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)

            return data

        except Exception as e:
            if '403' in str(e):
                logger.warning(f"  403 error - waiting 30s...")
                time.sleep(30)
            else:
                logger.error(f"  Error: {e}")
            return {}

    def extract_path_from_url(self, url: str) -> str:
        """Extract documentation path from URL."""
        match = re.search(r'/documentation/([\w-]+/[\w-]+/[\w-]+/.+?)(?:\?|$)', url)
        return match.group(1) if match else ''

    def parse_node_page(self, data: Dict, category_path: str) -> Dict:
        """Parse an individual blueprint node page."""
        node = {
            'displayName': data.get('title', ''),
            'category': category_path,
            'description': data.get('description', ''),
            'inputs': [],
            'outputs': [],
            'metadata': {}
        }

        if 'blocks' not in data:
            return None

        for block in data['blocks']:
            if block.get('type') == 'markdown' and 'content_html' in block:
                html = block['content_html']
                soup = BeautifulSoup(html, 'html.parser')

                # Extract more detailed description
                paragraphs = soup.find_all('p')
                if paragraphs:
                    full_desc = ' '.join([p.get_text(strip=True) for p in paragraphs[:3]])
                    if full_desc and len(full_desc) > len(node['description']):
                        node['description'] = full_desc

                # Extract parameters from tables
                for table in soup.find_all('table'):
                    rows = table.find_all('tr')
                    if len(rows) <= 1:
                        continue

                    headers = [th.get_text(strip=True).lower() for th in rows[0].find_all('th')]
                    is_output_table = any(keyword in ' '.join(headers) for keyword in ['output', 'return', 'result'])

                    for row in rows[1:]:
                        cols = [td.get_text(strip=True) for td in row.find_all('td')]
                        if len(cols) >= 2:
                            param = {
                                'name': cols[0],
                                'type': cols[1],
                                'description': cols[2] if len(cols) > 2 else ''
                            }

                            if is_output_table:
                                node['outputs'].append(param)
                            else:
                                node['inputs'].append(param)

        return node if node['displayName'] else None

    def scrape_page_recursive(self, path: str, depth: int = 0, category_path: str = "") -> None:
        """Recursively scrape a page and its sub-pages."""
        if path in self.visited_paths or depth > 5:  # Max depth safety
            return

        self.visited_paths.add(path)
        data = self.fetch_json_api(path)

        if not data or 'blocks' not in data:
            return

        # Check if this page has sub-categories
        has_subcategories = False
        subcategories = []

        for block in data['blocks']:
            if block.get('type') == 'markdown' and 'content_html' in block:
                html = block['content_html']
                soup = BeautifulSoup(html, 'html.parser')
                items = soup.find_all('block-dir-item')

                if items:
                    has_subcategories = True
                    for item in items:
                        href = item.get('href', '')
                        page_name = item.get('page-name', '')
                        if href and 'BlueprintAPI/' in href:
                            sub_path = self.extract_path_from_url(href)
                            if sub_path:
                                subcategories.append({
                                    'name': page_name,
                                    'path': sub_path
                                })

        if has_subcategories:
            # This is an index page - recursively scrape subcategories
            current_category = category_path or data.get('title', '')
            indent = "  " * depth
            logger.info(f"{indent}📁 {current_category} ({len(subcategories)} items)")

            for subcat in subcategories:
                new_category_path = f"{current_category}/{subcat['name']}" if current_category else subcat['name']
                self.scrape_page_recursive(subcat['path'], depth + 1, new_category_path)

        else:
            # This is a leaf node - extract node data
            node = self.parse_node_page(data, category_path)
            if node:
                self.nodes_data.append(node)
                indent = "  " * depth
                logger.info(f"{indent}✓ {node['displayName']}")

    def scrape_all(self):
        """Start scraping from the main Blueprint API page."""
        logger.info("🚀 Starting Recursive Blueprint API Scraper")
        logger.info(f"   Version: {self.version}\n")

        # Start from main page
        main_path = 'en-us/unreal-engine/BlueprintAPI'
        self.scrape_page_recursive(main_path, depth=0, category_path="")

        self.save_results()
        logger.info(f"\n✅ Scraping Complete!")
        logger.info(f"   Pages processed: {self.request_count}")
        logger.info(f"   Total nodes: {len(self.nodes_data)}")

    def save_progress(self):
        """Save current progress."""
        self.save_results(suffix='_progress')

    def save_results(self, suffix=''):
        """Save results to JSON."""
        output = {
            'version': '2.0',
            'source': 'Unreal Engine Official Documentation API',
            'unrealVersion': self.version,
            'scrapedAt': time.strftime('%Y-%m-%d %H:%M:%S'),
            'totalNodes': len(self.nodes_data),
            'pagesProcessed': self.request_count,
            'nodes': self.nodes_data
        }

        filename = f'ue_blueprint_nodes_v{self.version}{suffix}.json'
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(output, f, indent=2, ensure_ascii=False)

        if not suffix:
            logger.info(f"\n💾 Saved {len(self.nodes_data)} nodes to {filename}")


def main():
    scraper = RecursiveBlueprintScraper(version='5.5')
    try:
        scraper.scrape_all()
    except KeyboardInterrupt:
        logger.info("\n⚠️  Interrupted by user")
        scraper.save_results(suffix='_interrupted')


if __name__ == '__main__':
    main()
