#!/usr/bin/env python3
"""
Fetch blueprint data from the Unreal Engine JSON API.
"""

import cloudscraper
import json

scraper = cloudscraper.create_scraper(
    browser={'browser': 'chrome', 'platform': 'windows', 'desktop': True}
)

# The JSON API endpoint discovered from the page
api_url = 'https://dev.epicgames.com/community/api/documentation/document.json?path=en-us/unreal-engine/BlueprintAPI&application_version=5.5'

print(f"Fetching Blueprint API data from: {api_url}")
response = scraper.get(api_url, timeout=30)

if response.status_code == 200:
    data = response.json()

    # Save the full response
    with open('blueprint_api_raw.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"✓ Successfully fetched {len(response.text)} bytes")
    print(f"  Saved to blueprint_api_raw.json")

    # Print structure
    print(f"\n=== Data Structure ===")
    print(f"Keys: {list(data.keys())}")

    # Look for blueprint node information
    if 'document' in data:
        doc = data['document']
        print(f"\nDocument keys: {list(doc.keys()) if isinstance(doc, dict) else type(doc)}")

    if 'content' in data:
        print(f"\nContent length: {len(str(data['content']))}")
        content_str = str(data['content'])[:500]
        print(f"Content sample: {content_str}...")

    # Try to find embedded blueprint data
    data_str = json.dumps(data)
    if 'K2Node' in data_str:
        print(f"\n✓ Found K2Node references in data!")
        import re
        k2nodes = re.findall(r'K2Node[A-Za-z_]+', data_str)
        unique_nodes = list(set(k2nodes))[:20]
        print(f"  Unique K2Node types found: {len(set(k2nodes))}")
        print(f"  Examples: {', '.join(unique_nodes)}")

else:
    print(f"✗ Failed to fetch: HTTP {response.status_code}")
    print(response.text[:500])
