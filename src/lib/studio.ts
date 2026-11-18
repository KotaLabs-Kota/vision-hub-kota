const mapAddress = 'Vision Hub, 3-F-27, Opera Road, Sector 3, Talwandi, Kota, Rajasthan 324005';

export const studio = {
  name: 'Vision Hub Kota',
  phone: '+91 96608 43997',
  phoneHref: 'tel:+919660843997',
  address: ['3-F-27, Opera Road, Sector 3, Talwandi', 'Kota, Rajasthan 324005'],
  directions: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapAddress)}`,
  instagram: 'https://www.instagram.com/visionhub.kota/reels/',
  handle: '@visionhub.kota',
  rating: '4.8',
  ratingSource: 'https://www.justdial.com/Kota-Rajasthan/Vision-Hub-Talwandi/9999PX744-X744-190517174002-V8L9_BZDET',
  reviewSource: 'https://yappe.in/rajasthan/kota/vision-hub-best-optical-store-in-kota/1393564#reviews',
};

export const navigation = [
  { label: 'Eyewear', href: '#eyewear' },
  { label: 'Eye Care', href: '#eye-care' },
  { label: 'Visit Us', href: '#visit' },
  { label: 'Reels', href: '#reels' },
] as const;

export const categories = [
  {
    name: 'Eyeglasses',
    description: 'From barely-there to bold.',
    image: '/images/optical.webp',
    alt: 'Dark tortoiseshell optical frames resting on cream travertine',
    href: '#frame-edit',
    filter: 'eyeglasses',
  },
  {
    name: 'Sunglasses',
    description: 'A different shade of everyday.',
    image: '/images/sun.webp',
    alt: 'Deep olive sunglasses on a light sage surface',
    href: '#frame-edit',
    filter: 'sunglasses',
  },
  {
    name: 'Eye tests',
    description: 'Get to know your prescription.',
    image: '/images/care.webp',
    alt: 'Optical eye-test equipment in a softly lit room',
    href: '#eye-care',
    filter: undefined,
  },
] as const;

export const filters = [
  { key: 'all', label: 'All frames' },
  { key: 'eyeglasses', label: 'Eyeglasses' },
  { key: 'sunglasses', label: 'Sunglasses' },
] as const;

export type FrameCategory = Exclude<(typeof filters)[number]['key'], 'all'>;

interface Frame {
  id: string;
  name: string;
  category: FrameCategory;
  shape: string;
  material: string;
  finish: string;
  tone: string;
  image: string;
  alt: string;
  description: string;
}

export const frames: Frame[] = [
  {
    id: 'atelier', name: 'The Atelier', category: 'eyeglasses', shape: 'Square', material: 'Acetate',
    finish: 'Champagne amber', tone: '#b7814d', image: '/images/atelier.webp',
    alt: 'Square prescription glasses in transparent champagne-amber acetate',
    description: 'A squared frame with a warm translucent finish. Try a shape like this if you want a defined brow line without the weight of a dark rim.',
  },
  {
    id: 'noor', name: 'The Noor', category: 'eyeglasses', shape: 'Round', material: 'Metal',
    finish: 'Brushed gold', tone: '#c2a163', image: '/images/noor.webp',
    alt: 'Round prescription glasses in slender brushed gold metal',
    description: 'Fine metal rims, a soft round shape and a brushed gold finish. A light-looking frame that leaves your features in focus.',
  },
  {
    id: 'dune', name: 'The Dune', category: 'sunglasses', shape: 'Soft square', material: 'Acetate',
    finish: 'Honey tortoiseshell', tone: '#855031', image: '/images/dune.webp',
    alt: 'Acetate sunglasses with rounded square rims in honey tortoiseshell',
    description: 'Rounded square rims and a deep honey finish. A good shape to try if you like a classic silhouette with just a little colour.',
  },
  {
    id: 'verve', name: 'The Verve', category: 'sunglasses', shape: 'Cat-eye', material: 'Acetate',
    finish: 'Ink black', tone: '#373832', image: '/images/verve.webp',
    alt: 'Black acetate cat-eye sunglasses with dark lenses',
    description: 'A slim cat-eye with an upswept brow and a glossy black finish. Try it when you want your sunglasses to be the most striking part of your outfit.',
  },
];

export const fitGuide = [
  {
    label: 'Round', icon: 'square', heading: 'Try a little structure.',
    description: 'Square or rectangular frames can add definition. Start with a pair about as wide as your face, and smile to see if the rims lift off your nose.',
  },
  {
    label: 'Angular', icon: 'round', heading: 'Balance angles with curves.',
    description: 'Try a round, oval or softly squared frame to soften a defined brow or jaw. Check that the temples sit comfortably without pressing at the sides.',
  },
  {
    label: 'Oval', icon: 'glasses', heading: 'Start with width, then try shape.',
    description: 'Most shapes are worth a try. Begin with a frame close to the width of your face, then compare a slim frame with a bolder one to see which you prefer.',
  },
] as const;

export const reviews = [
  { quote: 'Proper eye test facilities are available at the store.', author: 'Golu H.' },
  { quote: 'Overall 5 stars for their services, products and friendly approach.', author: 'Sivam Y.' },
  { quote: 'Proper measurements were taken for progressive glasses', author: 'Komal S.' },
];

export const searchPages = [
  { name: 'Eyeglasses', detail: 'Explore the optical frame edit', href: '#frame-edit', filter: 'eyeglasses', terms: 'spectacles specs frames prescription' },
  { name: 'Sunglasses', detail: 'Explore the sun frame edit', href: '#frame-edit', filter: 'sunglasses', terms: 'shades frames sun' },
  { name: 'Eye tests & lens guidance', detail: 'Book a test or ask about lenses', href: '#eye-care', terms: 'eye care exam checkup contact lenses progressive prescription optician' },
  { name: 'Visit the studio', detail: 'Find us in Talwandi, Kota', href: '#visit', terms: 'directions map phone contact address hours opera road' },
  { name: 'Vision Hub Reels', detail: 'Watch reels and find us on Instagram', href: '#reels', terms: 'video social instagram visionhub.kota' },
] as const;
