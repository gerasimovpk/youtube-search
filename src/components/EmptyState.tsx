// EmptyState.tsx
import React from 'react';
import FeaturedMatches from './FeaturedMatches';

export const EmptyState: React.FC = () => {
  return (
    <div className="w-full">
      <FeaturedMatches />
    </div>
  );
};