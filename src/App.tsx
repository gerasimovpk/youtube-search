import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store';
import { useNavigate, useLocation, useLoaderData, Outlet } from 'react-router-dom';
import { setSelectedVideo } from './store/videoSlice';
import { fetchVideoById } from './utils/youtube';
import { VideoGrid } from './components/VideoGrid';
import { VideoPlayer } from './components/VideoPlayer';
import { EmptyState } from './components/EmptyState';
import { SearchSection } from './components/SearchSection';
import { Video } from './types';

interface LoaderData {
  query: string | null;
  videoId: string | null;
}

const AppContent: React.FC = () => {
  const { videos, loading, selectedVideo } = useSelector((state: RootState) => state.videos);
  const navigate = useNavigate();
  const location = useLocation();
  const { query, videoId } = useLoaderData() as LoaderData;
  const dispatch = useDispatch();
  const hasResults = videos.length > 0;

  // Handle video selection
  const handleVideoSelect = (video: Video) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('v', video.id);
    navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
    dispatch(setSelectedVideo(video));
  };

  // Handle video closing
  const handleVideoClose = () => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.delete('v');
    navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
    dispatch(setSelectedVideo(null));
  };

  // Handle home navigation
  const handleHomeClick = () => {
    dispatch(setSelectedVideo(null));
    navigate('/', { replace: true });
  };

  // For initial state (landing page)
  if (!hasResults && !loading && location.pathname === '/') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 pt-12 pb-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Watch Football Matches Without Spoilers
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Missed the big game? Keep the thrill alive! Watch match replays 
              without knowing the score. Perfect for busy fans who want to 
              experience the match as if it's live.
            </p>
          </div>

          {/* Search Section */}
          <div className="max-w-2xl mx-auto mb-8">
            <SearchSection initialQuery={query} onHomeClick={handleHomeClick} />
          </div>

          {/* Featured Matches */}
          <div className="mt-8">
            <EmptyState />
          </div>
        </div>
      </div>
    );
  }

  // For results view
  return (
    <div className="min-h-screen bg-white w-full flex flex-col relative">
      <SearchSection initialQuery={query} onHomeClick={handleHomeClick} />
      <main className="flex-1 flex flex-col">
        <VideoGrid onVideoSelect={handleVideoSelect} />
      </main>
      {selectedVideo && <VideoPlayer onClose={handleVideoClose} />}
      <Outlet />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;