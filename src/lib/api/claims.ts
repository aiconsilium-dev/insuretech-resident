import { apiFetch } from './client';
import type {
  ApiClaim,
  ApiEstimation,
  CreateClaimRequest,
  ClaimsFilter,
  PaginatedResponse,
  MessageResponse,
} from './types';

export const getClaims = (
  filters?: ClaimsFilter
): Promise<PaginatedResponse<ApiClaim>> => {
  const params = new URLSearchParams();
  if (filters?.status) params.set('status', filters.status);
  if (filters?.category) params.set('category', filters.category);
  if (filters?.page != null) params.set('page', String(filters.page));
  if (filters?.size != null) params.set('size', String(filters.size));
  const query = params.toString();
  return apiFetch(`/api/claims${query ? `?${query}` : ''}`);
};

export const getClaimById = (id: string): Promise<ApiClaim> =>
  apiFetch(`/api/claims/${id}`);

export const createClaim = (req: CreateClaimRequest): Promise<ApiClaim> =>
  apiFetch('/api/claims', {
    method: 'POST',
    body: JSON.stringify(req),
  });

export const uploadPhotos = (
  claimId: string,
  files: File[]
): Promise<MessageResponse> => {
  const form = new FormData();
  files.forEach((f) => form.append('photos', f));
  return apiFetch(`/api/claims/${claimId}/photos`, {
    method: 'POST',
    body: form,
  });
};

export const runEstimate = (claimId: string): Promise<ApiEstimation> =>
  apiFetch(`/api/claims/${claimId}/estimate`, { method: 'POST' });

export const requestVisit = (claimId: string): Promise<MessageResponse> =>
  apiFetch(`/api/claims/${claimId}/visit`, { method: 'POST' });

export const submitAppeal = (
  claimId: string,
  reason: string
): Promise<MessageResponse> =>
  apiFetch(`/api/claims/${claimId}/appeal`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  });
