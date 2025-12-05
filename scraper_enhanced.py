#!/usr/bin/env python3
"""
Enhanced Unreal Engine Blueprint Nodes Scraper
Uses cloudscraper to bypass Cloudflare/bot protection on Epic Games website.
This version is more robust against 403 errors.
"""

import cloudscraper
import json
import time
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import re
from typing import List, Dict, Optional, Set
import logging
from pathlib import Path

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class UnrealDocsScraperEnhanced:
    """Enhanced scraper using cloudscraper for better 403 bypass."""

    def __init__(self):
        # cloudscraper automatically handles Cloudflare challenges
        self.scraper = cloudscraper.create_scraper(
            browser={
                'browser': 'chrome',
                'platform': 'windows',
                'desktop': True
            }
        )

        self.base_url = 'https://docs.unrealengine.com'
        self.delay = 1.5  # Seconds between requests
        self.nodes_data = []
        self.visited_urls: Set[str] = set()
        self.failed_urls: List[str] = []

    def fetch_page(self, url: str, retries: int = 3) -> Optional[str]:
        """Fetch a page with cloudscraper (handles Cloudflare automatically)."""
        if url in self.visited_urls:
            logger.debug(f"Already visited: {url}")
            return None

        for attempt in range(retries):
            try:
                logger.info(f"Fetching: {url} (attempt {attempt + 1}/{retries})")
                response = self.scraper.get(url, timeout=30)

                if response.status_code == 403:
                    logger.warning(f"403 Forbidden on {url}, waiting longer before retry...")
                    time.sleep(self.delay * 3)
                    continue

                response.raise_for_status()
                self.visited_urls.add(url)
                logger.info(f"✓ Successfully fetched {url}")
                return response.text

            except Exception as e:
                logger.error(f"Error fetching {url}: {e}")
                if attempt < retries - 1:
                    time.sleep(self.delay * (attempt + 2))
                    continue
                else:
                    self.failed_urls.append(url)
                    return None

        return None

    def parse_blueprint_node_page(self, html: str, url: str) -> Optional[Dict]:
        """Parse a blueprint node documentation page."""
        soup = BeautifulSoup(html, 'html.parser')

        node_data = {
            'url': url,
            'className': None,
            'displayName': None,
            'category': None,
            'description': None,
            'nodeType': None,
            'isPure': False,
            'inputs': [],
            'outputs': [],
            'properties': {},
            'examples': []
        }

        # Extract title/display name
        title_elem = soup.find('h1')
        if title_elem:
            node_data['displayName'] = title_elem.get_text(strip=True)
            # Try to extract class name from title (often in format like "K2Node_CallFunction")
            if 'K2Node' in node_data['displayName'] or 'Node_' in node_data['displayName']:
                node_data['className'] = node_data['displayName'].split()[0]

        # Extract meta description
        meta_desc = soup.find('meta', {'name': 'description'}) or soup.find('meta', {'property': 'og:description'})
        if meta_desc:
            node_data['description'] = meta_desc.get('content', '').strip()

        # Extract from main content
        main_content = soup.find('main') or soup.find('article') or soup.find('div', {'class': 'content'})
        if main_content:
            # Get description from first paragraph if not already set
            if not node_data['description']:
                first_p = main_content.find('p')
                if first_p:
                    node_data['description'] = first_p.get_text(strip=True)

            # Look for parameter/pin tables
            tables = main_content.find_all('table')
            for table in tables:
                headers = [th.get_text(strip=True).lower() for th in table.find_all('th')]

                # Check if this is a pins/parameters table
                if 'pin' in ' '.join(headers) or 'parameter' in ' '.join(headers) or 'input' in ' '.join(headers):
                    rows = table.find_all('tr')[1:]  # Skip header
                    for row in rows:
                        cols = [td.get_text(strip=True) for td in row.find_all('td')]
                        if len(cols) >= 2:
                            pin_info = {
                                'name': cols[0],
                                'type': cols[1] if len(cols) > 1 else 'Unknown',
                                'description': cols[2] if len(cols) > 2 else ''
                            }

                            # Determine if input or output
                            if 'output' in headers or 'out' in cols[0].lower():
                                node_data['outputs'].append(pin_info)
                            else:
                                node_data['inputs'].append(pin_info)

            # Look for category in breadcrumbs or navigation
            breadcrumbs = main_content.find('nav', {'aria-label': 'breadcrumb'}) or \
                         main_content.find('ol', {'class': re.compile('breadcrumb', re.I)}) or \
                         main_content.find('div', {'class': re.compile('breadcrumb', re.I)})

            if breadcrumbs:
                crumbs = breadcrumbs.find_all('a')
                if len(crumbs) > 1:
                    # Usually the second-to-last crumb is the category
                    node_data['category'] = crumbs[-2].get_text(strip=True)

            # Look for code examples
            code_blocks = main_content.find_all('code') + main_content.find_all('pre')
            for code in code_blocks[:3]:  # Limit to first 3 examples
                example_text = code.get_text(strip=True)
                if example_text and len(example_text) > 10:
                    node_data['examples'].append(example_text)

        # Determine node type from className or category
        if node_data['className']:
            if 'Event' in node_data['className']:
                node_data['nodeType'] = 'Event'
            elif 'Function' in node_data['className']:
                node_data['nodeType'] = 'Function'
            elif 'Variable' in node_data['className']:
                node_data['nodeType'] = 'Variable'
            elif 'Cast' in node_data['className']:
                node_data['nodeType'] = 'Cast'
            elif 'Flow' in node_data['className'] or 'Branch' in node_data['className']:
                node_data['nodeType'] = 'Flow Control'

        return node_data

    def find_blueprint_node_links(self, html: str, base_url: str) -> List[str]:
        """Find all blueprint node documentation links on a page."""
        soup = BeautifulSoup(html, 'html.parser')
        links = []

        # Look for links in main content area
        main_content = soup.find('main') or soup.find('article') or soup.find('div', {'class': 'content'})
        search_area = main_content if main_content else soup

        # Keywords to identify blueprint-related pages
        keywords = [
            'blueprint', 'node', 'k2node', 'function', 'event',
            'variable', 'component', 'actor', 'flow', 'graph'
        ]

        for a_tag in search_area.find_all('a', href=True):
            href = a_tag['href']
            text = a_tag.get_text(strip=True).lower()

            # Filter out navigation, footer, and other non-content links
            if any(skip in href.lower() for skip in ['#', 'javascript:', 'mailto:', '.pdf', '.zip']):
                continue

            # Check if link is relevant to blueprints
            if any(keyword in href.lower() or keyword in text for keyword in keywords):
                full_url = urljoin(base_url, href)

                # Only include docs.unrealengine.com URLs
                if full_url.startswith(self.base_url) and full_url not in self.visited_urls:
                    links.append(full_url)

        return list(set(links))  # Remove duplicates

    def scrape_section(self, start_url: str, max_depth: int = 2, current_depth: int = 0):
        """Recursively scrape a documentation section."""
        if current_depth >= max_depth:
            return

        html = self.fetch_page(start_url)
        if not html:
            return

        # Parse current page
        node_data = self.parse_blueprint_node_page(html, start_url)
        if node_data and (node_data['displayName'] or node_data['className']):
            self.nodes_data.append(node_data)
            logger.info(f"✓ Extracted: {node_data['displayName'] or node_data['className']}")

        # Find and follow links
        if current_depth < max_depth - 1:
            links = self.find_blueprint_node_links(html, start_url)
            logger.info(f"Found {len(links)} links at depth {current_depth}")

            for link in links[:50]:  # Limit links per page to avoid infinite crawling
                time.sleep(self.delay)
                self.scrape_section(link, max_depth, current_depth + 1)

    def scrape_blueprint_api(self):
        """Scrape the Blueprint API reference pages."""
        # Target URLs for different UE versions
        start_urls = [
            # UE 5.5
            'https://docs.unrealengine.com/5.5/en-US/BlueprintAPI/',
            'https://docs.unrealengine.com/5.5/en-US/unreal-engine-blueprint-api-reference/',

            # UE 5.3
            'https://docs.unrealengine.com/5.3/en-US/BlueprintAPI/',
            'https://docs.unrealengine.com/5.3/en-US/unreal-engine-blueprint-api-reference/',

            # Generic/latest
            'https://docs.unrealengine.com/en-US/BlueprintAPI/',
            'https://docs.unrealengine.com/en-US/ProgrammingAndScripting/Blueprints/UserGuide/nodes/',
        ]

        for start_url in start_urls:
            logger.info(f"\n{'='*60}")
            logger.info(f"Scraping section: {start_url}")
            logger.info(f"{'='*60}")

            self.scrape_section(start_url, max_depth=3)

            # Save progress after each major section
            self.save_progress()

            time.sleep(self.delay * 2)  # Longer delay between major sections

    def save_progress(self, filename: str = 'ue_blueprint_nodes_scraped.json'):
        """Save current progress to JSON file."""
        output = {
            'version': '2.0',
            'source': 'Unreal Engine Official Documentation',
            'scrapedAt': time.strftime('%Y-%m-%d %H:%M:%S'),
            'totalNodes': len(self.nodes_data),
            'visitedUrls': len(self.visited_urls),
            'failedUrls': self.failed_urls,
            'nodes': self.nodes_data
        }

        output_path = Path(__file__).parent / filename
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(output, f, indent=2, ensure_ascii=False)

        logger.info(f"\n💾 Saved {len(self.nodes_data)} nodes to {filename}")
        logger.info(f"   Visited: {len(self.visited_urls)} URLs")
        logger.info(f"   Failed: {len(self.failed_urls)} URLs")

    def scrape(self):
        """Main scraping method."""
        logger.info("🚀 Starting Enhanced Unreal Engine blueprint nodes scraper...")
        logger.info("   Using cloudscraper for automatic Cloudflare bypass")
        logger.info("")

        try:
            self.scrape_blueprint_api()
        except KeyboardInterrupt:
            logger.info("\n⚠️  Scraping interrupted by user")
        finally:
            self.save_progress()

        logger.info(f"\n✅ Scraping complete!")
        logger.info(f"   Total nodes scraped: {len(self.nodes_data)}")
        logger.info(f"   Failed URLs: {len(self.failed_urls)}")


def main():
    scraper = UnrealDocsScraperEnhanced()
    scraper.scrape()


if __name__ == '__main__':
    main()
