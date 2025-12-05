#!/usr/bin/env python3
"""
Phase 1: Quick extraction of all blueprint nodes from cached category pages.
This runs immediately on data we already have!
"""

import json
from bs4 import BeautifulSoup
from pathlib import Path
import time
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(message)s')
logger = logging.getLogger(__name__)


def extract_nodes_from_category(cache_file: Path) -> list:
    """Extract all node entries from a cached category page."""
    with open(cache_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    nodes = []
    category_name = data.get('title', 'Unknown')

    if 'blocks' not in data:
        return nodes

    for block in data['blocks']:
        if block.get('type') == 'markdown' and 'content_html' in block:
            html = block['content_html']
            soup = BeautifulSoup(html, 'html.parser')

            # Find all blueprint node items
            items = soup.find_all('block-dir-item')

            for item in items:
                node = {
                    'displayName': item.get('page-name', ''),
                    'category': category_name,
                    'description': item.get('description', ''),
                    'url': item.get('href', ''),
                    'type': item.get('type', ''),
                    'hasDetailedInfo': False  # Will be updated in Phase 2
                }

                if node['displayName']:
                    nodes.append(node)

    return nodes


def main():
    logger.info("🚀 Phase 1: Quick Blueprint Node Extraction")
    logger.info("   Extracting from cached category pages...\n")

    cache_dir = Path('cache')
    cache_files = list(cache_dir.glob('*.json'))

    all_nodes = []
    categories_processed = 0

    for cache_file in cache_files:
        try:
            nodes = extract_nodes_from_category(cache_file)
            if nodes:
                all_nodes.extend(nodes)
                categories_processed += 1
                logger.info(f"  ✓ {cache_file.stem}: {len(nodes)} nodes")
        except Exception as e:
            logger.error(f"  ✗ Error processing {cache_file.name}: {e}")

    # Organize by category
    by_category = {}
    for node in all_nodes:
        cat = node['category']
        if cat not in by_category:
            by_category[cat] = []
        by_category[cat].append(node)

    # Save results
    output = {
        'version': '2.0',
        'source': 'Unreal Engine Official Documentation (Quick Extract)',
        'unrealVersion': '5.5',
        'extractedAt': time.strftime('%Y-%m-%d %H:%M:%S'),
        'phase': 'Phase 1 - Basic Info from Category Pages',
        'totalNodes': len(all_nodes),
        'totalCategories': len(by_category),
        'categoriesProcessed': categories_processed,
        'note': 'This is basic info. Phase 2 will add detailed parameters/inputs/outputs.',
        'nodes': all_nodes,
        'byCategory': {cat: len(nodes) for cat, nodes in by_category.items()}
    }

    filename = 'ue_blueprint_nodes_phase1.json'
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    logger.info(f"\n✅ Phase 1 Complete!")
    logger.info(f"   Total nodes extracted: {len(all_nodes)}")
    logger.info(f"   Categories: {len(by_category)}")
    logger.info(f"   Saved to: {filename}")
    logger.info(f"\n📊 Top 10 categories by node count:")

    sorted_cats = sorted(by_category.items(), key=lambda x: len(x[1]), reverse=True)
    for cat, nodes in sorted_cats[:10]:
        logger.info(f"      {cat}: {len(nodes)} nodes")


if __name__ == '__main__':
    main()
