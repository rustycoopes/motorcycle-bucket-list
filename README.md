# Motorcycle Bucket List

Planning, routes and artifacts for motorcycle bucket-list trips.

One folder per trip.

| Trip | Folder | Status |
|---|---|---|
| Coast to Coast (USA) | [`coast-to-coast/`](coast-to-coast/) | Planning — rough itinerary, not booked |

## Layout convention

Each trip folder follows the same shape, so new trips can be dropped in alongside:

```
<trip-name>/
├── README.md         # what the trip is, current status, how to rebuild
├── itinerary.html    # the generated, self-contained itinerary page
├── data/             # structured trip data (JSON) — the source of truth
├── src/              # build pipeline that turns data into the page
└── docs/             # planning notes, research findings, decisions
```
