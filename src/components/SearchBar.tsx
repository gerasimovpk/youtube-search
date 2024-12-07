import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppDispatch } from '../store';
import { searchVideos } from '../store/videoSlice';
import { Search } from 'lucide-react';

export const SearchBar: React.FC<{ 
  initialQuery: string | null;
  autoFocus?: boolean;
}> = ({ initialQuery, autoFocus }) => {
  const [searchTerm, setSearchTerm] = useState(initialQuery || '');
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  // Update search term when URL changes
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const queryParam = searchParams.get('q');
    if (queryParam && queryParam !== searchTerm) {
      setSearchTerm(queryParam);
    }
  }, [location.search]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Preserve video ID if it exists
      const searchParams = new URLSearchParams(location.search);
      const videoId = searchParams.get('v');
      
      // Update search parameters
      searchParams.set('q', searchTerm);
      if (videoId) {
        searchParams.set('v', videoId);
      }

      dispatch(searchVideos(searchTerm));
      navigate(`/search?${searchParams.toString()}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex-1 flex gap-3">
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search videos..."
          autoFocus={autoFocus}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl 
            text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 
            focus:ring-blue-500 shadow-sm"
        />
      </div>
      <button
        type="submit"
        className="px-6 py-2.5 bg-blue-500 text-white font-medium rounded-xl 
          hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 
          shadow-sm transition-colors"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;