// Featured item seed data
// Each entry references an entity (product, look, or hairstyle) by name

type FeaturedItemSeed = {
  type: string;
  entityName: string;
  title: string;
  subtitle: string | null;
  imageUrl: string | null;
  position: number;
  section: string;
  startDate: Date | null;
  endDate: Date | null;
  isActive: boolean;
};

export const featuredItems: FeaturedItemSeed[] = [
  // ═══════════════════════════════════════════════════════════
  // TRENDING section
  // ═══════════════════════════════════════════════════════════
  {
    type: 'PRODUCT',
    entityName: 'Classic Red Lipstick',
    title: 'The Perfect Red',
    subtitle: 'Our #1 most-tried shade this month',
    imageUrl: 'https://cdn.maikup.app/featured/trending-classic-red.jpg',
    position: 1,
    section: 'trending',
    startDate: null,
    endDate: null,
    isActive: true,
  },
  {
    type: 'LOOK',
    entityName: 'Korean Glass Skin',
    title: 'Glass Skin Goals',
    subtitle: 'The K-beauty look everyone is obsessed with',
    imageUrl: 'https://cdn.maikup.app/featured/trending-glass-skin.jpg',
    position: 2,
    section: 'trending',
    startDate: null,
    endDate: null,
    isActive: true,
  },
  {
    type: 'HAIRSTYLE',
    entityName: 'Curtain Bangs',
    title: 'Curtain Bangs Era',
    subtitle: 'See how they frame your face before committing',
    imageUrl: 'https://cdn.maikup.app/featured/trending-curtain-bangs.jpg',
    position: 3,
    section: 'trending',
    startDate: null,
    endDate: null,
    isActive: true,
  },
  {
    type: 'PRODUCT',
    entityName: 'Strawberry Cream Blush',
    title: 'Strawberry Flush',
    subtitle: 'The viral dewy blush taking over social media',
    imageUrl: 'https://cdn.maikup.app/featured/trending-strawberry-blush.jpg',
    position: 4,
    section: 'trending',
    startDate: null,
    endDate: null,
    isActive: true,
  },
  {
    type: 'HAIRSTYLE',
    entityName: 'Copper Red',
    title: 'Copper Is the New Blonde',
    subtitle: 'The hottest hair color trend right now',
    imageUrl: 'https://cdn.maikup.app/featured/trending-copper-red.jpg',
    position: 5,
    section: 'trending',
    startDate: null,
    endDate: null,
    isActive: true,
  },
  {
    type: 'LOOK',
    entityName: 'Monochromatic Rose',
    title: 'One Color, Full Look',
    subtitle: 'Effortless monochrome beauty in under 5 minutes',
    imageUrl: 'https://cdn.maikup.app/featured/trending-monochrome-rose.jpg',
    position: 6,
    section: 'trending',
    startDate: null,
    endDate: null,
    isActive: true,
  },

  // ═══════════════════════════════════════════════════════════
  // EDITORS_PICK section
  // ═══════════════════════════════════════════════════════════
  {
    type: 'LOOK',
    entityName: 'Classic Hollywood Glam',
    title: 'Editor\'s Favorite: Old Hollywood',
    subtitle: 'Timeless glamour that never goes out of style',
    imageUrl: 'https://cdn.maikup.app/featured/editors-hollywood-glam.jpg',
    position: 1,
    section: 'editors_pick',
    startDate: null,
    endDate: null,
    isActive: true,
  },
  {
    type: 'PRODUCT',
    entityName: 'Champagne Pop',
    title: 'The Glow Getter',
    subtitle: 'Our beauty editor\'s desert island highlighter',
    imageUrl: 'https://cdn.maikup.app/featured/editors-champagne-pop.jpg',
    position: 2,
    section: 'editors_pick',
    startDate: null,
    endDate: null,
    isActive: true,
  },
  {
    type: 'HAIRSTYLE',
    entityName: 'Classic French Braid',
    title: 'The Timeless Braid',
    subtitle: 'Elevated elegance for any occasion',
    imageUrl: 'https://cdn.maikup.app/featured/editors-french-braid.jpg',
    position: 3,
    section: 'editors_pick',
    startDate: null,
    endDate: null,
    isActive: true,
  },
  {
    type: 'PRODUCT',
    entityName: 'Dusty Rose Lipstick',
    title: 'Your Lips But Better',
    subtitle: 'The universally flattering shade you need',
    imageUrl: 'https://cdn.maikup.app/featured/editors-dusty-rose.jpg',
    position: 4,
    section: 'editors_pick',
    startDate: null,
    endDate: null,
    isActive: true,
  },
  {
    type: 'LOOK',
    entityName: 'Classic Bridal',
    title: 'Bridal Beauty Perfected',
    subtitle: 'Photo-ready bridal makeup you can preview in AR',
    imageUrl: 'https://cdn.maikup.app/featured/editors-bridal.jpg',
    position: 5,
    section: 'editors_pick',
    startDate: null,
    endDate: null,
    isActive: true,
  },

  // ═══════════════════════════════════════════════════════════
  // NEW section
  // ═══════════════════════════════════════════════════════════
  {
    type: 'PRODUCT',
    entityName: 'Holographic Opal Shadow',
    title: 'New: Holographic Opal',
    subtitle: 'Multi-chrome magic just dropped',
    imageUrl: 'https://cdn.maikup.app/featured/new-holographic-opal.jpg',
    position: 1,
    section: 'new',
    startDate: null,
    endDate: null,
    isActive: true,
  },
  {
    type: 'HAIRSTYLE',
    entityName: 'Butterfly Cut',
    title: 'New: The Butterfly Cut',
    subtitle: 'The voluminous cut that flatters every face shape',
    imageUrl: 'https://cdn.maikup.app/featured/new-butterfly-cut.jpg',
    position: 2,
    section: 'new',
    startDate: null,
    endDate: null,
    isActive: true,
  },
  {
    type: 'LOOK',
    entityName: 'Douyin Glam',
    title: 'New: Douyin Glam Look',
    subtitle: 'Chinese beauty-inspired bold contour and eyes',
    imageUrl: 'https://cdn.maikup.app/featured/new-douyin-glam.jpg',
    position: 3,
    section: 'new',
    startDate: null,
    endDate: null,
    isActive: true,
  },
  {
    type: 'PRODUCT',
    entityName: 'Cherry Blossom Blush',
    title: 'New: Cherry Blossom Blush',
    subtitle: 'Delicate spring pink with a dewy finish',
    imageUrl: 'https://cdn.maikup.app/featured/new-cherry-blossom.jpg',
    position: 4,
    section: 'new',
    startDate: null,
    endDate: null,
    isActive: true,
  },

  // ═══════════════════════════════════════════════════════════
  // SEASONAL section (Spring/Summer themed)
  // ═══════════════════════════════════════════════════════════
  {
    type: 'LOOK',
    entityName: 'Summer Glow',
    title: 'Spring Into Summer',
    subtitle: 'Sun-drenched glow for the warm season ahead',
    imageUrl: 'https://cdn.maikup.app/featured/seasonal-summer-glow.jpg',
    position: 1,
    section: 'seasonal',
    startDate: new Date('2026-03-01'),
    endDate: new Date('2026-08-31'),
    isActive: true,
  },
  {
    type: 'PRODUCT',
    entityName: 'Coral Lipstick',
    title: 'Coral Season Is Here',
    subtitle: 'The perfect warm-weather lip color',
    imageUrl: 'https://cdn.maikup.app/featured/seasonal-coral-lip.jpg',
    position: 2,
    section: 'seasonal',
    startDate: new Date('2026-03-01'),
    endDate: new Date('2026-08-31'),
    isActive: true,
  },
  {
    type: 'HAIRSTYLE',
    entityName: 'Balayage',
    title: 'Spring Balayage',
    subtitle: 'Sun-kissed highlights to welcome the new season',
    imageUrl: 'https://cdn.maikup.app/featured/seasonal-balayage.jpg',
    position: 3,
    section: 'seasonal',
    startDate: new Date('2026-03-01'),
    endDate: new Date('2026-08-31'),
    isActive: true,
  },
  {
    type: 'PRODUCT',
    entityName: 'Peach Nectar Blush',
    title: 'Peachy Spring Cheeks',
    subtitle: 'Warm peachy flush for the breezy days ahead',
    imageUrl: 'https://cdn.maikup.app/featured/seasonal-peach-blush.jpg',
    position: 4,
    section: 'seasonal',
    startDate: new Date('2026-03-01'),
    endDate: new Date('2026-08-31'),
    isActive: true,
  },
];
