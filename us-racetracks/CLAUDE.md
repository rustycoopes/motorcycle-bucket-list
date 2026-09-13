# CLAUDE.md — US Racetracks

Operating context for Claude Code sessions in this folder. Started September 2026.

---

## Who and what

Russ, based in **Ridgefield, Connecticut**. Second bucket-list item in this repo (see also `../coast-to-coast/`). Goal: ride his motorcycle at **as many major US racetracks as possible**, doing trackdays (not racing).

Travel mode: **toyhauler**, staying at the track and in the surrounding region using it as base camp — not hotel-based, not fly-in.

Between trackdays in a region there will be down days. Claude's job on those is to surface **interesting areas/places to visit or hang out** nearby — general themes and regions, not specific bookings.

Status: **rough clustering phase only.** No lodging, no specific dates, no bookings. Russ explicitly does not want deep planning yet — he wants to see a rough proposal (tracks by region, provider references, rough clusters with rough trip-length estimates) and will refine from there.

`itinerary.html` now renders this: an overview US map (all tracks, dot-colored by cluster) plus one accordion panel per cluster, each with its own mini-map highlighting that cluster's states and pinning just its tracks, a track/provider table, and off-day ideas.

---

## How his preferences shape the work

- **No rush.** No fixed deadline for finishing the list.
- Two trip modes, both valid, don't collapse them into one:
  - **Small clusters** (1-2 weeks) — while still working, fits around job.
  - **Longer clusters** — deferred until retirement.
- Wants **rough** clustering and **rough** time estimates first. Do not jump to hotel research, specific campground picks, or day-by-day itineraries until he says to refine.
- Organize by **region**.
- Every track entry should reference which **trackday provider(s)** run there — this is a real requirement, not incidental.

## Repo layout (this folder)

```
us-racetracks/
├── CLAUDE.md                       # this file
├── itinerary.html                  # GENERATED — do not hand-edit
├── data/track-data.json            # GENERATED — do not hand-edit
├── map/*.json                      # GENERATED — baked map + track projections
├── src/
│   ├── build.mjs                   # cluster/track definitions (edit this)
│   ├── generate.mjs                # projects state paths + track lat/lon -> map/*.json
│   ├── render.mjs                  # assembles itinerary.html
│   └── package.json                # us-atlas, topojson-client, d3-geo
└── docs/
    ├── trip-planning-context.md    # the original brief, verbatim intent
    └── track-research-findings.md  # tracks by region, providers, proposed clusters
```

**Edit `src/build.mjs`.** Everything in `data/`, `map/`, and `itinerary.html` is output. Rebuild with:

```bash
cd us-racetracks/src
npm install
node build.mjs && node generate.mjs && node render.mjs
```

Same pipeline shape as `coast-to-coast/` but simpler — clusters replace phases, tracks replace route stops. The map SVG defines state paths and the border mesh once (`<defs>`) and reuses them via `<use>` in every cluster's mini-map; inlining full state paths per cluster balloons the page ~8x, learned the hard way while building this.

Track lat/lon coordinates in `build.mjs` are approximate (track-level, not gate-precise) — fine for a bucket-list map, not for turn-by-turn navigation.

## Decisions already made — don't relitigate

- Toyhauler-based, not hotel-based. Stays at/near the tracks.
- Trackdays, not racing/licensing.
- Organized by region first, then clustered into trips.
- Small-cluster trips (1-2 wk) now, big clusters post-retirement — keep this split visible in any proposal, don't merge into one master itinerary.

## Open questions

1. Which small clusters to actually book first (his call, after seeing the regional proposal).
2. Retirement timeline, which affects how the big clusters get sequenced.
3. Whether he wants a specific bike/toyhauler logistics section once clusters are picked.
