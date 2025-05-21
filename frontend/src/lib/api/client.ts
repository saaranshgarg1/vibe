import createClient from 'openapi-fetch';
import { QueryClient } from '@tanstack/react-query';

// Create Query Client for React Query
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 60, // 1 hour
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Base API URL - this should point to your backend
const BASE_URL = 'http://localhost:4001/api';

// Create API client
export const apiClient = createClient({
  baseUrl: BASE_URL,
});

// Helper to get auth token from storage
export const getAuthToken = (): string | null => {
  const token = localStorage.getItem('auth-token');
  return token;
};

// Add auth token to requests
apiClient.use({
  async onRequest(request) {
    const token = getAuthToken();
    if (token) {
      request.headers.set('Authorization', `Bearer ${token}`);
    }
    return request;
  },
  async onResponse(response) {
    // Handle 401 Unauthorized responses
    if (response.status === 401) {
      // Clear auth token and redirect to login
      localStorage.removeItem('auth-token');
      window.location.href = '/auth';
    }
    return response;
  }
});