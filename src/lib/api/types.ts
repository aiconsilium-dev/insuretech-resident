// ── 공통 ──────────────────────────────────────────────────────────────────────

export type Role = 'resident';

export type ClaimCategory = 'facility' | 'leak' | 'injury' | 'fire';

export type ClaimStatus =
  | 'submitted'
  | 'classifying'
  | 'field_check_pending'
  | 'field_checking'
  | 'estimating'
  | 'estimated'
  | 'approval_pending'
  | 'approved'
  | 'denied'
  | 'paid'
  | 'appealed';

export type TypeClass = 'A' | 'B' | 'C';

// ── ERD: users ────────────────────────────────────────────────────────────────

export interface ApiUser {
  id: string;
  role: Role;
  name: string;
  phone: string;
  email?: string;
  apartment_id?: string;
  apartment_name?: string;
  unit_dong?: string;
  unit_ho?: string;
  created_at: string;
}

// ── ERD: claims ───────────────────────────────────────────────────────────────

export interface ApiClaim {
  id: string;
  claim_number: string;
  apartment_id: string;
  reporter_id: string;
  source: 'resident' | 'office' | 'admin';
  category: ClaimCategory;
  type_class?: TypeClass;
  status: ClaimStatus;
  location_type: 'private' | 'common';
  location_detail?: string;
  description?: string;
  damage_amount_ai?: number;
  deductible?: number;
  insurance_amount_ai?: number;
  damage_amount_final?: number;
  insurance_amount_final?: number;
  created_at: string;
  updated_at: string;
}

// ── ERD: estimations ──────────────────────────────────────────────────────────

export interface ApiEstimation {
  estimation_id: string;
  claim_id: string;
  version: number;
  items: EstimationItem[];
  total_damage: number;
  deductible: number;
  insurance_amount: number;
  is_ai_generated: boolean;
  created_at: string;
}

export interface EstimationItem {
  work_type: string;
  unit: string;
  quantity: number;
  unit_price: number;
  amount: number;
}

// ── ERD: notifications ────────────────────────────────────────────────────────

export interface ApiNotification {
  id: string;
  user_id: string;
  type:
    | 'claim_status'
    | 'field_check'
    | 'approval'
    | 'opinion'
    | 'visit_request'
    | 'system';
  title: string;
  body?: string;
  claim_id?: string;
  is_read: boolean;
  created_at: string;
}

// ── 요청 페이로드 ─────────────────────────────────────────────────────────────

export interface SendOtpRequest {
  phone: string;
}

export interface LoginRequest {
  phone: string;
  otp_code: string;
}

export interface RegisterRequest {
  name: string;
  phone: string;
  email: string;
  apartment_name: string;
  unit_dong: string;
  unit_ho: string;
  id_card_photo?: File;
}

export interface CreateClaimRequest {
  category: ClaimCategory;
  location_type: 'private' | 'common';
  location_detail?: string;
  description?: string;
  details?: Record<string, unknown>;
}

export interface ClaimsFilter {
  status?: ClaimStatus;
  category?: ClaimCategory;
  page?: number;
  size?: number;
}

// ── 응답 래퍼 ─────────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  total_pages: number;
}

export interface AuthResponse {
  access_token: string; // refresh_token은 HTTP-Only Cookie로 서버가 Set-Cookie 발급
  user: ApiUser;
}

export interface MessageResponse {
  message: string;
}
