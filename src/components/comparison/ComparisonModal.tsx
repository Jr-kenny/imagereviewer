import React, { useState } from 'react';
import { ArrowLeftRight, Star, Sparkles } from 'lucide-react';
import { ImageRecord, ComparisonResult } from '../../types';
import { Modal } from '../shared/Modal';
import { Button } from '../shared/Button';
import { Badge } from '../shared/Badge';
import { ColorSwatch } from '../shared/ColorSwatch';
import { useCompareImages } from '../../hooks/useContract';
import toast from 'react-hot-toast';

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: ImageRecord[];
  initialImage?: ImageRecord;
}

export function ComparisonModal({ isOpen, onClose, images, initialImage }: ComparisonModalProps) {
  const [imageA, setImageA] = useState<ImageRecord | null>(initialImage || null);
  const [imageB, setImageB] = useState<ImageRecord | null>(null);
  const [result, setResult] = useState<ComparisonResult | null>(null);

  const compareMutation = useCompareImages();

  const handleCompare = async () => {
    if (!imageA || !imageB) {
      toast.error('Please select two images to compare');
      return;
    }

    if (imageA.id === imageB.id) {
      toast.error('Please select two different images');
      return;
    }

    try {
      const comparisonResult = await compareMutation.mutateAsync({
        idA: imageA.id,
        idB: imageB.id,
      });
      setResult(comparisonResult);
      toast.success('Comparison complete!');
    } catch (error) {
      toast.error('Comparison failed. Please try again.');
      console.error('Comparison error:', error);
    }
  };

  const handleReset = () => {
    setImageA(initialImage || null);
    setImageB(null);
    setResult(null);
  };

  const ImageSelector = ({
    label,
    selectedImage,
    onSelect,
  }: {
    label: string;
    selectedImage: ImageRecord | null;
    onSelect: (image: ImageRecord) => void;
  }) => (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-white">{label}</h3>
      {selectedImage ? (
        <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
          <img
            src={`data:image/jpeg;base64,${selectedImage.image_base64}`}
            alt={selectedImage.title}
            className="w-full h-48 object-cover"
          />
          <div className="p-3">
            <p className="font-medium text-white line-clamp-1">{selectedImage.title}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="rarity" rarity={selectedImage.analysis.rarity}>
                {selectedImage.analysis.rarity}
              </Badge>
              <span className="text-sm text-cyan-400 flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                {selectedImage.analysis.rating.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white/5 rounded-xl border-2 border-dashed border-white/20 p-8 text-center">
          <p className="text-gray-400">Select an image</p>
        </div>
      )}
      {!result && (
        <div className="max-h-48 overflow-y-auto space-y-2">
          {images
            .filter((img) => img.id !== selectedImage?.id)
            .slice(0, 10)
            .map((image) => (
              <button
                key={image.id}
                onClick={() => onSelect(image)}
                className="w-full flex items-center gap-3 p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-left"
              >
                <img
                  src={`data:image/jpeg;base64,${image.image_base64}`}
                  alt={image.title}
                  className="w-12 h-12 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white line-clamp-1">{image.title}</p>
                  <p className="text-xs text-gray-400">{image.analysis.rarity}</p>
                </div>
              </button>
            ))}
        </div>
      )}
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Compare Images" size="xl">
      <div className="p-6">
        {!result ? (
          <>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <ImageSelector
                label="Image A"
                selectedImage={imageA}
                onSelect={setImageA}
              />
              <ImageSelector
                label="Image B"
                selectedImage={imageB}
                onSelect={setImageB}
              />
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleCompare}
                isLoading={compareMutation.isPending}
                disabled={!imageA || !imageB}
                className="flex-1"
                size="lg"
              >
                <ArrowLeftRight className="w-5 h-5 mr-2" />
                Compare Images
              </Button>
              <Button variant="outline" onClick={handleReset}>
                Reset
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 rounded-xl p-6 border border-cyan-500/20">
              <div className="flex items-center gap-2 text-cyan-400 mb-3">
                <Sparkles className="w-6 h-6" />
                <h3 className="text-xl font-semibold">AI Verdict</h3>
              </div>
              <p className="text-white text-lg leading-relaxed">{result.verdict}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[result.image_a, result.image_b].map((image, idx) => (
                <div
                  key={idx}
                  className="bg-white/5 rounded-xl border border-white/10 overflow-hidden"
                >
                  <img
                    src={`data:image/jpeg;base64,${image.image_base64}`}
                    alt={image.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-4 space-y-3">
                    <h4 className="font-semibold text-white text-lg">{image.title}</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-gray-400">Rating</p>
                        <p className="text-amber-400 font-semibold flex items-center gap-1">
                          <Star className="w-4 h-4 fill-amber-400" />
                          {image.analysis.rating.toFixed(1)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400">Rarity</p>
                        <Badge variant="rarity" rarity={image.analysis.rarity}>
                          {image.analysis.rarity}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-2">Dominant Colors</p>
                      <div className="flex gap-1">
                        {image.analysis.dominant_colors.slice(0, 5).map((color, i) => (
                          <ColorSwatch key={i} color={color} size="sm" />
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-2">Style Tags</p>
                      <div className="flex flex-wrap gap-1">
                        {image.analysis.style_tags.slice(0, 3).map((tag, i) => (
                          <Badge key={i} variant="tag" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <Button onClick={handleReset} className="flex-1">
                Compare Different Images
              </Button>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
