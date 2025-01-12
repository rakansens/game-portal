import { create } from 'zustand';
import { LiffUser } from '../types/liff';

interface AuthState {
  user: LiffUser | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: LiffUser | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  error: null,
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  logout: () => set({ user: null }),
  initializeAuth: () => {
    // 開発環境用のモックユーザー
    if (process.env.NODE_ENV === 'development') {
      console.log('Using mock user for development');
      set({
        user: {
          id: 'mock-user-id',
          displayName: '開発ユーザー',
          pictureUrl: null,
        },
        isLoading: false,
      });
      return;
    }

    // TODO: LIFF認証の実装
    set({ isLoading: false });
  },
}));
