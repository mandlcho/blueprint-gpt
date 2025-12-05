#!/usr/bin/env python3
"""
Unreal Engine Blueprint Nodes Scraper
Scrapes blueprint node documentation from the official Unreal Engine documentation.
Handles Epic Games website 403 protection with proper headers and rate limiting.
"""

import requests
import json
import time
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import re
from typing import List, Dict, Optional
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class UnrealDocsScraper:
    """Scraper for Unreal Engine documentation with 403 bypass."""

    def __init__(self):
        self.session = requests.Session()
        # Headers to bypass 403 protection
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Cache-Control': 'max-age=0',
        })
        self.base_url = 'https://docs.unrealengine.com'
        self.delay = 2  # Seconds between requests
        self.nodes_data = []

    def fetch_page(self, url: str, retries: int = 3) -> Optional[str]:
        """Fetch a page with retry logic and 403 bypass."""
        for attempt in range(retries):
            try:
                logger.info(f"Fetching: {url} (attempt {attempt + 1}/{retries})")
                response = self.session.get(url, timeout=30)

                if response.status_code == 403:
                    logger.warning(f"403 Forbidden on {url}, retrying with different headers...")
                    # Try with additional headers
                    self.session.headers.update({
                        'Referer': self.base_url,
                        'DNT': '1',
                    })
                    time.sleep(self.delay * 2)
                    continue

                response.raise_for_status()
                logger.info(f"Successfully fetched {url}")
                return response.text

            except requests.RequestException as e:
                logger.error(f"Error fetching {url}: {e}")
                if attempt < retries - 1:
                    time.sleep(self.delay * (attempt + 1))
                    continue
                return None

        return None

    def parse_blueprint_node_page(self, html: str, url: str) -> Optional[Dict]:
        """Parse a blueprint node documentation page."""
        soup = BeautifulSoup(html, 'html.parser')

        node_data = {
            'url': url,
            'title': None,
            'category': None,
            'description': None,
            'inputs': [],
            'outputs': [],
            'properties': {}
        }

        # Extract title
        title_elem = soup.find('h1') or soup.find('title')
        if title_elem:
            node_data['title'] = title_elem.get_text(strip=True)

        # Extract description (usually in first paragraph or meta description)
        meta_desc = soup.find('meta', {'name': 'description'})
        if meta_desc:
            node_data['description'] = meta_desc.get('content', '')
        else:
            first_p = soup.find('p')
            if first_p:
                node_data['description'] = first_p.get_text(strip=True)

        # Try to extract category from breadcrumbs
        breadcrumbs = soup.find('nav', {'aria-label': 'breadcrumb'}) or soup.find('ol', {'class': 'breadcrumb'})
        if breadcrumbs:
            crumbs = breadcrumbs.find_all('a')
            if len(crumbs) > 1:
                node_data['category'] = crumbs[-2].get_text(strip=True)

        return node_data

    def find_blueprint_node_links(self, html: str, base_url: str) -> List[str]:
        """Find all blueprint node documentation links on a page."""
        soup = BeautifulSoup(html, 'html.parser')
        links = []

        # Look for links containing common blueprint node keywords
        keywords = ['blueprint', 'node', 'k2node', 'function', 'event', 'variable']

        for a_tag in soup.find_all('a', href=True):
            href = a_tag['href']
            text = a_tag.get_text(strip=True).lower()

            # Check if link is relevant
            if any(keyword in href.lower() or keyword in text for keyword in keywords):
                full_url = urljoin(base_url, href)
                if full_url.startswith(self.base_url):
                    links.append(full_url)

        return list(set(links))  # Remove duplicates

    def scrape_blueprint_api_reference(self):
        """Scrape the Blueprint API reference pages."""
        # Common URLs for Unreal Engine blueprint documentation
        start_urls = [
            'https://docs.unrealengine.com/5.3/en-US/BlueprintAPI/',
            'https://docs.unrealengine.com/5.3/en-US/blueprint-node-reference/',
            'https://docs.unrealengine.com/en-US/BlueprintAPI/',
            'https://docs.unrealengine.com/en-US/ProgrammingAndScripting/Blueprints/',
        ]

        all_links = set()

        # First pass: collect all blueprint node links
        for start_url in start_urls:
            html = self.fetch_page(start_url)
            if html:
                links = self.find_blueprint_node_links(html, start_url)
                all_links.update(links)
                logger.info(f"Found {len(links)} links from {start_url}")
                time.sleep(self.delay)

        logger.info(f"Total unique links found: {len(all_links)}")

        # Second pass: scrape each node page
        for i, link in enumerate(all_links, 1):
            logger.info(f"Processing {i}/{len(all_links)}: {link}")
            html = self.fetch_page(link)
            if html:
                node_data = self.parse_blueprint_node_page(html, link)
                if node_data and node_data['title']:
                    self.nodes_data.append(node_data)
                    logger.info(f"Extracted: {node_data['title']}")

            time.sleep(self.delay)

            # Save progress every 10 nodes
            if i % 10 == 0:
                self.save_progress()

    def save_progress(self, filename: str = 'ue_blueprint_nodes_scraped.json'):
        """Save current progress to JSON file."""
        output = {
            'version': '1.0',
            'source': 'Unreal Engine Documentation',
            'scrapedAt': time.strftime('%Y-%m-%d %H:%M:%S'),
            'totalNodes': len(self.nodes_data),
            'nodes': self.nodes_data
        }

        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(output, f, indent=2, ensure_ascii=False)

        logger.info(f"Saved {len(self.nodes_data)} nodes to {filename}")

    def scrape(self):
        """Main scraping method."""
        logger.info("Starting Unreal Engine blueprint nodes scraper...")
        self.scrape_blueprint_api_reference()
        self.save_progress()
        logger.info(f"Scraping complete! Total nodes: {len(self.nodes_data)}")


def main():
    scraper = UnrealDocsScraper()
    scraper.scrape()


if __name__ == '__main__':
    main()
