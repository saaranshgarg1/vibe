import React from 'react';
import { 
  Router, 
  Route, 
  RootRoute, 
  redirect, 
  createMemoryHistory,
  Outlet,
  NotFoundRoute 
} from '@tanstack/react-router'
import { useAuthStore } from '@/lib/store/auth-store'

// Import pages and layouts
import AuthPage from '@/pages/auth-page'
import TeacherLayout from '@/layouts/teacher-layout'
import Dashboard from '@/pages/teacher/dashboard'
import CreateCourse from '@/pages/teacher/create-course'
import Editor from '@/pages/teacher/create-article'
import FaceDetectors from '@/pages/testing-proctoring/face-detectors'

// Not Found Component
const NotFoundComponent = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center p-8 bg-gray-50 rounded-lg shadow-lg max-w-md">
        <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
        <p className="text-gray-600 mb-6">The page you're looking for doesn't exist or has been moved.</p>
        <button 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => window.location.href = '/'}
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

// Root route with error and notFound handling
const rootRoute = new RootRoute({
  component: () => <Outlet />,
  notFoundComponent: NotFoundComponent,
  errorComponent: ({ error }) => {
    console.error('Router error:', error);
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center p-8 bg-red-50 rounded-lg shadow-lg max-w-md">
          <h1 className="text-2xl font-bold text-red-800 mb-4">Something went wrong</h1>
          <p className="text-red-600 mb-6">{error instanceof Error ? error.message : 'An unexpected error occurred'}</p>
          <button 
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={() => window.location.href = '/auth'}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }
});

// Auth route - accessible only when NOT authenticated
const authRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/auth',
  component: AuthPage,
  beforeLoad: () => {
    // Redirect to dashboard if already authenticated
    if (useAuthStore.getState().isAuthenticated) {
      throw redirect({
        to: '/teacher',
      })
    }
  },
});

// Index route with redirect
const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    // Redirect to appropriate dashboard or auth
    if (useAuthStore.getState().isAuthenticated) {
      const userRole = useAuthStore.getState().user?.role;
      if (userRole === 'teacher') {
        throw redirect({
          to: '/teacher',
        })
      } else {
        throw redirect({
          to: '/student',
        })
      }
    } else {
      throw redirect({
        to: '/auth',
      })
    }
  },
  component: () => null,
});

// Teacher layout route with auth check and notFound handling
const teacherLayoutRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/teacher',
  notFoundComponent: NotFoundComponent,
  beforeLoad: () => {
    // Auth check
    if (!useAuthStore.getState().isAuthenticated) {
      throw redirect({
        to: '/auth',
      })
    }
    
    // Role check
    const userRole = useAuthStore.getState().user?.role;
    if (userRole !== 'teacher') {
      throw redirect({
        to: '/auth',
      })
    }
  },
  component: () => (
    <TeacherLayout>
      <Outlet />
    </TeacherLayout>
  ),
});

// Teacher dashboard route
const teacherDashboardRoute = new Route({
  getParentRoute: () => teacherLayoutRoute,
  path: '/',
  component: Dashboard,
});

// Teacher create course route
const teacherCreateCourseRoute = new Route({
  getParentRoute: () => teacherLayoutRoute,
  path: '/courses/create',
  component: CreateCourse,
});

// Teacher create article route
const teacherCreateArticleRoute = new Route({
  getParentRoute: () => teacherLayoutRoute,
  path: '/courses/articles/create',
  component: Editor,
});

// Testing face detection route
const teacherTestingRoute = new Route({
  getParentRoute: () => teacherLayoutRoute,
  path: '/testing',
  component: FaceDetectors,
});

// Create a catch-all not found route
const notFoundRoute = new NotFoundRoute({
  getParentRoute: () => rootRoute,
  component: NotFoundComponent,
});

// Create the router with the route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  authRoute,
  teacherLayoutRoute.addChildren([
    teacherDashboardRoute,
    teacherCreateCourseRoute,
    teacherCreateArticleRoute,
    teacherTestingRoute,
  ]),
]);

// For server-side rendering compatibility
const memoryHistory = typeof window !== 'undefined' ? undefined : createMemoryHistory();

// Create router instance with additional options
export const router = new Router({
  routeTree,
  defaultPreload: 'intent',
  // Use memory history for SSR
  history: memoryHistory,
  // Global not found component
  defaultNotFoundComponent: NotFoundComponent,
  notFoundRoute,
});

// Export the types
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
