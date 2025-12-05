#!/usr/bin/env python3
"""
Phase 1.5: Extract individual blueprint functions from cached category pages.
Parses the HTML in cached category files to find all individual function nodes.
"""

import json
from pathlib import Path
from bs4 import BeautifulSoup
import re
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(message)s')
logger = logging.getLogger(__name__)


class Phase15FunctionExtractor:
    """Extract individual blueprint functions from category cache files."""

    def __init__(self):
        self.cache_dir = Path('cache')
        self.all_functions = []
        self.categories_processed = 0
        self.functions_found = 0

    def extract_category_from_url(self, url: str) -> str:
        """Extract category name from URL."""
        match = re.search(r'/BlueprintAPI/([^/\?]+)', url)
        return match.group(1) if match else 'Uncategorized'

    def parse_cache_file(self, cache_file: Path):
        """Parse a single cache file and extract function entries."""
        try:
            with open(cache_file, 'r', encoding='utf-8') as f:
                data = json.load(f)

            # Get category info
            category_title = data.get('title', 'Unknown')
            category_url = f"https://dev.epicgames.com/documentation/en-us/unreal-engine/{data.get('slug', '')}"

            # Skip if not a BlueprintAPI category
            if 'BlueprintAPI' not in data.get('slug', ''):
                return

            # Parse HTML blocks
            for block in data.get('blocks', []):
                if block.get('type') != 'markdown':
                    continue

                html = block.get('content_html', '')
                if not html:
                    continue

                # Parse with BeautifulSoup
                soup = BeautifulSoup(html, 'html.parser')

                # Find all block-dir-item elements
                items = soup.find_all('block-dir-item')

                for item in items:
                    function_name = item.get('page-name', '')
                    description = item.get('description', function_name)
                    url = item.get('href', '')
                    item_type = item.get('type', 'topic')

                    if not function_name or not url:
                        continue

                    # Skip if it's another category (check if URL goes deeper than category level)
                    url_parts = url.split('/')
                    # If URL has BlueprintAPI/Category/Function pattern, it's a function
                    if url.count('/BlueprintAPI/') == 1 and url.count('/') >= 6:
                        function_entry = {
                            'displayName': function_name,
                            'category': category_title,
                            'description': description,
                            'url': url.split('?')[0],  # Remove query params
                            'type': item_type,
                            'hasDetailedInfo': False,
                            'canSpawn': False  # Will be updated in Phase 2 when we get parameters
                        }
                        self.all_functions.append(function_entry)
                        self.functions_found += 1

            self.categories_processed += 1

        except Exception as e:
            logger.error(f"Error parsing {cache_file.name}: {e}")

    def run(self):
        """Run the extraction process."""
        logger.info("🔍 Phase 1.5: Extracting individual blueprint functions")
        logger.info(f"   Cache directory: {self.cache_dir}\n")

        if not self.cache_dir.exists():
            logger.error("❌ Cache directory not found!")
            return

        # Process all cache files
        cache_files = list(self.cache_dir.glob('*.json'))
        logger.info(f"📂 Found {len(cache_files)} cache files\n")

        for cache_file in cache_files:
            self.parse_cache_file(cache_file)

        logger.info(f"\n📊 Extraction complete:")
        logger.info(f"   Categories processed: {self.categories_processed}")
        logger.info(f"   Functions found: {self.functions_found}")

        # Remove duplicates based on URL
        unique_functions = {}
        for func in self.all_functions:
            url = func['url']
            if url not in unique_functions:
                unique_functions[url] = func

        self.all_functions = list(unique_functions.values())
        logger.info(f"   Unique functions: {len(self.all_functions)}")

        # Sort by category and name
        self.all_functions.sort(key=lambda x: (x['category'], x['displayName']))

        # Save output
        output = {
            'version': '1.5',
            'source': 'Extracted from cached category pages',
            'extractedAt': Path('cache').stat().st_mtime if Path('cache').exists() else 0,
            'totalFunctions': len(self.all_functions),
            'categoriesProcessed': self.categories_processed,
            'nodes': self.all_functions
        }

        output_file = Path('ue_blueprint_functions_phase1_5.json')
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(output, f, indent=2, ensure_ascii=False)

        logger.info(f"\n💾 Saved to {output_file}")

        # Print sample functions
        logger.info(f"\n📋 Sample functions found:")
        samples = [f for f in self.all_functions if 'Actor' in f['displayName'] and 'Rotation' in f['displayName']][:5]
        if samples:
            for func in samples:
                logger.info(f"   • {func['displayName']} ({func['category']})")
        else:
            # Show first 5 functions
            for func in self.all_functions[:5]:
                logger.info(f"   • {func['displayName']} ({func['category']})")

        logger.info(f"\n✅ Phase 1.5 complete! Found {len(self.all_functions)} blueprint functions.")
        logger.info(f"💡 Next: Run Phase 2 to fetch detailed parameters for spawning.")


def main():
    extractor = Phase15FunctionExtractor()
    extractor.run()


if __name__ == '__main__':
    main()
