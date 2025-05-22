import { auth, provider } from '../firebase';
import { 
  signInWithPopup, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser // Import Firebase User type
} from 'firebase/auth';
import { useAuthStore } from '../store/auth-store'; // Removed unused User import
import { queryClient } from './client';
import { useMutation } from '@tanstack/react-query'; // Import useMutation

// Convert Firebase user to our app user model
const mapFirebaseUserToAppUser = async (firebaseUser: FirebaseUser | null) => {
  if (!firebaseUser) return null;
  
  try {
    // Get token for backend API calls
    const token = await firebaseUser.getIdToken();
    
    // Store token
    useAuthStore.getState().setToken(token);
    
    // Map user
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email || '',
      name: firebaseUser.displayName || '',
      role: 'teacher' as const, // Use const assertion to match the allowed role values
      avatar: firebaseUser.photoURL || '',
    };
  } catch (error) {
    console.error('Error mapping Firebase user:', error);
    return null;
  }
};

// Initialize auth listener
export const initAuth = () => {
  const { setUser, clearUser } = useAuthStore.getState();
  
  return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
    if (firebaseUser) {
      const user = await mapFirebaseUserToAppUser(firebaseUser);
      if (user) {
        setUser(user);
      }
    } else {
      clearUser();
    }
  });
};

// Login with Google in a popup
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = await mapFirebaseUserToAppUser(result.user);
    if (user) {
      useAuthStore.getState().setUser(user);
    }
    return result;
  } catch (error) {
    console.error('Google login error:', error);
    throw error;
  }
};

// Login with email/password
export const loginWithEmail = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = await mapFirebaseUserToAppUser(result.user);
    if (user) {
      useAuthStore.getState().setUser(user);
    }
    return result;
  } catch (error) {
    console.error('Email login error:', error);
    throw error;
  }
};

// Use a single implementation of logout and checkAuth
// Logout
export function logout() {
  // Clear token
  localStorage.removeItem('auth-token');
  
  // Sign out from Firebase
  firebaseSignOut(auth).catch(err => console.error('Firebase logout error:', err));
  
  // Clear user from store
  useAuthStore.getState().clearUser();
  
  // Reset query client
  queryClient.clear();
}

// Check if user is authenticated
export function checkAuth() {
  const token = localStorage.getItem('auth-token');
  const firebaseUser = auth.currentUser;
  return !!token && !!firebaseUser;
}

// API-specific functions
export function useLogin() {
  const setUser = useAuthStore((state) => state.setUser);
  
  return useMutation<LoginResponse, Error, { email: string; password: string }>({
    mutationFn: async (credentials) => {
      try {
        // Use standard fetch instead of the OpenAPI client for auth
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4001'}/api/auth/verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Login failed with status: ${response.status}`);
        }
        
        const data = await response.json();
        return data as LoginResponse;
      } catch (error) {
        throw error instanceof Error ? error : new Error('Unknown login error');
      }
    },
    onSuccess: (data: LoginResponse) => {
      // Save token in localStorage
      localStorage.setItem('auth-token', data.token);
      
      // Set user in store
      setUser({
        uid: data.user.id,
        name: data.user.firstName + ' ' + data.user.lastName,
        email: data.user.email,
        role: data.user.role as 'teacher' | 'student' | 'admin' | null,
        avatar: data.user.avatar || ''
      });
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['user'] });
    }
  });
}

export function useSignup() {
  const setUser = useAuthStore((state) => state.setUser);
  
  return useMutation<SignupResponse, Error, { 
    name: string; 
    email: string; 
    password: string;
    role: 'teacher' | 'student';
  }>({
    mutationFn: async (userData) => {
      try {
        // Split the name into firstName and lastName
        const nameParts = userData.name.split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
        
        // Use standard fetch instead of the OpenAPI client for auth
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4001'}/api/auth/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstName,
            lastName,
            email: userData.email,
            password: userData.password,
            role: userData.role
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Signup failed with status: ${response.status}`);
        }
        
        const data = await response.json();
        return data as SignupResponse;
      } catch (error) {
        throw error instanceof Error ? error : new Error('Unknown signup error');
      }
    },
    onSuccess: (data: SignupResponse) => {
      // Save token in localStorage
      localStorage.setItem('auth-token', data.token);
      
      // Set user in store
      setUser({
        uid: data.user.id, // Use uid instead of id
        name: data.user.firstName + ' ' + data.user.lastName,
        email: data.user.email,
        role: data.user.role as 'teacher' | 'student' | 'admin' | null,
        avatar: data.user.avatar || ''
      });
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['user'] });
    }
  });
}

// Add type definitions for API responses
interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    avatar?: string;
  };
}

interface SignupResponse {
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    avatar?: string;
  };
}
