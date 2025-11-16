import React from 'react';
import { Star, Calendar, User, Palette, Tag, Heart, Sparkles } from 'lucide-react';
import { ImageRecord } from '../../types';
import { Modal } from '../shared/Modal';
import { Badge } from '../shared/Badge';
import { ColorSwatch } from '../shared/ColorSwatch';
import { formatDate } from '../../lib/utils';
import { Button } from '../shared/Button';

interface ImageDetailModalProps {
  image: ImageRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onCompare?: (image: ImageRecord) => void;
}

export function ImageDetailModal({ image, isOpen, onClose, onCompare }: ImageDetailModalProps) {
  if (!image) return null;

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 10; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Star key={i} className="w-5 h-5 fill-amber-400/50 text-amber-400" />
        );
      } else {
        stars.push(
          <Star key={i} className="w-5 h-5 text-gray-600" />
        );
      }
    }
    return stars;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <div className="grid md:grid-cols-2 gap-6 p-6">
        <div className="space-y-4">
          <div className="relative aspect-square rounded-xl overflow-hidden bg-black/20">
            <img
              src={`data:image/jpeg;base64,${image.image_base64}`}
              alt={image.title}
              className="w-full h-full object-contain"
            />
          </div>

          <div className="bg-white/5 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <User className="w-4 h-4" />
              <span>{image.uploader}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(image.timestamp)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Sparkles className="w-4 h-4" />
              <span>ID: {image.id}</span>
            </div>
          </div>
        </div>

        <div className="space-y-6 overflow-y-auto max-h-[70vh]">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">{image.title}</h2>
            <Badge variant="rarity" rarity={image.analysis.rarity} className="text-base px-4 py-2">
              {image.analysis.rarity}
            </Badge>
          </div>

          <div className="bg-gradient-to-br from-amber-500/10 to-orange-600/10 rounded-xl p-6 border border-amber-500/20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Star className="w-6 h-6 text-amber-400" />
                <h3 className="text-xl font-semibold text-white">Rating</h3>
              </div>
              <span className="text-3xl font-bold text-amber-400">
                {image.analysis.rating.toFixed(1)}
              </span>
            </div>
            <div className="flex gap-1">{renderStars(image.analysis.rating)}</div>
          </div>

          <div className="bg-white/5 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-cyan-400 mb-3">
              <Palette className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Color Analysis</h3>
            </div>
            <p className="text-gray-300 leading-relaxed">{image.analysis.color_profile}</p>
            <div className="flex flex-wrap gap-3 pt-2">
              {image.analysis.dominant_colors.map((color, idx) => (
                <ColorSwatch key={idx} color={color} size="lg" showHex copyable />
              ))}
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-cyan-400 mb-3">
              <Tag className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Style Tags</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {image.analysis.style_tags.map((tag, idx) => (
                <Badge key={idx} variant="tag" className="text-sm px-3 py-1.5">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-cyan-400 mb-3">
              <Heart className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Emotion</h3>
            </div>
            <p className="text-gray-300 text-lg">{image.analysis.emotion}</p>
          </div>

          <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 rounded-xl p-6 border border-cyan-500/20">
            <div className="flex items-center gap-2 text-cyan-400 mb-3">
              <Sparkles className="w-5 h-5" />
              <h3 className="text-lg font-semibold">AI Analysis</h3>
            </div>
            <p className="text-gray-300 leading-relaxed whitespace-pre-line">
              {image.analysis.rationale}
            </p>
          </div>

          {onCompare && (
            <Button onClick={() => onCompare(image)} className="w-full" size="lg">
              Compare with Another Image
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
