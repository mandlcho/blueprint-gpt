# Unreal Engine Blueprint Nodes Scraper

Multi-phase scraper for extracting blueprint node data from official Unreal Engine documentation.

## Overview

This scraper handles Epic Games' 403 protection and rate limiting by using a two-phase approach:

### ✅ Phase 1: Quick Extraction (COMPLETE)
**Status:** ✅ Done
**Result:** 2,090 nodes extracted
**Time:** Instant (uses cached data)

Extracts basic node information from category pages:
- Node display name
- Category
- Brief description
- URL for detailed info

**Output:** `ue_blueprint_nodes_phase1.json`

### 🔄 Phase 2: Detailed Scraping (Multi-day)
**Status:** Ready to run
**Estimated time:** ~42 days at 50 nodes/day (configurable)

Fetches detailed information for each node:
- Input parameters (name, type, description)
- Output parameters
- Return values
- Detailed descriptions
- Code examples

**Output:** `ue_blueprint_nodes_phase2.json` (updated progressively)

## Quick Start

### Run Phase 1 (Instant Results)
```bash
python quick_extract_from_cache.py
```

### Run Phase 2 (Daily Scraping)
```bash
# Default: 50 nodes with 2s delay
python phase2_detailed_scraper.py

# Custom configuration
python phase2_detailed_scraper.py --nodes 100 --delay 3.0
```

**Recommended schedule:** Run Phase 2 once per day to avoid rate limits

## Phase 2 Multi-Day Plan

### Day 1-10 (500 nodes)
```bash
# Run daily
python phase2_detailed_scraper.py --nodes 50 --delay 2.0
```

### Day 11-20 (500 nodes)
Continue daily runs

### Day 21-42 (1090 nodes)
Complete remaining nodes

**Progress is automatically saved** - you can stop/resume anytime!

## Features

✅ **Cloudflare bypass** - Uses cloudscraper for bot protection
✅ **Caching** - Stores all successful requests
✅ **Resumable** - Tracks completed/failed nodes
✅ **Rate limit handling** - Automatic delays and retries
✅ **Progress tracking** - See exactly what's done

## File Structure

```
blueprint-gpt/
├── quick_extract_from_cache.py     # Phase 1: Extract from cache
├── phase2_detailed_scraper.py      # Phase 2: Detailed scraping
├── phase2_progress.json            # Progress tracker (auto-generated)
├── cache/                          # Category pages cache
├── detailed_cache/                 # Individual node cache (Phase 2)
├── ue_blueprint_nodes_phase1.json  # Phase 1 results
└── ue_blueprint_nodes_phase2.json  # Phase 2 results (in progress)
```

## Dependencies

```bash
pip install -r requirements.txt
```

Required packages:
- cloudscraper (bypasses Cloudflare)
- beautifulsoup4 (HTML parsing)
- requests
- lxml

## Monitoring Progress

Check current progress:
```bash
python -c "import json; p=json.load(open('phase2_progress.json')); print(f\"Completed: {len(p['completed'])}/{len(p['completed'])+len(p['failed'])}\")"
```

View Phase 2 output:
```bash
python -c "import json; d=json.load(open('ue_blueprint_nodes_phase2.json')); print(d['progress'])"
```

## Handling Errors

- **500 errors**: Server issues on Epic's side - script automatically retries
- **403 errors**: Rate limiting - script waits 60s and retries
- **Network errors**: Automatically handled with retries

All errors are logged and can be retried in subsequent runs.

## Tips

1. **Run Phase 2 daily** - Consistent small batches avoid rate limits
2. **Increase delay if blocked** - Use `--delay 5.0` if seeing many 403s
3. **Check progress regularly** - Monitor `phase2_progress.json`
4. **Don't delete cache** - Speeds up re-runs significantly

## Output Format

### Phase 1 JSON Structure
```json
{
  "version": "2.0",
  "unrealVersion": "5.5",
  "totalNodes": 2090,
  "nodes": [
    {
      "displayName": "Destroy Actor",
      "category": "Actor",
      "description": "Destroy Actor",
      "url": "https://...",
      "hasDetailedInfo": false
    }
  ]
}
```

### Phase 2 JSON Structure (with details)
```json
{
  "displayName": "Destroy Actor",
  "category": "Actor",
  "description": "Destroys the specified actor...",
  "hasDetailedInfo": true,
  "inputs": [
    {"name": "Target", "type": "Actor", "description": "..."}
  ],
  "outputs": [...],
  "examples": [...]
}
```

## Alternative Scrapers

Additional scraper versions available for reference:
- `scraper_recursive.py` - Original recursive version
- `scraper_enhanced.py` - Enhanced with better error handling
- `scraper.py` - Basic version

## Contributing

The scraper is designed to be robust but Epic's documentation API may change. If you encounter issues:

1. Check if the API endpoint changed
2. Verify cache directory has write permissions
3. Ensure cloudscraper is up to date
4. Report issues with logs

## License

Part of blueprint-gpt project. See main LICENSE file.
