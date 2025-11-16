import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { Upload, Grid3x3, BarChart3 } from 'lucide-react';
import { useThemeStore } from './store/themeStore';
import { Header } from './components/layout/Header';
import { UploadZone } from './components/upload/UploadZone';
import { GalleryGrid } from './components/gallery/GalleryGrid';
import { FilterPanel } from './components/filters/FilterPanel';
import { ImageDetailModal } from './components/detail/ImageDetailModal';
import { ComparisonModal } from './components/comparison/ComparisonModal';
import { StatsPanel } from './components/stats/StatsPanel';
import { Button } from './components/shared/Button';
import { useRecentImages, useSearchImages } from './hooks/useContract';
import { ImageRecord, SearchFilters } from './types';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function AppContent() {
  const { isDark } = useThemeStore();
  const [view, setView] = useState<'upload' | 'gallery' | 'stats'>('gallery');
  const [selectedImage, setSelectedImage] = useState<ImageRecord | null>(null);
  const [comparisonImage, setComparisonImage] = useState<ImageRecord | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({});

  const hasFilters = Object.keys(filters).some(
    (key) => filters[key as keyof SearchFilters] !== undefined
  );

  const { data: recentImages = [], isLoading: isLoadingRecent } = useRecentImages(50);
  const { data: searchResults = [], isLoading: isLoadingSearch } = useSearchImages(filters);

  const displayImages = hasFilters ? searchResults : recentImages;
  const isLoading = hasFilters ? isLoadingSearch : isLoadingRecent;

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const handleCompareClick = (image: ImageRecord) => {
    setComparisonImage(image);
    setSelectedImage(null);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'dark bg-gray-950' : 'bg-gray-50'}`}>
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {view === 'upload' && 'Upload Image'}
                {view === 'gallery' && 'Image Archive'}
                {view === 'stats' && 'Statistics'}
              </h2>
              <p className="text-gray-400">
                {view === 'upload' && 'Upload and analyze images with AI'}
                {view === 'gallery' && 'Browse and filter your image collection'}
                {view === 'stats' && 'Explore collection insights and trends'}
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant={view === 'gallery' ? 'primary' : 'ghost'}
                onClick={() => setView('gallery')}
                size="sm"
              >
                <Grid3x3 className="w-4 h-4 mr-2" />
                Gallery
              </Button>
              <Button
                variant={view === 'upload' ? 'primary' : 'ghost'}
                onClick={() => setView('upload')}
                size="sm"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </Button>
              <Button
                variant={view === 'stats' ? 'primary' : 'ghost'}
                onClick={() => setView('stats')}
                size="sm"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Stats
              </Button>
            </div>
          </div>

          {view === 'upload' && (
            <div className="flex justify-center">
              <UploadZone />
            </div>
          )}

          {view === 'gallery' && (
            <div className="space-y-6">
              <FilterPanel
                onFilterChange={setFilters}
                resultCount={displayImages.length}
              />
              <GalleryGrid
                images={displayImages}
                isLoading={isLoading}
                onImageClick={setSelectedImage}
              />
            </div>
          )}

          {view === 'stats' && <StatsPanel images={displayImages} />}
        </div>
      </main>

      <ImageDetailModal
        image={selectedImage}
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        onCompare={handleCompareClick}
      />

      <ComparisonModal
        isOpen={!!comparisonImage}
        onClose={() => setComparisonImage(null)}
        images={displayImages}
        initialImage={comparisonImage || undefined}
      />

      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: isDark ? '#1f2937' : '#ffffff',
            color: isDark ? '#ffffff' : '#000000',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
        }}
      />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;
