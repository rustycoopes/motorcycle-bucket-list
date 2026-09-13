import { readFileSync, writeFileSync } from 'fs';

const states = JSON.parse(readFileSync('./map/states.json', 'utf8'));
const borders = readFileSync('./map/borders.json', 'utf8'); // raw path string, JSON-encoded
const bordersPath = JSON.parse(borders);
const cities = JSON.parse(readFileSync('./map/cities.json', 'utf8'));
const D = JSON.parse(readFileSync('../data/trip-data.json', 'utf8'));
const { phases, considerations, southDays, southMiles, northDays, northMiles, totalDays, totalMiles, restDays, ridingDays, avgMiles, optDays, optMiles, southWithOptDays, southWithOptMiles } = D;

function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

// ---- Build state paths SVG ----
const statePathsSvg = states.map(s => `<path d="${s.d}" class="state" data-name="${esc(s.name)}"></path>`).join('');
const bordersSvg = `<path d="${bordersPath}" class="border"></path>`;

// ---- Build route polylines per phase ----
const routeLinesSvg = phases.map(p => {
  const pts = p.route.map(name => cities[name]).filter(Boolean);
  if (pts.length < 2) return '';
  const pointsAttr = pts.map(([x, y]) => `${x},${y}`).join(' ');
  return `<polyline points="${pointsAttr}" fill="none" stroke="${p.color}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="9,7" opacity="0.9"></polyline>`;
}).join('');

// ---- Build city markers (unique set across all phases' routes, dedup) ----
const allStopNames = [];
phases.forEach(p => p.route.forEach(n => { if (!allStopNames.includes(n)) allStopNames.push(n); }));

const markerSvg = allStopNames.map(name => {
  const pt = cities[name];
  if (!pt) return '';
  const [x, y] = pt;
  const short = name.split(',')[0].split(' (')[0];
  return `<g class="marker">
    <circle cx="${x}" cy="${y}" r="5.5" class="marker-dot"></circle>
    <text x="${x + 8}" y="${y - 6}" class="marker-label">${esc(short)}</text>
  </g>`;
}).join('');

// ---- Legend items for phases ----
const legendSvg = phases.map(p => `
  <div class="legend-item">
    <span class="legend-swatch" style="background:${p.color}"></span>
    <span>Phase ${p.id}: ${esc(p.name)}</span>
  </div>`).join('');

// ---- Phase accordion panels ----
function stopRows(stops) {
  return stops.map(st => `
    <tr class="${st.miles === 0 ? 'rest-row' : ''}">
      <td class="day-cell">Day ${st.day}</td>
      <td>${esc(st.seg)}</td>
      <td class="miles-cell">${st.miles === 0 ? 'Rest' : st.miles + ' mi'}</td>
      <td class="note-cell">${esc(st.note)}</td>
    </tr>`).join('');
}

function highlightList(title, items, extraClass) {
  if (!items || items.length === 0) return '';
  return `<div class="hl-group${extraClass ? ' ' + extraClass : ''}"><div class="hl-title">${title}</div><ul class="hl-list">${items.map(i => `<li>${esc(i)}</li>`).join('')}</ul></div>`;
}

// Family/kids notes to insert before specific phase IDs
const familyNotes = {
  'S3': "Thinking about renting a place for a week around here — before pushing into the Southwest — so the kids can fly out and join for a stretch.",
  'N4': "Jackson, WY is the natural spot on this route to rent a place for a week and have the kids fly out — airport in town, and the Tetons on the doorstep."
};

function noteBlock(text) {
  return `<div class="trip-note">
    <span class="trip-note-icon">📝</span>
    <div><div class="trip-note-title">Idea to plan around</div><div class="trip-note-text">${esc(text)}</div></div>
  </div>`;
}

// Route-gap decisions surfaced by researching rider forums / route guides
const gapNotes = {};

function gapBlock(g) {
  return `<div class="gap-note">
    <div class="gap-note-title">🧭 ${esc(g.title)}</div>
    <div class="gap-note-body">${esc(g.body)}</div>
    <ul class="hl-list gap-list">${g.items.map(i => `<li>${esc(i)}</li>`).join('')}</ul>
  </div>`;
}

// Group phases by trip, inserting a section header whenever the trip changes
let lastTrip = null;
const phasesSvg = phases.map(p => {
  let header = '';
  const noteHtml = (familyNotes[p.id] ? noteBlock(familyNotes[p.id]) : '')
    + (gapNotes[p.id] ? gapBlock(gapNotes[p.id]) : '');
  if (p.trip !== lastTrip) {
    lastTrip = p.trip;
    const tripPhases = phases.filter(x => x.trip === p.trip && !x.optional);
    const tripDays = tripPhases.reduce((s, x) => s + x.days, 0);
    const tripMiles = tripPhases.reduce((s, x) => s + x.miles, 0);
    const hasOpt = phases.some(x => x.trip === p.trip && x.optional);
    header = `<div class="trip-header">
      <div class="trip-name">${esc(p.trip)} <span class="oneway-tag">one way → Pacific</span></div>
      <div class="trip-stats">${tripPhases.length} phases · ${tripDays} days · ${tripMiles.toLocaleString()} mi${hasOpt ? ` (+${optDays} days / ${optMiles.toLocaleString()} mi with optional S3B)` : ''}</div>
    </div>`;
  }
  const fuelBlock = highlightList('⛽ Fuel Notes (180-mi range)', p.fuel, 'fuel');
  const cellBlock = highlightList('📵 Cell Signal Notes (Verizon)', p.cell, 'fuel');
  const motoBlock = highlightList('🏍️ Motorcycle Stops', p.moto);
  const cautionBlock = highlightList('⚠️ Ride Cautions', p.caution, 'fuel');
  return `${header}${noteHtml}
<details class="phase-panel${p.optional ? ' optional-panel' : ''}" style="--phase-color:${p.color}">
  <summary>
    <span class="phase-swatch" style="background:${p.color}"></span>
    <span class="phase-title">Phase ${p.id}: ${esc(p.name)}${p.optional ? ' <span class=\"opt-tag\">optional</span>' : ''}</span>
    <span class="phase-meta">
      <span class="meta-chip">${esc(p.months)}</span>
      <span class="meta-chip">${p.days} days</span>
      <span class="meta-chip">${p.miles.toLocaleString()} mi</span>
      ${p.fuel ? '<span class="meta-chip fuel-chip">⛽ fuel notes</span>' : ''}
      ${p.cell ? '<span class="meta-chip fuel-chip">📵 signal notes</span>' : ''}
      ${p.moto ? '<span class="meta-chip moto-chip">🏍️ moto stop</span>' : ''}
    </span>
    <span class="chevron" aria-hidden="true">▸</span>
  </summary>
  <div class="phase-body">
    <div class="stop-table-wrap">
    <table class="stop-table">
      <thead><tr><th>Day</th><th>Leg</th><th>Miles</th><th>Notes</th></tr></thead>
      <tbody>${stopRows(p.stops)}</tbody>
    </table>
    </div>
    <div class="hl-grid">
      ${highlightList('Scenic Roads', p.roads)}
      ${highlightList('Historic', p.historic)}
      ${highlightList('Natural Wonders', p.natural)}
      ${highlightList('Native American / Culture', p.culture)}
      ${highlightList('Towns & Nightlife', p.towns)}
      ${motoBlock}
      ${fuelBlock}
      ${cellBlock}
      ${cautionBlock}
    </div>
  </div>
</details>`;
}).join('\n');

// ---- Planning Considerations section ----
const considerationsSvg = considerations.map((c, i) => `
<details class="phase-panel consideration-panel" ${i === 0 ? '' : ''}>
  <summary>
    <span class="phase-title">${esc(c.title)}</span>
    <span class="chevron" aria-hidden="true">▸</span>
  </summary>
  <div class="phase-body">
    <ul class="hl-list consideration-list">${c.items.map(it => `<li>${esc(it)}</li>`).join('')}</ul>
  </div>
</details>`).join('\n');

const html = `<title>Coast-to-Coast Motorcycle Trip</title>
<style>
:root {
  --bg: #f7f6f3;
  --card-bg: #ffffff;
  --text: #232323;
  --text-muted: #6b6b6b;
  --border: #e4e1da;
  --accent: #c0392b;
  --map-land: #eef0ea;
  --map-border: #ffffff;
  --map-outline: #b9c2b0;
  --chip-bg: #f0ede6;
  --rest-bg: #f5f0e6;
  --shadow: 0 2px 10px rgba(0,0,0,0.06);
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --bg: #17181a;
    --card-bg: #202225;
    --text: #ecebe8;
    --text-muted: #a2a09b;
    --border: #34363a;
    --accent: #e8746a;
    --map-land: #2a2d2b;
    --map-border: #17181a;
    --map-outline: #4a4f47;
    --chip-bg: #2c2e31;
    --rest-bg: #2a2620;
    --shadow: 0 2px 14px rgba(0,0,0,0.4);
  }
}
:root[data-theme="dark"] {
  --bg: #17181a;
  --card-bg: #202225;
  --text: #ecebe8;
  --text-muted: #a2a09b;
  --border: #34363a;
  --accent: #e8746a;
  --map-land: #2a2d2b;
  --map-border: #17181a;
  --map-outline: #4a4f47;
  --chip-bg: #2c2e31;
  --rest-bg: #2a2620;
  --shadow: 0 2px 14px rgba(0,0,0,0.4);
}
* { box-sizing: border-box; }
body { background: var(--bg); color: var(--text); font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
.wrap { max-width: 1180px; margin: 0 auto; padding: 24px 16px 60px; }
h1 { font-size: 26px; margin: 0 0 4px; }
.subtitle { color: var(--text-muted); font-size: 14px; margin-bottom: 24px; }

.summary-card { background: var(--card-bg); border-radius: 14px; box-shadow: var(--shadow); padding: 22px 24px; margin-bottom: 22px; border: 1px solid var(--border); }
.summary-title { font-size: 16px; font-weight: 700; margin-bottom: 14px; }
.stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 14px; margin-bottom: 16px; }
.stat-box { text-align: center; padding: 12px 8px; background: var(--chip-bg); border-radius: 10px; }
.stat-num { font-size: 22px; font-weight: 800; color: var(--accent); }
.stat-label { font-size: 11.5px; color: var(--text-muted); margin-top: 2px; }
.callout { background: var(--rest-bg); border-left: 3px solid var(--accent); border-radius: 6px; padding: 12px 16px; font-size: 13.5px; line-height: 1.55; }
.callout strong { color: var(--accent); }

.map-card { background: var(--card-bg); border-radius: 14px; box-shadow: var(--shadow); padding: 18px; margin-bottom: 22px; border: 1px solid var(--border); }
svg#usmap { width: 100%; height: auto; display: block; }
.state { fill: var(--map-land); stroke: var(--map-border); stroke-width: 0.6; }
.border { fill: none; stroke: var(--map-outline); stroke-width: 0.6; }
.marker-dot { fill: var(--card-bg); stroke: var(--accent); stroke-width: 2; }
.marker-label { font-size: 9.5px; fill: var(--text); font-weight: 600; }

.legend-wrap { display: flex; flex-wrap: wrap; gap: 10px 18px; margin-top: 14px; padding-top: 14px; border-top: 1px solid var(--border); }
.legend-item { display: flex; align-items: center; gap: 7px; font-size: 12.5px; color: var(--text-muted); }
.legend-swatch { width: 14px; height: 14px; border-radius: 4px; flex-shrink: 0; }

.phase-panel { background: var(--card-bg); border-radius: 12px; box-shadow: var(--shadow); margin-bottom: 12px; border: 1px solid var(--border); overflow: hidden; }
.phase-panel summary { list-style: none; cursor: pointer; padding: 15px 18px; display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.phase-panel summary::-webkit-details-marker { display: none; }
.phase-swatch { width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0; }
.phase-title { font-weight: 700; font-size: 15px; flex: 1 1 200px; }
.phase-meta { display: flex; gap: 8px; flex-wrap: wrap; }
.meta-chip { background: var(--chip-bg); color: var(--text-muted); font-size: 11.5px; padding: 4px 10px; border-radius: 999px; white-space: nowrap; }
.chevron { transition: transform 0.2s ease; color: var(--text-muted); font-size: 14px; }
.phase-panel[open] .chevron { transform: rotate(90deg); }
.phase-body { padding: 4px 18px 20px; border-top: 1px solid var(--border); }

.stop-table { width: 100%; border-collapse: collapse; margin: 14px 0 18px; font-size: 13px; }
.stop-table th { text-align: left; color: var(--text-muted); font-weight: 600; font-size: 11.5px; text-transform: uppercase; letter-spacing: 0.03em; padding: 6px 8px; border-bottom: 2px solid var(--border); }
.stop-table td { padding: 7px 8px; border-bottom: 1px solid var(--border); vertical-align: top; }
.day-cell { font-weight: 700; white-space: nowrap; color: var(--accent); }
.miles-cell { white-space: nowrap; color: var(--text-muted); }
.note-cell { color: var(--text-muted); }
.rest-row { background: var(--rest-bg); }
.stop-table-wrap { overflow-x: auto; }

.hl-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px; }
.hl-title { font-size: 11.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.03em; color: var(--phase-color, var(--accent)); margin-bottom: 6px; }
.hl-list { margin: 0; padding-left: 18px; font-size: 13px; line-height: 1.6; }

.footer-note { margin-top: 22px; font-size: 12.5px; color: var(--text-muted); text-align: center; }
.footer-note .avoid { margin-top: 4px; }

.trip-header { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; flex-wrap: wrap; margin: 28px 0 10px; padding-bottom: 8px; border-bottom: 2px solid var(--text); }
.trip-header:first-child { margin-top: 0; }
.trip-name { font-size: 18px; font-weight: 800; letter-spacing: 0.01em; }
.trip-stats { font-size: 12.5px; color: var(--text-muted); }
.fuel-chip { background: var(--rest-bg); color: var(--accent); font-weight: 700; }
.optional-panel { border-style: dashed; border-width: 2px; }
.opt-tag { font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; color: var(--accent); border: 1px solid var(--accent); border-radius: 999px; padding: 1px 7px; margin-left: 6px; vertical-align: middle; }
.oneway-tag { font-size: 11.5px; font-weight: 600; color: var(--text-muted); text-transform: none; letter-spacing: 0; margin-left: 6px; }
.moto-chip { background: var(--chip-bg); color: var(--text); font-weight: 700; }
.hl-group.fuel { grid-column: 1 / -1; background: var(--rest-bg); border-radius: 8px; padding: 10px 14px; }
.hl-group.fuel .hl-title { color: var(--accent); }

.trip-note { display: flex; gap: 12px; align-items: flex-start; background: var(--chip-bg); border: 1px dashed var(--text-muted); border-radius: 10px; padding: 12px 16px; margin-bottom: 12px; }
.trip-note-icon { font-size: 18px; line-height: 1; }
.trip-note-title { font-size: 11.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.03em; color: var(--text-muted); margin-bottom: 3px; }
.trip-note-text { font-size: 13.5px; line-height: 1.5; color: var(--text); }

.gap-note { background: var(--card-bg); border: 2px solid var(--accent); border-radius: 10px; padding: 14px 18px; margin-bottom: 12px; box-shadow: var(--shadow); }
.gap-note-title { font-size: 14px; font-weight: 800; color: var(--accent); margin-bottom: 6px; }
.gap-note-body { font-size: 13.5px; line-height: 1.55; margin-bottom: 8px; }
.gap-list { font-size: 13px; line-height: 1.6; }
.gap-list li { margin-bottom: 5px; }

.considerations-header { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; flex-wrap: wrap; margin: 32px 0 10px; padding-bottom: 8px; border-bottom: 2px solid var(--text); }
.consideration-panel .phase-title { flex: 1 1 auto; }
.consideration-list { margin: 10px 0 4px; }
.consideration-list li { margin-bottom: 6px; }

@media (max-width: 640px) {
  .stat-grid { grid-template-columns: repeat(2, 1fr); }
  .phase-title { font-size: 14px; }
}
</style>

<div class="wrap">
  <h1>🏍️ Coast-to-Coast Motorcycle Adventure</h1>
  <div class="subtitle">Ridgefield, CT → South → Southwest → West Coast → Pacific Northwest → Northern Rockies → Maine → Home</div>

  <div class="summary-card">
    <div class="summary-title">Trip Summary — two one-way rides to the Pacific</div>
    <div class="stat-grid">
      <div class="stat-box"><div class="stat-num">${southDays}</div><div class="stat-label">South Route Days</div></div>
      <div class="stat-box"><div class="stat-num">${southMiles.toLocaleString()}</div><div class="stat-label">South Route Miles</div></div>
      <div class="stat-box"><div class="stat-num">${northDays}</div><div class="stat-label">North Route Days</div></div>
      <div class="stat-box"><div class="stat-num">${northMiles.toLocaleString()}</div><div class="stat-label">North Route Miles</div></div>
      <div class="stat-box"><div class="stat-num">${avgMiles}</div><div class="stat-label">Avg Mi / Riding Day</div></div>
      <div class="stat-box"><div class="stat-num">${totalMiles.toLocaleString()}</div><div class="stat-label">Both Trips, Total Miles</div></div>
    </div>
    <div class="callout">
      <strong>How this works:</strong> both routes run <strong>one way, west from Ridgefield, CT to the Pacific</strong> — no return leg. At the coast the bike gets shipped home and you fly back. Two separate trips in different years.
    </div>
    <div class="callout" style="margin-top:10px;">
      <strong>Which is which:</strong> the <strong>South Route (${southDays} days / ${southMiles.toLocaleString()} mi)</strong> is the shorter of the two — the one that fits around work. The <strong>North Route (${northDays} days / ${northMiles.toLocaleString()} mi)</strong> is the big one, and the better retirement trip: it goes up through Maine first, crosses the northern tier, and spends far longer in the Rockies. Adding the optional Colorado &amp; Utah phase (S3B) puts the South Route at ${southWithOptDays} days / ${southWithOptMiles.toLocaleString()} mi — level on days, still well short on miles.
    </div>
    <div class="callout" style="margin-top:10px;">
      <strong>⛽ Fuel (180-mi range):</strong> nothing on either route exceeds a 180-mile gap between stations. Chaco Canyon (S3) and the Beartooth Highway (N4) still earn the auxiliary pack. Elsewhere in the rural West, small-town station <em>hours</em> are the real risk — refuel at half a tank, not at 180 miles.
    </div>
  </div>

  <div class="map-card">
    <svg id="usmap" viewBox="20 10 935 600" xmlns="http://www.w3.org/2000/svg">
      <g id="states">${statePathsSvg}</g>
      ${bordersSvg}
      <g id="routes">${routeLinesSvg}</g>
      <g id="markers">${markerSvg}</g>
    </svg>
    <div class="legend-wrap">${legendSvg}</div>
  </div>

  ${phasesSvg}

  <div class="considerations-header">
    <div class="trip-name">📋 Things to Consider</div>
    <div class="trip-stats">Open planning questions — grows as we work through them</div>
  </div>
  ${considerationsSvg}

  <div class="footer-note">
    Places skipped (already visited): Boston · New York · Seattle · Austin, TX · Outer Banks
    <div class="avoid">Rough planning draft — living document, refine anytime.</div>
  </div>
</div>
`;

writeFileSync('../itinerary.html', html);
console.log('Wrote final.html, size:', html.length);
