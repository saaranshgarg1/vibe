import { createContext } from 'react';
import { useAuthStore } from '@/lib/store/auth-store';

type Role = 'teacher' | 'student' | 'admin' | null;

// Create a context with default values from our Zustand store
export const AuthContext = createContext({
  role: null as Role,
  login: (_selectedRole: Role, _uid: string, _email: string) => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Use the Zustand store directly
  const { user, setUser, clearUser } = useAuthStore();

  const login = (selectedRole: Role, uid: string, email: string) => {
    if (selectedRole) {
      setUser({
        uid,
        email,
        role: selectedRole,
      });
    }
  };
  
  const logout = () => clearUser();

  return (
    <AuthContext.Provider value={{ 
      role: user?.role || null,
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}
