import { readFileSync, writeFileSync } from 'fs';
import { feature, mesh } from 'topojson-client';
import { geoAlbersUsa, geoPath } from 'd3-geo';

const us = JSON.parse(readFileSync('./node_modules/us-atlas/states-10m.json', 'utf8'));

// Exclude Alaska (02) and Hawaii (15) - not part of the continental road trip route
const EXCLUDE = new Set(['02', '15']);
us.objects.states.geometries = us.objects.states.geometries.filter(g => !EXCLUDE.has(g.id));

const statesGeo = feature(us, us.objects.states);
const stateBorders = mesh(us, us.objects.states, (a, b) => a !== b);

// Standard d3 default projection, calibrated for a 960x600 viewbox
const projection = geoAlbersUsa().scale(1280).translate([487.5, 305]);
const path = geoPath(projection);

// Generate state path data
const statePaths = statesGeo.features.map(f => ({
  id: f.id,
  name: f.properties.name,
  d: path(f)
}));

const bordersPath = path(stateBorders);

// City / stop coordinates (lon, lat) -> project to x,y
const cities = {
  "Ridgefield, CT": [-73.4979, 41.2815],
  "Front Royal, VA (Shenandoah)": [-78.1994, 38.9209],
  "Roanoke, VA": [-79.9414, 37.2710],
  "Asheville, NC": [-82.5515, 35.5951],
  "Great Smoky Mountains, TN": [-83.5352, 35.6118],
  "Nashville, TN": [-86.7816, 36.1627],
  "Memphis, TN": [-90.0490, 35.1495],
  "Hot Springs, AR": [-93.0552, 34.5037],
  "Oklahoma City, OK": [-97.5164, 35.4676],
  "Amarillo, TX": [-101.8313, 35.2220],
  "Santa Fe, NM": [-105.9378, 35.6870],
  "Taos, NM": [-105.5731, 36.4072],
  "Chaco Canyon, NM": [-107.9564, 36.0608],
  "Durango, CO": [-107.8801, 37.2753],
  "Silverton, CO": [-107.6645, 37.8119],
  "Ouray, CO": [-107.6712, 38.0228],
  "Telluride, CO": [-107.8123, 37.9375],
  "Mesa Verde, CO": [-108.4618, 37.2309],
  "Moab, UT": [-109.5498, 38.5733],
  "Capitol Reef, UT": [-111.1355, 38.2972],
  "Bryce Canyon, UT": [-112.1871, 37.5930],
  "Page, AZ": [-111.4558, 36.9147],
  "Grand Canyon, AZ": [-112.1401, 36.0544],
  "Sedona, AZ": [-111.7610, 34.8697],
  "Phoenix, AZ": [-112.0740, 33.4484],
  "Joshua Tree, CA": [-116.3130, 33.8734],
  "Los Angeles, CA": [-118.2437, 34.0522],
  "Big Sur, CA": [-121.8081, 36.2704],
  "San Francisco, CA": [-122.4194, 37.7749],
  "Redwoods, CA": [-124.0046, 41.2132],
  "Crater Lake, OR": [-122.1090, 42.9446],
  "Bend, OR": [-121.3153, 44.0582],
  "Portland, OR": [-122.6784, 45.5152],
  "Mount Rainier, WA": [-121.7269, 46.8523],
  "Glacier NP, MT": [-113.7870, 48.6960],
  "Missoula, MT": [-113.9940, 46.8721],
  "Bozeman, MT": [-111.0429, 45.6770],
  "Yellowstone, WY": [-110.5885, 44.4280],
  "Jackson, WY": [-110.7624, 43.4799],
  "Rapid City, SD": [-103.2310, 44.0805],
  "Black Hills, SD": [-103.4560, 43.8791],
  "Badlands, SD": [-102.3397, 43.8554],
  "Sioux Falls, SD": [-96.7311, 43.5446],
  "Madison, WI": [-89.4012, 43.0731],
  "Niagara Falls, NY": [-79.0377, 43.0962],
  "Green Mountains, VT": [-72.8092, 43.8500],
  "Lake Placid, NY": [-73.9799, 44.2795],
  "Harbor Springs, MI": [-84.9886, 45.4314],
  "Keweenaw, MI": [-88.0637, 47.4103],
  "Duluth, MN": [-92.1005, 46.7867],
  "Fargo, ND": [-96.7898, 46.8772],
  "Theodore Roosevelt NP, ND": [-103.4530, 46.9790],
  "Casper, WY": [-106.3131, 42.8666],
  "Spokane, WA": [-117.4260, 47.6588],
  "North Cascades, WA": [-120.6650, 48.5000],
  "Oregon Coast, OR": [-124.0535, 44.6368],
  "White Mountains, NH": [-71.5811, 44.2706],
  "Acadia NP, ME": [-68.2733, 44.3386]
};

const cityPoints = {};
for (const [name, coords] of Object.entries(cities)) {
  const p = projection(coords);
  cityPoints[name] = p ? [Math.round(p[0]*100)/100, Math.round(p[1]*100)/100] : null;
}

const bounds = path.bounds(statesGeo);

writeFileSync('./map/states.json', JSON.stringify(statePaths));
writeFileSync('./map/borders.json', JSON.stringify(bordersPath));
writeFileSync('./map/cities.json', JSON.stringify(cityPoints, null, 2));
writeFileSync('./map/bounds.json', JSON.stringify(bounds));

console.log('States:', statePaths.length);
console.log('Cities projected:', Object.keys(cityPoints).length);
console.log('Bounds:', bounds);
