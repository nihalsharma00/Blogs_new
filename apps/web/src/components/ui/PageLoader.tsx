import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';

export const PageLoader: React.FC = () => {
  return (
    <div className="flex-grow flex items-center justify-center min-h-[50vh]">
      <LoadingSpinner message="Loading page..." />
    </div>
  );
};
