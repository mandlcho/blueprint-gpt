/**
 * Unreal Engine Blueprint Node Scraper
 *
 * This script provides multiple methods to collect UE blueprint nodes:
 * 1. Manual browser-based extraction (paste in browser console)
 * 2. Generate common blueprint nodes programmatically
 * 3. Merge with existing database
 */

const fs = require('fs');
const path = require('path');

// Load existing database
const existingDb = JSON.parse(fs.readFileSync('./ue_blueprint_nodes.json', 'utf8'));

// ========================================
// COMMON BLUEPRINT NODES DATABASE
// ========================================
// These are frequently used nodes in UE blueprints that should be added

const commonNodes = [
    // === MATH OPERATIONS ===
    {
        className: "K2Node_MathExpression",
        displayName: "Add",
        category: "Math|Float",
        nodeType: "Math",
        isPure: true,
        description: "Addition: A + B",
        keywords: "math add plus sum +"
    },
    {
        className: "K2Node_MathExpression",
        displayName: "Subtract",
        category: "Math|Float",
        nodeType: "Math",
        isPure: true,
        description: "Subtraction: A - B",
        keywords: "math subtract minus difference -"
    },
    {
        className: "K2Node_MathExpression",
        displayName: "Multiply",
        category: "Math|Float",
        nodeType: "Math",
        isPure: true,
        description: "Multiplication: A * B",
        keywords: "math multiply times product *"
    },
    {
        className: "K2Node_MathExpression",
        displayName: "Divide",
        category: "Math|Float",
        nodeType: "Math",
        isPure: true,
        description: "Division: A / B",
        keywords: "math divide quotient /"
    },
    {
        className: "K2Node_CallFunction",
        displayName: "Percent",
        category: "Math|Float",
        nodeType: "Math",
        isPure: true,
        description: "Modulo: A % B",
        keywords: "math modulo remainder mod %"
    },

    // === STRING OPERATIONS ===
    {
        className: "K2Node_CallFunction",
        displayName: "Append",
        category: "String",
        nodeType: "String",
        isPure: true,
        description: "Concatenates two strings together to make a new string",
        keywords: "string append concatenate join concat"
    },
    {
        className: "K2Node_CallFunction",
        displayName: "Len",
        category: "String",
        nodeType: "String",
        isPure: true,
        description: "Returns the length of a string",
        keywords: "string length size count len"
    },
    {
        className: "K2Node_CallFunction",
        displayName: "Contains",
        category: "String",
        nodeType: "String",
        isPure: true,
        description: "Returns whether this string contains the specified substring",
        keywords: "string contains search find"
    },
    {
        className: "K2Node_CallFunction",
        displayName: "ToUpper",
        category: "String",
        nodeType: "String",
        isPure: true,
        description: "Converts string to uppercase",
        keywords: "string uppercase upper case"
    },
    {
        className: "K2Node_CallFunction",
        displayName: "ToLower",
        category: "String",
        nodeType: "String",
        isPure: true,
        description: "Converts string to lowercase",
        keywords: "string lowercase lower case"
    },

    // === ARRAY OPERATIONS ===
    {
        className: "K2Node_CallArrayFunction",
        displayName: "Add",
        category: "Array",
        nodeType: "Array",
        isPure: false,
        description: "Adds an item to an array",
        keywords: "array add push append insert"
    },
    {
        className: "K2Node_CallArrayFunction",
        displayName: "Remove",
        category: "Array",
        nodeType: "Array",
        isPure: false,
        description: "Removes an item from an array",
        keywords: "array remove delete erase"
    },
    {
        className: "K2Node_CallArrayFunction",
        displayName: "Length",
        category: "Array",
        nodeType: "Array",
        isPure: true,
        description: "Returns the number of items in the array",
        keywords: "array length size count num"
    },
    {
        className: "K2Node_CallArrayFunction",
        displayName: "Get",
        category: "Array",
        nodeType: "Array",
        isPure: true,
        description: "Returns the item at the specified index in the array",
        keywords: "array get index access element"
    },
    {
        className: "K2Node_CallArrayFunction",
        displayName: "Clear",
        category: "Array",
        nodeType: "Array",
        isPure: false,
        description: "Clears all elements from the array",
        keywords: "array clear empty reset"
    },
    {
        className: "K2Node_CallArrayFunction",
        displayName: "Find",
        category: "Array",
        nodeType: "Array",
        isPure: true,
        description: "Finds the index of an item in the array",
        keywords: "array find search index locate"
    },

    // === VECTOR MATH ===
    {
        className: "K2Node_CallFunction",
        displayName: "MakeVector",
        category: "Math|Vector",
        nodeType: "Vector",
        isPure: true,
        description: "Makes a vector from X, Y, Z components",
        keywords: "vector make create construct"
    },
    {
        className: "K2Node_CallFunction",
        displayName: "BreakVector",
        category: "Math|Vector",
        nodeType: "Vector",
        isPure: true,
        description: "Breaks a vector into X, Y, Z components",
        keywords: "vector break split decompose"
    },
    {
        className: "K2Node_CallFunction",
        displayName: "VectorLength",
        category: "Math|Vector",
        nodeType: "Vector",
        isPure: true,
        description: "Returns the length (magnitude) of a vector",
        keywords: "vector length magnitude size"
    },
    {
        className: "K2Node_CallFunction",
        displayName: "Normalize",
        category: "Math|Vector",
        nodeType: "Vector",
        isPure: true,
        description: "Returns a normalized copy of the vector",
        keywords: "vector normalize unit direction"
    },
    {
        className: "K2Node_CallFunction",
        displayName: "DotProduct",
        category: "Math|Vector",
        nodeType: "Vector",
        isPure: true,
        description: "Calculates the dot product of two vectors",
        keywords: "vector dot product scalar"
    },
    {
        className: "K2Node_CallFunction",
        displayName: "CrossProduct",
        category: "Math|Vector",
        nodeType: "Vector",
        isPure: true,
        description: "Calculates the cross product of two vectors",
        keywords: "vector cross product perpendicular"
    },

    // === FLOW CONTROL ===
    {
        className: "K2Node_IfThenElse",
        displayName: "Branch",
        category: "Flow Control",
        nodeType: "Flow Control",
        isPure: false,
        description: "Branches execution flow based on a boolean condition",
        keywords: "branch if then else conditional"
    },
    {
        className: "K2Node_ExecutionSequence",
        displayName: "Sequence",
        category: "Flow Control",
        nodeType: "Flow Control",
        isPure: false,
        description: "Executes a series of pins in order",
        keywords: "sequence order then next"
    },
    {
        className: "K2Node_CallFunction",
        displayName: "DoOnce",
        category: "Flow Control",
        nodeType: "Flow Control",
        isPure: false,
        description: "Will fire off once, and then never again until reset",
        keywords: "do once single one time"
    },
    {
        className: "K2Node_CallFunction",
        displayName: "DoN",
        category: "Flow Control",
        nodeType: "Flow Control",
        isPure: false,
        description: "Will fire off N times, then stop until reset",
        keywords: "do n times count limit"
    },
    {
        className: "K2Node_CallFunction",
        displayName: "Delay",
        category: "Flow Control",
        nodeType: "Flow Control",
        isPure: false,
        description: "Delays execution for a set amount of time",
        keywords: "delay wait pause timer"
    },
    {
        className: "K2Node_CallFunction",
        displayName: "RetriggerableDelay",
        category: "Flow Control",
        nodeType: "Flow Control",
        isPure: false,
        description: "Delay that can be retriggered, restarting the countdown",
        keywords: "delay retriggerable restart reset"
    },
    {
        className: "K2Node_CallFunction",
        displayName: "Gate",
        category: "Flow Control",
        nodeType: "Flow Control",
        isPure: false,
        description: "Acts as a gate, allowing execution to pass through when open",
        keywords: "gate open close enable disable"
    },
    {
        className: "K2Node_MultiGate",
        displayName: "MultiGate",
        category: "Flow Control",
        nodeType: "Flow Control",
        isPure: false,
        description: "Routes execution to one of several output pins",
        keywords: "multigate multiple gate route"
    },
    {
        className: "K2Node_CallFunction",
        displayName: "FlipFlop",
        category: "Flow Control",
        nodeType: "Flow Control",
        isPure: false,
        description: "Alternates between two output pins each time it executes",
        keywords: "flipflop alternate toggle switch"
    },
    {
        className: "K2Node_CallFunction",
        displayName: "ForLoop",
        category: "Flow Control",
        nodeType: "Flow Control",
        isPure: false,
        description: "Standard for loop with index",
        keywords: "for loop iterate index counter"
    },
    {
        className: "K2Node_CallFunction",
        displayName: "ForEachLoop",
        category: "Flow Control",
        nodeType: "Flow Control",
        isPure: false,
        description: "Loops through each element in an array",
        keywords: "foreach loop iterate array element"
    },
    {
        className: "K2Node_CallFunction",
        displayName: "WhileLoop",
        category: "Flow Control",
        nodeType: "Flow Control",
        isPure: false,
        description: "Loops while a condition is true",
        keywords: "while loop condition repeat"
    },

    // === TRANSFORM & ROTATION ===
    {
        className: "K2Node_CallFunction",
        displayName: "MakeTransform",
        category: "Transform",
        nodeType: "Transform",
        isPure: true,
        description: "Makes a transform from location, rotation, and scale",
        keywords: "transform make create construct"
    },
    {
        className: "K2Node_CallFunction",
        displayName: "BreakTransform",
        category: "Transform",
        nodeType: "Transform",
        isPure: true,
        description: "Breaks a transform into location, rotation, and scale",
        keywords: "transform break split decompose"
    },
    {
        className: "K2Node_CallFunction",
        displayName: "MakeRotator",
        category: "Transform",
        nodeType: "Rotator",
        isPure: true,
        description: "Makes a rotator from pitch, yaw, and roll",
        keywords: "rotator rotation make create"
    },
    {
        className: "K2Node_CallFunction",
        displayName: "BreakRotator",
        category: "Transform",
        nodeType: "Rotator",
        isPure: true,
        description: "Breaks a rotator into pitch, yaw, and roll",
        keywords: "rotator rotation break split"
    },

    // === ACTOR & COMPONENT ===
    {
        className: "K2Node_CallFunction",
        displayName: "GetActorLocation",
        category: "Actor",
        nodeType: "Actor",
        isPure: true,
        description: "Returns the location of the actor in world space",
        keywords: "actor location position get"
    },
    {
        className: "K2Node_CallFunction",
        displayName: "SetActorLocation",
        category: "Actor",
        nodeType: "Actor",
        isPure: false,
        description: "Sets the location of the actor in world space",
        keywords: "actor location position set move"
    },
    {
        className: "K2Node_CallFunction",
        displayName: "GetActorRotation",
        category: "Actor",
        nodeType: "Actor",
        isPure: true,
        description: "Returns the rotation of the actor in world space",
        keywords: "actor rotation orientation get"
    },
    {
        className: "K2Node_CallFunction",
        displayName: "SetActorRotation",
        category: "Actor",
        nodeType: "Actor",
        isPure: false,
        description: "Sets the rotation of the actor in world space",
        keywords: "actor rotation orientation set rotate"
    },
    {
        className: "K2Node_CallFunction",
        displayName: "GetActorScale3D",
        category: "Actor",
        nodeType: "Actor",
        isPure: true,
        description: "Returns the scale of the actor",
        keywords: "actor scale size get"
    },
    {
        className: "K2Node_CallFunction",
        displayName: "SetActorScale3D",
        category: "Actor",
        nodeType: "Actor",
        isPure: false,
        description: "Sets the scale of the actor",
        keywords: "actor scale size set"
    },
    {
        className: "K2Node_SpawnActorFromClass",
        displayName: "SpawnActor",
        category: "Actor",
        nodeType: "Actor",
        isPure: false,
        description: "Spawns an actor of the specified class",
        keywords: "spawn actor create instantiate"
    },
    {
        className: "K2Node_CallFunction",
        displayName: "DestroyActor",
        category: "Actor",
        nodeType: "Actor",
        isPure: false,
        description: "Destroys this actor",
        keywords: "destroy actor delete remove kill"
    },

    // === PRINTING & DEBUG ===
    {
        className: "K2Node_CallFunction",
        displayName: "PrintString",
        category: "Development",
        nodeType: "Debug",
        isPure: false,
        description: "Prints a string to the log and optionally to the screen",
        keywords: "print string log debug output"
    },
    {
        className: "K2Node_CallFunction",
        displayName: "PrintText",
        category: "Development",
        nodeType: "Debug",
        isPure: false,
        description: "Prints text to the log and optionally to the screen",
        keywords: "print text log debug output"
    },

    // === CASTING ===
    {
        className: "K2Node_DynamicCast",
        displayName: "Cast",
        category: "Casting",
        nodeType: "Cast",
        isPure: false,
        description: "Attempts to cast an object to a specific class",
        keywords: "cast convert type as"
    },

    // === EVENTS ===
    {
        className: "K2Node_Event",
        displayName: "BeginPlay",
        category: "Event",
        nodeType: "Event",
        isPure: false,
        description: "Event when play begins for this actor",
        keywords: "begin play start event"
    },
    {
        className: "K2Node_Event",
        displayName: "Tick",
        category: "Event",
        nodeType: "Event",
        isPure: false,
        description: "Event called every frame",
        keywords: "tick update frame event"
    },
    {
        className: "K2Node_Event",
        displayName: "EndPlay",
        category: "Event",
        nodeType: "Event",
        isPure: false,
        description: "Event when play ends for this actor",
        keywords: "end play stop destroy event"
    },
    {
        className: "K2Node_CustomEvent",
        displayName: "CustomEvent",
        category: "Event",
        nodeType: "Event",
        isPure: false,
        description: "Creates a custom event",
        keywords: "custom event create new"
    }
];

// ========================================
// MERGE FUNCTION
// ========================================

function mergeNodes() {
    console.log('=== Merging Node Databases ===\n');

    // Create a set of existing node classNames for deduplication
    const existingClassNames = new Set(
        existingDb.nodes.map(node => node.className + '||' + node.displayName)
    );

    // Filter out duplicates from commonNodes
    const newNodes = commonNodes.filter(node => {
        const key = node.className + '||' + node.displayName;
        return !existingClassNames.has(key);
    });

    console.log(`Existing nodes: ${existingDb.nodes.length}`);
    console.log(`Common nodes to add: ${newNodes.length}`);
    console.log(`Duplicate nodes skipped: ${commonNodes.length - newNodes.length}\n`);

    // Merge nodes
    const mergedNodes = [...existingDb.nodes, ...newNodes];

    // Count node types
    const nodeTypeCounts = {};
    mergedNodes.forEach(node => {
        const type = node.nodeType || 'Uncategorized';
        nodeTypeCounts[type] = (nodeTypeCounts[type] || 0) + 1;
    });

    // Create merged database
    const mergedDb = {
        version: "2.0",
        extractedFrom: "Unreal Engine Source - BlueprintGraph + Common Nodes",
        totalNodes: mergedNodes.length,
        categories: {
            Uncategorized: mergedNodes.length
        },
        nodeTypes: nodeTypeCounts,
        nodes: mergedNodes.sort((a, b) =>
            a.displayName.localeCompare(b.displayName)
        )
    };

    // Write to file
    const outputPath = path.join(__dirname, 'ue_blueprint_nodes_expanded.json');
    fs.writeFileSync(outputPath, JSON.stringify(mergedDb, null, 2));

    console.log('✓ Merged database saved to: ue_blueprint_nodes_expanded.json');
    console.log(`\nNode Type Breakdown:`);
    Object.entries(nodeTypeCounts)
        .sort((a, b) => b[1] - a[1])
        .forEach(([type, count]) => {
            console.log(`  ${type}: ${count}`);
        });

    console.log(`\nTotal nodes: ${mergedNodes.length}`);
    console.log(`\nNew nodes added:`);
    newNodes.slice(0, 10).forEach(node => {
        console.log(`  - ${node.displayName} (${node.nodeType})`);
    });
    if (newNodes.length > 10) {
        console.log(`  ... and ${newNodes.length - 10} more`);
    }
}

// ========================================
// BROWSER CONSOLE SCRAPER
// ========================================

const browserScraperCode = `
// ==================================================
// UNREAL ENGINE BLUEPRINT NODE SCRAPER
// Paste this code into your browser console when viewing
// the UE Blueprint API documentation page
// ==================================================

(function() {
    console.log('Starting UE Blueprint Node Scraper...');

    const nodes = [];

    // Try to find node elements on the page
    // This will vary depending on the documentation structure
    const nodeElements = document.querySelectorAll('.node-item, .api-item, .reference-item');

    nodeElements.forEach(el => {
        const node = {
            className: el.querySelector('.class-name, .node-class')?.textContent?.trim(),
            displayName: el.querySelector('.display-name, .node-name')?.textContent?.trim(),
            category: el.querySelector('.category, .node-category')?.textContent?.trim(),
            nodeType: el.querySelector('.type, .node-type')?.textContent?.trim(),
            description: el.querySelector('.description, .node-desc')?.textContent?.trim(),
            isPure: el.textContent.toLowerCase().includes('pure'),
        };

        if (node.className || node.displayName) {
            nodes.push(node);
        }
    });

    console.log(\`Found \${nodes.length} nodes\`);
    console.log('Nodes:', nodes);

    // Copy to clipboard
    const jsonOutput = JSON.stringify(nodes, null, 2);
    navigator.clipboard.writeText(jsonOutput).then(() => {
        console.log('✓ Node data copied to clipboard!');
        console.log('Paste this into scrape-ue-nodes.js');
    });

    return nodes;
})();
`;

// ========================================
// MAIN EXECUTION
// ========================================

console.log('\n╔═══════════════════════════════════════════════════════════╗');
console.log('║   Unreal Engine Blueprint Node Database Expander         ║');
console.log('╚═══════════════════════════════════════════════════════════╝\n');

// Run the merge
mergeNodes();

console.log('\n========================================');
console.log('BROWSER SCRAPER CODE');
console.log('========================================');
console.log('If you want to scrape additional nodes from UE documentation,');
console.log('copy the code below and paste it into your browser console');
console.log('when viewing the Blueprint API page:\n');
console.log(browserScraperCode);
console.log('\n========================================\n');
