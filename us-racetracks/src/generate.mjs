import { readFileSync, writeFileSync } from 'fs';
import { feature, mesh } from 'topojson-client';
import { geoAlbersUsa, geoPath } from 'd3-geo';

const us = JSON.parse(readFileSync('./node_modules/us-atlas/states-10m.json', 'utf8'));

// Exclude Alaska (02) and Hawaii (15) - no tracks there, keeps map continental
const EXCLUDE = new Set(['02', '15']);
us.objects.states.geometries = us.objects.states.geometries.filter(g => !EXCLUDE.has(g.id));

const statesGeo = feature(us, us.objects.states);
const stateBorders = mesh(us, us.objects.states, (a, b) => a !== b);

// Same calibration as coast-to-coast/src/generate.mjs, for a 960x600 viewbox
const projection = geoAlbersUsa().scale(1280).translate([487.5, 305]);
const path = geoPath(projection);

const statePaths = statesGeo.features.map(f => ({
  id: f.id,
  name: f.properties.name,
  d: path(f)
}));

const bordersPath = path(stateBorders);

const trackData = JSON.parse(readFileSync('../data/track-data.json', 'utf8'));
const trackPoints = {};
for (const cluster of trackData.clusters) {
  for (const t of cluster.tracks) {
    const p = projection([t.lon, t.lat]);
    trackPoints[t.name] = p ? [Math.round(p[0] * 100) / 100, Math.round(p[1] * 100) / 100] : null;
  }
}

writeFileSync('../map/states.json', JSON.stringify(statePaths));
writeFileSync('../map/borders.json', JSON.stringify(bordersPath));
writeFileSync('../map/tracks.json', JSON.stringify(trackPoints, null, 2));

console.log('States:', statePaths.length);
console.log('Tracks projected:', Object.keys(trackPoints).length);
