import React from 'react';

export const EmptyState: React.FC = () => {
  return (
    <div className="text-center w-full max-w-md mx-auto">
      <div className="w-24 h-24 mx-auto mb-6 text-gray-300">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold mb-2">Search Football Matches</h2>
      <p className="text-gray-500">
        Find and watch football matches without spoilers.<br />
        Enter a team name or competition to get started.
      </p>
    </div>
  );
};