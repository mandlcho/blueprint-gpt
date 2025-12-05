#!/usr/bin/env python3
"""
Final Unreal Engine Blueprint Nodes Scraper
Scrapes all blueprint nodes from the official Unreal Engine documentation API.
"""

import cloudscraper
import json
import time
import re
from bs4 import BeautifulSoup
from typing import List, Dict, Set
from urllib.parse import urljoin, urlparse, parse_qs
import logging
from pathlib import Path

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class BlueprintNodeScraper:
    """Scraper for Unreal Engine Blueprint API."""

    def __init__(self, version='5.5'):
        self.scraper = cloudscraper.create_scraper(
            browser={'browser': 'chrome', 'platform': 'windows', 'desktop': True}
        )
        self.version = version
        self.base_doc_url = 'https://dev.epicgames.com/documentation'
        self.base_api_url = 'https://dev.epicgames.com/community/api/documentation'
        self.delay = 0.5  # Delay between requests
        self.nodes_data = []
        self.categories_data = {}
        self.visited_urls: Set[str] = set()

    def fetch_json_api(self, path: str) -> Dict:
        """Fetch documentation JSON from the API."""
        url = f"{self.base_api_url}/document.json?path={path}&application_version={self.version}"

        logger.info(f"Fetching API: {url}")
        try:
            response = self.scraper.get(url, timeout=30)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"Error fetching {url}: {e}")
            return {}

    def extract_category_urls_from_html(self, html_content: str) -> List[Dict]:
        """Extract blueprint category URLs from HTML content."""
        soup = BeautifulSoup(html_content, 'html.parser')
        categories = []

        # Find all block-dir-item elements (category links)
        items = soup.find_all('block-dir-item')

        for item in items:
            href = item.get('href', '')
            page_name = item.get('page-name', '')
            description = item.get('description', '')

            if href and 'BlueprintAPI/' in href:
                categories.append({
                    'name': page_name,
                    'description': description,
                    'url': href,
                    'path': self.extract_path_from_url(href)
                })

        logger.info(f"Found {len(categories)} categories")
        return categories

    def extract_path_from_url(self, url: str) -> str:
        """Extract the documentation path from a URL."""
        # URL format: https://dev.epicgames.com/documentation/en-us/unreal-engine/BlueprintAPI/AI
        match = re.search(r'/documentation/([\w-]+/[\w-]+/[\w-]+/.+?)(?:\?|$)', url)
        if match:
            return match.group(1)
        return ''

    def parse_blueprint_function(self, elem: BeautifulSoup) -> Dict:
        """Parse a blueprint function/node from HTML element."""
        node_data = {
            'displayName': None,
            'category': None,
            'description': None,
            'className': None,
            'nodeType': None,
            'inputs': [],
            'outputs': [],
            'returnValue': None
        }

        # Extract function name
        name_elem = elem.find('h3') or elem.find('h4') or elem.find('strong')
        if name_elem:
            node_data['displayName'] = name_elem.get_text(strip=True)

        # Extract description
        desc_elem = elem.find('p')
        if desc_elem:
            node_data['description'] = desc_elem.get_text(strip=True)

        # Look for parameter tables
        tables = elem.find_all('table')
        for table in tables:
            rows = table.find_all('tr')
            if len(rows) > 1:  # Has header + content
                headers = [th.get_text(strip=True).lower() for th in rows[0].find_all('th')]

                for row in rows[1:]:
                    cols = [td.get_text(strip=True) for td in row.find_all('td')]
                    if len(cols) >= 2:
                        param = {
                            'name': cols[0],
                            'type': cols[1] if len(cols) > 1 else 'Unknown',
                            'description': cols[2] if len(cols) > 2 else ''
                        }

                        # Determine if input or output based on header or position
                        if 'output' in headers or 'return' in headers:
                            node_data['outputs'].append(param)
                        else:
                            node_data['inputs'].append(param)

        return node_data

    def scrape_category_page(self, category: Dict) -> List[Dict]:
        """Scrape all blueprint nodes from a category page."""
        path = category['path']
        if not path or path in self.visited_urls:
            return []

        self.visited_urls.add(path)
        data = self.fetch_json_api(path)

        if not data or 'blocks' not in data:
            return []

        nodes = []
        category_name = category['name']

        # Process each block
        for block in data['blocks']:
            if block.get('type') == 'markdown' and 'content_html' in block:
                html = block['content_html']
                soup = BeautifulSoup(html, 'html.parser')

                # Look for function/node listings
                # They might be in various formats, try multiple approaches

                # Approach 1: Look for h3/h4 headers with descriptions
                headers = soup.find_all(['h3', 'h4'])
                for header in headers:
                    # Get the section around this header
                    section_content = []
                    for sibling in header.find_next_siblings():
                        if sibling.name in ['h3', 'h4']:
                            break
                        section_content.append(sibling)

                    if section_content:
                        node = {
                            'displayName': header.get_text(strip=True),
                            'category': category_name,
                            'description': None,
                            'inputs': [],
                            'outputs': []
                        }

                        # Get description from first paragraph
                        for elem in section_content:
                            if elem.name == 'p':
                                node['description'] = elem.get_text(strip=True)
                                break

                        # Look for parameter tables
                        for elem in section_content:
                            if elem.name == 'table':
                                rows = elem.find_all('tr')
                                if len(rows) > 1:
                                    for row in rows[1:]:
                                        cols = [td.get_text(strip=True) for td in row.find_all('td')]
                                        if len(cols) >= 2:
                                            param = {
                                                'name': cols[0],
                                                'type': cols[1],
                                                'description': cols[2] if len(cols) > 2 else ''
                                            }
                                            node['inputs'].append(param)

                        if node['displayName']:
                            nodes.append(node)

        logger.info(f"  Extracted {len(nodes)} nodes from {category_name}")
        return nodes

    def scrape_all(self):
        """Scrape all blueprint nodes from all categories."""
        logger.info("🚀 Starting Blueprint API scraper...")
        logger.info(f"   Target version: {self.version}")

        # Step 1: Get main Blueprint API page
        logger.info("\nStep 1: Fetching main Blueprint API page...")
        main_data = self.fetch_json_api('en-us/unreal-engine/BlueprintAPI')

        if not main_data or 'blocks' not in main_data:
            logger.error("Failed to fetch main page")
            return

        # Step 2: Extract category URLs
        logger.info("\nStep 2: Extracting categories...")
        html_content = main_data['blocks'][0]['content_html']
        categories = self.extract_category_urls_from_html(html_content)

        # Save categories list
        self.categories_data = {
            'version': self.version,
            'totalCategories': len(categories),
            'categories': categories
        }

        with open('blueprint_categories.json', 'w', encoding='utf-8') as f:
            json.dump(self.categories_data, f, indent=2, ensure_ascii=False)

        logger.info(f"✓ Found {len(categories)} categories")
        logger.info(f"✓ Saved to blueprint_categories.json")

        # Step 3: Scrape each category
        logger.info(f"\nStep 3: Scraping {len(categories)} categories...")

        for i, category in enumerate(categories, 1):
            logger.info(f"\n[{i}/{len(categories)}] {category['name']}")
            nodes = self.scrape_category_page(category)
            self.nodes_data.extend(nodes)

            # Save progress every 50 categories
            if i % 50 == 0:
                self.save_results()

            time.sleep(self.delay)

        # Final save
        self.save_results()

        logger.info(f"\n✅ Scraping complete!")
        logger.info(f"   Total categories: {len(categories)}")
        logger.info(f"   Total nodes: {len(self.nodes_data)}")

    def save_results(self):
        """Save scraped data to JSON file."""
        output = {
            'version': '2.0',
            'source': 'Unreal Engine Official Documentation API',
            'unrealVersion': self.version,
            'scrapedAt': time.strftime('%Y-%m-%d %H:%M:%S'),
            'totalNodes': len(self.nodes_data),
            'totalCategories': len(self.categories_data.get('categories', [])),
            'nodes': self.nodes_data
        }

        filename = f'ue_blueprint_nodes_v{self.version}.json'
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(output, f, indent=2, ensure_ascii=False)

        logger.info(f"\n💾 Saved {len(self.nodes_data)} nodes to {filename}")


def main():
    import argparse

    parser = argparse.ArgumentParser(description='Scrape Unreal Engine Blueprint API')
    parser.add_argument('--version', default='5.5', help='Unreal Engine version (default: 5.5)')
    parser.add_argument('--delay', type=float, default=0.5, help='Delay between requests in seconds')

    args = parser.parse_args()

    scraper = BlueprintNodeScraper(version=args.version)
    scraper.delay = args.delay
    scraper.scrape_all()


if __name__ == '__main__':
    main()
