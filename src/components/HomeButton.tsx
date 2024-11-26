import React from 'react';
import { Home } from 'lucide-react';

interface HomeButtonProps {
  onClick: () => void;
}

export const HomeButton: React.FC<HomeButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
    >
      <Home size={20} />
    </button>
  );
};