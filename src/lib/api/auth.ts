import { apiFetch } from './client';
import type {
  AuthResponse,
  ApiUser,
  SendOtpRequest,
  LoginRequest,
  RegisterRequest,
  MessageResponse,
} from './types';

export const sendOtp = (req: SendOtpRequest): Promise<MessageResponse> =>
  apiFetch('/api/auth/otp', {
    method: 'POST',
    body: JSON.stringify(req),
  });

export const loginWithOtp = (req: LoginRequest): Promise<AuthResponse> =>
  apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(req),
  });

export const register = (req: RegisterRequest): Promise<AuthResponse> => {
  const form = new FormData();
  form.append('name', req.name);
  form.append('phone', req.phone);
  form.append('email', req.email);
  form.append('apartment_name', req.apartment_name);
  form.append('unit_dong', req.unit_dong);
  form.append('unit_ho', req.unit_ho);
  if (req.id_card_photo) {
    form.append('id_card_photo', req.id_card_photo);
  }
  return apiFetch('/api/auth/register', {
    method: 'POST',
    body: form,
  });
};

export const getMe = (): Promise<ApiUser> => apiFetch('/api/auth/me');

// refresh_token은 HTTP-Only 쿠키로 자동 전송 → body에 포함 불필요
export const logout = (): Promise<MessageResponse> =>
  apiFetch('/api/auth/logout', { method: 'POST' });
