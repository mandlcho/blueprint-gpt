#!/usr/bin/env python3
"""
Merge old nodes database (with className for spawning) with Phase 1 catalog.
"""

import json

# Load old database (113 nodes with full spawn data)
with open('ue_blueprint_nodes.json', 'r', encoding='utf-8') as f:
    old_data = json.load(f)

# Load Phase 1 catalog (2,090 nodes with basic info)
with open('ue_blueprint_nodes_phase1.json', 'r', encoding='utf-8') as f:
    phase1_data = json.load(f)

print(f"Old database: {len(old_data['nodes'])} spawnable nodes")
print(f"Phase 1: {len(phase1_data['nodes'])} searchable nodes")

# Merge: Start with Phase 1 as base, enhance with old data where available
merged_nodes = []

# Create lookup for old nodes by displayName
old_by_name = {node.get('displayName', ''): node for node in old_data['nodes']}

for phase1_node in phase1_data['nodes']:
    node = {**phase1_node}  # Copy Phase 1 data

    # Check if we have detailed data from old database
    old_node = old_by_name.get(node['displayName'])
    if old_node:
        # Merge in spawning data from old database
        node['className'] = old_node.get('className')
        node['nodeType'] = old_node.get('nodeType')
        node['isPure'] = old_node.get('isPure', False)
        node['canSpawn'] = True
        print(f"  ✓ Enhanced: {node['displayName']}")
    else:
        # Mark as non-spawnable (search only)
        node['canSpawn'] = False

    merged_nodes.append(node)

# Add any old nodes that weren't in Phase 1
phase1_names = {n['displayName'] for n in phase1_data['nodes']}
for old_node in old_data['nodes']:
    if old_node.get('displayName') not in phase1_names:
        node = {**old_node}
        node['canSpawn'] = True
        merged_nodes.append(node)
        print(f"  + Added from old: {node['displayName']}")

# Create merged database
merged = {
    'version': '3.0',
    'source': 'Merged: Old spawnable database + Phase 1 catalog',
    'mergedAt': '2025-12-05',
    'totalNodes': len(merged_nodes),
    'spawnableNodes': sum(1 for n in merged_nodes if n.get('canSpawn')),
    'searchOnlyNodes': sum(1 for n in merged_nodes if not n.get('canSpawn')),
    'nodes': merged_nodes
}

# Save merged database
with open('ue_blueprint_nodes_merged.json', 'w', encoding='utf-8') as f:
    json.dump(merged, f, indent=2, ensure_ascii=False)

print(f"\n✅ Merged database created:")
print(f"   Total nodes: {merged['totalNodes']}")
print(f"   Spawnable (with className): {merged['spawnableNodes']}")
print(f"   Search-only: {merged['searchOnlyNodes']}")
print(f"   Saved to: ue_blueprint_nodes_merged.json")
