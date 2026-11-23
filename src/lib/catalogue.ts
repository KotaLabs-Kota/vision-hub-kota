export const frameSections = [
  { id: 'metal-frames', name: 'Metal frames', description: 'Slim rims and crisp outlines.' },
  { id: 'statement-frames', name: 'Statement frames', description: 'Defined shapes, from clear grey to classic black.' },
  { id: 'rimless-frames', name: 'Rimless frames', description: 'An open look with colour at the temples.' },
] as const;

export type FrameSection = (typeof frameSections)[number]['id'];

export const viewLabels = { front: 'Front', angle: 'Angled', folded: 'Folded' } as const;

export interface FramePhoto {
  view: keyof typeof viewLabels;
  alt: string;
}

export interface Frame {
  id: string;
  code: string;
  section: FrameSection;
  name: string;
  shape: string;
  finish: string;
  description: string;
  photos: readonly [FramePhoto, ...FramePhoto[]];
}

export const frames: readonly Frame[] = [
  {
    id: 'navy-geometric', code: 'VH-01', section: 'metal-frames', name: 'Navy Geometric',
    shape: 'Geometric', finish: 'Navy & silver',
    description: 'Fine navy rims trace a softly angular shape. A silver bridge and slim metal temples give the frame a little contrast.',
    photos: [
      { view: 'front', alt: 'Front of the navy geometric glasses with a silver bridge and open temples' },
      { view: 'angle', alt: 'Angled view showing the navy rims, silver temples and black tips' },
      { view: 'folded', alt: 'Navy geometric glasses with the black-tipped temples folded' },
    ],
  },
  {
    id: 'silver-double-bridge', code: 'VH-02', section: 'metal-frames', name: 'Silver Double Bridge',
    shape: 'Soft square', finish: 'Silver & black',
    description: 'A straight silver brow bar sits above softly squared rims. Dark temple tips pick up the fine black outline around each lens.',
    photos: [
      { view: 'front', alt: 'Front view of the silver double-bridge frame with dark squared rims' },
      { view: 'angle', alt: 'Angled view of the double bridge, silver temples and black temple tips' },
    ],
  },
  {
    id: 'midnight-square', code: 'VH-03', section: 'metal-frames', name: 'Midnight Square',
    shape: 'Soft square', finish: 'Midnight blue',
    description: 'A slim, dark rim and a single bridge keep this softly squared frame understated. The clear nose pads are visible without adding much to the outline.',
    photos: [
      { view: 'front', alt: 'Front view of the dark midnight blue square metal frame' },
      { view: 'angle', alt: 'Angled view of the midnight square frame showing the matching dark temples' },
    ],
  },
  {
    id: 'smoke-clear-square', code: 'VH-04', section: 'statement-frames', name: 'Smoke Clear Square',
    shape: 'Soft square', finish: 'Translucent grey',
    description: 'Translucent smoky-grey rims soften the square shape. A silver-toned temple is visible through the clear finish.',
    photos: [
      { view: 'folded', alt: 'Smoke-grey transparent glasses from the front with the temples folded behind the lenses' },
      { view: 'angle', alt: 'Angle of the smoke-grey frame showing its clear rims and silver-toned temples' },
    ],
  },
  {
    id: 'black-twin-rivet', code: 'VH-05', section: 'statement-frames', name: 'Black Twin Rivet',
    shape: 'Soft square', finish: 'Black',
    description: 'A black front with softly rounded corners. Two small metal dots at each corner give the frame its signature detail.',
    photos: [{ view: 'angle', alt: 'Angled view of black square glasses with paired silver rivets at the corners' }],
  },
  {
    id: 'classic-black-square', code: 'VH-06', section: 'statement-frames', name: 'Classic Black Square',
    shape: 'Square', finish: 'Black',
    description: 'A bold black brow and softly rounded lower edges balance this square frame. Each corner has an inset oval silver accent.',
    photos: [{ view: 'front', alt: 'Front view of bold black square glasses with an oval metal accent at each corner' }],
  },
  {
    id: 'forest-rectangle', code: 'VH-07', section: 'statement-frames', name: 'Forest Rectangle',
    shape: 'Rectangle', finish: 'Deep green',
    description: 'A deep green brow adds definition above a thinner lower rim. The rectangular front pairs with dark green temples.',
    photos: [{ view: 'folded', alt: 'Deep green rectangular XFord glasses with the temples folded behind the lenses' }],
  },
  {
    id: 'crimson-rimless', code: 'VH-08', section: 'rimless-frames', name: 'Crimson Rimless',
    shape: 'Rectangle', finish: 'Red & gunmetal',
    description: 'Rimless rectangular lenses keep the front open. Red temples and a dark bridge carry the colour and contrast.',
    photos: [
      { view: 'front', alt: 'Front of the rimless rectangular glasses with red temples and a dark bridge' },
      { view: 'folded', alt: 'Rimless rectangular glasses with the red temples folded behind the lenses' },
    ],
  },
  {
    id: 'champagne-rimless', code: 'VH-09', section: 'rimless-frames', name: 'Champagne Rimless',
    shape: 'Rectangle', finish: 'Champagne & brown',
    description: 'A champagne-toned bridge and thin temples frame the look without a full rim. Dark brown temple tips add a warm contrast.',
    photos: [{ view: 'angle', alt: 'Angled view of champagne-toned XFord rimless glasses with dark brown temple tips' }],
  },
];

export const catalogueGroups = frameSections.map((section) => ({
  ...section,
  frames: frames.filter((frame) => frame.section === section.id),
}));

export function frameHref({ id }: Pick<Frame, 'id'>) {
  return `/frames/${id}/`;
}

export function photoSrc({ id }: Pick<Frame, 'id'>, { view }: FramePhoto, small = false) {
  return `/images/frames/${id}/${view}${small ? '-small' : ''}.webp`;
}
