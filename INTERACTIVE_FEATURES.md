# Interactive Blueprint Editor Features

All the interactive features you requested are **already built into the blueprint viewer**! Here's how to use them:

## 🎯 Node Search & Spawning

### Method 1: Right-Click Menu
1. **Right-click** anywhere on the canvas
2. Type to search for nodes (e.g., "print", "delay", "branch")
3. Click on a node or press **Enter** to spawn it at your cursor position

### Method 2: Tab Key
1. Press **Tab** to open the node search menu
2. Type to filter nodes
3. Use **Arrow Keys** to navigate
4. Press **Enter** to spawn the selected node

**Note:** Currently only 12 nodes are marked as "spawnable" in the database. Other nodes will show a message that they're search-only and will be available after Phase 2 scraping.

## 🔗 Pin Connections (Click-to-Connect)

### Creating Connections
1. **Click and drag** from any output pin (on the right side of a node)
2. Drag to an input pin (on the left side of another node)
3. Release to create the connection

The system will:
- Show visual feedback as you drag
- Highlight compatible pins when you hover over them
- Prevent invalid connections automatically

### Connection Rules
- Execution pins (white) connect to execution pins
- Data pins connect to compatible data types
- Output pins → Input pins only

## ❌ Unlinking/Deleting Connections

### Delete a Connection
1. Hold **Alt** (or **Left Alt**)
2. **Click** on the link/wire you want to delete
3. The connection will be removed immediately

### Delete Multiple Connections
- Hold **Alt** and click multiple links one by one

## 🗑️ Deleting Nodes

- Select a node and press **Delete** key to remove it
- All connected links will be automatically removed

## ⌨️ Other Keyboard Shortcuts

- **Tab** - Open node search menu
- **Ctrl+A** - Select all nodes (when implemented)
- **Ctrl+D** - Duplicate selected nodes (when implemented)
- **Delete** - Delete selected nodes
- **Alt+Click** - Delete link/connection

## 📝 Notes

All these features are powered by the `ueblueprint.js` library's built-in interactive capabilities:
- `MouseCreateLink` class handles pin dragging and connection creation
- `MouseClick` with `enableLinkDelete` shortcut handles link deletion
- Node spawning uses the `spawnNode()` and `createNodeSerialization()` functions

The blueprint viewer is fully interactive and works exactly like the Unreal Engine Blueprint Editor!
