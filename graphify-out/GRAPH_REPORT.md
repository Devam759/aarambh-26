# Graph Report - .  (2026-05-05)

## Corpus Check
- Corpus is ~3,466 words - fits in a single context window. You may not need a graph.

## Summary
- 53 nodes · 37 edges · 19 communities (17 shown, 2 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.85)
- Token cost: 1,000 input · 500 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Event Planning & Core Tasks|Event Planning & Core Tasks]]
- [[_COMMUNITY_Home Page & UI Components|Home Page & UI Components]]
- [[_COMMUNITY_Content Pages (FAQ, Schedule, Speakers)|Content Pages (FAQ, Schedule, Speakers)]]

## God Nodes (most connected - your core abstractions)
1. `Tech Team Delivery Plan` - 7 edges
2. `Card()` - 5 edges
3. `Digital Check-in System` - 3 edges
4. `Button()` - 2 edges
5. `Aarambh 2026` - 2 edges
6. `Aarambh Website` - 2 edges
7. `Volunteer Management Portal` - 2 edges
8. `Feedback & Analytics Portal` - 1 edges
9. `Face Recognition Photo Finder` - 1 edges
10. `Equipment List` - 1 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Communities (19 total, 2 thin omitted)

### Community 0 - "Event Planning & Core Tasks"
Cohesion: 0.28
Nodes (9): Aarambh 2026, Aarambh Website, Digital Check-in System, Equipment List, Feedback & Analytics Portal, Master Timeline, Face Recognition Photo Finder, Tech Team Delivery Plan (+1 more)

## Knowledge Gaps
- **4 isolated node(s):** `Feedback & Analytics Portal`, `Face Recognition Photo Finder`, `Equipment List`, `Master Timeline`
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Card()` connect `Content Pages (FAQ, Schedule, Speakers)` to `Home Page & UI Components`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Digital Check-in System` (e.g. with `Aarambh Website` and `Volunteer Management Portal`) actually correct?**
  _`Digital Check-in System` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Feedback & Analytics Portal`, `Face Recognition Photo Finder`, `Equipment List` to the rest of the system?**
  _4 weakly-connected nodes found - possible documentation gaps or missing edges._