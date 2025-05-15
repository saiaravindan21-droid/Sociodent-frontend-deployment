import React from 'react';

interface LoadingProps {
  readonly message?: string;
}

export const Loading = React.memo(function Loading({ message = 'Loading...' }: LoadingProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sociodent-600 mx-auto"></div>
        <p className="mt-4 text-lg text-gray-700">{message}</p>
      </div>
    </div>
  );
});
