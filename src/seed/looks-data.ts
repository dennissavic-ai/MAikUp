import { SubscriptionTier } from '@prisma/client';

type LookSeed = {
  name: string;
  description: string;
  style: string;
  occasion: string;
  difficulty: string;
  tier: SubscriptionTier;
  sortOrder: number;
  tags: string[];
  productNames: string[];
};

export const makeupLooks: LookSeed[] = [
  // ─── Natural / Everyday Looks ─────────────────────────────
  {
    name: 'No-Makeup Makeup',
    description: 'The classic barely-there look - flawless skin, subtle enhancement, effortless beauty',
    style: 'natural',
    occasion: 'everyday',
    difficulty: 'beginner',
    tier: 'FREE',
    sortOrder: 1,
    tags: ['natural', 'minimal', 'everyday', 'beginner-friendly'],
    productNames: ['Natural Buff Foundation', 'Light Concealer', 'Translucent Setting Powder', 'Nude Flush Blush', 'Clear Brow Gel', 'Lengthening Mascara', 'Bare Nude Lipstick'],
  },
  {
    name: 'Fresh-Faced Dewy',
    description: 'Glowing, hydrated skin with a dewy finish and soft color',
    style: 'dewy',
    occasion: 'everyday',
    difficulty: 'beginner',
    tier: 'FREE',
    sortOrder: 2,
    tags: ['dewy', 'glow', 'hydrated', 'k-beauty'],
    productNames: ['Hydrating Primer', 'Ivory Silk Foundation', 'Champagne Pop', 'Peach Nectar Blush', 'Clear Brow Gel', 'Lengthening Mascara', 'Pink Shimmer Gloss'],
  },
  {
    name: 'Soft Glam Everyday',
    description: 'Elevated everyday look with warm-toned shadows and defined features',
    style: 'soft-glam',
    occasion: 'everyday',
    difficulty: 'intermediate',
    tier: 'FREE',
    sortOrder: 3,
    tags: ['soft-glam', 'warm', 'everyday', 'polished'],
    productNames: ['Shell Beige Foundation', 'Medium Concealer', 'Champagne Toast Shadow', 'Soft Taupe Shadow', 'Classic Black Liner', 'Volumizing Black Mascara', 'Rose Petal Blush', 'Taupe Brow Pencil', 'Rose Pink Lipstick'],
  },

  // ─── Glam / Evening Looks ─────────────────────────────────
  {
    name: 'Classic Hollywood Glam',
    description: 'Old Hollywood glamour with red lips, winged liner, and flawless skin',
    style: 'glam',
    occasion: 'evening',
    difficulty: 'intermediate',
    tier: 'BASIC',
    sortOrder: 4,
    tags: ['hollywood', 'classic', 'red-lip', 'timeless'],
    productNames: ['Sand Foundation', 'Medium Concealer', 'Banana Powder', 'Light Sculpt Contour', 'Champagne Pop', 'Rose Petal Blush', 'Classic Black Liner', 'Full Glam Lashes', 'Volumizing Black Mascara', 'Dark Brown Brow Pencil', 'Classic Red Lipstick', 'Red Lip Liner'],
  },
  {
    name: 'Smoky Eye Siren',
    description: 'Intense smoky eye with dark shadows, dramatic lashes, and nude lip',
    style: 'smoky',
    occasion: 'evening',
    difficulty: 'advanced',
    tier: 'BASIC',
    sortOrder: 5,
    tags: ['smoky', 'dramatic', 'dark', 'sexy'],
    productNames: ['Sand Foundation', 'Medium Concealer', 'Dark Chocolate Shadow', 'Jet Black Shadow', 'Champagne Toast Shadow', 'Classic Black Liner', 'Full Glam Lashes', 'Volumizing Black Mascara', 'Medium Sculpt Contour', 'Nude Flush Blush', 'Dark Brown Brow Pencil', 'Bare Nude Lipstick'],
  },
  {
    name: 'Bronze Goddess',
    description: 'Sun-kissed bronzed look with golden shimmer and warm tones throughout',
    style: 'bronzed',
    occasion: 'evening',
    difficulty: 'intermediate',
    tier: 'BASIC',
    sortOrder: 6,
    tags: ['bronze', 'golden', 'warm', 'sun-kissed'],
    productNames: ['Golden Beige Foundation', 'Golden Tan Bronzer', 'Bronze Goddess Shadow', 'Antique Gold Shadow', 'Bronze Shimmer Liner', 'Volumizing Black Mascara', 'Bronze Goddess', 'Coral Reef Blush', 'Soft Brown Brow Pencil', 'Coral Lipstick'],
  },

  // ─── Bridal Looks ─────────────────────────────────────────
  {
    name: 'Classic Bridal',
    description: 'Timeless, photograph-ready bridal makeup with soft definition and lasting finish',
    style: 'bridal',
    occasion: 'wedding',
    difficulty: 'advanced',
    tier: 'PREMIUM',
    sortOrder: 7,
    tags: ['bridal', 'wedding', 'timeless', 'long-lasting'],
    productNames: ['Mattifying Primer', 'Shell Beige Foundation', 'Fair Concealer', 'Banana Powder', 'Light Sculpt Contour', 'Champagne Pop', 'Rose Petal Blush', 'Champagne Toast Shadow', 'Dusty Rose Shadow', 'Soft Brown Liner', 'Cat Eye Lashes', 'Lengthening Mascara', 'Taupe Brow Pencil', 'Dusty Rose Lipstick', 'Pink Lip Liner'],
  },
  {
    name: 'Romantic Bridal',
    description: 'Soft, romantic look with pink and rose tones for a dreamy bridal glow',
    style: 'bridal',
    occasion: 'wedding',
    difficulty: 'advanced',
    tier: 'PREMIUM',
    sortOrder: 8,
    tags: ['bridal', 'romantic', 'pink', 'dreamy'],
    productNames: ['Hydrating Primer', 'Ivory Silk Foundation', 'Fair Concealer', 'Rose Gold Gleam', 'Baby Pink Blush', 'Dusty Rose Shadow', 'Champagne Toast Shadow', 'Soft Brown Liner', 'Natural Wispy Lashes', 'Lengthening Mascara', 'Taupe Brow Pencil', 'Baby Pink Lipstick', 'Pink Lip Liner'],
  },

  // ─── K-Beauty / Asian Beauty Looks ────────────────────────
  {
    name: 'Korean Glass Skin',
    description: 'Ultra-dewy glass skin with gradient lip and straight brows - the K-beauty signature',
    style: 'k-beauty',
    occasion: 'everyday',
    difficulty: 'intermediate',
    tier: 'BASIC',
    sortOrder: 9,
    tags: ['k-beauty', 'glass-skin', 'dewy', 'gradient-lip'],
    productNames: ['Hydrating Primer', 'Porcelain Glow Foundation', 'Moonstone Glow', 'Strawberry Cream Blush', 'Vanilla Cream Shadow', 'Lengthening Mascara', 'Taupe Brow Pencil', 'Cherry Stain'],
  },
  {
    name: 'Douyin Glam',
    description: 'Chinese social media-inspired makeup with bold defined eyes and contour',
    style: 'douyin',
    occasion: 'evening',
    difficulty: 'advanced',
    tier: 'PREMIUM',
    sortOrder: 10,
    tags: ['douyin', 'chinese-beauty', 'contour', 'bold-eyes'],
    productNames: ['Pore-Minimizing Primer', 'Shell Beige Foundation', 'Light Concealer', 'Light Sculpt Contour', 'Champagne Pop', 'Warm Brown Shadow', 'Dark Chocolate Shadow', 'Classic Black Liner', 'Cat Eye Lashes', 'Volumizing Black Mascara', 'Charcoal Brow Pencil', 'Ruby Red Lipstick'],
  },

  // ─── Editorial / Bold Looks ───────────────────────────────
  {
    name: 'Editorial Neon',
    description: 'Fashion-forward editorial look with unexpected pops of bold color',
    style: 'editorial',
    occasion: 'photoshoot',
    difficulty: 'advanced',
    tier: 'PREMIUM',
    sortOrder: 11,
    tags: ['editorial', 'bold', 'neon', 'fashion'],
    productNames: ['Illuminating Primer', 'Natural Buff Foundation', 'Electric Violet Shadow', 'Hot Pink Shadow', 'Classic Black Liner', 'Full Glam Lashes', 'Volumizing Black Mascara', 'Holographic Prism', 'Charcoal Brow Pencil', 'Fuchsia Lipstick'],
  },
  {
    name: 'Monochromatic Rose',
    description: 'Cohesive look using the same rose tone across eyes, cheeks, and lips',
    style: 'monochromatic',
    occasion: 'everyday',
    difficulty: 'beginner',
    tier: 'FREE',
    sortOrder: 12,
    tags: ['monochromatic', 'rose', 'cohesive', 'easy'],
    productNames: ['Natural Buff Foundation', 'Dusty Rose Shadow', 'Rose Petal Blush', 'Lengthening Mascara', 'Soft Brown Brow Pencil', 'Dusty Rose Lipstick'],
  },

  // ─── Seasonal / Occasion Looks ────────────────────────────
  {
    name: 'Autumn Warmth',
    description: 'Warm, earthy tones perfect for fall with rich browns and berry accents',
    style: 'seasonal',
    occasion: 'everyday',
    difficulty: 'intermediate',
    tier: 'BASIC',
    sortOrder: 13,
    tags: ['autumn', 'fall', 'warm', 'earthy'],
    productNames: ['Caramel Foundation', 'Golden Tan Bronzer', 'Warm Brown Shadow', 'Copper Penny Shadow', 'Soft Brown Liner', 'Volumizing Black Mascara', 'Terracotta Blush', 'Dark Brown Brow Pencil', 'Brick Red Lipstick'],
  },
  {
    name: 'Summer Glow',
    description: 'Sun-drenched look with bronzed skin, coral cheeks, and fruity lips',
    style: 'seasonal',
    occasion: 'everyday',
    difficulty: 'beginner',
    tier: 'FREE',
    sortOrder: 14,
    tags: ['summer', 'glow', 'coral', 'fresh'],
    productNames: ['Hydrating Primer', 'Golden Beige Foundation', 'Sun-Kissed Light Bronzer', 'Champagne Pop', 'Coral Reef Blush', 'Champagne Toast Shadow', 'Natural Brown Mascara', 'Clear Brow Gel', 'Coral Lipstick'],
  },
  {
    name: 'Date Night Sultry',
    description: 'Seductive evening look with smoky eyes, defined features, and berry lip',
    style: 'glam',
    occasion: 'date-night',
    difficulty: 'intermediate',
    tier: 'BASIC',
    sortOrder: 15,
    tags: ['date-night', 'sultry', 'evening', 'berry'],
    productNames: ['Mattifying Primer', 'Sand Foundation', 'Medium Concealer', 'Medium Sculpt Contour', 'Rose Gold Gleam', 'Plum Velvet Shadow', 'Champagne Toast Shadow', 'Classic Black Liner', 'Cat Eye Lashes', 'Volumizing Black Mascara', 'Mauve Dream Blush', 'Dark Brown Brow Pencil', 'Berry Lipstick', 'Berry Lip Liner'],
  },
  {
    name: 'Office Professional',
    description: 'Polished, workplace-appropriate look with subtle definition',
    style: 'natural',
    occasion: 'work',
    difficulty: 'beginner',
    tier: 'FREE',
    sortOrder: 16,
    tags: ['professional', 'office', 'polished', 'subtle'],
    productNames: ['Mattifying Primer', 'Natural Buff Foundation', 'Light Concealer', 'Translucent Setting Powder', 'Soft Taupe Shadow', 'Soft Brown Liner', 'Lengthening Mascara', 'Peach Nectar Blush', 'Taupe Brow Pencil', 'Mauve Nude Lipstick'],
  },
];
