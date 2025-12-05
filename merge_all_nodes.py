#!/usr/bin/env python3
"""
Merge all node sources into a single database for the webapp.
Sources:
1. Old spawnable nodes (ue_blueprint_nodes.json) - 115 nodes with className for spawning
2. Phase 1.5 functions (ue_blueprint_functions_phase1_5.json) - 2111 searchable functions
"""

import json
from pathlib import Path
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(message)s')
logger = logging.getLogger(__name__)


def main():
    logger.info("🔄 Merging all node databases\n")

    # Load old spawnable nodes
    old_nodes_file = Path('ue_blueprint_nodes.json')
    if old_nodes_file.exists():
        with open(old_nodes_file, 'r', encoding='utf-8') as f:
            old_data = json.load(f)
            old_nodes = old_data.get('nodes', [])
        logger.info(f"📦 Loaded {len(old_nodes)} old spawnable nodes")
    else:
        logger.warning("⚠️  Old nodes file not found")
        old_nodes = []

    # Load Phase 1.5 functions
    phase15_file = Path('ue_blueprint_functions_phase1_5.json')
    if not phase15_file.exists():
        logger.error("❌ Phase 1.5 file not found!")
        return

    with open(phase15_file, 'r', encoding='utf-8') as f:
        phase15_data = json.load(f)
        phase15_nodes = phase15_data['nodes']
    logger.info(f"📦 Loaded {len(phase15_nodes)} Phase 1.5 functions")

    # Merge strategy:
    # - Old nodes have className and can spawn
    # - Phase 1.5 nodes are search-only (no className yet)
    # - Deduplicate by URL, preferring old nodes if they have className

    merged = {}

    # Add Phase 1.5 nodes first
    for node in phase15_nodes:
        url = node.get('url', '')
        if url:
            merged[url] = node

    # Override with old nodes if they have className (spawnable)
    spawnable_count = 0
    for node in old_nodes:
        url = node.get('url', '')
        if url and node.get('className'):
            # This node can spawn - merge it in
            if url in merged:
                # Keep Phase 1.5 data but add spawn info
                merged[url]['className'] = node['className']
                merged[url]['canSpawn'] = True
                if 'inputs' in node:
                    merged[url]['inputs'] = node['inputs']
                if 'outputs' in node:
                    merged[url]['outputs'] = node['outputs']
            else:
                merged[url] = {**node, 'canSpawn': True}
            spawnable_count += 1
        elif url:
            # No className, just add if not exists
            if url not in merged:
                merged[url] = {**node, 'canSpawn': False}

    all_nodes = list(merged.values())

    # Sort by category and name
    all_nodes.sort(key=lambda x: (x.get('category', ''), x.get('displayName', '')))

    logger.info(f"\n📊 Merge complete:")
    logger.info(f"   Total nodes: {len(all_nodes)}")
    logger.info(f"   Spawnable nodes: {spawnable_count}")
    logger.info(f"   Search-only nodes: {len(all_nodes) - spawnable_count}")

    # Save merged database
    output = {
        'version': '4.0',
        'source': 'Merged: Old spawnable nodes + Phase 1.5 functions + Transformation essentials',
        'mergedAt': '2025-12-05',
        'totalNodes': len(all_nodes),
        'spawnableNodes': spawnable_count,
        'searchOnlyNodes': len(all_nodes) - spawnable_count,
        'nodes': all_nodes
    }

    output_file = Path('ue_blueprint_nodes_merged.json')
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    logger.info(f"\n💾 Saved to {output_file}")

    # Verify transformation functions
    rotation_funcs = [n for n in all_nodes if 'rotation' in n.get('displayName', '').lower() and 'actor' in n.get('displayName', '').lower()]
    if rotation_funcs:
        logger.info(f"\n🎯 Verified actor rotation functions:")
        for func in rotation_funcs[:5]:
            logger.info(f"   ✓ {func['displayName']} (canSpawn: {func.get('canSpawn', False)})")

    logger.info(f"\n✅ Database ready!")
    logger.info(f"💡 Open index.html - you can now press Tab and search for 'Set Actor Rotation'")


if __name__ == '__main__':
    main()
