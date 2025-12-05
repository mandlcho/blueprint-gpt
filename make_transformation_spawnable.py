#!/usr/bin/env python3
"""
Add className and basic pin info to Transformation functions to make them spawnable.
This allows them to be instantiated on the blueprint canvas.
"""

import json
from pathlib import Path
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(message)s')
logger = logging.getLogger(__name__)


def get_transformation_spawn_data():
    """Map transformation functions to their K2Node class and basic pins."""

    # All transformation functions are K2Node_CallFunction nodes
    # They call functions on the Actor class

    return {
        "Get Actor Location": {
            "className": "K2Node_CallFunction",
            "functionName": "K2_GetActorLocation",
            "targetClass": "/Script/Engine.Actor",
            "isPure": True,
            "inputs": [
                {"name": "self", "type": "object", "description": "Target Actor"}
            ],
            "outputs": [
                {"name": "ReturnValue", "type": "struct", "description": "Actor's world location"}
            ]
        },
        "Set Actor Location": {
            "className": "K2Node_CallFunction",
            "functionName": "K2_SetActorLocation",
            "targetClass": "/Script/Engine.Actor",
            "isPure": False,
            "inputs": [
                {"name": "execute", "type": "exec", "description": "Execution pin"},
                {"name": "self", "type": "object", "description": "Target Actor"},
                {"name": "NewLocation", "type": "struct", "description": "New location to set"},
                {"name": "bSweep", "type": "bool", "description": "Whether to sweep to the destination"},
                {"name": "bTeleport", "type": "bool", "description": "Whether to teleport"}
            ],
            "outputs": [
                {"name": "then", "type": "exec", "description": "Execution output"},
                {"name": "ReturnValue", "type": "bool", "description": "Whether location was successfully set"}
            ]
        },
        "Get Actor Rotation": {
            "className": "K2Node_CallFunction",
            "functionName": "K2_GetActorRotation",
            "targetClass": "/Script/Engine.Actor",
            "isPure": True,
            "inputs": [
                {"name": "self", "type": "object", "description": "Target Actor"}
            ],
            "outputs": [
                {"name": "ReturnValue", "type": "struct", "description": "Actor's world rotation"}
            ]
        },
        "Set Actor Rotation": {
            "className": "K2Node_CallFunction",
            "functionName": "K2_SetActorRotation",
            "targetClass": "/Script/Engine.Actor",
            "isPure": False,
            "inputs": [
                {"name": "execute", "type": "exec", "description": "Execution pin"},
                {"name": "self", "type": "object", "description": "Target Actor"},
                {"name": "NewRotation", "type": "struct", "description": "New rotation to set"},
                {"name": "bTeleportPhysics", "type": "bool", "description": "Whether to teleport physics"}
            ],
            "outputs": [
                {"name": "then", "type": "exec", "description": "Execution output"},
                {"name": "ReturnValue", "type": "bool", "description": "Whether rotation was successfully set"}
            ]
        },
        "Get Actor Scale3D": {
            "className": "K2Node_CallFunction",
            "functionName": "GetActorScale3D",
            "targetClass": "/Script/Engine.Actor",
            "isPure": True,
            "inputs": [
                {"name": "self", "type": "object", "description": "Target Actor"}
            ],
            "outputs": [
                {"name": "ReturnValue", "type": "struct", "description": "Actor's scale"}
            ]
        },
        "Set Actor Scale3D": {
            "className": "K2Node_CallFunction",
            "functionName": "SetActorScale3D",
            "targetClass": "/Script/Engine.Actor",
            "isPure": False,
            "inputs": [
                {"name": "execute", "type": "exec", "description": "Execution pin"},
                {"name": "self", "type": "object", "description": "Target Actor"},
                {"name": "NewScale3D", "type": "struct", "description": "New scale to set"}
            ],
            "outputs": [
                {"name": "then", "type": "exec", "description": "Execution output"}
            ]
        },
        "Get Actor Transform": {
            "className": "K2Node_CallFunction",
            "functionName": "GetTransform",
            "targetClass": "/Script/Engine.Actor",
            "isPure": True,
            "inputs": [
                {"name": "self", "type": "object", "description": "Target Actor"}
            ],
            "outputs": [
                {"name": "ReturnValue", "type": "struct", "description": "Actor's world transform"}
            ]
        },
        "Set Actor Transform": {
            "className": "K2Node_CallFunction",
            "functionName": "SetActorTransform",
            "targetClass": "/Script/Engine.Actor",
            "isPure": False,
            "inputs": [
                {"name": "execute", "type": "exec", "description": "Execution pin"},
                {"name": "self", "type": "object", "description": "Target Actor"},
                {"name": "NewTransform", "type": "struct", "description": "New transform to set"},
                {"name": "bSweep", "type": "bool", "description": "Whether to sweep"},
                {"name": "bTeleport", "type": "bool", "description": "Whether to teleport"}
            ],
            "outputs": [
                {"name": "then", "type": "exec", "description": "Execution output"},
                {"name": "ReturnValue", "type": "bool", "description": "Whether transform was successfully set"}
            ]
        },
        "Set Actor Location And Rotation": {
            "className": "K2Node_CallFunction",
            "functionName": "K2_SetActorLocationAndRotation",
            "targetClass": "/Script/Engine.Actor",
            "isPure": False,
            "inputs": [
                {"name": "execute", "type": "exec", "description": "Execution pin"},
                {"name": "self", "type": "object", "description": "Target Actor"},
                {"name": "NewLocation", "type": "struct", "description": "New location"},
                {"name": "NewRotation", "type": "struct", "description": "New rotation"},
                {"name": "bSweep", "type": "bool", "description": "Whether to sweep"},
                {"name": "bTeleport", "type": "bool", "description": "Whether to teleport"}
            ],
            "outputs": [
                {"name": "then", "type": "exec", "description": "Execution output"},
                {"name": "ReturnValue", "type": "bool", "description": "Success"}
            ]
        },
        "Get Actor Forward Vector": {
            "className": "K2Node_CallFunction",
            "functionName": "GetActorForwardVector",
            "targetClass": "/Script/Engine.Actor",
            "isPure": True,
            "inputs": [
                {"name": "self", "type": "object", "description": "Target Actor"}
            ],
            "outputs": [
                {"name": "ReturnValue", "type": "struct", "description": "Forward vector"}
            ]
        },
        "Get Actor Right Vector": {
            "className": "K2Node_CallFunction",
            "functionName": "GetActorRightVector",
            "targetClass": "/Script/Engine.Actor",
            "isPure": True,
            "inputs": [
                {"name": "self", "type": "object", "description": "Target Actor"}
            ],
            "outputs": [
                {"name": "ReturnValue", "type": "struct", "description": "Right vector"}
            ]
        },
        "Get Actor Up Vector": {
            "className": "K2Node_CallFunction",
            "functionName": "GetActorUpVector",
            "targetClass": "/Script/Engine.Actor",
            "isPure": True,
            "inputs": [
                {"name": "self", "type": "object", "description": "Target Actor"}
            ],
            "outputs": [
                {"name": "ReturnValue", "type": "struct", "description": "Up vector"}
            ]
        }
    }


def main():
    logger.info("🔧 Making Transformation functions spawnable\n")

    # Load merged database
    merged_file = Path('ue_blueprint_nodes_merged.json')
    if not merged_file.exists():
        logger.error("❌ Merged database not found! Run merge_all_nodes.py first.")
        return

    with open(merged_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    nodes = data['nodes']
    spawn_data = get_transformation_spawn_data()

    updated_count = 0
    for node in nodes:
        display_name = node.get('displayName', '')
        if display_name in spawn_data:
            spawn_info = spawn_data[display_name]
            node['className'] = spawn_info['className']
            node['functionName'] = spawn_info['functionName']
            node['targetClass'] = spawn_info['targetClass']
            node['isPure'] = spawn_info['isPure']
            node['inputs'] = spawn_info['inputs']
            node['outputs'] = spawn_info['outputs']
            node['canSpawn'] = True
            node['hasDetailedInfo'] = True
            updated_count += 1
            logger.info(f"   ✓ {display_name} -> spawnable")

    # Update counts
    spawnable_count = sum(1 for n in nodes if n.get('canSpawn', False))

    data['spawnableNodes'] = spawnable_count
    data['searchOnlyNodes'] = len(nodes) - spawnable_count
    data['version'] = '4.1'

    # Save
    with open(merged_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    logger.info(f"\n📊 Update complete:")
    logger.info(f"   Updated: {updated_count} functions")
    logger.info(f"   Total spawnable: {spawnable_count}")
    logger.info(f"   Total nodes: {len(nodes)}")

    logger.info(f"\n💾 Updated {merged_file}")
    logger.info(f"\n✅ Success! Open index.html and try spawning 'Set Actor Rotation' now!")


if __name__ == '__main__':
    main()
