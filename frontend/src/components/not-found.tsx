import { FC } from 'react';

export const NotFoundComponent: FC = () => {
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
