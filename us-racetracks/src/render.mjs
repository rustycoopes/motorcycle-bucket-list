import { readFileSync, writeFileSync } from 'fs';

const states = JSON.parse(readFileSync('../map/states.json', 'utf8'));
const bordersPath = JSON.parse(readFileSync('../map/borders.json', 'utf8'));
const trackPoints = JSON.parse(readFileSync('../map/tracks.json', 'utf8'));
const { clusters, providerUrls, considerations } = JSON.parse(readFileSync('../data/track-data.json', 'utf8'));

function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

const bordersUse = `<use href="#borders"></use>`;

// Base state paths are emitted once in <defs> and reused via <use> in every
// map instance — inlining all 54 state paths per cluster balloons page size ~8x.
const baseStatesSvg = states.map(s => `<path d="${s.d}" class="state" data-name="${esc(s.name)}"></path>`).join('');

function highlightSvg(highlightNames, highlightColor) {
  const set = new Set(highlightNames);
  return states.filter(s => set.has(s.name))
    .map(s => `<path d="${s.d}" class="state state-on" style="fill:${highlightColor}"></path>`)
    .join('');
}

function markersSvg(tracks, color) {
  return tracks.map(t => {
    const pt = trackPoints[t.name];
    if (!pt) return '';
    const [x, y] = pt;
    const short = t.name.split(' (')[0];
    return `<g class="marker">
      <circle cx="${x}" cy="${y}" r="6" class="marker-dot" style="stroke:${color}"></circle>
      <text x="${x + 8}" y="${y - 6}" class="marker-label">${esc(short)}</text>
    </g>`;
  }).join('');
}

// ---- Overview map: every track, dot colored by its cluster ----
const overviewMarkers = clusters.map(c => markersSvg(c.tracks, c.color)).join('');
const overviewLegend = clusters.map(c => `
  <div class="legend-item">
    <span class="legend-swatch" style="background:${c.color}"></span>
    <span>${esc(c.name)}</span>
  </div>`).join('');

function link(name, url) {
  return url ? `<a href="${esc(url)}" class="ext-link" target="_blank" rel="noopener">${esc(name)}</a>` : esc(name);
}

// ---- Per-cluster panels, each with its own highlighted map ----
function trackRows(tracks) {
  return tracks.map(t => `
    <tr>
      <td class="state-cell">${esc(t.state)}</td>
      <td>${link(t.name, t.url)}</td>
      <td class="note-cell">${t.length ? esc(t.length) : '—'}</td>
      <td class="note-cell">${t.providers.map(p => link(p, providerUrls[p])).join(', ')}</td>
      <td class="note-cell">${t.mapUrl ? `<a href="${esc(t.mapUrl)}" class="ext-link" target="_blank" rel="noopener">map</a>` : '—'}</td>
    </tr>`).join('');
}

function offDaysList(items) {
  if (!items || items.length === 0) return '';
  return `<div class="hl-group"><div class="hl-title">Off-day ideas</div><ul class="hl-list">${items.map(i => `<li>${esc(i)}</li>`).join('')}</ul></div>`;
}

const clusterPanels = clusters.map(c => `
<details class="phase-panel" style="--phase-color:${c.color}">
  <summary>
    <span class="phase-swatch" style="background:${c.color}"></span>
    <span class="phase-title">${esc(c.name)}</span>
    <span class="phase-meta">
      <span class="meta-chip">${c.tracks.length} tracks</span>
      <span class="meta-chip">${esc(c.length)}</span>
      <span class="meta-chip ${c.size === 'small' ? 'small-chip' : 'big-chip'}">${c.size === 'small' ? '1-2 wk trip' : 'retirement-scale'}</span>
    </span>
    <span class="chevron" aria-hidden="true">▸</span>
  </summary>
  <div class="phase-body">
    <div class="cluster-map-wrap">
      <svg viewBox="20 10 935 600" class="cluster-map" xmlns="http://www.w3.org/2000/svg">
        <use href="#states-base"></use>
        <g>${highlightSvg(c.states, c.color)}</g>
        ${bordersUse}
        <g>${markersSvg(c.tracks, c.color)}</g>
      </svg>
    </div>
    <div class="stop-table-wrap">
    <table class="stop-table">
      <thead><tr><th>State</th><th>Track</th><th>Length</th><th>Trackday provider(s)</th><th>Map</th></tr></thead>
      <tbody>${trackRows(c.tracks)}</tbody>
    </table>
    </div>
    <div class="hl-grid">
      ${offDaysList(c.offDays)}
    </div>
  </div>
</details>`).join('\n');

const considerationsSvg = considerations.map(c => `
<details class="phase-panel consideration-panel">
  <summary>
    <span class="phase-title">${esc(c.title)}</span>
    <span class="chevron" aria-hidden="true">▸</span>
  </summary>
  <div class="phase-body">
    <ul class="hl-list consideration-list">${c.items.map(it => `<li>${esc(it)}</li>`).join('')}</ul>
  </div>
</details>`).join('\n');

const totalTracks = clusters.reduce((s, c) => s + c.tracks.length, 0);
const smallCount = clusters.filter(c => c.size === 'small').length;

const html = `<!DOCTYPE html>
<meta charset="UTF-8">
<title>US Racetracks Motorcycle Trip</title>
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
  --shadow: 0 2px 10px rgba(0,0,0,0.06);
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --bg: #17181a; --card-bg: #202225; --text: #ecebe8; --text-muted: #a2a09b;
    --border: #34363a; --accent: #e8746a; --map-land: #2a2d2b; --map-border: #17181a;
    --map-outline: #4a4f47; --chip-bg: #2c2e31; --shadow: 0 2px 14px rgba(0,0,0,0.4);
  }
}
:root[data-theme="dark"] {
  --bg: #17181a; --card-bg: #202225; --text: #ecebe8; --text-muted: #a2a09b;
  --border: #34363a; --accent: #e8746a; --map-land: #2a2d2b; --map-border: #17181a;
  --map-outline: #4a4f47; --chip-bg: #2c2e31; --shadow: 0 2px 14px rgba(0,0,0,0.4);
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
.callout { background: var(--chip-bg); border-left: 3px solid var(--accent); border-radius: 6px; padding: 12px 16px; font-size: 13.5px; line-height: 1.55; }
.callout strong { color: var(--accent); }

.map-card, .cluster-map-wrap { background: var(--card-bg); border-radius: 14px; box-shadow: var(--shadow); padding: 18px; margin-bottom: 22px; border: 1px solid var(--border); }
.cluster-map-wrap { margin-bottom: 16px; box-shadow: none; padding: 10px; }
svg.usmap, svg.cluster-map { width: 100%; height: auto; display: block; }
.state { fill: var(--map-land); stroke: var(--map-border); stroke-width: 0.6; transition: fill 0.2s ease; }
.border { fill: none; stroke: var(--map-outline); stroke-width: 0.6; }
.marker-dot { fill: var(--card-bg); stroke-width: 2.5; }
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
.small-chip { color: #3f7d4a; font-weight: 700; }
.big-chip { color: #7a3e91; font-weight: 700; }
.chevron { transition: transform 0.2s ease; color: var(--text-muted); font-size: 14px; }
.phase-panel[open] .chevron { transform: rotate(90deg); }
.phase-body { padding: 4px 18px 20px; border-top: 1px solid var(--border); }

.stop-table { width: 100%; border-collapse: collapse; margin: 14px 0 18px; font-size: 13px; }
.stop-table th { text-align: left; color: var(--text-muted); font-weight: 600; font-size: 11.5px; text-transform: uppercase; letter-spacing: 0.03em; padding: 6px 8px; border-bottom: 2px solid var(--border); }
.stop-table td { padding: 7px 8px; border-bottom: 1px solid var(--border); vertical-align: top; }
.state-cell { font-weight: 700; white-space: nowrap; color: var(--accent); }
.note-cell { color: var(--text-muted); }
.stop-table-wrap { overflow-x: auto; }

.hl-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px; }
.hl-title { font-size: 11.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.03em; color: var(--phase-color, var(--accent)); margin-bottom: 6px; }
.hl-list { margin: 0; padding-left: 18px; font-size: 13px; line-height: 1.6; }

.ext-link { color: var(--accent); text-decoration: none; font-weight: 600; }
.ext-link:hover { text-decoration: underline; }

.considerations-header { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; flex-wrap: wrap; margin: 32px 0 10px; padding-bottom: 8px; border-bottom: 2px solid var(--text); }
.considerations-sub { font-size: 12.5px; color: var(--text-muted); }
.consideration-panel .phase-title { flex: 1 1 auto; }
.consideration-list { margin: 10px 0 4px; }
.consideration-list li { margin-bottom: 6px; }

.footer-note { margin-top: 22px; font-size: 12.5px; color: var(--text-muted); text-align: center; }

@media (max-width: 640px) {
  .stat-grid { grid-template-columns: repeat(2, 1fr); }
  .phase-title { font-size: 14px; }
}
</style>

<div class="wrap">
  <h1>🏁 US Racetracks Motorcycle Trip</h1>
  <div class="subtitle">Trackdays at as many major US circuits as possible, towing the toyhauler, clustered by region</div>

  <div class="summary-card">
    <div class="summary-title">Overview — rough clustering, not yet booked</div>
    <div class="stat-grid">
      <div class="stat-box"><div class="stat-num">${clusters.length}</div><div class="stat-label">Clusters</div></div>
      <div class="stat-box"><div class="stat-num">${totalTracks}</div><div class="stat-label">Tracks</div></div>
      <div class="stat-box"><div class="stat-num">${smallCount}</div><div class="stat-label">1-2 wk trips (while working)</div></div>
      <div class="stat-box"><div class="stat-num">${clusters.length - smallCount}</div><div class="stat-label">Retirement-scale trips</div></div>
    </div>
    <div class="callout">
      <strong>How this works:</strong> toyhauler-based — stay at or near the track, use it as base camp between trackdays. Small clusters (Northeast, Southeast, Texas, Midwest, Pacific NW) fit a 1-2 week trip around work. SoCal and the Mountain West add-on run long enough that they're better suited to retirement, along with any multi-region chain stringing clusters together.
    </div>
  </div>

  <svg width="0" height="0" style="position:absolute" aria-hidden="true">
    <defs>
      <g id="states-base">${baseStatesSvg}</g>
      <path id="borders" d="${bordersPath}" class="border"></path>
    </defs>
  </svg>

  <div class="map-card">
    <svg viewBox="20 10 935 600" class="usmap" xmlns="http://www.w3.org/2000/svg">
      <use href="#states-base"></use>
      ${bordersUse}
      <g>${overviewMarkers}</g>
    </svg>
    <div class="legend-wrap">${overviewLegend}</div>
  </div>

  ${clusterPanels}

  <div class="considerations-header">
    <div class="phase-title" style="font-size:18px;font-weight:800;">📋 Things to Consider</div>
    <div class="considerations-sub">Open planning questions — grows as we work through them</div>
  </div>
  ${considerationsSvg}

  <div class="footer-note">
    Rough clustering draft — no lodging, no dates, no bookings yet. Track coordinates are approximate. Refine anytime.
  </div>
</div>
`;

writeFileSync('../itinerary.html', html);
console.log('Wrote itinerary.html, size:', html.length);
