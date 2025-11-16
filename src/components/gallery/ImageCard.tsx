import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { ImageRecord } from '../../types';
import { Badge } from '../shared/Badge';
import { ColorSwatch } from '../shared/ColorSwatch';
import { cn } from '../../lib/utils';

interface ImageCardProps {
  image: ImageRecord;
  onClick: () => void;
}

export function ImageCard({ image, onClick }: ImageCardProps) {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 10; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Star key={i} className="w-3 h-3 fill-amber-400/50 text-amber-400" />
        );
      } else {
        stars.push(
          <Star key={i} className="w-3 h-3 text-gray-600" />
        );
      }
    }
    return stars;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      onClick={onClick}
      className="group bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden cursor-pointer transition-all duration-300 hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/20"
    >
      <div className="relative aspect-square overflow-hidden bg-black/20">
        <img
          src={`data:image/jpeg;base64,${image.image_base64}`}
          alt={image.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Badge variant="rarity" rarity={image.analysis.rarity}>
            {image.analysis.rarity}
          </Badge>
        </div>

        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <div className="flex flex-wrap gap-1">
            {image.analysis.style_tags.slice(0, 3).map((tag, idx) => (
              <Badge key={idx} variant="tag" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-white text-lg line-clamp-1 group-hover:text-cyan-400 transition-colors">
            {image.title}
          </h3>
          <p className="text-sm text-gray-400 line-clamp-1">{image.uploader}</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {renderStars(image.analysis.rating)}
          </div>
          <span className="text-sm font-semibold text-cyan-400">
            {image.analysis.rating.toFixed(1)}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {image.analysis.dominant_colors.slice(0, 5).map((color, idx) => (
            <ColorSwatch key={idx} color={color} size="sm" />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
