export const site = {
  name: 'Ajdaam Machine Craft',
  short: 'Ajdaam',
  tagline: 'We cut, carve and fabricate custom pieces in wood, metal and acrylic. Made to order in Islamabad.',
  location: 'NSTP, G-11, Islamabad, Pakistan',
  instagram: 'https://www.instagram.com/ajdammc/',
  instagramHandle: '@ajdammc',
  founded: '2020',
};

export const nav = [
  { href: '/work', label: 'Work' },
  { href: '/services', label: 'Services' },
  { href: '/materials', label: 'Materials' },
  { href: '/process', label: 'Process' },
  { href: '/testing', label: 'Showcase' },
  { href: '/contact', label: 'Contact' },
];

export const services = [
  {
    slug: 'cnc-machining',
    name: 'CNC Machining',
    spec: 'Router / Mill',
    summary: 'Precision routing and milling across wood, MDF and metal.',
    detail:
      'The router is where most jobs start and finish. Nested cutting across a full sheet, pocketing, profiling, and depth mapped passes for anything that needs to sit proud of the face. We hold the drawing, not an approximation of it.',
    doesWell: ['Nested sheet cutting', 'Pocketing and profiling', 'Depth mapped 3D passes', 'Repeat production runs'],
  },
  {
    slug: 'fiber-laser',
    name: 'Fiber Laser Cutting',
    spec: 'Mild Steel / Sheet',
    summary: 'Clean cuts through mild steel and sheet metal.',
    detail:
      'Flat, smooth cut faces straight off the bed. No grinding, no cleanup pass before finishing. Custom profiles, perforated patterns and decorative screens where the edge quality is the whole point.',
    doesWell: ['Decorative steel screens', 'Custom brackets and profiles', 'Perforated pattern work', 'Signage faces'],
  },
  {
    slug: 'plasma-cutting',
    name: 'Plasma Cutting',
    spec: 'Heavy Gauge',
    summary: 'Heavier metal profiles and thicker stock.',
    detail:
      'When the plate is too thick for the laser to be the right tool, plasma takes it. Structural pieces, base plates, thicker decorative work where the cut speed matters more than a mirror edge.',
    doesWell: ['Thick plate profiles', 'Structural components', 'Base plates and gussets', 'Fast turnaround cuts'],
  },
  {
    slug: 'laser-cutting',
    name: 'Laser Cutting and Engraving',
    spec: 'Acrylic / Wood / MDF',
    summary: 'Fine detail in acrylic, wood and MDF.',
    detail:
      'Down to the small stuff. Layered acrylic signage, name tags, inlays, engraved faces. Detail the router cannot reach and the eye still notices.',
    doesWell: ['Layered acrylic signage', 'Engraved faces and inlays', 'Small run tags and markers', 'Sample and prototype cuts'],
  },
  {
    slug: 'wood-carving',
    name: '3D Wood Carving',
    spec: 'Relief / Sculpted',
    summary: 'Relief carving, panels and sculpted pieces.',
    detail:
      'Three dimensional passes in solid wood and MDF. Relief panels, carved trays, calligraphy, ornamental fields. The machine does the depth, the finishing is done by hand.',
    doesWell: ['Relief wall panels', 'Calligraphy and ornament', 'Carved trays and objects', 'Sculpted furniture details'],
  },
  {
    slug: 'product-development',
    name: 'Custom Product Development',
    spec: 'Sketch to Part',
    summary: 'From a sketch or a sample through to a finished piece.',
    detail:
      'Bring a photo, a napkin drawing or a broken part. We work out the material, the tooling and the tolerances, cut a sample, then run the job. Most of what leaves this shop has never existed before.',
    doesWell: ['Drawing to finished part', 'Reverse engineering a sample', 'Material and tooling selection', 'Small batch production'],
  },
];

export const materials = [
  { name: 'Solid Wood', spec: 'Carved / Profiled', note: 'Trays, relief panels, furniture details. Finished by hand after the machine pass.' },
  { name: 'MDF', spec: '3mm — 18mm', note: 'The workhorse. Nested cutting, 3D machining, decor panels up to full sheet.' },
  { name: 'Acrylic', spec: '2mm — 10mm', note: 'Layered signage, extrusion effects, cut carts. Flame polished edges on request.' },
  { name: 'Mild Steel', spec: 'Fiber Laser', note: 'Screens, brackets, profiles. Cut faces come off flat and smooth.' },
  { name: 'Aluminium Cladding', spec: 'Composite Panel', note: 'Facade and interior cladding cut to a pattern.' },
  { name: 'PVC', spec: 'Sheet', note: 'Furniture components and moisture resistant fitout work.' },
];

// Placeholder — replace with real client quotes before launch. See README,
// "Before launch".
export const testimonials = [
  {
    quote:
      'We sent over a rough sketch and they came back with a material and a price the same day. The panel fit first time.',
    name: 'Client name',
    role: 'Decor panel, Islamabad',
  },
  {
    quote:
      'Everything from cutting to finishing happened in one shop. No waiting on three different vendors to get one piece done.',
    name: 'Client name',
    role: 'Furniture fitout',
  },
  {
    quote:
      'They cut a sample before touching the full run, so we knew exactly what we were getting before committing to the job.',
    name: 'Client name',
    role: 'Signage, production run',
  },
];

/**
 * Capabilities. The hard numbers a procurement team or a spec-writer looks
 * for before they send a drawing — bed sizes, tolerances, thicknesses,
 * turnaround. Confirm each of these against the actual machines before
 * launch; they are set to the shop's known figures, not invented.
 */
export const capabilities = [
  { label: 'Router bed', value: '4 × 8 ft', note: 'Full-sheet nested cutting in a single setup.' },
  { label: 'Fiber laser', value: 'Up to 6 mm', note: 'Mild steel, flat and smooth off the bed.' },
  { label: 'Plasma', value: 'Up to 20 mm', note: 'Heavy plate and structural profiles.' },
  { label: 'Tolerance', value: '± 0.1 mm', note: 'Held on detail and repeat production runs.' },
  { label: 'Sample lead time', value: '24–48 hrs', note: 'A cut sample before any production run.' },
  { label: 'Materials', value: '6 families', note: 'Wood, MDF, acrylic, steel, aluminium, PVC.' },
];

/**
 * Standards and process controls. Placeholders — replace the labels and the
 * "in progress / certified" state with the shop's real position before
 * launch. Framed as commitments a business buyer can audit, not badges.
 */
export const certifications = [
  {
    name: 'ISO 9001 Quality Management',
    detail: 'Documented quality process from drawing intake to final inspection.',
    status: 'In progress',
  },
  {
    name: 'Material traceability',
    detail: 'Stock logged by batch and certificate, so every part can be traced to its sheet.',
    status: 'Standard',
  },
  {
    name: 'First-article inspection',
    detail: 'A signed-off sample precedes every production run, dimensionally checked against the drawing.',
    status: 'Standard',
  },
  {
    name: 'NDA & IP handling',
    detail: 'Client drawings and tooling held in confidence and never reused between clients.',
    status: 'Standard',
  },
];

// Placeholder client roster — replace with real names/sectors before launch.
export const clients = [
  { name: 'Retail Group', sector: 'Retail fit-out' },
  { name: 'Hospitality Co.', sector: 'Restaurants & cafés' },
  { name: 'Property Developer', sector: 'Interiors' },
  { name: 'Signage Partner', sector: 'Brand signage' },
  { name: 'Furniture Brand', sector: 'Furniture' },
  { name: 'Exhibitions Ltd', sector: 'Events & stands' },
];

/**
 * Case studies. Structured so a reader sees the brief, the decision and the
 * outcome, not just a photo. Copy is placeholder — replace before launch —
 * but each is pinned to a real project shot for imagery.
 */
export const caseStudies = [
  {
    id: 'CC37tiKlbss',
    sector: 'Retail interior',
    title: 'A seamless 3.5 × 8 ft decorative field',
    challenge: 'A feature wall specified as one continuous pattern, with no visible seam or join.',
    solution: 'Nested and machined from a single 16 mm MDF sheet on the 4 × 8 router in one setup.',
    result: 'Installed as a single panel. No alignment work on site, no seam to hide.',
  },
  {
    id: 'CDZ7hcol16-',
    sector: 'Metal fabrication',
    title: 'Decorative steel screens, no secondary finishing',
    challenge: 'A perforated screen run where the cut edge itself is the finished surface.',
    solution: 'Fiber-laser cut through mild steel at held tolerance, flat off the bed.',
    result: 'Delivered ready to coat — no grinding or deburring pass required.',
  },
  {
    id: 'CECeDZLpOAV',
    sector: 'Commercial fit-out',
    title: 'CNC feature work, delivered and installed',
    challenge: 'A mall installation needing shop fabrication and on-site fitting to a schedule.',
    solution: 'Programmed, cut and finished in-house, then installed by the same team.',
    result: 'One point of contact from drawing to fitted piece, on the opening date.',
  },
];

export const process = [
  {
    step: '01',
    name: 'Drawing',
    body: 'You send a sketch, a photo, a DXF, or the broken part itself. We work out what is actually buildable and what the material will allow.',
  },
  {
    step: '02',
    name: 'Programming',
    body: 'The drawing becomes toolpaths. Tooling, feed rate and pass depth get chosen for the material, not copied from the last job.',
  },
  {
    step: '03',
    name: 'Sample',
    body: 'On anything with detail or a production run behind it, we cut a sample first. It is cheaper to be wrong on one piece than forty.',
  },
  {
    step: '04',
    name: 'Cutting',
    body: 'Router, fiber laser or plasma, whichever the job calls for. All of it under one roof, so nothing waits on a subcontractor.',
  },
  {
    step: '05',
    name: 'Finishing',
    body: 'Deburring, sanding, edge polishing, assembly. The machine gets it to shape. A person gets it to done.',
  },
  {
    step: '06',
    name: 'Delivery',
    body: 'Collected from the shop in G-11, or delivered and installed on site if the piece needs fitting.',
  },
];
