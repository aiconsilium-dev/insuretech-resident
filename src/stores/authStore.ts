import { create } from 'zustand';
import type { ApiUser } from '@/lib/api/types';

interface AuthState {
  user: ApiUser | null;
  isAuthenticated: boolean;
  setUser: (user: ApiUser) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: true }),
  clearAuth: () => set({ user: null, isAuthenticated: false }),
}));
