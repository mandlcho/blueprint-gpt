#!/usr/bin/env python3
"""
Investigate alternative approaches to get blueprint node data.
"""

import json
from bs4 import BeautifulSoup
from pathlib import Path

# Check what we have in the cache
cache_dir = Path('cache')
cache_files = list(cache_dir.glob('*.json'))

print(f"=== Cached Files: {len(cache_files)} ===\n")

# Look at a successful category page more carefully
actor_cache = cache_dir / 'en_us_unreal_engine_BlueprintAPI_Actor.json'
if actor_cache.exists():
    with open(actor_cache, 'r', encoding='utf-8') as f:
        data = json.load(f)

    print("=== Detailed Analysis of Actor Category ===\n")

    if 'blocks' in data:
        for block in data['blocks']:
            if 'content_html' in block:
                html = block['content_html']
                soup = BeautifulSoup(html, 'html.parser')

                # Look at block-dir-item elements more carefully
                items = soup.find_all('block-dir-item')

                print(f"Found {len(items)} sub-items (blueprint nodes)\n")
                print("=== First 3 items detailed: ===\n")

                for i, item in enumerate(items[:3]):
                    print(f"\nItem {i+1}: {item.get('page-name')}")
                    print(f"  href: {item.get('href')}")
                    print(f"  description: {item.get('description')}")

                    # Check all attributes
                    print(f"  All attributes: {item.attrs}")

                    # Check if there's any embedded content
                    if item.string:
                        print(f"  Content: {item.string}")

                    # Check children
                    children = list(item.children)
                    if children:
                        print(f"  Children: {children}")

print("\n\n=== Check blueprint_categories.json ===\n")
with open('blueprint_categories.json', 'r', encoding='utf-8') as f:
    cats = json.load(f)

print(f"Total categories: {cats['totalCategories']}")
print(f"\nFirst 5 categories:")
for cat in cats['categories'][:5]:
    print(f"  - {cat['name']}: {cat['description']}")
    print(f"    path: {cat['path']}")

print("\n\n=== Alternative idea: Check if we can extract from HTML directly ===")
print("The category pages list all the nodes with names and descriptions.")
print("Even without individual node pages, we can extract:")
print("  1. Node display name (from page-name)")
print("  2. Category (from parent page)")
print("  3. Description (from description attribute)")
print("  4. URL (from href)")
print("\nThis gives us a comprehensive catalog of ALL blueprint nodes!")
print("Individual parameter details might require visiting each page over time.")

print("\n\n=== Proposed multi-day approach ===")
print("Day 1-2: Extract all node names/descriptions from category pages (already cached!)")
print("Day 3+: Gradually fetch individual node pages (with delays, resumable)")
print("       - Save progress frequently")
print("       - Use exponential backoff on errors")
print("       - Skip already successful nodes")
