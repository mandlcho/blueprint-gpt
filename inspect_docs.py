#!/usr/bin/env python3
"""
Inspect Unreal Engine documentation to find where blueprint node data is stored.
This helps us understand the structure before scraping.
"""

import cloudscraper
import json
from bs4 import BeautifulSoup
import re

scraper = cloudscraper.create_scraper(
    browser={'browser': 'chrome', 'platform': 'windows', 'desktop': True}
)

url = 'https://docs.unrealengine.com/5.5/en-US/BlueprintAPI/'
print(f"Fetching {url}...")

response = scraper.get(url)
soup = BeautifulSoup(response.text, 'html.parser')

print("\n=== Looking for JavaScript data ===")
scripts = soup.find_all('script')
for i, script in enumerate(scripts):
    if script.string and ('blueprint' in script.string.lower() or 'api' in script.string.lower()):
        content = script.string[:500]
        print(f"\nScript {i}:")
        print(content)

print("\n\n=== Looking for JSON data ===")
# Look for embedded JSON
json_patterns = [
    r'window\.__INITIAL_STATE__\s*=\s*({.*?});',
    r'window\.__DATA__\s*=\s*({.*?});',
    r'var\s+data\s*=\s*({.*?});',
    r'const\s+data\s*=\s*({.*?});',
]

for pattern in json_patterns:
    matches = re.findall(pattern, response.text, re.DOTALL)
    if matches:
        print(f"\nFound JSON with pattern: {pattern}")
        print(f"Sample: {matches[0][:200]}...")

print("\n\n=== Looking for API endpoints ===")
# Look for API URLs
api_patterns = [
    r'https?://[^\"\']+/api/[^\"\']+',
    r'\.json[\"\']*',
    r'/api/v\d+/[^\"\']+',
]

for pattern in api_patterns:
    matches = re.findall(pattern, response.text)
    if matches:
        print(f"\nFound API URLs with pattern: {pattern}")
        for match in list(set(matches))[:10]:
            print(f"  - {match}")

print("\n\n=== Page structure ===")
# Look for the main content structure
main = soup.find('main') or soup.find('div', {'id': 'main'}) or soup.find('div', {'class': 'main-content'})
if main:
    print(f"Main container: {main.name} with classes: {main.get('class')}")

    # Find unique classes and IDs that might hold data
    divs_with_ids = main.find_all('div', {'id': True})
    print(f"\nDivs with IDs ({len(divs_with_ids)}):")
    for div in divs_with_ids[:10]:
        print(f"  - {div.get('id')}: {div.get('class')}")

print("\n\n=== Links on page ===")
links = soup.find_all('a', href=True)
blueprint_links = [a for a in links if 'blueprint' in a['href'].lower() or 'node' in a.get_text().lower()]
print(f"Found {len(blueprint_links)} blueprint-related links")
for link in blueprint_links[:20]:
    print(f"  - {link.get('href')} ({link.get_text(strip=True)[:50]})")

# Try to download a sitemap
print("\n\n=== Checking for sitemap ===")
sitemap_urls = [
    'https://docs.unrealengine.com/sitemap.xml',
    'https://docs.unrealengine.com/sitemap_index.xml',
    'https://docs.unrealengine.com/5.5/sitemap.xml',
]

for sitemap_url in sitemap_urls:
    try:
        resp = scraper.get(sitemap_url, timeout=10)
        if resp.status_code == 200:
            print(f"✓ Found sitemap: {sitemap_url} ({len(resp.text)} bytes)")
            # Save it
            with open('sitemap.xml', 'w', encoding='utf-8') as f:
                f.write(resp.text)
            print("  Saved to sitemap.xml")

            # Count blueprint URLs
            blueprint_count = resp.text.lower().count('blueprint')
            print(f"  Contains 'blueprint' {blueprint_count} times")
            break
    except:
        print(f"✗ No sitemap at: {sitemap_url}")

print("\n\nInspection complete!")
