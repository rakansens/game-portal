import { create } from 'zustand';
import { AuthState, LiffUser } from '../types/liff';

export const useAuthStore = create<AuthState & {
  setUser: (user: LiffUser | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
}>((set) => ({
  user: null,
  isLoading: true,
  error: null,
  setUser: (user) => set({ user, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),
  logout: () => set({ user: null, error: null }),
}));
