import React from 'react';
import { ImagePlus } from 'lucide-react';
import { ImageRecord } from '../../types';
import { ImageCard } from './ImageCard';
import { GallerySkeleton } from '../shared/LoadingSkeleton';

interface GalleryGridProps {
  images: ImageRecord[];
  isLoading?: boolean;
  onImageClick: (image: ImageRecord) => void;
}

export function GalleryGrid({ images, isLoading, onImageClick }: GalleryGridProps) {
  if (isLoading) {
    return <GallerySkeleton />;
  }

  if (!images || images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="p-6 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 rounded-3xl mb-6">
          <ImagePlus className="w-16 h-16 text-cyan-400" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">No Images Found</h3>
        <p className="text-gray-400 max-w-md">
          Upload your first image to get started with AI-powered analysis and archival.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {images.map((image) => (
        <ImageCard
          key={image.id}
          image={image}
          onClick={() => onImageClick(image)}
        />
      ))}
    </div>
  );
}
