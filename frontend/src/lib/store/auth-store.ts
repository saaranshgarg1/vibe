import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type User = {
  uid: string;
  email: string;
  name?: string;
  role: 'teacher' | 'student' | 'admin' | null;
  avatar?: string;
};

type AuthStore = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  clearUser: () => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => {
        set({ token });
        localStorage.setItem('auth-token', token);
      },
      clearUser: () => {
        set({ user: null, token: null, isAuthenticated: false });
        localStorage.removeItem('auth-token');
      },
    }),
    {
      name: 'auth-store',
    }
  )
);

// Subscribe to store changes to update the auth header in API client
useAuthStore.subscribe((state) => {
  if (state.token) {
    // Set token for API client (if needed beyond localStorage)
    console.log('Auth token updated in store');
  }
});
