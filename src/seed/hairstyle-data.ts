import { HairstyleCategory, SubscriptionTier } from '@prisma/client';

type HairstyleSeed = {
  category: HairstyleCategory;
  subcategory: string;
  name: string;
  description: string;
  length: string;
  texture: string | null;
  colorHex: string | null;
  colorName: string | null;
  tier: SubscriptionTier;
  sortOrder: number;
  tags: string[];
};

export const hairstyles: HairstyleSeed[] = [
  // ═══════════════════════════════════════════════════════════
  // CUTS - Short
  // ═══════════════════════════════════════════════════════════
  { category: 'CUT', subcategory: 'pixie', name: 'Classic Pixie Cut', description: 'Short, cropped pixie with tapered sides and textured top', length: 'short', texture: 'straight', colorHex: null, colorName: null, tier: 'FREE', sortOrder: 1, tags: ['pixie', 'classic', 'low-maintenance', 'edgy'] },
  { category: 'CUT', subcategory: 'pixie', name: 'Textured Pixie', description: 'Messy, textured pixie with longer layers on top', length: 'short', texture: 'wavy', colorHex: null, colorName: null, tier: 'FREE', sortOrder: 2, tags: ['pixie', 'textured', 'messy', 'modern'] },
  { category: 'CUT', subcategory: 'pixie', name: 'Side-Swept Pixie', description: 'Pixie with longer side-swept bangs for a feminine touch', length: 'short', texture: 'straight', colorHex: null, colorName: null, tier: 'BASIC', sortOrder: 3, tags: ['pixie', 'side-swept', 'feminine'] },
  { category: 'CUT', subcategory: 'pixie', name: 'Curly Pixie', description: 'Natural curls embraced in a short pixie shape', length: 'short', texture: 'curly', colorHex: null, colorName: null, tier: 'BASIC', sortOrder: 4, tags: ['pixie', 'curly', 'natural'] },

  // Short Bobs
  { category: 'CUT', subcategory: 'bob', name: 'Classic Bob', description: 'Clean, chin-length bob with blunt ends', length: 'short', texture: 'straight', colorHex: null, colorName: null, tier: 'FREE', sortOrder: 5, tags: ['bob', 'classic', 'blunt', 'polished'] },
  { category: 'CUT', subcategory: 'bob', name: 'French Bob', description: 'Chic jaw-length bob with short bangs - très Parisienne', length: 'short', texture: 'straight', colorHex: null, colorName: null, tier: 'BASIC', sortOrder: 6, tags: ['bob', 'french', 'chic', 'bangs'] },
  { category: 'CUT', subcategory: 'bob', name: 'Textured Bob', description: 'Piece-y, lived-in bob with choppy layers', length: 'short', texture: 'wavy', colorHex: null, colorName: null, tier: 'FREE', sortOrder: 7, tags: ['bob', 'textured', 'choppy', 'effortless'] },
  { category: 'CUT', subcategory: 'bob', name: 'Asymmetrical Bob', description: 'Edgy bob with one side longer than the other', length: 'short', texture: 'straight', colorHex: null, colorName: null, tier: 'BASIC', sortOrder: 8, tags: ['bob', 'asymmetrical', 'edgy', 'modern'] },
  { category: 'CUT', subcategory: 'bob', name: 'Stacked Bob', description: 'Graduated layers stacked at the back for volume', length: 'short', texture: 'straight', colorHex: null, colorName: null, tier: 'BASIC', sortOrder: 9, tags: ['bob', 'stacked', 'volume', 'layered'] },
  { category: 'CUT', subcategory: 'bob', name: 'Curly Bob', description: 'Bouncy curly bob full of body and movement', length: 'short', texture: 'curly', colorHex: null, colorName: null, tier: 'FREE', sortOrder: 10, tags: ['bob', 'curly', 'bouncy'] },

  // ═══════════════════════════════════════════════════════════
  // CUTS - Medium
  // ═══════════════════════════════════════════════════════════
  { category: 'CUT', subcategory: 'lob', name: 'Classic Lob', description: 'Collarbone-length long bob - the most versatile medium cut', length: 'medium', texture: 'straight', colorHex: null, colorName: null, tier: 'FREE', sortOrder: 11, tags: ['lob', 'classic', 'versatile'] },
  { category: 'CUT', subcategory: 'lob', name: 'Wavy Lob', description: 'Beach-wave textured lob for effortless style', length: 'medium', texture: 'wavy', colorHex: null, colorName: null, tier: 'FREE', sortOrder: 12, tags: ['lob', 'wavy', 'beach', 'effortless'] },
  { category: 'CUT', subcategory: 'shag', name: 'Modern Shag', description: 'Layered shag with curtain bangs - 70s inspired, modern vibes', length: 'medium', texture: 'wavy', colorHex: null, colorName: null, tier: 'BASIC', sortOrder: 13, tags: ['shag', 'layered', 'curtain-bangs', 'retro'] },
  { category: 'CUT', subcategory: 'shag', name: 'Curly Shag', description: 'Embracing natural curls with shaggy layers', length: 'medium', texture: 'curly', colorHex: null, colorName: null, tier: 'BASIC', sortOrder: 14, tags: ['shag', 'curly', 'natural', 'volume'] },
  { category: 'CUT', subcategory: 'layers', name: 'Face-Framing Layers', description: 'Strategic layers around the face for flattering dimension', length: 'medium', texture: 'straight', colorHex: null, colorName: null, tier: 'FREE', sortOrder: 15, tags: ['layers', 'face-framing', 'flattering'] },
  { category: 'CUT', subcategory: 'layers', name: 'Butterfly Cut', description: 'Trending voluminous cut with dramatic face-framing layers', length: 'medium', texture: 'wavy', colorHex: null, colorName: null, tier: 'PREMIUM', sortOrder: 16, tags: ['butterfly', 'trending', 'volume', 'dramatic'] },
  { category: 'CUT', subcategory: 'wolf_cut', name: 'Wolf Cut', description: 'Edgy hybrid of shag and mullet with lots of texture', length: 'medium', texture: 'wavy', colorHex: null, colorName: null, tier: 'BASIC', sortOrder: 17, tags: ['wolf-cut', 'edgy', 'textured', 'trending'] },

  // ═══════════════════════════════════════════════════════════
  // CUTS - Long
  // ═══════════════════════════════════════════════════════════
  { category: 'CUT', subcategory: 'long_layers', name: 'Long Layered', description: 'Classic long hair with flowing layers for movement', length: 'long', texture: 'straight', colorHex: null, colorName: null, tier: 'FREE', sortOrder: 18, tags: ['long', 'layered', 'classic', 'flowing'] },
  { category: 'CUT', subcategory: 'long_layers', name: 'Beachy Long Waves', description: 'Long tousled waves for that just-off-the-beach look', length: 'long', texture: 'wavy', colorHex: null, colorName: null, tier: 'FREE', sortOrder: 19, tags: ['long', 'wavy', 'beach', 'tousled'] },
  { category: 'CUT', subcategory: 'long_layers', name: 'Long Curly Natural', description: 'Beautiful long natural curls with defined ringlets', length: 'long', texture: 'curly', colorHex: null, colorName: null, tier: 'FREE', sortOrder: 20, tags: ['long', 'curly', 'natural', 'ringlets'] },
  { category: 'CUT', subcategory: 'long_layers', name: 'Sleek Straight Long', description: 'Ultra-sleek, glossy straight long hair', length: 'long', texture: 'straight', colorHex: null, colorName: null, tier: 'BASIC', sortOrder: 21, tags: ['long', 'sleek', 'straight', 'glossy'] },
  { category: 'CUT', subcategory: 'blunt_cut', name: 'Blunt Cut Long', description: 'One-length blunt cut for thick, full appearance', length: 'long', texture: 'straight', colorHex: null, colorName: null, tier: 'BASIC', sortOrder: 22, tags: ['long', 'blunt', 'thick', 'full'] },

  // Bangs
  { category: 'CUT', subcategory: 'bangs', name: 'Curtain Bangs', description: 'Soft, face-framing bangs parted in the center', length: 'medium', texture: 'straight', colorHex: null, colorName: null, tier: 'FREE', sortOrder: 23, tags: ['bangs', 'curtain', 'face-framing', 'trending'] },
  { category: 'CUT', subcategory: 'bangs', name: 'Blunt Bangs', description: 'Straight-across full fringe for a bold statement', length: 'medium', texture: 'straight', colorHex: null, colorName: null, tier: 'FREE', sortOrder: 24, tags: ['bangs', 'blunt', 'fringe', 'bold'] },
  { category: 'CUT', subcategory: 'bangs', name: 'Side-Swept Bangs', description: 'Elegant bangs swept to one side', length: 'medium', texture: 'straight', colorHex: null, colorName: null, tier: 'FREE', sortOrder: 25, tags: ['bangs', 'side-swept', 'elegant'] },
  { category: 'CUT', subcategory: 'bangs', name: 'Wispy Bangs', description: 'Soft, feathered wispy bangs for subtle framing', length: 'medium', texture: 'straight', colorHex: null, colorName: null, tier: 'BASIC', sortOrder: 26, tags: ['bangs', 'wispy', 'feathered', 'soft'] },
  { category: 'CUT', subcategory: 'bangs', name: 'Birkin Bangs', description: 'Iconic 60s-inspired full bangs à la Jane Birkin', length: 'medium', texture: 'straight', colorHex: null, colorName: null, tier: 'PREMIUM', sortOrder: 27, tags: ['bangs', 'birkin', 'retro', '60s'] },

  // ═══════════════════════════════════════════════════════════
  // UPDOS
  // ═══════════════════════════════════════════════════════════
  { category: 'UPDO', subcategory: 'bun', name: 'Messy Bun', description: 'Effortlessly chic messy bun with loose tendrils', length: 'long', texture: null, colorHex: null, colorName: null, tier: 'FREE', sortOrder: 1, tags: ['bun', 'messy', 'casual', 'quick'] },
  { category: 'UPDO', subcategory: 'bun', name: 'Sleek Low Bun', description: 'Polished low bun at the nape - elegant and refined', length: 'long', texture: null, colorHex: null, colorName: null, tier: 'FREE', sortOrder: 2, tags: ['bun', 'sleek', 'elegant', 'formal'] },
  { category: 'UPDO', subcategory: 'bun', name: 'Top Knot', description: 'High bun perched on top of the head', length: 'medium', texture: null, colorHex: null, colorName: null, tier: 'FREE', sortOrder: 3, tags: ['bun', 'top-knot', 'high', 'casual'] },
  { category: 'UPDO', subcategory: 'bun', name: 'Ballerina Bun', description: 'Tight, smooth classical bun inspired by ballet dancers', length: 'long', texture: null, colorHex: null, colorName: null, tier: 'BASIC', sortOrder: 4, tags: ['bun', 'ballerina', 'classic', 'smooth'] },
  { category: 'UPDO', subcategory: 'bun', name: 'Chignon', description: 'Low, elegant twisted bun perfect for formal events', length: 'long', texture: null, colorHex: null, colorName: null, tier: 'BASIC', sortOrder: 5, tags: ['chignon', 'elegant', 'formal', 'twisted'] },
  { category: 'UPDO', subcategory: 'bun', name: 'Space Buns', description: 'Playful double buns on each side of the head', length: 'medium', texture: null, colorHex: null, colorName: null, tier: 'FREE', sortOrder: 6, tags: ['bun', 'space-buns', 'playful', 'fun'] },

  // Ponytails
  { category: 'UPDO', subcategory: 'ponytail', name: 'High Ponytail', description: 'Sleek high ponytail for a lifted, youthful look', length: 'long', texture: 'straight', colorHex: null, colorName: null, tier: 'FREE', sortOrder: 7, tags: ['ponytail', 'high', 'sleek'] },
  { category: 'UPDO', subcategory: 'ponytail', name: 'Low Ponytail', description: 'Polished low ponytail with wrapped hair tie', length: 'long', texture: 'straight', colorHex: null, colorName: null, tier: 'FREE', sortOrder: 8, tags: ['ponytail', 'low', 'polished'] },
  { category: 'UPDO', subcategory: 'ponytail', name: 'Bubble Ponytail', description: 'Segmented ponytail with bubble sections for fun texture', length: 'long', texture: null, colorHex: null, colorName: null, tier: 'BASIC', sortOrder: 9, tags: ['ponytail', 'bubble', 'fun', 'textured'] },
  { category: 'UPDO', subcategory: 'ponytail', name: 'Curly Ponytail', description: 'Voluminous curly ponytail full of body', length: 'long', texture: 'curly', colorHex: null, colorName: null, tier: 'BASIC', sortOrder: 10, tags: ['ponytail', 'curly', 'voluminous'] },
  { category: 'UPDO', subcategory: 'ponytail', name: 'Side Ponytail', description: 'Romantic side-swept ponytail draped over one shoulder', length: 'long', texture: 'wavy', colorHex: null, colorName: null, tier: 'FREE', sortOrder: 11, tags: ['ponytail', 'side', 'romantic'] },

  // Half-Up Styles
  { category: 'UPDO', subcategory: 'half_up', name: 'Half-Up Half-Down', description: 'Classic half-up style leaving length flowing', length: 'long', texture: 'wavy', colorHex: null, colorName: null, tier: 'FREE', sortOrder: 12, tags: ['half-up', 'classic', 'versatile'] },
  { category: 'UPDO', subcategory: 'half_up', name: 'Half-Up Top Knot', description: 'Trendy half-up bun with the rest of hair down', length: 'medium', texture: null, colorHex: null, colorName: null, tier: 'FREE', sortOrder: 13, tags: ['half-up', 'top-knot', 'casual', 'trending'] },
  { category: 'UPDO', subcategory: 'half_up', name: 'Pinned Back Half-Up', description: 'Hair pinned back at the sides for an elegant effect', length: 'long', texture: 'wavy', colorHex: null, colorName: null, tier: 'BASIC', sortOrder: 14, tags: ['half-up', 'pinned', 'elegant'] },

  // ═══════════════════════════════════════════════════════════
  // BRAIDS
  // ═══════════════════════════════════════════════════════════
  { category: 'BRAID', subcategory: 'french_braid', name: 'Classic French Braid', description: 'Traditional three-strand braid incorporating hair from the sides', length: 'long', texture: null, colorHex: null, colorName: null, tier: 'FREE', sortOrder: 1, tags: ['french', 'classic', 'traditional'] },
  { category: 'BRAID', subcategory: 'dutch_braid', name: 'Dutch Braid', description: 'Inverted French braid that sits on top of the hair', length: 'long', texture: null, colorHex: null, colorName: null, tier: 'FREE', sortOrder: 2, tags: ['dutch', 'inverted', 'dimensional'] },
  { category: 'BRAID', subcategory: 'fishtail', name: 'Fishtail Braid', description: 'Intricate two-strand braid creating a fish-scale pattern', length: 'long', texture: null, colorHex: null, colorName: null, tier: 'BASIC', sortOrder: 3, tags: ['fishtail', 'intricate', 'bohemian'] },
  { category: 'BRAID', subcategory: 'box_braids', name: 'Box Braids', description: 'Individual sectioned braids - a protective style icon', length: 'long', texture: 'coily', colorHex: null, colorName: null, tier: 'BASIC', sortOrder: 4, tags: ['box-braids', 'protective', 'versatile'] },
  { category: 'BRAID', subcategory: 'cornrows', name: 'Cornrows', description: 'Tight braids braided close to the scalp in rows', length: 'medium', texture: 'coily', colorHex: null, colorName: null, tier: 'BASIC', sortOrder: 5, tags: ['cornrows', 'tight', 'scalp', 'protective'] },
  { category: 'BRAID', subcategory: 'crown_braid', name: 'Crown Braid', description: 'Braids wrapped around the head like a crown - bridal favorite', length: 'long', texture: null, colorHex: null, colorName: null, tier: 'PREMIUM', sortOrder: 6, tags: ['crown', 'bridal', 'romantic', 'elegant'] },
  { category: 'BRAID', subcategory: 'side_braid', name: 'Side Braid', description: 'Casual braid draped over one shoulder', length: 'long', texture: null, colorHex: null, colorName: null, tier: 'FREE', sortOrder: 7, tags: ['side', 'casual', 'simple'] },
  { category: 'BRAID', subcategory: 'waterfall', name: 'Waterfall Braid', description: 'Cascading braid where strands fall through like a waterfall', length: 'long', texture: 'wavy', colorHex: null, colorName: null, tier: 'PREMIUM', sortOrder: 8, tags: ['waterfall', 'romantic', 'cascading'] },
  { category: 'BRAID', subcategory: 'twist', name: 'Two-Strand Twists', description: 'Twisted sections creating defined, rope-like texture', length: 'medium', texture: 'coily', colorHex: null, colorName: null, tier: 'BASIC', sortOrder: 9, tags: ['twists', 'rope', 'protective', 'natural'] },
  { category: 'BRAID', subcategory: 'twist', name: 'Flat Twists', description: 'Twists done close to the scalp in geometric patterns', length: 'medium', texture: 'coily', colorHex: null, colorName: null, tier: 'PREMIUM', sortOrder: 10, tags: ['flat-twists', 'scalp', 'geometric'] },
  { category: 'BRAID', subcategory: 'double_braids', name: 'Double Dutch Braids', description: 'Two Dutch braids - sporty and stylish', length: 'long', texture: null, colorHex: null, colorName: null, tier: 'FREE', sortOrder: 11, tags: ['double', 'dutch', 'sporty', 'active'] },
  { category: 'BRAID', subcategory: 'bubble_braid', name: 'Bubble Braid', description: 'Easy segmented braid with pulled-out bubble sections', length: 'long', texture: null, colorHex: null, colorName: null, tier: 'BASIC', sortOrder: 12, tags: ['bubble', 'easy', 'trendy', 'fun'] },
  { category: 'BRAID', subcategory: 'knotless', name: 'Knotless Braids', description: 'Feed-in braids without the traditional knot at the root', length: 'long', texture: 'coily', colorHex: null, colorName: null, tier: 'PREMIUM', sortOrder: 13, tags: ['knotless', 'feed-in', 'protective', 'gentle'] },
  { category: 'BRAID', subcategory: 'locs', name: 'Faux Locs', description: 'Temporary loc-style protective hairstyle', length: 'long', texture: 'coily', colorHex: null, colorName: null, tier: 'PREMIUM', sortOrder: 14, tags: ['faux-locs', 'protective', 'boho'] },

  // ═══════════════════════════════════════════════════════════
  // COLOR
  // ═══════════════════════════════════════════════════════════
  // Natural Blondes
  { category: 'COLOR', subcategory: 'blonde', name: 'Platinum Blonde', description: 'Ultra-light, icy platinum blonde', length: 'medium', texture: null, colorHex: '#E5E4E2', colorName: 'Platinum', tier: 'BASIC', sortOrder: 1, tags: ['platinum', 'icy', 'light', 'cool'] },
  { category: 'COLOR', subcategory: 'blonde', name: 'Honey Blonde', description: 'Warm, golden honey blonde', length: 'medium', texture: null, colorHex: '#DAA520', colorName: 'Honey', tier: 'FREE', sortOrder: 2, tags: ['honey', 'golden', 'warm'] },
  { category: 'COLOR', subcategory: 'blonde', name: 'Ash Blonde', description: 'Cool-toned ash blonde with silver undertones', length: 'medium', texture: null, colorHex: '#B8B09B', colorName: 'Ash Blonde', tier: 'BASIC', sortOrder: 3, tags: ['ash', 'cool', 'silver'] },
  { category: 'COLOR', subcategory: 'blonde', name: 'Strawberry Blonde', description: 'Warm blend of golden blonde and light red', length: 'medium', texture: null, colorHex: '#CC8844', colorName: 'Strawberry', tier: 'BASIC', sortOrder: 4, tags: ['strawberry', 'warm', 'red-tint'] },
  { category: 'COLOR', subcategory: 'blonde', name: 'Champagne Blonde', description: 'Soft, muted beige-blonde', length: 'medium', texture: null, colorHex: '#F7E7CE', colorName: 'Champagne', tier: 'FREE', sortOrder: 5, tags: ['champagne', 'soft', 'beige'] },
  { category: 'COLOR', subcategory: 'blonde', name: 'Butter Blonde', description: 'Warm buttery blonde with yellow undertones', length: 'medium', texture: null, colorHex: '#E8D568', colorName: 'Butter', tier: 'BASIC', sortOrder: 6, tags: ['butter', 'warm', 'yellow'] },

  // Natural Brunettes
  { category: 'COLOR', subcategory: 'brunette', name: 'Chocolate Brown', description: 'Rich, warm chocolate brown', length: 'medium', texture: null, colorHex: '#3C1414', colorName: 'Chocolate', tier: 'FREE', sortOrder: 7, tags: ['chocolate', 'warm', 'rich'] },
  { category: 'COLOR', subcategory: 'brunette', name: 'Caramel Brown', description: 'Warm caramel-kissed brown', length: 'medium', texture: null, colorHex: '#65350F', colorName: 'Caramel', tier: 'FREE', sortOrder: 8, tags: ['caramel', 'warm', 'golden'] },
  { category: 'COLOR', subcategory: 'brunette', name: 'Espresso', description: 'Deep, near-black espresso brown', length: 'medium', texture: null, colorHex: '#1C1008', colorName: 'Espresso', tier: 'FREE', sortOrder: 9, tags: ['espresso', 'deep', 'dark'] },
  { category: 'COLOR', subcategory: 'brunette', name: 'Chestnut Brown', description: 'Medium brown with red-gold warmth', length: 'medium', texture: null, colorHex: '#954535', colorName: 'Chestnut', tier: 'BASIC', sortOrder: 10, tags: ['chestnut', 'medium', 'red-gold'] },
  { category: 'COLOR', subcategory: 'brunette', name: 'Ash Brown', description: 'Cool, smoky brown without warmth', length: 'medium', texture: null, colorHex: '#6B5B4E', colorName: 'Ash Brown', tier: 'BASIC', sortOrder: 11, tags: ['ash', 'cool', 'smoky'] },
  { category: 'COLOR', subcategory: 'brunette', name: 'Mushroom Brown', description: 'Trendy cool-toned grey-brown', length: 'medium', texture: null, colorHex: '#8B7B6B', colorName: 'Mushroom', tier: 'PREMIUM', sortOrder: 12, tags: ['mushroom', 'cool', 'trendy', 'grey-brown'] },

  // Reds
  { category: 'COLOR', subcategory: 'red', name: 'Auburn Red', description: 'Natural auburn with warm red tones', length: 'medium', texture: null, colorHex: '#A52A2A', colorName: 'Auburn', tier: 'BASIC', sortOrder: 13, tags: ['auburn', 'natural', 'warm'] },
  { category: 'COLOR', subcategory: 'red', name: 'Ginger', description: 'Bright natural ginger-red', length: 'medium', texture: null, colorHex: '#B06500', colorName: 'Ginger', tier: 'BASIC', sortOrder: 14, tags: ['ginger', 'bright', 'natural'] },
  { category: 'COLOR', subcategory: 'red', name: 'Copper Red', description: 'Vibrant copper-penny red', length: 'medium', texture: null, colorHex: '#B87333', colorName: 'Copper', tier: 'BASIC', sortOrder: 15, tags: ['copper', 'vibrant', 'trending'] },
  { category: 'COLOR', subcategory: 'red', name: 'Cherry Red', description: 'Bold cherry-cola red', length: 'medium', texture: null, colorHex: '#9B111E', colorName: 'Cherry', tier: 'PREMIUM', sortOrder: 16, tags: ['cherry', 'bold', 'vivid'] },
  { category: 'COLOR', subcategory: 'red', name: 'Burgundy', description: 'Deep wine-toned burgundy', length: 'medium', texture: null, colorHex: '#800020', colorName: 'Burgundy', tier: 'BASIC', sortOrder: 17, tags: ['burgundy', 'wine', 'deep'] },

  // Black
  { category: 'COLOR', subcategory: 'black', name: 'Jet Black', description: 'True, blue-black jet black', length: 'medium', texture: null, colorHex: '#0A0A0A', colorName: 'Jet Black', tier: 'FREE', sortOrder: 18, tags: ['black', 'jet', 'dark'] },
  { category: 'COLOR', subcategory: 'black', name: 'Soft Black', description: 'Softer black with brown undertones', length: 'medium', texture: null, colorHex: '#1C1C1C', colorName: 'Soft Black', tier: 'FREE', sortOrder: 19, tags: ['black', 'soft', 'natural'] },
  { category: 'COLOR', subcategory: 'black', name: 'Blue Black', description: 'Black with blue-violet sheen', length: 'medium', texture: null, colorHex: '#0D0D2B', colorName: 'Blue Black', tier: 'BASIC', sortOrder: 20, tags: ['black', 'blue', 'sheen'] },

  // Fashion / Vivid Colors
  { category: 'COLOR', subcategory: 'fashion', name: 'Rose Gold', description: 'Trendy pink-gold metallic tone', length: 'medium', texture: null, colorHex: '#B76E79', colorName: 'Rose Gold', tier: 'PREMIUM', sortOrder: 21, tags: ['rose-gold', 'metallic', 'trendy', 'fashion'] },
  { category: 'COLOR', subcategory: 'fashion', name: 'Pastel Pink', description: 'Soft cotton-candy pastel pink', length: 'medium', texture: null, colorHex: '#FFB6C1', colorName: 'Pastel Pink', tier: 'PREMIUM', sortOrder: 22, tags: ['pastel', 'pink', 'soft', 'fashion'] },
  { category: 'COLOR', subcategory: 'fashion', name: 'Lavender', description: 'Dreamy pastel lavender purple', length: 'medium', texture: null, colorHex: '#B57EDC', colorName: 'Lavender', tier: 'PREMIUM', sortOrder: 23, tags: ['lavender', 'purple', 'pastel', 'dreamy'] },
  { category: 'COLOR', subcategory: 'fashion', name: 'Vivid Blue', description: 'Bold electric blue statement color', length: 'medium', texture: null, colorHex: '#1E90FF', colorName: 'Electric Blue', tier: 'PREMIUM', sortOrder: 24, tags: ['blue', 'vivid', 'bold', 'statement'] },
  { category: 'COLOR', subcategory: 'fashion', name: 'Emerald Green', description: 'Rich emerald green fashion color', length: 'medium', texture: null, colorHex: '#046307', colorName: 'Emerald', tier: 'PREMIUM', sortOrder: 25, tags: ['green', 'emerald', 'rich', 'fashion'] },
  { category: 'COLOR', subcategory: 'fashion', name: 'Silver Grey', description: 'Intentional silver-grey fashion shade', length: 'medium', texture: null, colorHex: '#C0C0C0', colorName: 'Silver', tier: 'PREMIUM', sortOrder: 26, tags: ['silver', 'grey', 'fashion', 'modern'] },
  { category: 'COLOR', subcategory: 'fashion', name: 'Peach Coral', description: 'Soft peach-coral warm fashion shade', length: 'medium', texture: null, colorHex: '#FFB07C', colorName: 'Peach Coral', tier: 'PREMIUM', sortOrder: 27, tags: ['peach', 'coral', 'warm', 'soft'] },

  // Color Techniques
  { category: 'COLOR', subcategory: 'technique', name: 'Balayage', description: 'Hand-painted graduated highlights for natural sun-kissed effect', length: 'long', texture: null, colorHex: '#C4956A', colorName: 'Balayage Blend', tier: 'BASIC', sortOrder: 28, tags: ['balayage', 'highlights', 'natural', 'sun-kissed'] },
  { category: 'COLOR', subcategory: 'technique', name: 'Ombre', description: 'Gradient from dark roots to lighter ends', length: 'long', texture: null, colorHex: '#8B6914', colorName: 'Ombre Gradient', tier: 'BASIC', sortOrder: 29, tags: ['ombre', 'gradient', 'two-tone'] },
  { category: 'COLOR', subcategory: 'technique', name: 'Highlights', description: 'Traditional foil highlights woven through the hair', length: 'long', texture: null, colorHex: '#F5DEB3', colorName: 'Highlighted', tier: 'BASIC', sortOrder: 30, tags: ['highlights', 'foils', 'dimension'] },
  { category: 'COLOR', subcategory: 'technique', name: 'Lowlights', description: 'Darker strands woven through for depth and dimension', length: 'long', texture: null, colorHex: '#4A2C17', colorName: 'Lowlights', tier: 'BASIC', sortOrder: 31, tags: ['lowlights', 'depth', 'dimension'] },
  { category: 'COLOR', subcategory: 'technique', name: 'Money Pieces', description: 'Bold face-framing highlights - the signature money piece look', length: 'long', texture: null, colorHex: '#F5E6B8', colorName: 'Money Piece', tier: 'PREMIUM', sortOrder: 32, tags: ['money-piece', 'face-framing', 'bold', 'trending'] },

  // ═══════════════════════════════════════════════════════════
  // ACCESSORIES
  // ═══════════════════════════════════════════════════════════
  { category: 'ACCESSORY', subcategory: 'clip', name: 'Claw Clip', description: 'Trendy claw clip for effortless updo', length: 'medium', texture: null, colorHex: '#8B4513', colorName: 'Tortoise', tier: 'FREE', sortOrder: 1, tags: ['claw-clip', 'trendy', 'effortless', 'casual'] },
  { category: 'ACCESSORY', subcategory: 'clip', name: 'Pearl Clip', description: 'Elegant pearl-adorned hair clip', length: 'medium', texture: null, colorHex: '#FDEEF4', colorName: 'Pearl', tier: 'BASIC', sortOrder: 2, tags: ['pearl', 'elegant', 'bridal', 'formal'] },
  { category: 'ACCESSORY', subcategory: 'clip', name: 'Barrette', description: 'Sleek metal barrette for minimalist style', length: 'medium', texture: null, colorHex: '#FFD700', colorName: 'Gold', tier: 'FREE', sortOrder: 3, tags: ['barrette', 'minimalist', 'gold'] },
  { category: 'ACCESSORY', subcategory: 'headband', name: 'Padded Headband', description: 'Trendy padded fabric headband', length: 'medium', texture: null, colorHex: '#000000', colorName: 'Black', tier: 'FREE', sortOrder: 4, tags: ['headband', 'padded', 'trendy'] },
  { category: 'ACCESSORY', subcategory: 'headband', name: 'Embellished Headband', description: 'Crystal or jewel-adorned headband for special occasions', length: 'medium', texture: null, colorHex: '#C0C0C0', colorName: 'Crystal', tier: 'PREMIUM', sortOrder: 5, tags: ['headband', 'embellished', 'crystal', 'special-occasion'] },
  { category: 'ACCESSORY', subcategory: 'scarf', name: 'Silk Hair Scarf', description: 'Printed silk scarf tied as headband or in ponytail', length: 'long', texture: null, colorHex: '#FF6347', colorName: 'Print', tier: 'BASIC', sortOrder: 6, tags: ['scarf', 'silk', 'retro', 'bohemian'] },
  { category: 'ACCESSORY', subcategory: 'pins', name: 'Decorative Bobby Pins', description: 'Styled bobby pins arranged as hair art', length: 'medium', texture: null, colorHex: '#FFD700', colorName: 'Gold', tier: 'BASIC', sortOrder: 7, tags: ['bobby-pins', 'decorative', 'hair-art'] },
  { category: 'ACCESSORY', subcategory: 'ribbon', name: 'Velvet Hair Bow', description: 'Romantic velvet ribbon bow for sweet, feminine look', length: 'long', texture: null, colorHex: '#8B0000', colorName: 'Burgundy', tier: 'BASIC', sortOrder: 8, tags: ['bow', 'velvet', 'romantic', 'feminine'] },
];
