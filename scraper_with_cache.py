#!/usr/bin/env python3
"""
Blueprint Node Scraper with caching and better 403 handling.
Uses cached data when available and adds delays to avoid rate limiting.
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
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class BlueprintNodeScraperCached:
    """Scraper with caching and rate limit handling."""

    def __init__(self, version='5.5'):
        self.scraper = cloudscraper.create_scraper(
            browser={'browser': 'chrome', 'platform': 'windows', 'desktop': True}
        )
        # Add more headers to avoid detection
        self.scraper.headers.update({
            'Referer': 'https://dev.epicgames.com/',
            'Origin': 'https://dev.epicgames.com',
            'DNT': '1',
            'Sec-Ch-Ua': '"Google Chrome";v="120", "Chromium";v="120", "Not_A Brand";v="24"',
            'Sec-Ch-Ua-Mobile': '?0',
            'Sec-Ch-Ua-Platform': '"Windows"',
        })

        self.version = version
        self.base_api_url = 'https://dev.epicgames.com/community/api/documentation'
        self.delay_min = 1.0  # Minimum delay
        self.delay_max = 2.0  # Maximum delay
        self.nodes_data = []
        self.categories_data = {}
        self.visited_urls: Set[str] = set()
        self.cache_dir = Path('cache')
        self.cache_dir.mkdir(exist_ok=True)
        self.request_count = 0

    def random_delay(self):
        """Add a random delay to avoid rate limiting."""
        delay = random.uniform(self.delay_min, self.delay_max)
        time.sleep(delay)

    def get_cache_path(self, path: str) -> Path:
        """Get cache file path for a given documentation path."""
        safe_name = path.replace('/', '_').replace('-', '_')
        return self.cache_dir / f"{safe_name}.json"

    def fetch_json_api(self, path: str, use_cache=True) -> Dict:
        """Fetch documentation JSON from API or cache."""
        cache_path = self.get_cache_path(path)

        # Try cache first
        if use_cache and cache_path.exists():
            logger.info(f"Using cached: {path}")
            with open(cache_path, 'r', encoding='utf-8') as f:
                return json.load(f)

        url = f"{self.base_api_url}/document.json?path={path}&application_version={self.version}"
        logger.info(f"Fetching API [{self.request_count}]: {path}")

        self.request_count += 1

        # Add extra delay every 10 requests
        if self.request_count % 10 == 0:
            logger.info("  Pausing for rate limit...")
            time.sleep(5)

        try:
            self.random_delay()
            response = self.scraper.get(url, timeout=30)
            response.raise_for_status()
            data = response.json()

            # Cache the response
            with open(cache_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)

            return data

        except Exception as e:
            if '403' in str(e):
                logger.warning(f"403 error - rate limited. Waiting 30 seconds...")
                time.sleep(30)
                # Try one more time
                try:
                    response = self.scraper.get(url, timeout=30)
                    response.raise_for_status()
                    data = response.json()
                    with open(cache_path, 'w', encoding='utf-8') as f:
                        json.dump(data, f, indent=2, ensure_ascii=False)
                    return data
                except Exception as e2:
                    logger.error(f"Failed again: {e2}")
                    return {}
            else:
                logger.error(f"Error fetching {url}: {e}")
                return {}

    def extract_category_urls_from_html(self, html_content: str) -> List[Dict]:
        """Extract blueprint category URLs from HTML content."""
        soup = BeautifulSoup(html_content, 'html.parser')
        categories = []

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

        return categories

    def extract_path_from_url(self, url: str) -> str:
        """Extract the documentation path from a URL."""
        match = re.search(r'/documentation/([\w-]+/[\w-]+/[\w-]+/.+?)(?:\?|$)', url)
        if match:
            return match.group(1)
        return ''

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

        for block in data['blocks']:
            if block.get('type') == 'markdown' and 'content_html' in block:
                html = block['content_html']
                soup = BeautifulSoup(html, 'html.parser')

                # Look for h3/h4 headers (function names)
                headers = soup.find_all(['h3', 'h4'])
                for header in headers:
                    section_content = []
                    for sibling in header.find_next_siblings():
                        if sibling.name in ['h3', 'h4', 'h2']:
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

                        # Get description
                        for elem in section_content:
                            if elem.name == 'p':
                                node['description'] = elem.get_text(strip=True)
                                break

                        # Extract parameters from tables
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

        logger.info(f"  ✓ {category_name}: {len(nodes)} nodes")
        return nodes

    def scrape_all(self):
        """Scrape all blueprint nodes."""
        logger.info("🚀 Starting Blueprint API scraper (cached version)...")
        logger.info(f"   Version: {self.version}")
        logger.info(f"   Cache dir: {self.cache_dir.absolute()}")

        # Use cached main page if available
        logger.info("\nStep 1: Loading main Blueprint API page...")
        main_data = self.fetch_json_api('en-us/unreal-engine/BlueprintAPI')

        if not main_data or 'blocks' not in main_data:
            logger.error("Failed to fetch main page. Trying to use blueprint_api_raw.json...")
            try:
                with open('blueprint_api_raw.json', 'r', encoding='utf-8') as f:
                    main_data = json.load(f)
            except:
                logger.error("No cached data available")
                return

        # Extract categories
        logger.info("\nStep 2: Extracting categories...")
        html_content = main_data['blocks'][0]['content_html']
        categories = self.extract_category_urls_from_html(html_content)

        self.categories_data = {
            'version': self.version,
            'totalCategories': len(categories),
            'categories': categories
        }

        with open('blueprint_categories.json', 'w', encoding='utf-8') as f:
            json.dump(self.categories_data, f, indent=2, ensure_ascii=False)

        logger.info(f"✓ Found {len(categories)} categories")

        # Scrape each category
        logger.info(f"\nStep 3: Scraping {len(categories)} categories...")

        for i, category in enumerate(categories, 1):
            logger.info(f"\n[{i}/{len(categories)}] {category['name']}")
            try:
                nodes = self.scrape_category_page(category)
                self.nodes_data.extend(nodes)

                # Save progress every 20 categories
                if i % 20 == 0:
                    self.save_results()
            except Exception as e:
                logger.error(f"Error scraping {category['name']}: {e}")
                continue

        self.save_results()
        logger.info(f"\n✅ Complete! Total nodes: {len(self.nodes_data)}")

    def save_results(self):
        """Save results to JSON."""
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

        logger.info(f"💾 Saved {len(self.nodes_data)} nodes to {filename}")


def main():
    scraper = BlueprintNodeScraperCached(version='5.5')
    scraper.scrape_all()


if __name__ == '__main__':
    main()
