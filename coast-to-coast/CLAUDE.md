# CLAUDE.md — Motorcycle Bucket List

Operating context for Claude Code sessions in this repo. Handed off from a Cowork session, September 2026.

---

## Who and what

Russ, based in **Ridgefield, Connecticut**. This repo holds planning and artifacts for motorcycle bucket-list trips, **one folder per trip**. Only `coast-to-coast/` exists so far; more will be added alongside it.

The coast-to-coast plan is **two separate one-way rides**, in two different years:

| Route | Days | Miles | Ends | Intended for |
|---|---|---|---|---|
| South (S1–S4) | 27 | 3,915 | San Francisco | The shorter one — fits around work |
| ↳ + optional S3B | 34 | 4,555 | San Francisco | If the Colorado/Utah phase gets ridden |
| North (N1–N6) | 34 | 6,950 | Oregon coast | The big one — post-retirement |

**One way, westbound, no return leg.** At the coast the bike is shipped home and Russ flies back. Do not reintroduce loops.

Status: rough itinerary. Nothing booked. No lodging research done.

---

## How his preferences shape the work

- Tone: friendly and casual, not corporate. Brief by default; go long only when he asks.
- He wants a **thought partner** — surface angles and trade-offs he hasn't considered, don't just execute. Several of the best decisions here came from pushing back (the 8,655-mile reality check that led to splitting the trip; the Colorado/Utah gap).
- He values synthesis over raw numbers, and insight over reporting.
- Prose over bullet-soup in conversation. The itinerary page is the exception — structured there by design.

## Riding constraints (hard requirements)

- **Max 6 hours riding per day**
- **180-mile fuel range.** Auxiliary fuel is an expandable/removable pack carried only on flagged backcountry legs, not the whole trip.
- Hotels preferred; lightweight bivy is the exception, not the plan
- **Verizon** — dead zones are flagged per phase and were researched, not assumed
- Priorities: twisty scenic roads over highway, pioneering and Civil War history, Native American heritage, natural wonders, city nightlife, famous motorcycle museums
- **Never route through (already visited): Boston, New York, Seattle, Austin TX, the Outer Banks.** This has bitten before — an early Pacific NW plan used Seattle and a road suggestion had to be reworked around it.

---

## Repo layout

```
motorcycle-bucket-list/
├── CLAUDE.md                     # this file
├── README.md                     # trip index + layout convention
└── coast-to-coast/
    ├── README.md                 # route summary, constraints, rebuild steps
    ├── itinerary.html            # GENERATED — do not hand-edit
    ├── data/trip-data.json       # GENERATED — do not hand-edit
    ├── src/
    │   ├── build.mjs             # South Route phases + considerations + totals
    │   ├── north-phases.mjs      # North Route phases
    │   ├── render.mjs            # assembles itinerary.html
    │   ├── generate.mjs          # projects map geometry + city coordinates
    │   ├── package.json
    │   └── map/*.json            # baked map geometry (states, borders, cities)
    └── docs/
        ├── trip-planning-context.md
        └── route-research-findings.md
```

**Edit `src/build.mjs` and `src/north-phases.mjs`. Everything else in `data/` and `itinerary.html` is output.**

## Rebuilding

```bash
cd coast-to-coast/src
npm install                 # us-atlas, topojson-client, d3-geo
node generate.mjs           # ONLY when adding new route stops (see below)
node build.mjs              # phase definitions -> ../data/trip-data.json
node render.mjs             # -> ../itinerary.html
```

`generate.mjs` projects city lat/long into the same **Albers USA** coordinate space as the state outlines. If you add a stop to any phase's `route` array, you must add its `[lon, lat]` to the `cities` object in `generate.mjs` and re-run it, or the marker won't line up — or won't render at all. Quick check after building:

```bash
node -e "const c=require('./map/cities.json'),p=require('../data/trip-data.json');
p.phases.forEach(ph=>ph.route.forEach(r=>{if(!c[r])console.log('MISSING',ph.id,r)}))"
```

Map geometry is inlined into the HTML, so the page is fully self-contained and renders offline with no CDN dependency. That was deliberate — an earlier version used Leaflet from a CDN and rendered blank under the artifact viewer's CSP.

## Phase data shape

Each phase object: `id`, `trip` (`"South Route"` / `"North Route"`), `name`, `color`, `months`, `days`, `miles`, `route` (array of city keys, must exist in `cities.json`), `stops` (day-by-day: `day`, `seg`, `miles`, `note`), then optional category arrays rendered as panels: `roads`, `historic`, `natural`, `culture`, `towns`, `moto`, `fuel`, `cell`, `caution`. Add `optional: true` to keep a phase out of headline totals (only S3B uses this).

**Keep the category structure.** Russ explicitly asked for it to be maintained — it's the part of the page he likes most.

---

## The published page

There is a live Artifact on claude.ai mirroring `itinerary.html`:

**https://claude.ai/code/artifact/2cf64f2d-fd0e-4872-940c-90f9137427be**

It's private to his account and not session-bound. If it needs updating from a Cowork/claude.ai session, **republish to that same URL** — never create a new artifact. From Claude Code there's no artifact tooling, so the repo's `itinerary.html` is the source of truth and the artifact may drift; if he wants them in sync, regenerate here and republish there.

---

## Decisions already made — don't relitigate

- **Two one-way trips, not one loop.** Original single loop came to ~8,655 mi / 54 days, which broke the "up to a month" framing. Splitting was his call.
- **Both start from Ridgefield.** He is fine with the two trips being different lengths.
- **Seattle is out**, Portland is the Pacific NW city stop.
- **S3B is optional, not committed.** Added at his request as an option after research showed the route skipped the Colorado San Juans and southern Utah.
- **Route content stays as designed** unless he asks — he's said this twice.

## Open questions

1. **Bike shipping and return flights** — now structural to the plan, still completely unaddressed. Highest-value gap.
2. Whether to actually ride optional Phase S3B
3. Which route runs in which year
4. Lodging budget → then camping vs hotels balance → then lodging research by region
5. Family stopover weeks (renting a place so the kids fly out — candidate points are before S3, and Jackson WY at N4)
6. Whether to add Acoma Pueblo to the S3 day-by-day table
7. He eventually wants to **build a webapp** from this data — `data/trip-data.json` is the intended starting point

## Things to consider list (lives in `src/build.mjs`, grows over time)

Documenting the trip · packing · cost limits and camping vs hotels · extra tools and fuel · road training. **Add to this list, don't replace it.** Bike shipping/flights should be added as item 6.

---

## Researched facts worth not re-deriving

Fuel and cell coverage were researched against real sources, and the notes on each phase carry the specifics. Headlines:

- No station-to-station gap on either route exceeds 180 miles.
- **Chaco Canyon (S3)** — zero services *and* confirmed zero cell reception, any carrier. Gas can mandatory.
- **Beartooth Highway (N4)** — ~68 mi, one seasonal limited-hours stop midway. Assume no signal.
- **Going-to-the-Sun Road (N5)** — confirmed Verizon dead zone, The Loop to Logan Pass, 20–30 min.
- **Yellowstone (N4)** — effectively one large dead zone with pockets at the developed areas. Jackson/Tetons is the reliable place to make calls.
- The real rural-West risk is station **hours**, not distance. Rule of thumb given to him: refuel at half a tank.
- Seasonality: **S3B** (Red Mountain Pass) and **N5/N6** (Going-to-the-Sun, WA-20) are the pinch points that constrain when each route can run.

`docs/route-research-findings.md` has the full list with sources, including what was deliberately excluded and why.

---

## Git note

The Cowork session that built this **could not push** — its proxy refused to inject credentials for a repo outside the session's authorized set. That restriction is specific to that environment. From Claude Code on his own machine, normal git access applies and this note can be ignored.
