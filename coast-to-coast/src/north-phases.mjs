// NORTH ROUTE — one-way westbound from Ridgefield, CT to the Pacific.
// Bike shipped home, rider flies back.
export const northPhases = [
  {
    id: "N1",
    trip: "North Route",
    name: "Connecticut, the Whites & Maine",
    color: "#c0392b",
    months: "Mid-June (blackfly season is easing, roads all open)",
    days: 4,
    miles: 900,
    route: ["Ridgefield, CT", "White Mountains, NH", "Acadia NP, ME"],
    stops: [
      { day: 1, seg: "Ridgefield, CT → White Mountains, NH", miles: 260, note: "North-east first — the one leg that heads away from the Pacific, and worth it" },
      { day: 2, seg: "Kancamagus Highway + Mount Washington Auto Road", miles: 120, note: "NH-112 and the climb to the 6,288 ft summit" },
      { day: 3, seg: "White Mountains → Acadia NP, ME", miles: 220, note: "Down to the Maine coast" },
      { day: 4, seg: "Acadia National Park (rest day)", miles: 0, note: "Park Loop Road, Cadillac Mountain, lighthouses, lobster" }
    ],
    roads: [
      "Kancamagus Highway / NH-112 (35 mi) — one of New England's great rides",
      "Mount Washington Auto Road (8 mi) — toll road to the summit, notorious weather",
      "Acadia Park Loop Road (27 mi) — glacier-scoured granite and the Atlantic"
    ],
    historic: ["Early New England coastal settlements", "Bar Harbor's Gilded Age history"],
    natural: ["White Mountains", "Acadia National Park", "Maine coastline"],
    towns: ["North Conway, NH", "Bar Harbor, ME — lobster shacks and working harbour"],
    caution: ["This leg runs east before the trip turns west — it's a deliberate 900-mile detour to get Maine in. If the schedule tightens, this is the cleanest phase to cut."]
  },
  {
    id: "N2",
    trip: "North Route",
    name: "Maine to the Great Lakes",
    color: "#e67e22",
    months: "Late June",
    days: 6,
    miles: 1400,
    route: ["Acadia NP, ME", "Green Mountains, VT", "Lake Placid, NY", "Niagara Falls, NY", "Harbor Springs, MI", "Keweenaw, MI"],
    stops: [
      { day: 1, seg: "Acadia → Vermont Route 100 / Green Mountains", miles: 300, note: "VT-100 runs the length of the Green Mountains" },
      { day: 2, seg: "Green Mountains → Adirondacks / Lake Placid, NY", miles: 180, note: "Across Lake Champlain into the High Peaks" },
      { day: 3, seg: "Lake Placid → Niagara Falls, NY", miles: 300, note: "Across upstate New York" },
      { day: 4, seg: "Niagara → Southern Michigan", miles: 250, note: "Around the lake shore. Optional: swing south of Lake Erie for the AMA Motorcycle Hall of Fame near Columbus, OH." },
      { day: 5, seg: "→ Tunnel of Trees / Harbor Springs → Mackinac", miles: 250, note: "M-119: a narrow, curvy path through a tunnel of foliage; then the Mackinac Bridge into the UP" },
      { day: 6, seg: "Michigan UP → Keweenaw Peninsula", miles: 200, note: "Brockway Mountain Drive, Lake Superior on three sides" }
    ],
    roads: [
      "Vermont Route 100 (217 mi) — the length of the Green Mountains",
      "Tunnel of Trees / M-119 (20 mi)",
      "Copper Country Trail (47 mi) — Keweenaw Peninsula, including Brockway Mountain Drive"
    ],
    historic: ["Niagara Falls region", "Keweenaw copper mining heritage", "Mackinac Island and the straits"],
    natural: ["Adirondack High Peaks", "Niagara Falls", "Lake Superior shoreline"],
    towns: ["Lake Placid, NY — twice a Winter Olympics host", "Copper Harbor, MI — end-of-the-road feel"],
    moto: ["AMA Motorcycle Hall of Fame Museum, Pickerington, OH — only if you route south of Lake Erie on day 4 rather than through the Adirondacks; covers the breadth of American motorcycling, not one brand"]
  },
  {
    id: "N3",
    trip: "North Route",
    name: "Great Lakes to the Black Hills",
    color: "#f1c40f",
    months: "Early July",
    days: 6,
    miles: 1500,
    route: ["Keweenaw, MI", "Duluth, MN", "Fargo, ND", "Theodore Roosevelt NP, ND", "Badlands, SD", "Black Hills, SD"],
    stops: [
      { day: 1, seg: "Keweenaw → Duluth / MN North Shore", miles: 250, note: "Lake Superior's north shore — cliffs, waterfalls, lighthouses" },
      { day: 2, seg: "North Shore → Fargo, ND", miles: 300, note: "Out of the lakes, into the plains" },
      { day: 3, seg: "Fargo → Theodore Roosevelt NP, ND", miles: 280, note: "North Dakota badlands, wild horses, bison — badly underrated and almost empty" },
      { day: 4, seg: "Theodore Roosevelt → Badlands NP, SD", miles: 300, note: "South across the plains into South Dakota" },
      { day: 5, seg: "Badlands → Rapid City / Black Hills", miles: 200, note: "Otherworldly formations, then into the Hills" },
      { day: 6, seg: "Black Hills — Iron Mountain Rd & Needles Hwy", miles: 60, note: "314 curves, 14 switchbacks, pigtail bridges; Rushmore and Crazy Horse" }
    ],
    roads: [
      "Minnesota North Shore Scenic Drive",
      "Theodore Roosevelt NP scenic loop drives",
      "Iron Mountain Road / US-16A (17 mi) — 314 curves, 14 switchbacks, three pigtail bridges, tunnels framed on Mount Rushmore",
      "Needles Highway — granite spires and needle-eye tunnels; pairs with Iron Mountain as a loop"
    ],
    historic: ["Theodore Roosevelt's Elkhorn Ranch", "Mount Rushmore", "Crazy Horse Memorial — still in progress"],
    natural: ["Lake Superior north shore", "North Dakota badlands", "Badlands National Park", "Black Hills"],
    culture: ["The Black Hills are sacred Lakota land — the Rushmore and Crazy Horse stories sit in direct tension with each other, and reading up before you go makes the visit land very differently"],
    towns: ["Duluth, MN — lake port city", "Medora, ND — tiny western gateway town", "Rapid City, SD"],
    moto: ["Sturgis Motorcycle Museum & Hall of Fame, Sturgis, SD — ~30 mi from Rapid City, essentially on the way. Home of the world's biggest rally."],
    fuel: ["Western North Dakota and the run south into South Dakota: towns thin out. Distances stay inside 180 mi on main routes, but station hours are short and Sunday closures are common — this is auxiliary-pack territory if you drop onto the smaller plains roads."],
    cell: ["Coverage across the northern plains is patchy between towns; interstates hold up better than the two-lanes. Theodore Roosevelt NP is largely without signal."]
  },
  {
    id: "N4",
    trip: "North Route",
    name: "Yellowstone & the Tetons",
    color: "#2ecc71",
    months: "Mid–late July",
    days: 6,
    miles: 1000,
    route: ["Black Hills, SD", "Casper, WY", "Jackson, WY", "Yellowstone, WY", "Bozeman, MT"],
    stops: [
      { day: 1, seg: "Black Hills → Casper, WY", miles: 220, note: "Transit west across Wyoming; Oregon Trail country" },
      { day: 2, seg: "Casper → Jackson, WY", miles: 260, note: "Wind River country into the Tetons" },
      { day: 3, seg: "Jackson, WY (rest day)", miles: 0, note: "Grand Teton, mountain-town culture, good nightlife — a natural spot for family to fly in and join" },
      { day: 4, seg: "Jackson → Grand Teton → Yellowstone", miles: 120, note: "Teton Park Road with the range in full view" },
      { day: 5, seg: "Yellowstone (rest day)", miles: 0, note: "Geysers, wildlife, historic lodges" },
      { day: 6, seg: "Yellowstone → Beartooth Highway → Bozeman, MT", miles: 240, note: "US-212 over 10,947 ft Beartooth Pass — \"the most scenic highway in America\"" }
    ],
    roads: [
      "Beartooth Highway / US-212 (69 mi) — Charles Kuralt's \"most scenic highway in America\"",
      "Teton Park Road — the Teton range the whole way",
      "Chief Joseph Scenic Byway — the fallback if Beartooth is closed for snow"
    ],
    historic: ["Yellowstone's historic lodges", "Oregon Trail sites around Casper"],
    natural: ["Grand Teton National Park", "Yellowstone National Park", "Beartooth Pass"],
    towns: ["Jackson, WY — western culture, genuinely good nightlife", "Bozeman, MT"],
    fuel: [
      "Beartooth Highway (~68 mi): one seasonal, limited-hours stop midway (Top of the World Store). Fill in Red Lodge or Cooke City rather than relying on it.",
      "Black Hills → Casper → Jackson (~480 mi of rural Wyoming): the long transit run. Top off at every opportunity — station hours, not distance, are the risk."
    ],
    cell: [
      "Yellowstone: \"essentially one giant dead zone\" — service exists at Mammoth, Old Faithful, Lake Village, Grant Village and near the entrances, with long gaps between.",
      "Grand Teton / Jackson: good reception — the reliable place to make calls before heading back in.",
      "Beartooth Highway: assume no signal across the pass."
    ],
    caution: ["Beartooth Pass is seasonal — typically open late May to mid-October, and it can close for snow in any month. Keep the Chief Joseph Scenic Byway in mind as the alternate."]
  },
  {
    id: "N5",
    trip: "North Route",
    name: "Glacier & the Northern Rockies",
    color: "#1abc9c",
    months: "Late July–August (Going-to-the-Sun needs to be fully open)",
    days: 5,
    miles: 850,
    route: ["Bozeman, MT", "Missoula, MT", "Glacier NP, MT", "Spokane, WA"],
    stops: [
      { day: 1, seg: "Bozeman → Missoula, MT", miles: 200, note: "Across the Divide, Montana mountain country" },
      { day: 2, seg: "Missoula → Glacier National Park", miles: 150, note: "Up the Flathead; MT-83 through Seeley Lake as the scenic option" },
      { day: 3, seg: "Glacier — Going-to-the-Sun Road", miles: 50, note: "Crosses the Divide at Logan Pass; one of the most scenic roads in North America" },
      { day: 4, seg: "Glacier (buffer / east side)", miles: 100, note: "Two Medicine and St. Mary, or a weather buffer day — the Sun Road is worth waiting out cloud for" },
      { day: 5, seg: "Glacier → Coeur d'Alene / Spokane, WA", miles: 350, note: "West out of the Rockies toward the Cascades" }
    ],
    roads: [
      "Going-to-the-Sun Road (50 mi) — Logan Pass at 6,646 ft",
      "MT-83 through the Seeley-Swan valley",
      "US-93 (MT) — remote wilderness riding"
    ],
    historic: ["Glacier's historic lodges", "Blackfeet Nation lands along the park's eastern boundary"],
    natural: ["Glacier National Park", "Flathead Lake", "Bob Marshall Wilderness (seen from the road)"],
    towns: ["Missoula, MT — college town, breweries", "Whitefish, MT"],
    fuel: ["Going-to-the-Sun Road: no gas inside the park — fuel in West Glacier or St. Mary before and after."],
    cell: [
      "Going-to-the-Sun Road: confirmed Verizon dead zone between The Loop and Logan Pass — a genuine 20-30 minutes with no signal. Many Glacier and Two Medicine are minimal-to-none. Verizon is still the best carrier in the park (usable at Apgar Village and Lake McDonald Lodge).",
      "MT-83 (Seeley Lake–Swan Lake): multiple confirmed 10-15 minute no-signal gaps. Verizon covers roughly 85% of Montana's major routes — best of the carriers, but the mountain interior stays spotty."
    ],
    caution: ["Going-to-the-Sun typically opens fully late June/early July and Glacier runs a vehicle reservation system in peak season — check requirements before you arrive, motorcycles included."]
  },
  {
    id: "N6",
    trip: "North Route",
    name: "Cascades to the Pacific",
    color: "#3498db",
    months: "August–early September",
    days: 7,
    miles: 1300,
    route: ["Spokane, WA", "North Cascades, WA", "Mount Rainier, WA", "Portland, OR", "Bend, OR", "Crater Lake, OR", "Oregon Coast, OR"],
    stops: [
      { day: 1, seg: "Spokane → North Cascades / Winthrop, WA", miles: 250, note: "WA-20 — glaciers, alpine lakes, waterfalls. Approached from the east, so Seattle stays well off the route." },
      { day: 2, seg: "North Cascades → Mount Rainier area", miles: 250, note: "Skirting south around the Puget Sound sprawl" },
      { day: 3, seg: "Mount Rainier → Columbia Gorge → Portland, OR", miles: 180, note: "Waterfalls along the Historic Columbia River Highway" },
      { day: 4, seg: "Portland, OR (rest day)", miles: 0, note: "Breweries, food, nightlife — the city stop of this route" },
      { day: 5, seg: "Portland → Mount Hood loop → Bend, OR", miles: 200, note: "Around the volcano and into the high desert" },
      { day: 6, seg: "Bend → Cascade Lakes Byway → Crater Lake", miles: 130, note: "Deepest lake in the US, sitting in a volcano" },
      { day: 7, seg: "Crater Lake → Oregon Coast (Pacific)", miles: 290, note: "Final run to salt water — the end of the line. Ship the bike, fly home." }
    ],
    roads: [
      "North Cascades Scenic Highway / WA-20 (140 mi) — old-growth forest, alpine lakes, glaciers",
      "Historic Columbia River Highway — waterfalls and cliffside curves",
      "Mount Hood Scenic Byway (105 mi)",
      "Cascade Lakes Scenic Byway",
      "West Cascades Scenic Byway (220 mi) — the spine of the Oregon Cascades",
      "Crater Lake Rim Drive",
      "Oregon Coast US-101 — lighthouses, sea stacks"
    ],
    historic: ["Columbia River Gorge and the Oregon Trail's final stretch"],
    natural: ["North Cascades", "Mount Rainier", "Columbia River Gorge", "Mount Hood", "Crater Lake National Park", "Oregon Coast sea stacks"],
    towns: ["Winthrop, WA — old-west themed mountain town", "Portland, OR — culture, breweries, nightlife (Seattle stays off the route)", "Bend, OR — outdoor town", "Cannon Beach / Newport, OR"],
    fuel: ["WA-20 through the North Cascades: no services for a long stretch between Winthrop and Marblemount. Fill before you start the pass.", "Central Oregon high desert between Bend and Crater Lake is emptier than it looks — otherwise this phase is well served."],
    cell: ["North Cascades: expect nothing across the pass section.", "Crater Lake and the Cascades generally: patchy. Coverage is solid in Portland, Bend and along the coast."],
    caution: ["WA-20 is closed by snow every winter and Crater Lake's rim road opens late — this phase is the reason the North Route has to be a midsummer trip."]
  }
];
