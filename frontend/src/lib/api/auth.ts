import { auth, provider } from '../firebase';
import { 
  signInWithPopup, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { useAuthStore } from '../store/auth-store';
import { apiClient, queryClient } from './client';

// Convert Firebase user to our app user model
const mapFirebaseUserToAppUser = async (firebaseUser) => {
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
      role: 'teacher', // Default role, should come from your backend
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
  
  return onAuthStateChanged(auth, async (firebaseUser) => {
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
    useAuthStore.getState().setUser(user);
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
    useAuthStore.getState().setUser(user);
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
  
  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await apiClient.POST('/auth/login', {
        body: credentials
      });
      
      if (response.error) {
        throw new Error(response.error.message || 'Login failed');
      }
      
      return response.data;
    },
    onSuccess: (data) => {
      // Save token in localStorage
      localStorage.setItem('auth-token', data.token);
      
      // Set user in store
      setUser({
        id: data.user.id,
        name: data.user.firstName + ' ' + data.user.lastName,
        email: data.user.email,
        role: data.user.role,
        avatar: data.user.avatar || ''
      });
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['user'] });
    }
  });
}

export function useSignup() {
  const setUser = useAuthStore((state) => state.setUser);
  
  return useMutation({
    mutationFn: async (userData: { 
      name: string; 
      email: string; 
      password: string;
      role: 'teacher' | 'student';
    }) => {
      // Split the name into firstName and lastName
      const nameParts = userData.name.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
      
      const response = await apiClient.POST('/auth/signup', {
        body: {
          firstName,
          lastName,
          email: userData.email,
          password: userData.password,
          role: userData.role
        }
      });
      
      if (response.error) {
        throw new Error(response.error.message || 'Signup failed');
      }
      
      return response.data;
    },
    onSuccess: (data) => {
      // Save token in localStorage
      localStorage.setItem('auth-token', data.token);
      
      // Set user in store
      setUser({
        id: data.user.id,
        name: data.user.firstName + ' ' + data.user.lastName,
        email: data.user.email,
        role: data.user.role,
        avatar: data.user.avatar || ''
      });
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['user'] });
    }
  });
}
