// Skin tone recommendation mappings
// Each entry maps a skin tone + undertone combination to product names with match scores

type RecommendationSeed = {
  skinTone: string;
  skinUndertone: string;
  productName: string;
  matchScore: number;
  notes: string;
};

export const skinToneRecommendations: RecommendationSeed[] = [
  // ─── Very Fair / Fair + Cool ──────────────────────────────
  { skinTone: 'very_fair', skinUndertone: 'cool', productName: 'Porcelain Glow Foundation', matchScore: 1.0, notes: 'Perfect match for very fair cool-toned skin' },
  { skinTone: 'very_fair', skinUndertone: 'cool', productName: 'Baby Pink Blush', matchScore: 0.95, notes: 'Soft pink complements cool fair skin beautifully' },
  { skinTone: 'very_fair', skinUndertone: 'cool', productName: 'Moonstone Glow', matchScore: 0.95, notes: 'Icy highlighter suits cool undertones' },
  { skinTone: 'very_fair', skinUndertone: 'cool', productName: 'Dusty Rose Lipstick', matchScore: 0.9, notes: 'Muted rose is universally flattering on fair cool skin' },
  { skinTone: 'very_fair', skinUndertone: 'cool', productName: 'Rose Pink Lipstick', matchScore: 0.9, notes: 'Classic rosy pink is perfect for cool fair complexions' },
  { skinTone: 'very_fair', skinUndertone: 'cool', productName: 'Ruby Red Lipstick', matchScore: 0.85, notes: 'Blue-based reds complement cool undertones' },
  { skinTone: 'very_fair', skinUndertone: 'cool', productName: 'Dusty Rose Shadow', matchScore: 0.9, notes: 'Mauve-pink enhances cool complexions' },
  { skinTone: 'very_fair', skinUndertone: 'cool', productName: 'Plum Velvet Shadow', matchScore: 0.85, notes: 'Plum tones bring out cool-toned eyes' },
  { skinTone: 'very_fair', skinUndertone: 'cool', productName: 'Taupe Brow Pencil', matchScore: 0.95, notes: 'Cool taupe matches fair brows perfectly' },

  // ─── Fair + Warm ──────────────────────────────────────────
  { skinTone: 'fair', skinUndertone: 'warm', productName: 'Ivory Silk Foundation', matchScore: 1.0, notes: 'Ideal for fair skin with warm golden undertones' },
  { skinTone: 'fair', skinUndertone: 'warm', productName: 'Peach Nectar Blush', matchScore: 0.95, notes: 'Peachy tones bring warmth to fair warm skin' },
  { skinTone: 'fair', skinUndertone: 'warm', productName: 'Champagne Pop', matchScore: 0.95, notes: 'Warm champagne glow is ideal for warm fair skin' },
  { skinTone: 'fair', skinUndertone: 'warm', productName: 'Coral Lipstick', matchScore: 0.9, notes: 'Warm coral flatters warm undertones' },
  { skinTone: 'fair', skinUndertone: 'warm', productName: 'Peach Kiss Lipstick', matchScore: 0.9, notes: 'Soft peach for natural everyday look' },
  { skinTone: 'fair', skinUndertone: 'warm', productName: 'Champagne Toast Shadow', matchScore: 0.95, notes: 'Warm shimmer enhances warm-toned eyes' },
  { skinTone: 'fair', skinUndertone: 'warm', productName: 'Antique Gold Shadow', matchScore: 0.85, notes: 'Gold tones complement warm undertones' },
  { skinTone: 'fair', skinUndertone: 'warm', productName: 'Blonde Brow Pencil', matchScore: 0.9, notes: 'Light warm brow shade' },

  // ─── Light / Light-Medium + Neutral ───────────────────────
  { skinTone: 'light', skinUndertone: 'neutral', productName: 'Shell Beige Foundation', matchScore: 1.0, notes: 'Perfect for light neutral skin' },
  { skinTone: 'light', skinUndertone: 'neutral', productName: 'Rose Petal Blush', matchScore: 0.95, notes: 'Universal rosy blush works beautifully on neutral skin' },
  { skinTone: 'light', skinUndertone: 'neutral', productName: 'Rose Gold Gleam', matchScore: 0.9, notes: 'Pink-gold suits neutral undertones' },
  { skinTone: 'light', skinUndertone: 'neutral', productName: 'Classic Red Lipstick', matchScore: 0.95, notes: 'True red is universally flattering on neutral undertones' },
  { skinTone: 'light', skinUndertone: 'neutral', productName: 'Bare Nude Lipstick', matchScore: 0.9, notes: 'Natural nude for everyday' },
  { skinTone: 'light', skinUndertone: 'neutral', productName: 'Soft Taupe Shadow', matchScore: 0.95, notes: 'Neutral taupe is universally flattering' },
  { skinTone: 'light', skinUndertone: 'neutral', productName: 'Taupe Brow Pencil', matchScore: 0.9, notes: 'Neutral brow shade' },

  // ─── Medium + Warm ────────────────────────────────────────
  { skinTone: 'medium', skinUndertone: 'warm', productName: 'Sand Foundation', matchScore: 1.0, notes: 'Perfect match for medium warm skin' },
  { skinTone: 'medium', skinUndertone: 'warm', productName: 'Golden Beige Foundation', matchScore: 0.9, notes: 'Great for medium skin with golden tones' },
  { skinTone: 'medium', skinUndertone: 'warm', productName: 'Coral Reef Blush', matchScore: 0.95, notes: 'Warm coral looks stunning on medium warm skin' },
  { skinTone: 'medium', skinUndertone: 'warm', productName: 'Sunset Glow Blush', matchScore: 0.9, notes: 'Warm shimmer blush for warm-toned skin' },
  { skinTone: 'medium', skinUndertone: 'warm', productName: 'Bronze Goddess', matchScore: 0.95, notes: 'Golden bronze highlight for warm medium skin' },
  { skinTone: 'medium', skinUndertone: 'warm', productName: 'Cherry Red Lipstick', matchScore: 0.9, notes: 'Warm cherry red complements warm undertones' },
  { skinTone: 'medium', skinUndertone: 'warm', productName: 'Bronze Goddess Shadow', matchScore: 0.95, notes: 'Bronze metallic makes warm eyes pop' },
  { skinTone: 'medium', skinUndertone: 'warm', productName: 'Copper Penny Shadow', matchScore: 0.9, notes: 'Copper enhances warm skin beautifully' },
  { skinTone: 'medium', skinUndertone: 'warm', productName: 'Soft Brown Brow Pencil', matchScore: 0.95, notes: 'Warm brown matches medium warm brows' },

  // ─── Olive + Neutral ──────────────────────────────────────
  { skinTone: 'olive', skinUndertone: 'neutral', productName: 'Olive Foundation', matchScore: 1.0, notes: 'Designed specifically for olive skin tones' },
  { skinTone: 'olive', skinUndertone: 'neutral', productName: 'Terracotta Blush', matchScore: 0.95, notes: 'Earthy terracotta complements olive tones perfectly' },
  { skinTone: 'olive', skinUndertone: 'neutral', productName: 'Rose Gold Gleam', matchScore: 0.9, notes: 'Rose gold highlight flatters olive undertones' },
  { skinTone: 'olive', skinUndertone: 'neutral', productName: 'Berry Lipstick', matchScore: 0.9, notes: 'Berry shades look incredible on olive skin' },
  { skinTone: 'olive', skinUndertone: 'neutral', productName: 'Brick Red Lipstick', matchScore: 0.85, notes: 'Earthy brick red suits olive complexions' },
  { skinTone: 'olive', skinUndertone: 'neutral', productName: 'Forest Emerald Shadow', matchScore: 0.95, notes: 'Emerald green makes olive skin glow' },
  { skinTone: 'olive', skinUndertone: 'neutral', productName: 'Warm Brown Shadow', matchScore: 0.9, notes: 'Warm brown for everyday olive looks' },
  { skinTone: 'olive', skinUndertone: 'neutral', productName: 'Dark Brown Brow Pencil', matchScore: 0.9, notes: 'Rich brown for olive-toned brows' },

  // ─── Tan + Warm ───────────────────────────────────────────
  { skinTone: 'tan', skinUndertone: 'warm', productName: 'Caramel Foundation', matchScore: 1.0, notes: 'Rich caramel base for warm tan skin' },
  { skinTone: 'tan', skinUndertone: 'warm', productName: 'Toffee Foundation', matchScore: 0.9, notes: 'Warm toffee for tan complexions' },
  { skinTone: 'tan', skinUndertone: 'warm', productName: 'Copper Glow', matchScore: 0.95, notes: 'Copper highlight looks gorgeous on warm tan skin' },
  { skinTone: 'tan', skinUndertone: 'warm', productName: 'Berry Bliss Blush', matchScore: 0.9, notes: 'Deep berry adds beautiful contrast on tan skin' },
  { skinTone: 'tan', skinUndertone: 'warm', productName: 'Orange Red Lipstick', matchScore: 0.9, notes: 'Warm orange-red pops on warm tan skin' },
  { skinTone: 'tan', skinUndertone: 'warm', productName: 'Honey Nude Lipstick', matchScore: 0.9, notes: 'Warm nude that complements tan skin' },
  { skinTone: 'tan', skinUndertone: 'warm', productName: 'Antique Gold Shadow', matchScore: 0.95, notes: 'Rich gold makes warm tan eyes stand out' },
  { skinTone: 'tan', skinUndertone: 'warm', productName: 'Dark Brown Brow Pencil', matchScore: 0.95, notes: 'Deep brown for defined brows' },

  // ─── Deep + Warm ──────────────────────────────────────────
  { skinTone: 'deep', skinUndertone: 'warm', productName: 'Chestnut Foundation', matchScore: 1.0, notes: 'Rich chestnut for deep warm skin' },
  { skinTone: 'deep', skinUndertone: 'warm', productName: 'Copper Glow', matchScore: 0.95, notes: 'Copper highlight is stunning on deep warm skin' },
  { skinTone: 'deep', skinUndertone: 'warm', productName: 'Bronze Goddess', matchScore: 0.9, notes: 'Golden bronze for beautiful deep skin glow' },
  { skinTone: 'deep', skinUndertone: 'warm', productName: 'Plum Wine Blush', matchScore: 0.95, notes: 'Deep plum blush creates beautiful flush on deep skin' },
  { skinTone: 'deep', skinUndertone: 'warm', productName: 'Wine Lipstick', matchScore: 0.95, notes: 'Deep wine shade is stunning on deep warm skin' },
  { skinTone: 'deep', skinUndertone: 'warm', productName: 'Classic Red Lipstick', matchScore: 0.9, notes: 'True red is universally stunning on deep skin' },
  { skinTone: 'deep', skinUndertone: 'warm', productName: 'Caramel Drip Gloss', matchScore: 0.9, notes: 'Rich caramel gloss for deep skin' },
  { skinTone: 'deep', skinUndertone: 'warm', productName: 'Antique Gold Shadow', matchScore: 0.95, notes: 'Gold makes deep warm eyes dazzle' },
  { skinTone: 'deep', skinUndertone: 'warm', productName: 'Charcoal Brow Pencil', matchScore: 0.9, notes: 'Soft black for deep-toned brows' },

  // ─── Deep + Cool ──────────────────────────────────────────
  { skinTone: 'deep', skinUndertone: 'cool', productName: 'Mahogany Foundation', matchScore: 1.0, notes: 'Cool red undertones perfect for deep cool skin' },
  { skinTone: 'deep', skinUndertone: 'cool', productName: 'Berry Bliss Blush', matchScore: 0.95, notes: 'Cool berry complements deep cool undertones' },
  { skinTone: 'deep', skinUndertone: 'cool', productName: 'Holographic Prism', matchScore: 0.85, notes: 'Multi-dimensional highlight on deep cool skin' },
  { skinTone: 'deep', skinUndertone: 'cool', productName: 'Fuchsia Lipstick', matchScore: 0.9, notes: 'Bold fuchsia is striking on deep cool skin' },
  { skinTone: 'deep', skinUndertone: 'cool', productName: 'Plum Lipstick', matchScore: 0.95, notes: 'Deep cool plum is made for deep cool complexions' },
  { skinTone: 'deep', skinUndertone: 'cool', productName: 'Ocean Sapphire Shadow', matchScore: 0.9, notes: 'Cool sapphire blue makes deep cool eyes pop' },
  { skinTone: 'deep', skinUndertone: 'cool', productName: 'Silver Frost Shadow', matchScore: 0.85, notes: 'Cool silver metallic for deep cool-toned eyes' },

  // ─── Very Deep + Neutral ──────────────────────────────────
  { skinTone: 'very_deep', skinUndertone: 'neutral', productName: 'Espresso Foundation', matchScore: 1.0, notes: 'Rich espresso for very deep neutral skin' },
  { skinTone: 'very_deep', skinUndertone: 'neutral', productName: 'Deep Setting Powder', matchScore: 0.95, notes: 'No white cast on very deep skin' },
  { skinTone: 'very_deep', skinUndertone: 'neutral', productName: 'Copper Glow', matchScore: 0.95, notes: 'Copper highlighter glows on very deep skin' },
  { skinTone: 'very_deep', skinUndertone: 'neutral', productName: 'Plum Wine Blush', matchScore: 0.95, notes: 'Rich plum creates visible flush on very deep skin' },
  { skinTone: 'very_deep', skinUndertone: 'neutral', productName: 'Oxblood Lipstick', matchScore: 0.9, notes: 'Vampy oxblood is striking on very deep skin' },
  { skinTone: 'very_deep', skinUndertone: 'neutral', productName: 'Hot Pink Lipstick', matchScore: 0.9, notes: 'Bright pink creates stunning contrast on very deep skin' },
  { skinTone: 'very_deep', skinUndertone: 'neutral', productName: 'Electric Violet Shadow', matchScore: 0.9, notes: 'Vivid violet is gorgeous on very deep skin' },
  { skinTone: 'very_deep', skinUndertone: 'neutral', productName: 'Charcoal Brow Pencil', matchScore: 0.95, notes: 'Soft charcoal for brow definition on deep skin' },
];
