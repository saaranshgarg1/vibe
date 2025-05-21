import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, setAuthToken, withAuth } from './client';
import { paths } from './schema';

type LoginCredentials = {
  email: string;
  password: string;
};

// Auth hooks
export function useLogin() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const { data, error } = await api.POST('/api/auth/login', {
        body: credentials,
      });
      
      if (error) {
        throw new Error(error.message || 'Login failed');
      }
      
      if (!data) {
        throw new Error('Login failed: No data returned');
      }
      
      // Set auth token for subsequent requests
      setAuthToken(data.token);
      
      return data;
    },
    onSuccess: (data) => {
      // Invalidate queries that might depend on auth state
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      // Clear auth token
      setAuthToken(null);
      return true;
    },
    onSuccess: () => {
      // Clear all queries from cache
      queryClient.clear();
    },
  });
}

// Example queries with authentication
export function useCourses() {
  return useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const { data, error } = await api.GET('/api/courses', withAuth({}));
      
      if (error) {
        throw new Error(error.message || 'Failed to fetch courses');
      }
      
      return data;
    },
  });
}

export function useUserProfile() {
  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data, error } = await api.GET('/api/users/me', withAuth({}));
      
      if (error) {
        throw new Error(error.message || 'Failed to fetch user profile');
      }
      
      return data;
    },
  });
}

// Extend with more hooks as needed according to your API spec
// For example:
/*
export function useCourses() {
  return useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const { data, error } = await api.GET('/api/courses');
      if (error) throw new Error(error.message || 'Failed to fetch courses');
      return data;
    },
  });
}
*/ 