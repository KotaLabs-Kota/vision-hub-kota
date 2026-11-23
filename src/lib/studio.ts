const mapAddress = 'Vision Hub, 3-F-27, Opera Road, Sector 3, Talwandi, Kota, Rajasthan 324005';
const phoneNumber = '+919660843997';
const instagramAccount = 'visionhub.kota';
const instagramProfile = `https://www.instagram.com/${instagramAccount}/`;

export const studio = {
  name: 'Vision Hub Kota',
  website: 'https://vision-hub-kota.vercel.app/',
  phone: '+91 96608 43997',
  phoneHref: `tel:${phoneNumber}`,
  whatsappNumber: phoneNumber.slice(1),
  address: ['3-F-27, Opera Road, Sector 3, Talwandi', 'Kota, Rajasthan 324005'],
  directions: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapAddress)}`,
  instagram: `${instagramProfile}reels/`,
  instagramProfile,
  instagramMessage: `https://ig.me/m/${instagramAccount}`,
  handle: `@${instagramAccount}`,
  rating: '4.8',
  ratingSource: 'https://www.justdial.com/Kota-Rajasthan/Vision-Hub-Talwandi/9999PX744-X744-190517174002-V8L9_BZDET',
  reviewSource: 'https://yappe.in/rajasthan/kota/vision-hub-best-optical-store-in-kota/1393564#reviews',
};

export function whatsappEnquiry(frame?: { name: string; code: string }) {
  const message = frame
    ? `Hi Vision Hub Kota! I'm interested in ${frame.name} (${frame.code}). Is it available to try on?`
    : "Hi Vision Hub Kota! I'd like help choosing a frame.";
  return `https://wa.me/${studio.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const navigation = [
  { label: 'Eyewear', href: '/#eyewear' },
  { label: 'Eye Care', href: '/#eye-care' },
  { label: 'Visit Us', href: '/#visit' },
  { label: 'Reels', href: '/#reels' },
] as const;

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
  { name: 'Eyewear catalogue', detail: 'Browse all frames', href: '/#frame-edit', terms: 'spectacles eyeglasses specs frames prescription' },
  { name: 'Eye tests & lens guidance', detail: 'Book a test or ask about lenses', href: '/#eye-care', terms: 'eye care exam checkup contact lenses progressive prescription optician sunglasses' },
  { name: 'Visit the studio', detail: 'Find us in Talwandi, Kota', href: '/#visit', terms: 'directions map phone contact address hours opera road' },
  { name: 'Contact Vision Hub', detail: 'Call, WhatsApp or message on Instagram', href: '/#enquire', terms: 'availability buy enquire message whatsapp instagram phone' },
  { name: 'Vision Hub Reels', detail: 'Watch reels and find us on Instagram', href: '/#reels', terms: 'video social instagram visionhub.kota' },
] as const;
