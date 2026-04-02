import { useMutation } from '@tanstack/react-query';
import { createClaim, uploadPhotos, runEstimate } from '@/lib/api/claims';
import { queryClient } from '@/lib/queryClient';
import { queryKeys } from '@/lib/queryKeys';

export function useCreateClaim() {
  return useMutation({
    mutationFn: createClaim,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.claims() });
    },
  });
}

export function useUploadPhotos() {
  return useMutation({
    mutationFn: ({ claimId, files }: { claimId: string; files: File[] }) =>
      uploadPhotos(claimId, files),
  });
}

export function useRunEstimate() {
  return useMutation({
    mutationFn: (claimId: string) => runEstimate(claimId),
  });
}
