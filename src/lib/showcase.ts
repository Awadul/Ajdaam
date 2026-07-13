// The two hero pieces on /testing. Plain data, importable from server and
// client alike — keep components out of this file.

export type ShowcaseItem = {
  projectId: string;
  name: string;
  material: string;
  method: string;
  spec: string;
  story: string;
};

// The landing page's own assembly piece — deliberately not one of the two
// /testing heroes, whose photos already appear in the case-study strip.
export const landingAssembly: ShowcaseItem = {
  projectId: 'CFAWzjUnN5n',
  name: '3D Carved Relief Panel',
  material: 'Solid wood',
  method: '3D Wood Carving',
  spec: 'Machine depth · hand finish',
  story:
    'Three-dimensional passes in solid wood: the machine does the depth, a person does the finishing. Relief fields, calligraphy and ornament that read as one carved surface.',
};

export const showcaseItems: ShowcaseItem[] = [
  {
    projectId: 'CC37tiKlbss',
    name: 'MDF Decor Panel',
    material: '16 mm MDF',
    method: 'CNC Machining',
    spec: '3.5 × 8 ft · one sheet',
    story:
      'Specified as one continuous pattern with no visible seam. Nested and machined from a single sheet on the 4 × 8 router in one setup — installed as one panel, no alignment work on site.',
  },
  {
    projectId: 'CDZ7hcol16-',
    name: 'Mild Steel Screens',
    material: 'Mild steel',
    method: 'Fiber Laser Cutting',
    spec: '3 mm · cut edge is the finish',
    story:
      'A perforated screen run where the cut edge itself is the finished surface. Cut at held tolerance, flat off the bed — delivered ready to coat, with no grinding pass.',
  },
];
