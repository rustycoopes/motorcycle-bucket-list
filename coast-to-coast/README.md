# Coast to Coast — USA

Two one-way motorcycle rides from Ridgefield, CT to the Pacific, planned for two different years. The bike gets shipped home from the coast; the rider flies back. Neither trip is a loop.

**Status:** rough itinerary. No bookings, no lodging research yet.

## The two routes

| Route | Days | Miles | Ends at | Notes |
|---|---|---|---|---|
| **South Route** (S1–S4) | 27 | 3,915 | San Francisco, CA | The shorter one — fits around work |
| ↳ with optional Phase S3B | 34 | 4,555 | San Francisco, CA | Adds the Colorado San Juans and Utah canyon country |
| **North Route** (N1–N6) | 34 | 6,950 | Oregon coast | The big one — better suited to retirement |

**South Route:** Ridgefield → Shenandoah & Blue Ridge → Great Smokies → Nashville & Memphis → Ozarks → Route 66 → Santa Fe & Taos → Chaco Canyon → Grand Canyon → Sedona → Joshua Tree → LA → Big Sur → San Francisco.

*Optional Phase S3B* diverts north from Chaco into Colorado (Million Dollar Highway, San Juan Skyway, Mesa Verde) and Utah (Moab, Capitol Reef, Scenic Byway 12, Bryce) before rejoining at the Grand Canyon.

**North Route:** Ridgefield → White Mountains & Acadia → Vermont & Adirondacks → Niagara → Michigan UP & Keweenaw → Lake Superior north shore → Theodore Roosevelt NP → Badlands & Black Hills → Casper → Jackson & the Tetons → Yellowstone → Beartooth Highway → Missoula → Glacier NP → North Cascades → Mount Rainier → Portland → Bend → Crater Lake → Oregon coast.

## Riding constraints baked into the plan

- Max 6 hours riding per day
- 180-mile fuel range; auxiliary fuel pack carried only for flagged backcountry legs
- Hotels preferred, lightweight bivy as the exception
- Verizon coverage — known dead zones flagged per phase
- Avoided (already visited): Boston, New York, Seattle, Austin TX, the Outer Banks

## Rebuilding the itinerary page

All trip content lives in `src/build.mjs` (South Route + shared data) and `src/north-phases.mjs` (North Route). `data/trip-data.json` is generated output, not hand-edited.

```bash
cd src
npm install                 # us-atlas, topojson-client, d3-geo
node generate.mjs           # regenerate map geometry + project city coordinates
node build.mjs              # emit phases.json from the phase definitions
node render.mjs             # assemble final.html
```

`generate.mjs` only needs re-running when new stops are added to a route — it projects lat/long into the map's Albers USA coordinate space so markers line up with the state outlines. Map geometry is baked into `src/map/*.json` and inlined into the page, so the published HTML has no external dependencies and renders offline.

## Docs

- [`docs/trip-planning-context.md`](docs/trip-planning-context.md) — full planning context, decisions made, open questions
- [`docs/route-research-findings.md`](docs/route-research-findings.md) — rider-sourced road research and what was deliberately excluded
