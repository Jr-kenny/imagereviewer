import React, { useCallback, useState } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn, validateImageFile, imageToBase64 } from '../../lib/utils';
import { Button } from '../shared/Button';
import { useUploadImage } from '../../hooks/useContract';
import toast from 'react-hot-toast';

export function UploadZone() {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [uploader, setUploader] = useState('');

  const uploadMutation = useUploadImage();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      processFile(droppedFile);
    }
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  }, []);

  const processFile = (selectedFile: File) => {
    const validation = validateImageFile(selectedFile);
    if (!validation.valid) {
      toast.error(validation.error || 'Invalid file');
      return;
    }

    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleClearPreview = () => {
    setPreview(null);
    setFile(null);
    setTitle('');
  };

  const handleSubmit = async () => {
    if (!file || !title.trim()) {
      toast.error('Please provide an image and title');
      return;
    }

    try {
      const base64 = await imageToBase64(file);

      await uploadMutation.mutateAsync({
        imageBase64: base64,
        title: title.trim(),
        uploader: uploader.trim() || 'Anonymous',
      });

      toast.success('Image uploaded successfully! AI analysis in progress...');
      handleClearPreview();
      setUploader('');
    } catch (error) {
      toast.error('Upload failed. Please try again.');
      console.error('Upload error:', error);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {!preview ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'relative border-2 border-dashed rounded-2xl p-12 transition-all duration-300',
            isDragging
              ? 'border-cyan-500 bg-cyan-500/10 scale-105'
              : 'border-white/20 bg-white/5 hover:border-cyan-500/50 hover:bg-white/10'
          )}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            aria-label="Upload image"
          />

          <div className="flex flex-col items-center gap-4 text-center pointer-events-none">
            <div className="p-4 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-2xl">
              <Upload className="w-12 h-12 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Drop your image here
              </h3>
              <p className="text-gray-400">
                or click to browse (JPEG, PNG, WebP • Max 10MB)
              </p>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden"
        >
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-96 object-contain bg-black/20"
            />
            <button
              onClick={handleClearPreview}
              className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-lg transition-colors"
              aria-label="Remove image"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                Image Title *
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a descriptive title..."
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label htmlFor="uploader" className="block text-sm font-medium text-gray-300 mb-2">
                Your Name (Optional)
              </label>
              <input
                id="uploader"
                type="text"
                value={uploader}
                onChange={(e) => setUploader(e.target.value)}
                placeholder="Anonymous"
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                onClick={handleSubmit}
                isLoading={uploadMutation.isPending}
                className="flex-1"
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                Upload & Analyze
              </Button>
              <Button
                onClick={handleClearPreview}
                variant="outline"
                disabled={uploadMutation.isPending}
              >
                Cancel
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
