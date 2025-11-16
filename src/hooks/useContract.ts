import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { callContractMethod, writeContractMethod } from '../lib/genlayer';
import { ImageRecord, ComparisonResult, SearchFilters } from '../types';

export function useImageCount() {
  return useQuery({
    queryKey: ['imageCount'],
    queryFn: async () => {
      const result = await callContractMethod('count_images');
      return typeof result === 'number' ? result : parseInt(result);
    },
  });
}

export function useRecentImages(count: number = 50) {
  return useQuery({
    queryKey: ['recentImages', count],
    queryFn: async () => {
      const result = await callContractMethod('list_recent', [count.toString()]);
      return result as ImageRecord[];
    },
    staleTime: 30000,
  });
}

export function useImageById(id: string | null) {
  return useQuery({
    queryKey: ['image', id],
    queryFn: async () => {
      if (!id) return null;
      const result = await callContractMethod('get_record_by_id', [id]);
      return result as ImageRecord;
    },
    enabled: !!id,
  });
}

export function useSearchImages(filters: SearchFilters) {
  return useQuery({
    queryKey: ['searchImages', filters],
    queryFn: async () => {
      if (filters.styleTag) {
        return await callContractMethod('filter_by_style_tag', [filters.styleTag]) as ImageRecord[];
      }
      if (filters.dominantColor) {
        return await callContractMethod('filter_by_dominant_color', [filters.dominantColor]) as ImageRecord[];
      }
      const minRating = filters.minRating?.toString() || '0';
      return await callContractMethod('search', [
        filters.rarity || '',
        minRating,
        filters.keyword || '',
      ]) as ImageRecord[];
    },
    enabled: Object.keys(filters).length > 0,
    staleTime: 30000,
  });
}

export function useCompareImages() {
  return useMutation({
    mutationFn: async ({ idA, idB }: { idA: string; idB: string }) => {
      const result = await callContractMethod('compare_images', [idA, idB]);
      return result as ComparisonResult;
    },
  });
}

export function useUploadImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      imageBase64,
      title,
      uploader,
    }: {
      imageBase64: string;
      title: string;
      uploader: string;
    }) => {
      const timestamp = new Date().toISOString();
      const result = await writeContractMethod('add_image_and_rate', [
        imageBase64,
        title,
        uploader,
        timestamp,
      ]);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recentImages'] });
      queryClient.invalidateQueries({ queryKey: ['imageCount'] });
    },
  });
}
