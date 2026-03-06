import { MakeupCategory, SubscriptionTier } from '@prisma/client';

type ProductSeed = {
  category: MakeupCategory;
  subcategory: string;
  name: string;
  description: string;
  colorHex: string;
  colorName: string;
  finish: string;
  intensity: string;
  tier: SubscriptionTier;
  sortOrder: number;
  tags: string[];
};

export const makeupProducts: ProductSeed[] = [
  // ═══════════════════════════════════════════════════════════
  // FACE - Foundation
  // ═══════════════════════════════════════════════════════════
  { category: 'FACE', subcategory: 'foundation', name: 'Porcelain Glow Foundation', description: 'Ultra-light coverage foundation for very fair skin with pink undertones', colorHex: '#F5E0D0', colorName: 'Porcelain', finish: 'dewy', intensity: 'light', tier: 'FREE', sortOrder: 1, tags: ['fair', 'cool-undertone', 'lightweight'] },
  { category: 'FACE', subcategory: 'foundation', name: 'Ivory Silk Foundation', description: 'Light coverage foundation for fair skin with neutral undertones', colorHex: '#F2DDC9', colorName: 'Ivory', finish: 'satin', intensity: 'light', tier: 'FREE', sortOrder: 2, tags: ['fair', 'neutral-undertone'] },
  { category: 'FACE', subcategory: 'foundation', name: 'Shell Beige Foundation', description: 'Medium coverage for light skin with warm undertones', colorHex: '#EDCFB5', colorName: 'Shell', finish: 'matte', intensity: 'medium', tier: 'FREE', sortOrder: 3, tags: ['light', 'warm-undertone'] },
  { category: 'FACE', subcategory: 'foundation', name: 'Natural Buff Foundation', description: 'Buildable coverage for light-medium skin', colorHex: '#E3C19C', colorName: 'Buff', finish: 'satin', intensity: 'medium', tier: 'FREE', sortOrder: 4, tags: ['light-medium', 'neutral-undertone'] },
  { category: 'FACE', subcategory: 'foundation', name: 'Sand Foundation', description: 'Full coverage for medium skin with warm undertones', colorHex: '#D4A574', colorName: 'Sand', finish: 'matte', intensity: 'full', tier: 'FREE', sortOrder: 5, tags: ['medium', 'warm-undertone'] },
  { category: 'FACE', subcategory: 'foundation', name: 'Golden Beige Foundation', description: 'Medium coverage for medium skin with golden undertones', colorHex: '#C9985A', colorName: 'Golden Beige', finish: 'dewy', intensity: 'medium', tier: 'BASIC', sortOrder: 6, tags: ['medium', 'warm-undertone', 'golden'] },
  { category: 'FACE', subcategory: 'foundation', name: 'Olive Foundation', description: 'Full coverage for olive skin tones', colorHex: '#B89460', colorName: 'Olive', finish: 'satin', intensity: 'full', tier: 'BASIC', sortOrder: 7, tags: ['olive', 'neutral-undertone'] },
  { category: 'FACE', subcategory: 'foundation', name: 'Caramel Foundation', description: 'Rich coverage for medium-tan skin', colorHex: '#A67B4B', colorName: 'Caramel', finish: 'matte', intensity: 'full', tier: 'FREE', sortOrder: 8, tags: ['medium-tan', 'warm-undertone'] },
  { category: 'FACE', subcategory: 'foundation', name: 'Toffee Foundation', description: 'Buildable coverage for tan skin', colorHex: '#8B6914', colorName: 'Toffee', finish: 'dewy', intensity: 'medium', tier: 'BASIC', sortOrder: 9, tags: ['tan', 'warm-undertone'] },
  { category: 'FACE', subcategory: 'foundation', name: 'Chestnut Foundation', description: 'Full coverage for deep skin with warm undertones', colorHex: '#6B4226', colorName: 'Chestnut', finish: 'satin', intensity: 'full', tier: 'FREE', sortOrder: 10, tags: ['deep', 'warm-undertone'] },
  { category: 'FACE', subcategory: 'foundation', name: 'Espresso Foundation', description: 'Rich coverage for very deep skin', colorHex: '#4A2C17', colorName: 'Espresso', finish: 'matte', intensity: 'full', tier: 'FREE', sortOrder: 11, tags: ['very-deep', 'neutral-undertone'] },
  { category: 'FACE', subcategory: 'foundation', name: 'Mahogany Foundation', description: 'Deep coverage with cool red undertones', colorHex: '#5C3A2E', colorName: 'Mahogany', finish: 'dewy', intensity: 'full', tier: 'BASIC', sortOrder: 12, tags: ['deep', 'cool-undertone'] },

  // ═══════════════════════════════════════════════════════════
  // FACE - Concealer
  // ═══════════════════════════════════════════════════════════
  { category: 'FACE', subcategory: 'concealer', name: 'Fair Concealer', description: 'Brightening concealer for under-eye circles on fair skin', colorHex: '#F7E5D6', colorName: 'Fair', finish: 'satin', intensity: 'full', tier: 'FREE', sortOrder: 1, tags: ['fair', 'brightening'] },
  { category: 'FACE', subcategory: 'concealer', name: 'Light Concealer', description: 'Natural concealer for light skin tones', colorHex: '#EEDCC4', colorName: 'Light', finish: 'satin', intensity: 'medium', tier: 'FREE', sortOrder: 2, tags: ['light', 'natural'] },
  { category: 'FACE', subcategory: 'concealer', name: 'Medium Concealer', description: 'Full coverage concealer for medium skin', colorHex: '#D4AE80', colorName: 'Medium', finish: 'matte', intensity: 'full', tier: 'FREE', sortOrder: 3, tags: ['medium'] },
  { category: 'FACE', subcategory: 'concealer', name: 'Tan Concealer', description: 'Buildable coverage concealer for tan skin', colorHex: '#B38B5E', colorName: 'Tan', finish: 'satin', intensity: 'medium', tier: 'FREE', sortOrder: 4, tags: ['tan'] },
  { category: 'FACE', subcategory: 'concealer', name: 'Deep Concealer', description: 'Rich coverage concealer for deep skin tones', colorHex: '#7A5230', colorName: 'Deep', finish: 'satin', intensity: 'full', tier: 'FREE', sortOrder: 5, tags: ['deep'] },
  { category: 'FACE', subcategory: 'concealer', name: 'Peach Corrector', description: 'Color-correcting concealer to neutralize dark circles', colorHex: '#FFCBA4', colorName: 'Peach', finish: 'satin', intensity: 'medium', tier: 'BASIC', sortOrder: 6, tags: ['color-corrector', 'dark-circles'] },
  { category: 'FACE', subcategory: 'concealer', name: 'Green Corrector', description: 'Color-correcting concealer to neutralize redness', colorHex: '#98D4A2', colorName: 'Green', finish: 'satin', intensity: 'light', tier: 'BASIC', sortOrder: 7, tags: ['color-corrector', 'redness'] },
  { category: 'FACE', subcategory: 'concealer', name: 'Lavender Corrector', description: 'Color-correcting concealer to brighten sallow skin', colorHex: '#C8A2C8', colorName: 'Lavender', finish: 'satin', intensity: 'light', tier: 'PREMIUM', sortOrder: 8, tags: ['color-corrector', 'brightening'] },

  // ═══════════════════════════════════════════════════════════
  // FACE - Contour
  // ═══════════════════════════════════════════════════════════
  { category: 'FACE', subcategory: 'contour', name: 'Light Sculpt Contour', description: 'Subtle contour shade for fair to light skin', colorHex: '#C4956A', colorName: 'Light Sculpt', finish: 'matte', intensity: 'light', tier: 'BASIC', sortOrder: 1, tags: ['fair', 'light', 'sculpting'] },
  { category: 'FACE', subcategory: 'contour', name: 'Medium Sculpt Contour', description: 'Natural contour shade for medium skin tones', colorHex: '#A0724E', colorName: 'Medium Sculpt', finish: 'matte', intensity: 'medium', tier: 'BASIC', sortOrder: 2, tags: ['medium', 'sculpting'] },
  { category: 'FACE', subcategory: 'contour', name: 'Deep Sculpt Contour', description: 'Rich contour shade for deep skin tones', colorHex: '#6B4226', colorName: 'Deep Sculpt', finish: 'matte', intensity: 'full', tier: 'BASIC', sortOrder: 3, tags: ['deep', 'sculpting'] },
  { category: 'FACE', subcategory: 'contour', name: 'Cool Contour', description: 'Cool-toned contour for chiseled look', colorHex: '#9E7B5E', colorName: 'Cool Contour', finish: 'matte', intensity: 'medium', tier: 'PREMIUM', sortOrder: 4, tags: ['cool-tone', 'chiseled'] },

  // ═══════════════════════════════════════════════════════════
  // FACE - Highlighter
  // ═══════════════════════════════════════════════════════════
  { category: 'FACE', subcategory: 'highlighter', name: 'Champagne Pop', description: 'Warm champagne glow highlight', colorHex: '#F5E1C8', colorName: 'Champagne', finish: 'shimmer', intensity: 'medium', tier: 'FREE', sortOrder: 1, tags: ['warm', 'glow', 'popular'] },
  { category: 'FACE', subcategory: 'highlighter', name: 'Moonstone Glow', description: 'Cool-toned icy highlight', colorHex: '#E8E4F0', colorName: 'Moonstone', finish: 'shimmer', intensity: 'medium', tier: 'FREE', sortOrder: 2, tags: ['cool', 'icy'] },
  { category: 'FACE', subcategory: 'highlighter', name: 'Rose Gold Gleam', description: 'Pink-gold luminous highlight', colorHex: '#E8C4B8', colorName: 'Rose Gold', finish: 'shimmer', intensity: 'medium', tier: 'BASIC', sortOrder: 3, tags: ['rose-gold', 'luminous'] },
  { category: 'FACE', subcategory: 'highlighter', name: 'Bronze Goddess', description: 'Deep golden bronze highlight for medium-deep skin', colorHex: '#C49A6C', colorName: 'Bronze', finish: 'shimmer', intensity: 'full', tier: 'BASIC', sortOrder: 4, tags: ['bronze', 'deep-skin'] },
  { category: 'FACE', subcategory: 'highlighter', name: 'Holographic Prism', description: 'Multi-dimensional holographic highlight', colorHex: '#D4C4E8', colorName: 'Holographic', finish: 'glitter', intensity: 'full', tier: 'PREMIUM', sortOrder: 5, tags: ['holographic', 'editorial', 'bold'] },
  { category: 'FACE', subcategory: 'highlighter', name: 'Copper Glow', description: 'Warm copper highlight perfect for deep skin', colorHex: '#B87333', colorName: 'Copper', finish: 'shimmer', intensity: 'medium', tier: 'BASIC', sortOrder: 6, tags: ['copper', 'warm', 'deep-skin'] },

  // ═══════════════════════════════════════════════════════════
  // FACE - Bronzer
  // ═══════════════════════════════════════════════════════════
  { category: 'FACE', subcategory: 'bronzer', name: 'Sun-Kissed Light Bronzer', description: 'Sheer warmth for fair skin', colorHex: '#D4A76A', colorName: 'Sun-Kissed', finish: 'matte', intensity: 'light', tier: 'FREE', sortOrder: 1, tags: ['fair', 'natural'] },
  { category: 'FACE', subcategory: 'bronzer', name: 'Golden Tan Bronzer', description: 'Medium warmth bronzer with golden tones', colorHex: '#C08B3E', colorName: 'Golden Tan', finish: 'satin', intensity: 'medium', tier: 'FREE', sortOrder: 2, tags: ['medium', 'golden'] },
  { category: 'FACE', subcategory: 'bronzer', name: 'Deep Sun Bronzer', description: 'Rich bronze for deep skin tones', colorHex: '#8B5A2B', colorName: 'Deep Sun', finish: 'matte', intensity: 'full', tier: 'BASIC', sortOrder: 3, tags: ['deep', 'rich'] },
  { category: 'FACE', subcategory: 'bronzer', name: 'Shimmer Bronze', description: 'Luminous bronzer with shimmer finish', colorHex: '#CD8C3C', colorName: 'Shimmer Bronze', finish: 'shimmer', intensity: 'medium', tier: 'BASIC', sortOrder: 4, tags: ['shimmer', 'luminous'] },

  // ═══════════════════════════════════════════════════════════
  // FACE - Setting Powder
  // ═══════════════════════════════════════════════════════════
  { category: 'FACE', subcategory: 'setting_powder', name: 'Translucent Setting Powder', description: 'Universal translucent powder for all skin tones', colorHex: '#FFF8F0', colorName: 'Translucent', finish: 'matte', intensity: 'light', tier: 'FREE', sortOrder: 1, tags: ['universal', 'oil-control'] },
  { category: 'FACE', subcategory: 'setting_powder', name: 'Banana Powder', description: 'Yellow-toned setting powder for brightening', colorHex: '#F5E6B8', colorName: 'Banana', finish: 'matte', intensity: 'light', tier: 'BASIC', sortOrder: 2, tags: ['brightening', 'baking'] },
  { category: 'FACE', subcategory: 'setting_powder', name: 'Deep Setting Powder', description: 'Rich-toned powder for deep skin without white cast', colorHex: '#C4946C', colorName: 'Rich Cocoa', finish: 'matte', intensity: 'medium', tier: 'BASIC', sortOrder: 3, tags: ['deep-skin', 'no-white-cast'] },

  // ═══════════════════════════════════════════════════════════
  // FACE - Primer
  // ═══════════════════════════════════════════════════════════
  { category: 'FACE', subcategory: 'primer', name: 'Hydrating Primer', description: 'Moisturizing primer for dry skin creating a dewy base', colorHex: '#F0E8E0', colorName: 'Clear Hydrate', finish: 'dewy', intensity: 'light', tier: 'FREE', sortOrder: 1, tags: ['hydrating', 'dry-skin', 'dewy'] },
  { category: 'FACE', subcategory: 'primer', name: 'Mattifying Primer', description: 'Oil-control primer for shine-free base', colorHex: '#F5F0E8', colorName: 'Matte Base', finish: 'matte', intensity: 'light', tier: 'FREE', sortOrder: 2, tags: ['mattifying', 'oily-skin', 'oil-control'] },
  { category: 'FACE', subcategory: 'primer', name: 'Pore-Minimizing Primer', description: 'Smoothing primer that blurs pores', colorHex: '#F2EDE6', colorName: 'Smooth Silk', finish: 'satin', intensity: 'light', tier: 'BASIC', sortOrder: 3, tags: ['pore-minimizing', 'smoothing'] },
  { category: 'FACE', subcategory: 'primer', name: 'Illuminating Primer', description: 'Radiance-boosting primer with light-reflecting pigments', colorHex: '#FAE8DA', colorName: 'Radiance', finish: 'shimmer', intensity: 'light', tier: 'BASIC', sortOrder: 4, tags: ['illuminating', 'radiance', 'glow'] },

  // ═══════════════════════════════════════════════════════════
  // CHEEKS - Blush
  // ═══════════════════════════════════════════════════════════
  { category: 'CHEEKS', subcategory: 'blush', name: 'Baby Pink Blush', description: 'Soft pastel pink for a youthful flush', colorHex: '#FFB6C1', colorName: 'Baby Pink', finish: 'matte', intensity: 'light', tier: 'FREE', sortOrder: 1, tags: ['pink', 'soft', 'everyday'] },
  { category: 'CHEEKS', subcategory: 'blush', name: 'Peach Nectar Blush', description: 'Warm peachy tone for a sun-kissed glow', colorHex: '#FFDAB9', colorName: 'Peach Nectar', finish: 'satin', intensity: 'light', tier: 'FREE', sortOrder: 2, tags: ['peach', 'warm', 'natural'] },
  { category: 'CHEEKS', subcategory: 'blush', name: 'Rose Petal Blush', description: 'Classic rosy pink blush', colorHex: '#E8919E', colorName: 'Rose Petal', finish: 'satin', intensity: 'medium', tier: 'FREE', sortOrder: 3, tags: ['rose', 'classic', 'romantic'] },
  { category: 'CHEEKS', subcategory: 'blush', name: 'Coral Reef Blush', description: 'Vibrant coral for a pop of warmth', colorHex: '#FF7F50', colorName: 'Coral Reef', finish: 'satin', intensity: 'medium', tier: 'FREE', sortOrder: 4, tags: ['coral', 'warm', 'summer'] },
  { category: 'CHEEKS', subcategory: 'blush', name: 'Mauve Dream Blush', description: 'Cool-toned mauve for sophisticated look', colorHex: '#C9A0DC', colorName: 'Mauve Dream', finish: 'matte', intensity: 'medium', tier: 'BASIC', sortOrder: 5, tags: ['mauve', 'cool-tone', 'sophisticated'] },
  { category: 'CHEEKS', subcategory: 'blush', name: 'Berry Bliss Blush', description: 'Deep berry tone for dramatic cheek color', colorHex: '#8B2252', colorName: 'Berry Bliss', finish: 'matte', intensity: 'full', tier: 'BASIC', sortOrder: 6, tags: ['berry', 'dramatic', 'bold'] },
  { category: 'CHEEKS', subcategory: 'blush', name: 'Sunset Glow Blush', description: 'Warm orange-pink with shimmer', colorHex: '#FF8C69', colorName: 'Sunset Glow', finish: 'shimmer', intensity: 'medium', tier: 'BASIC', sortOrder: 7, tags: ['sunset', 'shimmer', 'warm'] },
  { category: 'CHEEKS', subcategory: 'blush', name: 'Plum Wine Blush', description: 'Rich plum shade for evening looks', colorHex: '#722F37', colorName: 'Plum Wine', finish: 'matte', intensity: 'full', tier: 'PREMIUM', sortOrder: 8, tags: ['plum', 'evening', 'bold'] },
  { category: 'CHEEKS', subcategory: 'blush', name: 'Strawberry Cream Blush', description: 'Creamy strawberry pink for dewy finish', colorHex: '#FC5A8D', colorName: 'Strawberry', finish: 'dewy', intensity: 'medium', tier: 'FREE', sortOrder: 9, tags: ['strawberry', 'cream', 'k-beauty'] },
  { category: 'CHEEKS', subcategory: 'blush', name: 'Nude Flush Blush', description: 'Barely-there nude blush for no-makeup looks', colorHex: '#DCB9A0', colorName: 'Nude Flush', finish: 'satin', intensity: 'light', tier: 'FREE', sortOrder: 10, tags: ['nude', 'natural', 'minimal'] },
  { category: 'CHEEKS', subcategory: 'blush', name: 'Terracotta Blush', description: 'Earthy terracotta for warm-toned skin', colorHex: '#C86B3A', colorName: 'Terracotta', finish: 'matte', intensity: 'medium', tier: 'BASIC', sortOrder: 11, tags: ['terracotta', 'earthy', 'warm'] },
  { category: 'CHEEKS', subcategory: 'blush', name: 'Cherry Blossom Blush', description: 'Delicate cherry blossom pink', colorHex: '#FFB7C5', colorName: 'Cherry Blossom', finish: 'dewy', intensity: 'light', tier: 'PREMIUM', sortOrder: 12, tags: ['cherry-blossom', 'delicate', 'spring'] },

  // ═══════════════════════════════════════════════════════════
  // EYES - Eyeshadow
  // ═══════════════════════════════════════════════════════════
  // Neutral/Everyday
  { category: 'EYES', subcategory: 'eyeshadow', name: 'Vanilla Cream Shadow', description: 'Light cream base shade', colorHex: '#F5E6D0', colorName: 'Vanilla Cream', finish: 'matte', intensity: 'light', tier: 'FREE', sortOrder: 1, tags: ['neutral', 'base', 'everyday'] },
  { category: 'EYES', subcategory: 'eyeshadow', name: 'Soft Taupe Shadow', description: 'Everyday neutral taupe', colorHex: '#B8A088', colorName: 'Soft Taupe', finish: 'matte', intensity: 'medium', tier: 'FREE', sortOrder: 2, tags: ['neutral', 'taupe', 'everyday'] },
  { category: 'EYES', subcategory: 'eyeshadow', name: 'Warm Brown Shadow', description: 'Rich warm brown for crease definition', colorHex: '#8B6914', colorName: 'Warm Brown', finish: 'matte', intensity: 'medium', tier: 'FREE', sortOrder: 3, tags: ['brown', 'warm', 'crease'] },
  { category: 'EYES', subcategory: 'eyeshadow', name: 'Dark Chocolate Shadow', description: 'Deep chocolate brown for smoky definition', colorHex: '#3C1F0C', colorName: 'Dark Chocolate', finish: 'matte', intensity: 'full', tier: 'FREE', sortOrder: 4, tags: ['brown', 'dark', 'smoky'] },
  { category: 'EYES', subcategory: 'eyeshadow', name: 'Champagne Toast Shadow', description: 'Shimmering champagne for lid highlights', colorHex: '#F5DEB3', colorName: 'Champagne Toast', finish: 'shimmer', intensity: 'medium', tier: 'FREE', sortOrder: 5, tags: ['champagne', 'shimmer', 'highlight'] },
  { category: 'EYES', subcategory: 'eyeshadow', name: 'Antique Gold Shadow', description: 'Rich antique gold with shimmer', colorHex: '#C5A03C', colorName: 'Antique Gold', finish: 'shimmer', intensity: 'medium', tier: 'BASIC', sortOrder: 6, tags: ['gold', 'shimmer', 'warm'] },
  { category: 'EYES', subcategory: 'eyeshadow', name: 'Bronze Goddess Shadow', description: 'Warm bronze with metallic finish', colorHex: '#A67B3D', colorName: 'Bronze Goddess', finish: 'metallic', intensity: 'full', tier: 'BASIC', sortOrder: 7, tags: ['bronze', 'metallic', 'warm'] },
  { category: 'EYES', subcategory: 'eyeshadow', name: 'Copper Penny Shadow', description: 'Stunning copper with metallic sheen', colorHex: '#B87333', colorName: 'Copper Penny', finish: 'metallic', intensity: 'medium', tier: 'BASIC', sortOrder: 8, tags: ['copper', 'metallic'] },

  // Cool Tones
  { category: 'EYES', subcategory: 'eyeshadow', name: 'Dusty Rose Shadow', description: 'Soft mauve-pink for romantic looks', colorHex: '#C4918A', colorName: 'Dusty Rose', finish: 'matte', intensity: 'medium', tier: 'FREE', sortOrder: 9, tags: ['rose', 'romantic', 'cool'] },
  { category: 'EYES', subcategory: 'eyeshadow', name: 'Plum Velvet Shadow', description: 'Deep plum for smoky eyes', colorHex: '#5D3954', colorName: 'Plum Velvet', finish: 'matte', intensity: 'full', tier: 'BASIC', sortOrder: 10, tags: ['plum', 'smoky', 'dramatic'] },
  { category: 'EYES', subcategory: 'eyeshadow', name: 'Midnight Navy Shadow', description: 'Deep navy blue for dramatic looks', colorHex: '#191970', colorName: 'Midnight Navy', finish: 'matte', intensity: 'full', tier: 'BASIC', sortOrder: 11, tags: ['navy', 'dramatic', 'evening'] },
  { category: 'EYES', subcategory: 'eyeshadow', name: 'Ocean Sapphire Shadow', description: 'Vibrant sapphire blue with shimmer', colorHex: '#1560BD', colorName: 'Ocean Sapphire', finish: 'shimmer', intensity: 'full', tier: 'PREMIUM', sortOrder: 12, tags: ['blue', 'sapphire', 'shimmer'] },
  { category: 'EYES', subcategory: 'eyeshadow', name: 'Forest Emerald Shadow', description: 'Rich emerald green shimmer', colorHex: '#006B3C', colorName: 'Forest Emerald', finish: 'shimmer', intensity: 'full', tier: 'PREMIUM', sortOrder: 13, tags: ['green', 'emerald', 'jewel-tone'] },
  { category: 'EYES', subcategory: 'eyeshadow', name: 'Silver Frost Shadow', description: 'Icy silver metallic shadow', colorHex: '#C4C4C4', colorName: 'Silver Frost', finish: 'metallic', intensity: 'medium', tier: 'BASIC', sortOrder: 14, tags: ['silver', 'metallic', 'cool'] },

  // Bold/Editorial
  { category: 'EYES', subcategory: 'eyeshadow', name: 'Electric Violet Shadow', description: 'Vivid violet for bold editorial looks', colorHex: '#8F00FF', colorName: 'Electric Violet', finish: 'matte', intensity: 'full', tier: 'PREMIUM', sortOrder: 15, tags: ['violet', 'bold', 'editorial'] },
  { category: 'EYES', subcategory: 'eyeshadow', name: 'Hot Pink Shadow', description: 'Bright fuchsia pink', colorHex: '#FF69B4', colorName: 'Hot Pink', finish: 'matte', intensity: 'full', tier: 'PREMIUM', sortOrder: 16, tags: ['pink', 'bold', 'fun'] },
  { category: 'EYES', subcategory: 'eyeshadow', name: 'Sunset Orange Shadow', description: 'Warm sunset orange', colorHex: '#FF6347', colorName: 'Sunset Orange', finish: 'matte', intensity: 'full', tier: 'PREMIUM', sortOrder: 17, tags: ['orange', 'warm', 'sunset'] },
  { category: 'EYES', subcategory: 'eyeshadow', name: 'Jet Black Shadow', description: 'Intense black for smoky eyes', colorHex: '#0A0A0A', colorName: 'Jet Black', finish: 'matte', intensity: 'full', tier: 'FREE', sortOrder: 18, tags: ['black', 'smoky', 'dramatic'] },
  { category: 'EYES', subcategory: 'eyeshadow', name: 'Holographic Opal Shadow', description: 'Multi-chrome opalescent shadow', colorHex: '#E0D8F0', colorName: 'Holographic Opal', finish: 'glitter', intensity: 'full', tier: 'PREMIUM', sortOrder: 19, tags: ['holographic', 'opal', 'multi-chrome'] },
  { category: 'EYES', subcategory: 'eyeshadow', name: 'Glitter Bomb Shadow', description: 'Heavy glitter topper for party looks', colorHex: '#FFD700', colorName: 'Gold Glitter', finish: 'glitter', intensity: 'full', tier: 'PREMIUM', sortOrder: 20, tags: ['glitter', 'party', 'bold'] },

  // ═══════════════════════════════════════════════════════════
  // EYES - Eyeliner
  // ═══════════════════════════════════════════════════════════
  { category: 'EYES', subcategory: 'eyeliner', name: 'Classic Black Liner', description: 'Precise black liquid liner for classic looks', colorHex: '#000000', colorName: 'Jet Black', finish: 'matte', intensity: 'full', tier: 'FREE', sortOrder: 1, tags: ['black', 'classic', 'precise'] },
  { category: 'EYES', subcategory: 'eyeliner', name: 'Soft Brown Liner', description: 'Brown pencil liner for subtle definition', colorHex: '#5C4033', colorName: 'Soft Brown', finish: 'matte', intensity: 'medium', tier: 'FREE', sortOrder: 2, tags: ['brown', 'soft', 'natural'] },
  { category: 'EYES', subcategory: 'eyeliner', name: 'Navy Liner', description: 'Dark navy liner for a softer alternative to black', colorHex: '#000080', colorName: 'Navy', finish: 'matte', intensity: 'full', tier: 'BASIC', sortOrder: 3, tags: ['navy', 'subtle', 'cool'] },
  { category: 'EYES', subcategory: 'eyeliner', name: 'White Liner', description: 'Bright white liner for inner waterline brightening', colorHex: '#FFFFFF', colorName: 'Bright White', finish: 'matte', intensity: 'medium', tier: 'FREE', sortOrder: 4, tags: ['white', 'brightening', 'waterline'] },
  { category: 'EYES', subcategory: 'eyeliner', name: 'Emerald Green Liner', description: 'Jewel-toned green liner for colorful looks', colorHex: '#046307', colorName: 'Emerald', finish: 'shimmer', intensity: 'full', tier: 'PREMIUM', sortOrder: 5, tags: ['green', 'jewel-tone', 'colorful'] },
  { category: 'EYES', subcategory: 'eyeliner', name: 'Bronze Shimmer Liner', description: 'Warm bronze with shimmer for smoky definition', colorHex: '#A0764D', colorName: 'Bronze', finish: 'shimmer', intensity: 'medium', tier: 'BASIC', sortOrder: 6, tags: ['bronze', 'shimmer', 'warm'] },
  { category: 'EYES', subcategory: 'eyeliner', name: 'Purple Amethyst Liner', description: 'Rich purple for a pop of color', colorHex: '#6A0DAD', colorName: 'Amethyst', finish: 'matte', intensity: 'full', tier: 'PREMIUM', sortOrder: 7, tags: ['purple', 'bold', 'colorful'] },
  { category: 'EYES', subcategory: 'eyeliner', name: 'Nude Liner', description: 'Nude waterline liner to open up eyes', colorHex: '#F0D5B8', colorName: 'Nude', finish: 'matte', intensity: 'light', tier: 'BASIC', sortOrder: 8, tags: ['nude', 'waterline', 'subtle'] },

  // ═══════════════════════════════════════════════════════════
  // EYES - Mascara
  // ═══════════════════════════════════════════════════════════
  { category: 'EYES', subcategory: 'mascara', name: 'Volumizing Black Mascara', description: 'Thick, voluminous lashes in jet black', colorHex: '#000000', colorName: 'Jet Black', finish: 'matte', intensity: 'full', tier: 'FREE', sortOrder: 1, tags: ['volumizing', 'black', 'dramatic'] },
  { category: 'EYES', subcategory: 'mascara', name: 'Lengthening Mascara', description: 'Ultra-lengthening formula for long, defined lashes', colorHex: '#1A1A1A', colorName: 'Black', finish: 'satin', intensity: 'medium', tier: 'FREE', sortOrder: 2, tags: ['lengthening', 'defined'] },
  { category: 'EYES', subcategory: 'mascara', name: 'Natural Brown Mascara', description: 'Soft brown for natural-looking lash definition', colorHex: '#4A2C17', colorName: 'Brown', finish: 'satin', intensity: 'light', tier: 'FREE', sortOrder: 3, tags: ['brown', 'natural', 'soft'] },
  { category: 'EYES', subcategory: 'mascara', name: 'Curling Mascara', description: 'Curl-lifting formula for lifted lash effect', colorHex: '#0A0A0A', colorName: 'Black', finish: 'satin', intensity: 'medium', tier: 'BASIC', sortOrder: 4, tags: ['curling', 'lifting'] },
  { category: 'EYES', subcategory: 'mascara', name: 'Blue Mascara', description: 'Bold blue mascara for colorful lash looks', colorHex: '#0000CD', colorName: 'Cobalt Blue', finish: 'satin', intensity: 'full', tier: 'PREMIUM', sortOrder: 5, tags: ['blue', 'bold', 'colorful'] },

  // ═══════════════════════════════════════════════════════════
  // EYES - False Lashes
  // ═══════════════════════════════════════════════════════════
  { category: 'EYES', subcategory: 'false_lashes', name: 'Natural Wispy Lashes', description: 'Subtle, wispy false lashes for everyday wear', colorHex: '#1A1A1A', colorName: 'Black', finish: 'matte', intensity: 'light', tier: 'FREE', sortOrder: 1, tags: ['natural', 'wispy', 'everyday'] },
  { category: 'EYES', subcategory: 'false_lashes', name: 'Cat Eye Lashes', description: 'Elongated outer corner lashes for cat eye effect', colorHex: '#0A0A0A', colorName: 'Black', finish: 'matte', intensity: 'medium', tier: 'BASIC', sortOrder: 2, tags: ['cat-eye', 'elongated', 'flirty'] },
  { category: 'EYES', subcategory: 'false_lashes', name: 'Full Glam Lashes', description: 'Thick, dramatic false lashes for full glamour', colorHex: '#000000', colorName: 'Black', finish: 'matte', intensity: 'full', tier: 'BASIC', sortOrder: 3, tags: ['glam', 'dramatic', 'full'] },
  { category: 'EYES', subcategory: 'false_lashes', name: 'Individual Cluster Lashes', description: 'Individual lash clusters for customizable fullness', colorHex: '#1A1A1A', colorName: 'Black', finish: 'matte', intensity: 'medium', tier: 'PREMIUM', sortOrder: 4, tags: ['individual', 'custom', 'cluster'] },

  // ═══════════════════════════════════════════════════════════
  // BROWS - Eyebrows
  // ═══════════════════════════════════════════════════════════
  { category: 'BROWS', subcategory: 'brow_pencil', name: 'Blonde Brow Pencil', description: 'Fine-tipped pencil for light blonde brows', colorHex: '#C4A35A', colorName: 'Blonde', finish: 'matte', intensity: 'light', tier: 'FREE', sortOrder: 1, tags: ['blonde', 'precise'] },
  { category: 'BROWS', subcategory: 'brow_pencil', name: 'Taupe Brow Pencil', description: 'Cool-toned taupe for light brown brows', colorHex: '#8B7B68', colorName: 'Taupe', finish: 'matte', intensity: 'medium', tier: 'FREE', sortOrder: 2, tags: ['taupe', 'cool-tone'] },
  { category: 'BROWS', subcategory: 'brow_pencil', name: 'Soft Brown Brow Pencil', description: 'Warm medium brown brow pencil', colorHex: '#6B4226', colorName: 'Soft Brown', finish: 'matte', intensity: 'medium', tier: 'FREE', sortOrder: 3, tags: ['brown', 'warm'] },
  { category: 'BROWS', subcategory: 'brow_pencil', name: 'Dark Brown Brow Pencil', description: 'Deep brown for defined brows', colorHex: '#3B2412', colorName: 'Dark Brown', finish: 'matte', intensity: 'full', tier: 'FREE', sortOrder: 4, tags: ['dark-brown', 'defined'] },
  { category: 'BROWS', subcategory: 'brow_pencil', name: 'Charcoal Brow Pencil', description: 'Soft black for very dark brows', colorHex: '#2A2A2A', colorName: 'Charcoal', finish: 'matte', intensity: 'full', tier: 'FREE', sortOrder: 5, tags: ['charcoal', 'dark'] },
  { category: 'BROWS', subcategory: 'brow_pencil', name: 'Auburn Brow Pencil', description: 'Red-toned brown for auburn/red hair', colorHex: '#8B4513', colorName: 'Auburn', finish: 'matte', intensity: 'medium', tier: 'BASIC', sortOrder: 6, tags: ['auburn', 'red-tone'] },
  { category: 'BROWS', subcategory: 'brow_gel', name: 'Clear Brow Gel', description: 'Transparent setting gel for natural brow styling', colorHex: '#F0F0F0', colorName: 'Clear', finish: 'satin', intensity: 'light', tier: 'FREE', sortOrder: 7, tags: ['clear', 'natural', 'setting'] },
  { category: 'BROWS', subcategory: 'brow_gel', name: 'Tinted Brown Brow Gel', description: 'Tinted gel for quick, natural brow color', colorHex: '#6B4226', colorName: 'Medium Brown', finish: 'satin', intensity: 'medium', tier: 'BASIC', sortOrder: 8, tags: ['tinted', 'brown', 'quick'] },
  { category: 'BROWS', subcategory: 'brow_pomade', name: 'Dark Brown Brow Pomade', description: 'Creamy pomade for sculpted, bold brows', colorHex: '#3B2412', colorName: 'Dark Brown', finish: 'matte', intensity: 'full', tier: 'BASIC', sortOrder: 9, tags: ['pomade', 'sculpted', 'bold'] },
  { category: 'BROWS', subcategory: 'brow_pomade', name: 'Soap Brows', description: 'Laminated feathered brow effect', colorHex: '#F5F5F5', colorName: 'Clear', finish: 'satin', intensity: 'light', tier: 'PREMIUM', sortOrder: 10, tags: ['soap-brows', 'laminated', 'feathered', 'trending'] },

  // ═══════════════════════════════════════════════════════════
  // LIPS - Lipstick
  // ═══════════════════════════════════════════════════════════
  // Nudes & Neutrals
  { category: 'LIPS', subcategory: 'lipstick', name: 'Bare Nude Lipstick', description: 'Your-lips-but-better nude shade', colorHex: '#C4956A', colorName: 'Bare Nude', finish: 'satin', intensity: 'light', tier: 'FREE', sortOrder: 1, tags: ['nude', 'everyday', 'natural'] },
  { category: 'LIPS', subcategory: 'lipstick', name: 'Honey Nude Lipstick', description: 'Warm honey-toned nude', colorHex: '#D4A574', colorName: 'Honey', finish: 'satin', intensity: 'medium', tier: 'FREE', sortOrder: 2, tags: ['nude', 'honey', 'warm'] },
  { category: 'LIPS', subcategory: 'lipstick', name: 'Mauve Nude Lipstick', description: 'Cool mauve-toned nude', colorHex: '#B08080', colorName: 'Mauve Nude', finish: 'matte', intensity: 'medium', tier: 'FREE', sortOrder: 3, tags: ['nude', 'mauve', 'cool'] },
  { category: 'LIPS', subcategory: 'lipstick', name: 'Mocha Lipstick', description: 'Rich brown nude for deeper skin', colorHex: '#8B6347', colorName: 'Mocha', finish: 'satin', intensity: 'medium', tier: 'BASIC', sortOrder: 4, tags: ['nude', 'mocha', 'deep-skin'] },

  // Pinks
  { category: 'LIPS', subcategory: 'lipstick', name: 'Baby Pink Lipstick', description: 'Soft pastel pink lip color', colorHex: '#FFB6C1', colorName: 'Baby Pink', finish: 'satin', intensity: 'light', tier: 'FREE', sortOrder: 5, tags: ['pink', 'pastel', 'soft'] },
  { category: 'LIPS', subcategory: 'lipstick', name: 'Rose Pink Lipstick', description: 'Classic rosy pink', colorHex: '#E75480', colorName: 'Rose Pink', finish: 'satin', intensity: 'medium', tier: 'FREE', sortOrder: 6, tags: ['pink', 'rose', 'classic'] },
  { category: 'LIPS', subcategory: 'lipstick', name: 'Hot Pink Lipstick', description: 'Bold, vivid hot pink', colorHex: '#FF1493', colorName: 'Hot Pink', finish: 'matte', intensity: 'full', tier: 'BASIC', sortOrder: 7, tags: ['pink', 'bold', 'vivid'] },
  { category: 'LIPS', subcategory: 'lipstick', name: 'Fuchsia Lipstick', description: 'Bright fuchsia statement lip', colorHex: '#FF00FF', colorName: 'Fuchsia', finish: 'matte', intensity: 'full', tier: 'PREMIUM', sortOrder: 8, tags: ['fuchsia', 'bold', 'statement'] },
  { category: 'LIPS', subcategory: 'lipstick', name: 'Dusty Rose Lipstick', description: 'Muted dusty rose with matte finish', colorHex: '#C08081', colorName: 'Dusty Rose', finish: 'matte', intensity: 'medium', tier: 'FREE', sortOrder: 9, tags: ['dusty-rose', 'muted', 'everyday'] },

  // Reds
  { category: 'LIPS', subcategory: 'lipstick', name: 'Classic Red Lipstick', description: 'Timeless true red - a universal classic', colorHex: '#FF0000', colorName: 'Classic Red', finish: 'satin', intensity: 'full', tier: 'FREE', sortOrder: 10, tags: ['red', 'classic', 'timeless'] },
  { category: 'LIPS', subcategory: 'lipstick', name: 'Ruby Red Lipstick', description: 'Deep ruby red with blue undertones', colorHex: '#9B111E', colorName: 'Ruby Red', finish: 'matte', intensity: 'full', tier: 'FREE', sortOrder: 11, tags: ['red', 'ruby', 'cool'] },
  { category: 'LIPS', subcategory: 'lipstick', name: 'Cherry Red Lipstick', description: 'Bright cherry red with warm undertones', colorHex: '#DE3163', colorName: 'Cherry Red', finish: 'satin', intensity: 'full', tier: 'BASIC', sortOrder: 12, tags: ['red', 'cherry', 'warm'] },
  { category: 'LIPS', subcategory: 'lipstick', name: 'Brick Red Lipstick', description: 'Earthy brick red for autumn', colorHex: '#CB4154', colorName: 'Brick Red', finish: 'matte', intensity: 'full', tier: 'BASIC', sortOrder: 13, tags: ['red', 'brick', 'autumn'] },
  { category: 'LIPS', subcategory: 'lipstick', name: 'Orange Red Lipstick', description: 'Warm orange-red statement lip', colorHex: '#FF4500', colorName: 'Orange Red', finish: 'satin', intensity: 'full', tier: 'BASIC', sortOrder: 14, tags: ['orange-red', 'warm', 'statement'] },

  // Berries & Darks
  { category: 'LIPS', subcategory: 'lipstick', name: 'Berry Lipstick', description: 'Rich mixed berry shade', colorHex: '#8E3A59', colorName: 'Berry', finish: 'satin', intensity: 'full', tier: 'BASIC', sortOrder: 15, tags: ['berry', 'rich', 'fall'] },
  { category: 'LIPS', subcategory: 'lipstick', name: 'Plum Lipstick', description: 'Deep plum for dramatic looks', colorHex: '#5C2A4F', colorName: 'Plum', finish: 'matte', intensity: 'full', tier: 'BASIC', sortOrder: 16, tags: ['plum', 'dramatic', 'dark'] },
  { category: 'LIPS', subcategory: 'lipstick', name: 'Wine Lipstick', description: 'Sophisticated deep wine shade', colorHex: '#722F37', colorName: 'Wine', finish: 'matte', intensity: 'full', tier: 'BASIC', sortOrder: 17, tags: ['wine', 'sophisticated', 'evening'] },
  { category: 'LIPS', subcategory: 'lipstick', name: 'Oxblood Lipstick', description: 'Ultra-dark vampy oxblood', colorHex: '#4A0000', colorName: 'Oxblood', finish: 'matte', intensity: 'full', tier: 'PREMIUM', sortOrder: 18, tags: ['oxblood', 'vampy', 'dark'] },

  // Corals & Oranges
  { category: 'LIPS', subcategory: 'lipstick', name: 'Coral Lipstick', description: 'Bright coral for summer days', colorHex: '#FF7F50', colorName: 'Coral', finish: 'satin', intensity: 'medium', tier: 'FREE', sortOrder: 19, tags: ['coral', 'summer', 'bright'] },
  { category: 'LIPS', subcategory: 'lipstick', name: 'Peach Kiss Lipstick', description: 'Soft peach lip color', colorHex: '#FFCBA4', colorName: 'Peach Kiss', finish: 'satin', intensity: 'light', tier: 'FREE', sortOrder: 20, tags: ['peach', 'soft', 'natural'] },
  { category: 'LIPS', subcategory: 'lipstick', name: 'Burnt Orange Lipstick', description: 'Trendy burnt orange for bold looks', colorHex: '#CC5500', colorName: 'Burnt Orange', finish: 'matte', intensity: 'full', tier: 'PREMIUM', sortOrder: 21, tags: ['orange', 'burnt', 'trendy'] },

  // ═══════════════════════════════════════════════════════════
  // LIPS - Lip Gloss
  // ═══════════════════════════════════════════════════════════
  { category: 'LIPS', subcategory: 'lip_gloss', name: 'Clear Glass Gloss', description: 'Ultra-shiny clear gloss for glass lips effect', colorHex: '#FFFFFF', colorName: 'Clear', finish: 'gloss', intensity: 'light', tier: 'FREE', sortOrder: 1, tags: ['clear', 'glass-lips', 'shiny'] },
  { category: 'LIPS', subcategory: 'lip_gloss', name: 'Pink Shimmer Gloss', description: 'Shimmering pink lip gloss', colorHex: '#FFB6C1', colorName: 'Pink Shimmer', finish: 'gloss', intensity: 'light', tier: 'FREE', sortOrder: 2, tags: ['pink', 'shimmer', 'gloss'] },
  { category: 'LIPS', subcategory: 'lip_gloss', name: 'Nude Glaze Gloss', description: 'Nude-toned gloss for polished everyday look', colorHex: '#D4A574', colorName: 'Nude Glaze', finish: 'gloss', intensity: 'light', tier: 'FREE', sortOrder: 3, tags: ['nude', 'everyday', 'polished'] },
  { category: 'LIPS', subcategory: 'lip_gloss', name: 'Berry Burst Gloss', description: 'Juicy berry-toned gloss', colorHex: '#8E3A59', colorName: 'Berry Burst', finish: 'gloss', intensity: 'medium', tier: 'BASIC', sortOrder: 4, tags: ['berry', 'juicy'] },
  { category: 'LIPS', subcategory: 'lip_gloss', name: 'Caramel Drip Gloss', description: 'Rich caramel-toned gloss for deeper skin', colorHex: '#A0724E', colorName: 'Caramel Drip', finish: 'gloss', intensity: 'medium', tier: 'BASIC', sortOrder: 5, tags: ['caramel', 'deep-skin'] },

  // ═══════════════════════════════════════════════════════════
  // LIPS - Lip Liner
  // ═══════════════════════════════════════════════════════════
  { category: 'LIPS', subcategory: 'lip_liner', name: 'Nude Lip Liner', description: 'Natural nude liner for definition', colorHex: '#C4956A', colorName: 'Nude', finish: 'matte', intensity: 'medium', tier: 'FREE', sortOrder: 1, tags: ['nude', 'natural'] },
  { category: 'LIPS', subcategory: 'lip_liner', name: 'Pink Lip Liner', description: 'Classic pink for pairing with pink lipsticks', colorHex: '#E75480', colorName: 'Pink', finish: 'matte', intensity: 'medium', tier: 'FREE', sortOrder: 2, tags: ['pink', 'classic'] },
  { category: 'LIPS', subcategory: 'lip_liner', name: 'Red Lip Liner', description: 'True red liner for crisp red lip definition', colorHex: '#CC0000', colorName: 'True Red', finish: 'matte', intensity: 'full', tier: 'FREE', sortOrder: 3, tags: ['red', 'bold'] },
  { category: 'LIPS', subcategory: 'lip_liner', name: 'Berry Lip Liner', description: 'Deep berry liner for dark lip looks', colorHex: '#722F37', colorName: 'Berry', finish: 'matte', intensity: 'full', tier: 'BASIC', sortOrder: 4, tags: ['berry', 'dark'] },
  { category: 'LIPS', subcategory: 'lip_liner', name: 'Brown Lip Liner', description: 'Universal brown that pairs with most shades', colorHex: '#6B4226', colorName: 'Brown', finish: 'matte', intensity: 'medium', tier: 'BASIC', sortOrder: 5, tags: ['brown', 'universal'] },

  // ═══════════════════════════════════════════════════════════
  // LIPS - Lip Stain
  // ═══════════════════════════════════════════════════════════
  { category: 'LIPS', subcategory: 'lip_stain', name: 'Cherry Stain', description: 'Sheer cherry tint for a bitten-lip effect', colorHex: '#DE3163', colorName: 'Cherry', finish: 'matte', intensity: 'light', tier: 'BASIC', sortOrder: 1, tags: ['cherry', 'tint', 'bitten-lip', 'k-beauty'] },
  { category: 'LIPS', subcategory: 'lip_stain', name: 'Strawberry Stain', description: 'Fresh strawberry gradient lip tint', colorHex: '#FC5A8D', colorName: 'Strawberry', finish: 'matte', intensity: 'light', tier: 'BASIC', sortOrder: 2, tags: ['strawberry', 'gradient', 'k-beauty'] },
  { category: 'LIPS', subcategory: 'lip_stain', name: 'Rose Stain', description: 'Subtle rose water-tint effect', colorHex: '#E8919E', colorName: 'Rose', finish: 'matte', intensity: 'light', tier: 'BASIC', sortOrder: 3, tags: ['rose', 'subtle', 'water-tint'] },
  { category: 'LIPS', subcategory: 'lip_stain', name: 'Red Velvet Stain', description: 'Rich red velvet stain for long-lasting color', colorHex: '#B22222', colorName: 'Red Velvet', finish: 'matte', intensity: 'medium', tier: 'PREMIUM', sortOrder: 4, tags: ['red', 'velvet', 'long-lasting'] },
];
