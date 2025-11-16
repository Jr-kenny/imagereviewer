export interface ImageAnalysis {
  rating: number;
  rarity: 'unique' | 'rare' | 'common';
  color_profile: string;
  dominant_colors: string[];
  style_tags: string[];
  emotion: string;
  rationale: string;
}

export interface ImageRecord {
  id: string;
  title: string;
  uploader: string;
  timestamp: string;
  image_base64: string;
  analysis: ImageAnalysis;
}

export interface ComparisonResult {
  verdict: string;
  image_a: ImageRecord;
  image_b: ImageRecord;
}

export interface SearchFilters {
  rarity?: 'unique' | 'rare' | 'common';
  minRating?: number;
  keyword?: string;
  styleTag?: string;
  dominantColor?: string;
}

export interface Statistics {
  totalImages: number;
  averageRating: number;
  rarityDistribution: {
    unique: number;
    rare: number;
    common: number;
  };
  commonStyleTags: { tag: string; count: number }[];
}
