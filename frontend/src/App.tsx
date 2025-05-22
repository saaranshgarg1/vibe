import { useEffect } from 'react';
import { RouterProvider } from '@tanstack/react-router';
import { router } from '@/routes/router';
import { initAuth } from '@/lib/api/auth';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/api/client';
import { AuthProvider } from '@/context/auth';

export function App() {
  // Initialize Firebase auth listener
  useEffect(() => {
    const unsubscribe = initAuth();
    return () => unsubscribe();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  );
}
