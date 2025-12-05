#!/usr/bin/env python3
import json
from bs4 import BeautifulSoup

# Check the Actor category as an example
with open('cache/en_us_unreal_engine_BlueprintAPI_Actor.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print("=== Actor Category Structure ===\n")
print(f"Title: {data.get('title')}")
print(f"Description: {data.get('description')}")

if 'blocks' in data:
    for i, block in enumerate(data['blocks']):
        print(f"\n--- Block {i} ---")
        print(f"Type: {block.get('type')}")

        if block.get('type') == 'markdown' and 'content_html' in block:
            html = block['content_html']
            soup = BeautifulSoup(html, 'html.parser')

            # Count different elements
            h1_count = len(soup.find_all('h1'))
            h2_count = len(soup.find_all('h2'))
            h3_count = len(soup.find_all('h3'))
            h4_count = len(soup.find_all('h4'))
            p_count = len(soup.find_all('p'))
            table_count = len(soup.find_all('table'))
            block_dir_items = len(soup.find_all('block-dir-item'))

            print(f"  h1: {h1_count}, h2: {h2_count}, h3: {h3_count}, h4: {h4_count}")
            print(f"  paragraphs: {p_count}, tables: {table_count}")
            print(f"  block-dir-item (sub-categories): {block_dir_items}")

            if block_dir_items > 0:
                print(f"\n  This appears to be an INDEX page with {block_dir_items} sub-categories:")
                items = soup.find_all('block-dir-item')[:10]
                for item in items:
                    page_name = item.get('page-name', '')
                    desc = item.get('description', '')
                    print(f"    - {page_name}: {desc}")

            if h3_count > 0 or h4_count > 0:
                print(f"\n  This might contain actual NODE documentation:")
                for header in (soup.find_all('h3') + soup.find_all('h4'))[:5]:
                    print(f"    - {header.get_text(strip=True)}")

            if len(html) < 1000:
                print(f"\n  Full HTML:\n{html}")
