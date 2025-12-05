#!/usr/bin/env python3
"""
Extract and analyze the markdown content from the blueprint API data.
"""

import json
import re
from bs4 import BeautifulSoup

with open('blueprint_api_raw.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

if 'blocks' in data and len(data['blocks']) > 0:
    block = data['blocks'][0]
    if 'content_html' in block:
        html_content = block['content_html']

        print(f"=== HTML Content ({len(html_content)} chars) ===\n")
        print(html_content[:2000])
        print("\n...")

        # Parse HTML to find interesting elements
        soup = BeautifulSoup(html_content, 'html.parser')

        # Look for iframes
        iframes = soup.find_all('iframe')
        print(f"\n\n=== Iframes ({len(iframes)}) ===")
        for i, iframe in enumerate(iframes):
            print(f"\nIframe {i}:")
            print(f"  src: {iframe.get('src')}")
            print(f"  class: {iframe.get('class')}")
            print(f"  id: {iframe.get('id')}")

        # Look for script tags
        scripts = soup.find_all('script')
        print(f"\n\n=== Script tags ({len(scripts)}) ===")
        for i, script in enumerate(scripts):
            src = script.get('src')
            if src:
                print(f"\nScript {i}: {src}")
            else:
                content_preview = (script.string or '')[:200]
                if content_preview:
                    print(f"\nInline script {i}: {content_preview}...")

        # Look for data attributes or embedded JSON
        divs_with_data = soup.find_all(attrs=lambda x: x and any(k.startswith('data-') for k in x.keys()))
        print(f"\n\n=== Elements with data attributes ({len(divs_with_data)}) ===")
        for i, elem in enumerate(divs_with_data[:10]):
            data_attrs = {k: v for k, v in elem.attrs.items() if k.startswith('data-')}
            print(f"\n{elem.name} {i}:")
            for key, value in data_attrs.items():
                value_preview = str(value)[:100]
                print(f"  {key}: {value_preview}")

        # Look for specific URLs or references to blueprint data
        all_text = html_content
        urls = re.findall(r'https?://[^\s<>"\']+', all_text)
        print(f"\n\n=== URLs found ({len(urls)}) ===")
        unique_urls = list(set(urls))[:20]
        for url in unique_urls:
            print(f"  {url}")

        # Save full HTML
        with open('blueprint_api_content.html', 'w', encoding='utf-8') as f:
            f.write(html_content)
        print(f"\n\n✓ Saved full HTML to blueprint_api_content.html")
