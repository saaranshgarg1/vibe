import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { setAuthToken } from './client';
import { components } from './schema';

type LoginCredentials = {
  email: string;
  password: string;
};

// Auth hooks
export function useLogin() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await fetch(`${window.location.origin}/api/auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Login failed');
      }
      
      const data = await response.json();
      
      // Set auth token for subsequent requests
      if (data.token) {
        setAuthToken(data.token);
      }
      
      return data;
    },
    onSuccess: () => {
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

// Courses query with authentication
export function useCourses() {
  return useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const response = await fetch(`${window.location.origin}/api/courses`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch courses');
      }
      
      return response.json();
    },
  });
}

export function useUserProfile() {
  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await fetch(`${window.location.origin}/api/users/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch user profile');
      }
      
      return response.json();
    },
  });
}

// Course hooks
export function useCreateCourse() {
  const queryClient = useQueryClient();
  
  return useMutation<
    components['schemas']['CourseDataResponse'], 
    Error, 
    components['schemas']['CreateCourseBody']
  >({
    mutationFn: async (courseData) => {
      const token = localStorage.getItem('auth-token');
      const response = await fetch(`${window.location.origin}/api/courses/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify(courseData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to create course');
      }
      
      const data = await response.json();
      
      if (!data) {
        throw new Error('No data returned from course creation');
      }
      
      return data;
    },
    onSuccess: () => {
      // Invalidate courses query to refetch the list
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    }
  });
}