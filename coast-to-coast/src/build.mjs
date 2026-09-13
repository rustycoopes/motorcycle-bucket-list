import { readFileSync, writeFileSync } from 'fs';
import { northPhases } from './north-phases.mjs';

// ---------- PHASE DATA ----------
// Both routes run ONE WAY westbound from Ridgefield, CT to the Pacific.
// The bike is shipped home and the rider flies back — neither trip is a loop.
const southPhases = [
  {
    id: "S1",
    trip: "South Route",
    name: "Connecticut to Appalachia",
    color: "#e74c3c",
    months: "Late Apr–May, or mid-Sept–early Oct",
    days: 6,
    miles: 825,
    route: ["Ridgefield, CT", "Front Royal, VA (Shenandoah)", "Roanoke, VA", "Asheville, NC", "Great Smoky Mountains, TN"],
    stops: [
      { day: 1, seg: "Ridgefield, CT → Front Royal, VA", miles: 320, note: "Transit day down to the Shenandoah gateway (mostly highway to get to the good roads)" },
      { day: 2, seg: "Skyline Drive full run", miles: 105, note: "Scenic day — all 105 miles of Skyline Drive, overlooks and short hikes" },
      { day: 3, seg: "Skyline Drive → Roanoke, VA", miles: 170, note: "Onto the Blue Ridge Parkway proper" },
      { day: 4, seg: "Blue Ridge Parkway → Asheville, NC", miles: 150, note: "Continue the Parkway into Asheville" },
      { day: 5, seg: "Asheville, NC (rest day)", miles: 0, note: "Explore — Biltmore Estate, breweries, live music" },
      { day: 6, seg: "Asheville → Great Smoky Mountains, TN", miles: 80, note: "Newfound Gap Road day loop" }
    ],
    roads: [
      "Tail of the Dragon / US-129 at Deals Gap (11 mi, 318 curves) — the single most famous motorcycle road in America, right where you're already riding. Heavily policed and busy on weekends; ride it midweek and early.",
      "Moonshiner 28 / NC-28 (81 mi) — the other great road out of Deals Gap, usually far quieter than the Dragon itself",
      "Back of the Dragon / VA-16, Marion→Tazewell (32 mi, 400+ curves) — sits right on the way south through Virginia",
      "Skyline Drive (VA, 105 mi)",
      "Blue Ridge Parkway (VA/NC, 469 mi) — \"the quintessential scenic ride\"",
      "Cherohala Skyway (TN/NC, 43 mi) — perfectly radiused corners, smooth pavement",
      "Newfound Gap Road (TN)",
      "Georgia Triangle / GA-60, GA-180, US-129 (35 mi) — optional loop around Blood Mountain just south of Deals Gap"
    ],
    historic: ["Shenandoah Valley Civil War sites", "Colonial-era mountain settlements"],
    natural: ["Shenandoah National Park", "Blue Ridge Mountains overlooks", "Great Smoky Mountains National Park"],
    towns: ["Asheville, NC — breweries, music venues, Biltmore Estate"],
    cell: [
      "Verizon reception on Skyline Drive and Blue Ridge Parkway is inconsistent — reports describe Shenandoah campsites and much of Skyline Drive as \"absolutely terrible,\" with the Mount Rogers area singled out as the worst stretch.",
      "Watch for false bars: phones can show signal that never actually connects (calls/texts silently fail to send). Don't rely on it for navigation — download offline maps beforehand."
    ],
    moto: [
      "Wheels Through Time Museum, Maggie Valley, NC — just 5 miles off the Blue Ridge Parkway near Asheville. \"World's premier collection of rare American motorcycles\": 350+ machines from 25 manufacturers (Harley, Indian, Excelsior, Henderson). Open Thu–Mon 10am–5pm, ~$15. About as perfect a detour as this trip gets — barely off the route you're already riding."
    ]
  },
  {
    id: "S2",
    trip: "South Route",
    name: "South & Ozarks",
    color: "#e67e22",
    months: "May, or late Sept–Oct",
    days: 5,
    miles: 690,
    route: ["Great Smoky Mountains, TN", "Nashville, TN", "Memphis, TN", "Hot Springs, AR"],
    stops: [
      { day: 1, seg: "Smokies → Nashville, TN", miles: 200, note: "Rolling hills into Music City" },
      { day: 2, seg: "Nashville, TN (rest day)", miles: 0, note: "Broadway honky-tonks, live music, nightlife" },
      { day: 3, seg: "Nashville → Memphis, TN", miles: 210, note: "Blues heritage, Graceland, Beale Street" },
      { day: 4, seg: "Memphis → Hot Springs, AR", miles: 180, note: "Into the Ouachita Mountains" },
      { day: 5, seg: "Hot Springs — Ozark scenic loop", miles: 100, note: "Historic bathhouses + Ozark backroads" }
    ],
    roads: [
      "Natchez Trace Parkway (444 mi) — starts right in Nashville. No commercial traffic, no billboards, follows historic Native American and settler trails. You don't need all 444 miles; even a partial run is worth it.",
      "Talimena National Scenic Byway / AR-88 to OK-1 (54 mi) — ridge-top road along Rich Mountain and Winding Stair Mountain, sits between Hot Springs and Oklahoma",
      "Jasper Disaster Loop / AR-7, AR-43, AR-74 (56 mi) — hundreds of tight curves, crosses the Buffalo National River twice",
      "Pig Trail Scenic Byway / AR-23 (20 mi) — dense hardwood forest, classic Ozarks",
      "Ouachita Mountain backroads"
    ],
    historic: ["Shiloh Civil War battlefield (detour)", "Historic Hot Springs bathhouse row"],
    natural: ["Ozark Mountains", "Buffalo National River"],
    towns: ["Nashville — Music City nightlife", "Memphis — Beale Street blues", "Eureka Springs, AR — Victorian mountain town (optional detour)"],
    moto: [
      "Barber Vintage Motorsports Museum, Birmingham, AL — the largest motorcycle collection in the world (1,600+ bikes). It's a real detour though: roughly 200 miles south of Nashville, off the direct line to Memphis. Worth it if a museum this significant is a priority; otherwise it's the one to skip if you're keeping this phase tight."
    ]
  },
  {
    id: "S3",
    trip: "South Route",
    name: "Southwest & Native American Country",
    color: "#f1c40f",
    months: "Mar–Apr or Oct–Nov (avoid summer desert heat)",
    days: 10,
    miles: 1630,
    route: ["Hot Springs, AR", "Oklahoma City, OK", "Amarillo, TX", "Santa Fe, NM", "Taos, NM", "Chaco Canyon, NM", "Grand Canyon, AZ", "Sedona, AZ", "Phoenix, AZ"],
    stops: [
      { day: 1, seg: "Hot Springs → Oklahoma City, OK", miles: 260, note: "Transit — Indian Heritage Center" },
      { day: 2, seg: "OKC → Amarillo, TX", miles: 260, note: "Route 66 corridor" },
      { day: 3, seg: "Amarillo → Santa Fe, NM", miles: 285, note: "Long transit day, into high desert" },
      { day: 4, seg: "Santa Fe, NM (rest day)", miles: 0, note: "Historic Plaza, Pueblo art, galleries" },
      { day: 5, seg: "Santa Fe → Taos, NM (High Road)", miles: 70, note: "Taos Pueblo — living Native community" },
      { day: 6, seg: "Taos → Chaco Canyon, NM", miles: 155, note: "UNESCO ancient pueblo ruins" },
      { day: 7, seg: "Chaco → Grand Canyon, AZ", miles: 300, note: "Long transit — consider splitting into 2 days" },
      { day: 8, seg: "Grand Canyon, AZ (rest day)", miles: 0, note: "South Rim viewpoints" },
      { day: 9, seg: "Grand Canyon → Sedona, AZ", miles: 110, note: "Red rock country, AZ-89A scenic" },
      { day: 10, seg: "Sedona → Phoenix, AZ", miles: 120, note: "Wrap up the desert leg" }
    ],
    roads: [
      "Enchanted Circle Scenic Byway (84 mi) — loops from Taos around 13,167 ft Wheeler Peak. You're already stopping in Taos, so this is nearly free.",
      "High Road to Taos — the scenic way up from Santa Fe through the pueblo villages",
      "AZ-89A through Oak Creek Canyon (131 mi of AZ-89/89A) — Colorado Plateau down into Sedona's red rocks via Jerome and Prescott",
      "US-285 high desert (NM)",
      "Coronado Trail / US-191 (123 mi, hundreds of curves) — eastern Arizona alpine road; a real detour but consistently rated among the best in the state"
    ],
    historic: ["Route 66 towns", "Spanish colonial Santa Fe Plaza"],
    natural: ["Grand Canyon South Rim", "Sedona red rocks", "High desert plateau"],
    culture: ["Chaco Canyon (UNESCO)", "Taos Pueblo", "Acoma Pueblo — “Sky City” (detour option)"],
    towns: ["Santa Fe — art galleries, nightlife, distinct culture", "Sedona — artistic community"],
    fuel: [
      "Chaco Canyon: zero services inside the park — NPS calls it \"remote and isolated, few amenities, come prepared.\" Top off before the turnoff (nearest towns run ~50-70 mi away depending on direction) and treat the gas can as mandatory here, not optional.",
      "Backroads between Taos/Chaco/Navajo Nation: small-town stations exist but hours can be unreliable (closed Sundays, limited evening hours) — this is more a reliability risk than a pure distance risk at your 180-mi range.",
      "Route 66 corridor (OKC–Amarillo) and I-40/US-84 into Santa Fe: well served, no real concern."
    ],
    cell: [
      "Chaco Canyon: confirmed no cell reception anywhere inside the park (Verizon included) — completely off-grid. Tell someone your plan before heading in and treat the fuel/water/tools checklist as non-negotiable since you can't call out.",
      "The unpaved approach roads to Chaco can wash out in rain — another reason not to run this leg on a low tank or without backup fuel."
    ],
    moto: [
      "Buddy Stubbs Motorcycle Museum, Phoenix, AZ — right at the end of this phase. Free admission, 130+ rare machines across 37 manufacturers spanning 1903–present, heavy on Harley-Davidson with Indian/Triumph/BMW/BSA mixed in. Catch: it's only open Saturdays, 11am–5pm — worth timing the Phoenix arrival around that if you want to see it."
    ]
  },
  {
    id: "S3B",
    optional: true,
    trip: "South Route",
    name: "Colorado Rockies & Utah Canyon Country",
    color: "#8e44ad",
    months: "Late May–June or Sept–early Oct (high passes need to be clear of snow)",
    days: 8,
    miles: 940,
    route: ["Chaco Canyon, NM", "Durango, CO", "Silverton, CO", "Ouray, CO", "Telluride, CO", "Mesa Verde, CO", "Moab, UT", "Capitol Reef, UT", "Bryce Canyon, UT", "Page, AZ", "Grand Canyon, AZ"],
    stops: [
      { day: 1, seg: "Chaco Canyon / Farmington, NM → Durango, CO", miles: 120, note: "Climb out of the high desert into the San Juans" },
      { day: 2, seg: "Durango → Silverton → Ouray → Telluride", miles: 110, note: "The headline day: Million Dollar Highway and the San Juan Skyway. Short mileage on purpose — you'll want to stop constantly." },
      { day: 3, seg: "Telluride → Mesa Verde NP, CO", miles: 90, note: "Ancestral Puebloan cliff dwellings — UNESCO site, and the strongest Native American stop on the whole trip alongside Chaco" },
      { day: 4, seg: "Mesa Verde → Moab, UT", miles: 150, note: "Into red rock country" },
      { day: 5, seg: "Moab, UT (rest day)", miles: 0, note: "Arches, Canyonlands, Dead Horse Point" },
      { day: 6, seg: "Moab → Capitol Reef NP, UT", miles: 150, note: "UT-24 through the Waterpocket Fold" },
      { day: 7, seg: "Capitol Reef → Scenic Byway 12 → Bryce Canyon", miles: 120, note: "Byway 12 itself — Grand Staircase-Escalante, the Hogback ridge" },
      { day: 8, seg: "Bryce Canyon → Page, AZ → Grand Canyon", miles: 200, note: "Rejoins Phase 3 at the Grand Canyon" }
    ],
    roads: [
      "Million Dollar Highway / US-550, Ouray↔Silverton (25 mi) — the centrepiece; sheer drops, no guardrails, switchbacks over Red Mountain Pass",
      "San Juan Skyway (236 mi full loop) — Durango, Silverton, Ouray, Telluride, Cortez; the Million Dollar Highway is one leg of it",
      "Utah Scenic Byway 12 (123 mi) — links Bryce, Grand Staircase-Escalante and Capitol Reef; the Hogback section runs a knife-edge ridge with drops both sides",
      "UT-128 Upper Colorado River Scenic Byway (Moab) — river canyon run, often rated among Utah's best",
      "Moki Dugway / UT-261 — gravel switchbacks climbing off Valley of the Gods. Alternate southern line (Cortez → Monument Valley → Page) if you'd rather swap Moab/Capitol Reef for Monument Valley."
    ],
    historic: ["Mesa Verde cliff dwellings (UNESCO)", "Silverton and Ouray — preserved 1880s mining towns", "Telluride's Victorian main street"],
    natural: ["Arches National Park", "Canyonlands National Park", "Capitol Reef National Park", "Bryce Canyon — largest concentration of hoodoos on earth", "Red Mountain Pass (11,018 ft)"],
    culture: ["Mesa Verde National Park — Ancestral Puebloan cliff dwellings, the natural companion to Chaco Canyon", "Ute Mountain Ute Tribal Park (guided, adjacent to Mesa Verde)"],
    towns: ["Durango — historic downtown, brewery scene", "Ouray — \"Switzerland of America\", hot springs", "Telluride — box canyon town, festivals", "Moab — adventure hub, busy but good food and beds"],
    fuel: [
      "Million Dollar Highway: Ouray and Silverton both have fuel and they're only 23 miles apart — distance is not the issue here. Weather and road closures are.",
      "Byway 12 between Escalante and Torrey: the thinnest services stretch of this phase. Boulder, UT is tiny and its station keeps short hours — fill at Escalante or Torrey rather than counting on Boulder.",
      "Moab → Capitol Reef via UT-24: long empty gaps by eastern standards but comfortably inside 180 mi. Hanksville is the practical mid-point top-up.",
      "If you take the Moki Dugway alternate: fuel at Blanding or Mexican Hat before the climb — Valley of the Gods has nothing."
    ],
    cell: [
      "San Juans (Silverton, Red Mountain Pass, Ouray): signal drops out in the canyons and over the passes regardless of carrier — normal for deep mountain terrain, expect gaps of 20–40 minutes.",
      "Grand Staircase-Escalante along Byway 12: sparse to nonexistent between towns. Verizon returns in Escalante, Boulder and Torrey.",
      "Moab town has solid coverage; the parks around it (Canyonlands especially) largely do not.",
      "Add this to the case for a satellite communicator — this phase has more sustained no-signal riding than anything except Chaco."
    ],
    moto: [
      "No major museum on this leg, but Ouray and Silverton are genuine motorcycling destinations in their own right — the Million Dollar Highway is a bucket-list road on most riders' lists, and you'll find plenty of bikes parked in both towns in season."
    ],
    caution: [
      "This is the most demanding riding on the trip. Red Mountain Pass has no guardrails, sheer drops, tight switchbacks and heavy RV traffic in summer — it rewards the road-craft training in your considerations list.",
      "Altitude: you'll spend days above 9,000 ft with passes over 11,000 ft. The bike will feel down on power and afternoon thunderstorms build fast in summer — ride the passes in the morning.",
      "Season is tight: Red Mountain Pass can hold snow into late May and gets early-season storms from October. This phase is the main constraint on when Trip 1 can run."
    ]
  },
  {
    id: "S4",
    trip: "South Route",
    name: "California & West Coast",
    color: "#2ecc71",
    months: "Apr–Jun or Sept–Oct",
    days: 6,
    miles: 770,
    route: ["Phoenix, AZ", "Joshua Tree, CA", "Los Angeles, CA", "Big Sur, CA", "San Francisco, CA"],
    stops: [
      { day: 1, seg: "Phoenix → Joshua Tree, CA", miles: 250, note: "Desert transit into surreal rock formations" },
      { day: 2, seg: "Joshua Tree → Los Angeles, CA", miles: 140, note: "Into the city" },
      { day: 3, seg: "Los Angeles, CA (rest day)", miles: 0, note: "Santa Monica, Venice Beach, Malibu canyon rides" },
      { day: 4, seg: "LA → Big Sur, CA (PCH)", miles: 230, note: "The most famous scenic ride in America" },
      { day: 5, seg: "Big Sur → San Francisco, CA", miles: 150, note: "Via Monterey/Carmel" },
      { day: 6, seg: "San Francisco, CA (rest day)", miles: 0, note: "Golden Gate, Alcatraz, waterfront" }
    ],
    roads: ["Pacific Coast Highway / CA-1 (656 mi total) — world-class scenery, the Big Sur stretch is the headline", "Malibu canyon roads"],
    historic: ["California mission sites (detour option)"],
    natural: ["Big Sur cliffs", "Joshua Tree National Park", "Monterey Peninsula"],
    towns: ["Los Angeles — nightlife, beach culture", "San Francisco — Bay Area culture"],
    moto: [
      "ARCH Motorcycle Company, Hawthorne, CA — Keanu Reeves' boutique custom manufacturer, right in the LA area. This is a working manufacturer, not a public museum, so check archmotorcycle.com for current visit/tour policy before counting on seeing it in person.",
      "Solvang Vintage Motorcycle Museum, Solvang, CA — sits right along the route between Big Sur/Santa Barbara and LA, so it's barely a detour. Small, well-regarded vintage collection in a quirky Danish-style town."
    ]
  },
];

const phases = [...southPhases, ...northPhases];

// ---------- PLANNING CONSIDERATIONS (open list, grows over time) ----------
const considerations = [
  {
    title: "1. How to document the trip",
    items: [
      "Helmet-mounted action cam (GoPro or similar) for riding footage vs. handlebar mount — helmet gives POV but adds weight/wind noise on long days",
      "Phone photos are the low-effort default — worth a dedicated fast-access mount for quick stops",
      "Storage/backup plan on the road: swap SD cards vs. cloud upload at hotels each night (don't wait until the end of a phase to back up)",
      "Battery/charging logistics for cameras alongside phone, GPS, etc. — a small USB power bank or bike-mounted charger",
      "Consider a simple daily log/journal (voice memo at the end of each riding day is fast) to pair with the photos/video later",
      "Open question: is this purely for personal memory, or is there any interest in sharing/publishing (blog, YouTube, family group)? Changes how much editing effort is worth it"
    ]
  },
  {
    title: "2. Packing",
    items: [
      "Hotels-primary means lighter luggage than a full camping setup, but the bivy option (for backcountry exceptions) still needs a place on the bike",
      "Layering for big elevation/climate swings in one day — desert heat to mountain cold (Rockies, Sedona-to-Grand Canyon rim) is a real jump",
      "Rain gear — non-negotiable given the length of the trip and the regions covered",
      "Basic first aid kit, given some legs are genuinely remote (Chaco Canyon, Beartooth Highway)",
      "Weight distribution matters more on twisty mountain roads than on highway — pack heavier items low and centered",
      "Open question: soft luggage (throw-over saddlebags/dry bags) vs. hard cases — trade-off between security/weatherproofing and weight/flexibility"
    ]
  },
  {
    title: "3. Cost limitations — camping vs. hotels balance",
    items: [
      "Open question, not yet answered: what's the target nightly budget range for lodging?",
      "Hotels-primary was the stated preference, with camping/bivy as the exception rather than the plan — worth deciding which specific nights (if any) shift to camping to manage cost, e.g. near national parks where in-park lodging is expensive/scarce",
      "Fuel and food costs scale with total trip length (each trip is ~27 days / ~4,000 mi) — worth a rough per-day cost estimate once lodging budget is set",
      "Consider whether a rewards program (hotel chain or credit card) makes sense given the number of nights across two multi-week trips"
    ]
  },
  {
    title: "4. Extra tools and fuel",
    items: [
      "Fuel: plan is an expandable/removable auxiliary fuel pack, used only when heading into flagged backcountry stretches (Chaco Canyon, Beartooth Highway) rather than carried the whole trip — keeps weight down elsewhere",
      "Basic roadside tool kit: tire repair/plug kit + small pump given remote riding, zip ties, electrical tape, multi-tool, spare fuses",
      "Given the confirmed cell dead zones (Chaco Canyon, Going-to-the-Sun Road, Yellowstone interior), worth considering a satellite communicator (e.g. Garmin inReach) for the genuinely off-grid legs",
      "Tire condition/spare consideration before each remote phase — no quick replacement option in these areas"
    ]
  },
  {
    title: "5. Road training — improving my riding before the trip",
    items: [
      "Worth pegging to the actual demands of this route: the Dragon, Iron Mountain Road and the Beartooth are sustained tight-radius and switchback work, not just long-distance cruising",
      "Advanced road-craft / cornering course — the biggest single return for roads like these is vision, line selection and corner entry speed",
      "Long-distance endurance is its own skill: back-to-back 200+ mile days at altitude and in heat is different from a good Sunday ride. Worth building up with a few multi-day shakedown runs before committing to a 27-day trip.",
      "Loaded-bike handling — the bike will feel different fully packed with luggage and an auxiliary fuel pack. Practise with the real load before departure, not on day one of the trip.",
      "Consider a slow-speed control / parking-lot skills refresher — most trip-ending drops happen at walking pace, fully loaded, on gravel at a fuel stop",
      "Gravel/unpaved confidence: the Chaco Canyon approach roads and a few of the backcountry stretches aren't pristine tarmac",
      "Open question: any target dates for training relative to the trip? Doing a course the month before beats doing it a year out."
    ]
  }
];


// ---------- TOTALS ----------
// Optional phases are excluded from headline figures so the baseline stays comparable.
const core = phases.filter(p => !p.optional);
const optional = phases.filter(p => p.optional);

const southCore = core.filter(p => p.trip === 'South Route');
const northCore = core.filter(p => p.trip === 'North Route');

function sum(list, key) { return list.reduce((s, p) => s + p[key], 0); }
function rest(list) { return list.reduce((s, p) => s + p.stops.filter(st => st.miles === 0).length, 0); }

const southDays = sum(southCore, 'days'), southMiles = sum(southCore, 'miles');
const northDays = sum(northCore, 'days'), northMiles = sum(northCore, 'miles');

const totalDays = southDays + northDays;
const totalMiles = southMiles + northMiles;
const restDays = rest(southCore) + rest(northCore);
const ridingDays = totalDays - restDays;
const avgMiles = Math.round(totalMiles / ridingDays);

// Phase S3B replaces the direct Chaco -> Grand Canyon run (1 day, ~300 mi) inside S3.
const REPLACED_DAYS = 1, REPLACED_MILES = 300;
const optDays = sum(optional, 'days') - REPLACED_DAYS;
const optMiles = sum(optional, 'miles') - REPLACED_MILES;

const stats = { southDays, southMiles, northDays, northMiles, totalDays, totalMiles,
  restDays, ridingDays, avgMiles, optDays, optMiles,
  southWithOptDays: southDays + optDays, southWithOptMiles: southMiles + optMiles };

console.log(stats);

writeFileSync('../data/trip-data.json', JSON.stringify({ phases, considerations, ...stats }, null, 2));
