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

  // For initial state (no results and not loading)
  if (!hasResults && !loading) {
    return (
      <div className="min-h-screen bg-white w-full">
        <div className="flex flex-col min-h-screen">
          <div className="flex-1 flex flex-col items-center">
            <div className="w-full max-w-2xl px-6 mt-[35vh]">
              <SearchSection initialQuery={query} onHomeClick={handleHomeClick} />
            </div>
            <div className="mt-8">
              <EmptyState />
            </div>
          </div>
          <Outlet />
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