#!/usr/bin/env python3
"""
Scraper for blueprintue.com to collect real Unreal Engine blueprint examples.
These examples will be used to train/improve LLM blueprint generation accuracy.
"""

import requests
import json
import re
import time
from pathlib import Path
from typing import Optional
from bs4 import BeautifulSoup

# Common blueprint operations to search for
SEARCH_QUERIES = [
    # Basic operations
    "print string",
    "hello world",
    "debug",

    # Math
    "add float",
    "multiply",
    "clamp",
    "lerp",
    "distance",
    "normalize",

    # Vectors/Transforms
    "get actor location",
    "set actor location",
    "get actor rotation",
    "get forward vector",
    "make vector",
    "break vector",

    # Actor/Component
    "spawn actor",
    "destroy actor",
    "get component",
    "add component",
    "get player controller",
    "get player character",
    "get player pawn",

    # Input
    "input action",
    "input axis",
    "key pressed",
    "mouse",

    # Events
    "begin play",
    "tick",
    "overlap",
    "hit",
    "timer",
    "delay",

    # Flow Control
    "branch",
    "for loop",
    "foreach",
    "sequence",
    "switch",
    "gate",
    "do once",

    # Arrays
    "array",
    "get array",
    "add array",
    "remove array",
    "find array",

    # Physics
    "line trace",
    "sphere trace",
    "add force",
    "add impulse",
    "set physics",

    # Animation
    "play animation",
    "play montage",
    "get anim instance",

    # UI/HUD
    "create widget",
    "add to viewport",
    "remove from parent",
    "set text",

    # Audio
    "play sound",
    "spawn sound",

    # AI
    "ai moveto",
    "blackboard",
    "behavior tree",

    # Gameplay
    "apply damage",
    "get health",
    "set visibility",
    "set collision",
]

class BlueprintUEScraper:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        })
        self.blueprints = []
        self.nodes_db = {}

    def search_blueprints(self, query: str, max_results: int = 5) -> list:
        """Search Google for blueprintue.com blueprints matching a query."""
        # Using a simple approach - fetch from known blueprint URLs
        # In production, you'd want to use Google Custom Search API or similar
        print(f"Searching for: {query}")
        return []  # Placeholder - we'll use direct URLs instead

    def fetch_blueprint(self, url: str) -> Optional[dict]:
        """Fetch a blueprint page and extract the raw code."""
        try:
            print(f"Fetching: {url}")
            response = self.session.get(url, timeout=30)
            response.raise_for_status()

            soup = BeautifulSoup(response.text, 'html.parser')

            # Find the blueprint code - it's usually in a specific element
            # Look for the raw blueprint text
            code_element = soup.find('textarea', {'id': 'blueprint-raw'})
            if not code_element:
                code_element = soup.find('pre', class_='blueprint-code')
            if not code_element:
                # Try to find it in a script tag or data attribute
                script_tags = soup.find_all('script')
                for script in script_tags:
                    if script.string and 'Begin Object' in script.string:
                        code = self.extract_blueprint_from_script(script.string)
                        if code:
                            return self.parse_blueprint(code, url)

            if code_element:
                code = code_element.get_text()
                return self.parse_blueprint(code, url)

            # Try to find blueprint data in page source
            page_text = response.text
            if 'Begin Object' in page_text:
                # Extract blueprint code from page
                match = re.search(r'Begin Object.*?End Object', page_text, re.DOTALL)
                if match:
                    return self.parse_blueprint(match.group(0), url)

            return None

        except Exception as e:
            print(f"Error fetching {url}: {e}")
            return None

    def extract_blueprint_from_script(self, script_content: str) -> Optional[str]:
        """Extract blueprint code from JavaScript content."""
        # Look for blueprint data in various formats
        patterns = [
            r'"blueprint"\s*:\s*"([^"]+)"',
            r"'blueprint'\s*:\s*'([^']+)'",
            r'Begin Object.*?End Object',
        ]

        for pattern in patterns:
            match = re.search(pattern, script_content, re.DOTALL)
            if match:
                return match.group(1) if match.lastindex else match.group(0)
        return None

    def parse_blueprint(self, code: str, source_url: str) -> dict:
        """Parse raw blueprint code and extract node information."""
        nodes = []

        # Split into individual node definitions
        node_pattern = r'Begin Object Class=([^\s]+).*?End Object'
        matches = re.findall(node_pattern, code, re.DOTALL)

        # More detailed parsing
        full_nodes = re.findall(r'Begin Object.*?End Object', code, re.DOTALL)

        for node_text in full_nodes:
            node_info = self.parse_node(node_text)
            if node_info:
                nodes.append(node_info)

        return {
            'source_url': source_url,
            'raw_code': code,
            'nodes': nodes,
            'node_count': len(nodes)
        }

    def parse_node(self, node_text: str) -> Optional[dict]:
        """Parse a single node definition."""
        try:
            # Extract class
            class_match = re.search(r'Class=([^\s]+)', node_text)
            node_class = class_match.group(1) if class_match else None

            # Extract name
            name_match = re.search(r'Name="([^"]+)"', node_text)
            node_name = name_match.group(1) if name_match else None

            # Extract function reference (for CallFunction nodes)
            func_match = re.search(r'FunctionReference=\(([^)]+)\)', node_text)
            function_ref = func_match.group(1) if func_match else None

            # Extract member name
            member_match = re.search(r'MemberName="([^"]+)"', node_text)
            member_name = member_match.group(1) if member_match else None

            # Extract position
            pos_x_match = re.search(r'NodePosX=(-?\d+)', node_text)
            pos_y_match = re.search(r'NodePosY=(-?\d+)', node_text)

            # Extract pins
            pins = []
            pin_matches = re.findall(r'CustomProperties Pin \(([^)]+)\)', node_text)
            for pin_content in pin_matches:
                pin_info = self.parse_pin(pin_content)
                if pin_info:
                    pins.append(pin_info)

            return {
                'class': node_class,
                'name': node_name,
                'function_ref': function_ref,
                'member_name': member_name,
                'pos_x': int(pos_x_match.group(1)) if pos_x_match else 0,
                'pos_y': int(pos_y_match.group(1)) if pos_y_match else 0,
                'pins': pins,
                'raw': node_text
            }
        except Exception as e:
            print(f"Error parsing node: {e}")
            return None

    def parse_pin(self, pin_content: str) -> Optional[dict]:
        """Parse a pin definition."""
        try:
            pin_id_match = re.search(r'PinId=([^,]+)', pin_content)
            pin_name_match = re.search(r'PinName="([^"]+)"', pin_content)
            direction_match = re.search(r'Direction="([^"]+)"', pin_content)
            category_match = re.search(r'PinType\.PinCategory="([^"]+)"', pin_content)
            default_match = re.search(r'DefaultValue="([^"]*)"', pin_content)
            linked_match = re.search(r'LinkedTo=\(([^)]*)\)', pin_content)

            return {
                'id': pin_id_match.group(1) if pin_id_match else None,
                'name': pin_name_match.group(1) if pin_name_match else None,
                'direction': direction_match.group(1) if direction_match else 'EGPD_Input',
                'category': category_match.group(1) if category_match else None,
                'default_value': default_match.group(1) if default_match else None,
                'linked_to': linked_match.group(1) if linked_match else None
            }
        except Exception as e:
            return None

    def build_nodes_database(self):
        """Build a database of unique nodes from collected blueprints."""
        for bp in self.blueprints:
            for node in bp.get('nodes', []):
                key = f"{node.get('class')}_{node.get('member_name', 'unknown')}"

                if key not in self.nodes_db:
                    self.nodes_db[key] = {
                        'class': node.get('class'),
                        'member_name': node.get('member_name'),
                        'function_ref': node.get('function_ref'),
                        'examples': [],
                        'pin_patterns': {}
                    }

                # Add this example
                self.nodes_db[key]['examples'].append({
                    'raw': node.get('raw'),
                    'source': bp.get('source_url')
                })

                # Track pin patterns
                for pin in node.get('pins', []):
                    pin_name = pin.get('name')
                    if pin_name:
                        if pin_name not in self.nodes_db[key]['pin_patterns']:
                            self.nodes_db[key]['pin_patterns'][pin_name] = pin

    def save_database(self, output_path: str = 'blueprintue_nodes.json'):
        """Save the collected data to a JSON file."""
        output = {
            'version': '1.0',
            'source': 'blueprintue.com',
            'total_blueprints': len(self.blueprints),
            'total_unique_nodes': len(self.nodes_db),
            'blueprints': self.blueprints,
            'nodes_database': self.nodes_db
        }

        with open(output_path, 'w') as f:
            json.dump(output, f, indent=2)

        print(f"Saved database to {output_path}")
        print(f"Total blueprints: {len(self.blueprints)}")
        print(f"Total unique nodes: {len(self.nodes_db)}")


# Known blueprint URLs to scrape (from our searches)
KNOWN_BLUEPRINTS = [
    "https://blueprintue.com/blueprint/wrkiptxx/",  # print hello world
    "https://blueprintue.com/blueprint/-vp2ui0o/",  # PrintString
    "https://blueprintue.com/blueprint/9789jxks/",  # REST API
    "https://blueprintue.com/blueprint/-6n05ebo/",  # Rest API call
    "https://blueprintue.com/blueprint/9v475ixp/",  # GetAllActorsOfClass
    "https://blueprintue.com/blueprint/vmlb1im5/",  # String Array Join
    "https://blueprintue.com/blueprint/4lzujq3k/",  # Random string generator
]


def main():
    scraper = BlueprintUEScraper()

    print("=" * 60)
    print("BlueprintUE Scraper")
    print("=" * 60)

    # Fetch known blueprints
    for url in KNOWN_BLUEPRINTS:
        result = scraper.fetch_blueprint(url)
        if result:
            scraper.blueprints.append(result)
            print(f"  Found {result['node_count']} nodes")
        time.sleep(1)  # Be respectful to the server

    # Build the nodes database
    scraper.build_nodes_database()

    # Save results
    output_path = Path(__file__).parent / 'blueprintue_nodes.json'
    scraper.save_database(str(output_path))

    # Print summary
    print("\n" + "=" * 60)
    print("Node Types Found:")
    print("=" * 60)
    for key, data in sorted(scraper.nodes_db.items()):
        print(f"  {key}: {len(data['examples'])} examples")


if __name__ == '__main__':
    main()
