import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { SearchBar } from './SearchBar';
import { SpoilerToggle } from './SpoilerToggle';
import { HomeButton } from './HomeButton';

interface SearchSectionProps {
  initialQuery: string | null;
  onHomeClick: () => void;
}

export const SearchSection: React.FC<SearchSectionProps> = ({ initialQuery, onHomeClick }) => {
  const { videos, loading } = useSelector((state: RootState) => state.videos);
  const hasResults = videos.length > 0;
  
  if (!hasResults && !loading) {
    return <SearchBar initialQuery={initialQuery} />;
  }

  return (
    <>
      <div className="h-[73px]" />
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="px-6 py-3">
            <div className="flex items-center gap-4 max-w-3xl mx-auto">
              <HomeButton onClick={onHomeClick} />
              <SpoilerToggle />
              <SearchBar initialQuery={initialQuery} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchSection;