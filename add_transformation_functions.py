#!/usr/bin/env python3
"""
Manually add essential Transformation blueprint functions.
Based on official UE documentation that we know exists.
"""

import json
from pathlib import Path
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(message)s')
logger = logging.getLogger(__name__)


def get_transformation_functions():
    """Return known transformation functions from UE documentation."""
    base_url = "https://dev.epicgames.com/documentation/en-us/unreal-engine/BlueprintAPI/Transformation"

    return [
        {
            "displayName": "Get Actor Location",
            "category": "Transformation",
            "description": "Returns location of the RootComponent of this Actor",
            "url": f"{base_url}/GetActorLocation",
            "type": "function",
            "hasDetailedInfo": False,
            "canSpawn": False
        },
        {
            "displayName": "Set Actor Location",
            "category": "Transformation",
            "description": "Set the Actor's location instantly to the specified location",
            "url": f"{base_url}/SetActorLocation",
            "type": "function",
            "hasDetailedInfo": False,
            "canSpawn": False
        },
        {
            "displayName": "Get Actor Rotation",
            "category": "Transformation",
            "description": "Returns rotation of the RootComponent of this Actor",
            "url": f"{base_url}/GetActorRotation",
            "type": "function",
            "hasDetailedInfo": False,
            "canSpawn": False
        },
        {
            "displayName": "Set Actor Rotation",
            "category": "Transformation",
            "description": "Set the Actor's rotation instantly to the specified rotation",
            "url": f"{base_url}/SetActorRotation",
            "type": "function",
            "hasDetailedInfo": False,
            "canSpawn": False
        },
        {
            "displayName": "Get Actor Scale3D",
            "category": "Transformation",
            "description": "Returns scale 3D of the RootComponent",
            "url": f"{base_url}/GetActorScale3D",
            "type": "function",
            "hasDetailedInfo": False,
            "canSpawn": False
        },
        {
            "displayName": "Set Actor Scale3D",
            "category": "Transformation",
            "description": "Set the Actor's scale",
            "url": f"{base_url}/SetActorScale3D",
            "type": "function",
            "hasDetailedInfo": False,
            "canSpawn": False
        },
        {
            "displayName": "Get Actor Transform",
            "category": "Transformation",
            "description": "Returns the transform of the RootComponent",
            "url": f"{base_url}/GetActorTransform",
            "type": "function",
            "hasDetailedInfo": False,
            "canSpawn": False
        },
        {
            "displayName": "Set Actor Transform",
            "category": "Transformation",
            "description": "Set the Actor's transform instantly",
            "url": f"{base_url}/SetActorTransform",
            "type": "function",
            "hasDetailedInfo": False,
            "canSpawn": False
        },
        {
            "displayName": "Set Actor Location And Rotation",
            "category": "Transformation",
            "description": "Set the Actor's location and rotation instantly",
            "url": f"{base_url}/SetActorLocationAndRotation",
            "type": "function",
            "hasDetailedInfo": False,
            "canSpawn": False
        },
        {
            "displayName": "Set Actor Relative Location",
            "category": "Transformation",
            "description": "Set the Actor's relative location",
            "url": f"{base_url}/SetActorRelativeLocation",
            "type": "function",
            "hasDetailedInfo": False,
            "canSpawn": False
        },
        {
            "displayName": "Set Actor Relative Rotation",
            "category": "Transformation",
            "description": "Set the Actor's relative rotation",
            "url": f"{base_url}/SetActorRelativeRotation",
            "type": "function",
            "hasDetailedInfo": False,
            "canSpawn": False
        },
        {
            "displayName": "Set Actor Relative Transform",
            "category": "Transformation",
            "description": "Set the Actor's relative transform",
            "url": f"{base_url}/SetActorRelativeTransform",
            "type": "function",
            "hasDetailedInfo": False,
            "canSpawn": False
        },
        {
            "displayName": "Add Actor World Offset",
            "category": "Transformation",
            "description": "Adds a delta to the location of this actor in world space",
            "url": f"{base_url}/AddActorWorldOffset",
            "type": "function",
            "hasDetailedInfo": False,
            "canSpawn": False
        },
        {
            "displayName": "Add Actor World Rotation",
            "category": "Transformation",
            "description": "Adds a delta to the rotation of this actor in world space",
            "url": f"{base_url}/AddActorWorldRotation",
            "type": "function",
            "hasDetailedInfo": False,
            "canSpawn": False
        },
        {
            "displayName": "Add Actor World Transform",
            "category": "Transformation",
            "description": "Adds a delta to the transform of this actor in world space",
            "url": f"{base_url}/AddActorWorldTransform",
            "type": "function",
            "hasDetailedInfo": False,
            "canSpawn": False
        },
        {
            "displayName": "Add Actor Local Offset",
            "category": "Transformation",
            "description": "Adds a delta to the location of this actor in local space",
            "url": f"{base_url}/AddActorLocalOffset",
            "type": "function",
            "hasDetailedInfo": False,
            "canSpawn": False
        },
        {
            "displayName": "Add Actor Local Rotation",
            "category": "Transformation",
            "description": "Adds a delta to the rotation of this actor in local space",
            "url": f"{base_url}/AddActorLocalRotation",
            "type": "function",
            "hasDetailedInfo": False,
            "canSpawn": False
        },
        {
            "displayName": "Add Actor Local Transform",
            "category": "Transformation",
            "description": "Adds a delta to the transform of this actor in local space",
            "url": f"{base_url}/AddActorLocalTransform",
            "type": "function",
            "hasDetailedInfo": False,
            "canSpawn": False
        },
        {
            "displayName": "Get Actor Forward Vector",
            "category": "Transformation",
            "description": "Get the forward (X) vector of this Actor",
            "url": f"{base_url}/GetActorForwardVector",
            "type": "function",
            "hasDetailedInfo": False,
            "canSpawn": False
        },
        {
            "displayName": "Get Actor Right Vector",
            "category": "Transformation",
            "description": "Get the right (Y) vector of this Actor",
            "url": f"{base_url}/GetActorRightVector",
            "type": "function",
            "hasDetailedInfo": False,
            "canSpawn": False
        },
        {
            "displayName": "Get Actor Up Vector",
            "category": "Transformation",
            "description": "Get the up (Z) vector of this Actor",
            "url": f"{base_url}/GetActorUpVector",
            "type": "function",
            "hasDetailedInfo": False,
            "canSpawn": False
        },
    ]


def main():
    logger.info("📝 Adding essential Transformation functions\n")

    # Load existing Phase 1.5 data
    phase15_file = Path('ue_blueprint_functions_phase1_5.json')
    if not phase15_file.exists():
        logger.error("❌ Phase 1.5 file not found! Run phase1_5_extract_functions.py first.")
        return

    with open(phase15_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    existing_nodes = data['nodes']
    existing_urls = {node['url'] for node in existing_nodes}

    # Add transformation functions
    transformation_funcs = get_transformation_functions()
    added_count = 0

    for func in transformation_funcs:
        if func['url'] not in existing_urls:
            existing_nodes.append(func)
            added_count += 1
            logger.info(f"   ✓ Added: {func['displayName']}")

    logger.info(f"\n📊 Added {added_count} new Transformation functions")
    logger.info(f"   Total functions: {len(existing_nodes)}")

    # Sort by category and name
    existing_nodes.sort(key=lambda x: (x['category'], x['displayName']))

    # Update and save
    data['nodes'] = existing_nodes
    data['totalFunctions'] = len(existing_nodes)
    data['version'] = '1.5.1'
    data['source'] = 'Extracted from cache + Essential Transformation functions'

    with open(phase15_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    logger.info(f"\n💾 Updated {phase15_file}")
    logger.info(f"\n✅ Success! You can now search for 'Set Actor Rotation' and 'Get Actor Rotation'")
    logger.info(f"💡 Next: Merge this into ue_blueprint_nodes_merged.json to use in the webapp")


if __name__ == '__main__':
    main()
