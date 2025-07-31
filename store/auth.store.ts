import { getCurrentUser } from '@/lib/appwrite';
import { User } from '@/type';
import { create } from 'zustand';

type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  setIsAuthenticated: (value: boolean) => void;
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
  fetchAuthenticatedUser: () => Promise<void>;
  logOutUser: () => void;
  reset: () => void;
};

const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  isLoading: true,

  setIsAuthenticated: (value) => set({ isAuthenticated: value }),
  setUser: (user) => set({ user }),
  setLoading: (value) => set({ isLoading: value }),

  fetchAuthenticatedUser: async () => {
    set({ isLoading: true });

    try {
      const user = await getCurrentUser();
      if (user) {
        set({ isAuthenticated: true });
        useAuthStore.getState().setUser(user as User);
      } else {
        useAuthStore.getState().reset();
      }
    } catch (error: any) {
      console.error('Failed to fetch authenticated user:', error?.message || error);
      useAuthStore.getState().reset();
    } finally {
      set({ isLoading: false });
    }
  },

  logOutUser: () => useAuthStore.getState().reset(),

  reset: () => set({ isAuthenticated: false, user: null, isLoading: false }),
}));

export default useAuthStore;
