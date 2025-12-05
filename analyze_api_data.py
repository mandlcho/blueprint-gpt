#!/usr/bin/env python3
"""
Analyze the blueprint API JSON data structure.
"""

import json
from pathlib import Path

with open('blueprint_api_raw.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print("=== Top level keys ===")
for key, value in data.items():
    if isinstance(value, (list, dict)):
        print(f"{key}: {type(value).__name__} with {len(value)} items")
    else:
        value_preview = str(value)[:100] if value else 'None'
        print(f"{key}: {value_preview}")

print("\n\n=== Blocks structure ===")
if 'blocks' in data:
    blocks = data['blocks']
    print(f"Number of blocks: {len(blocks)}")

    for i, block in enumerate(blocks[:5]):
        print(f"\n--- Block {i} ---")
        print(f"Keys: {list(block.keys())}")
        if 'type' in block:
            print(f"Type: {block['type']}")
        if 'config' in block:
            config_str = json.dumps(block['config'], indent=2)[:500]
            print(f"Config preview: {config_str}...")
        if 'data' in block:
            data_str = json.dumps(block['data'], indent=2)[:500]
            print(f"Data preview: {data_str}...")

    # Look for specific block types
    block_types = {}
    for block in blocks:
        btype = block.get('type', 'unknown')
        block_types[btype] = block_types.get(btype, 0) + 1

    print(f"\n\nBlock types:")
    for btype, count in sorted(block_types.items(), key=lambda x: -x[1]):
        print(f"  {btype}: {count}")

    # Find blocks that might contain blueprint data
    print(f"\n\nLooking for blueprint-related blocks...")
    for i, block in enumerate(blocks):
        block_str = json.dumps(block).lower()
        if any(keyword in block_str for keyword in ['blueprint', 'node', 'function', 'event', 'k2']):
            print(f"\nBlock {i} ({block.get('type')}) might contain blueprint data")
            if 'config' in block and 'url' in block['config']:
                print(f"  URL: {block['config']['url']}")
            if 'data' in block and 'nodes' in str(block['data']):
                print(f"  Contains 'nodes' in data!")

print("\n\nAnalysis complete!")
