// router.ts
import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import { searchVideos, clearVideos, setSelectedVideo } from './store/videoSlice';
import { store } from './store';
import { fetchVideoById } from './utils/youtube';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: App,
    loader: () => {
      store.dispatch(clearVideos());
      return { query: null, videoId: null };
    },
    children: [
      {
        path: 'search',
        loader: async ({ request }) => {
          const url = new URL(request.url);
          const query = url.searchParams.get('q');
          const videoId = url.searchParams.get('v');
          const currentState = store.getState();
          
          // Only fetch new results if the query is different
          if (query && query !== currentState.videos.lastQuery) {
            try {
              await store.dispatch(searchVideos(query));
            } catch (error) {
              console.error('Search failed:', error);
            }
          }

          // For permalink video loading
          if (videoId && !currentState.videos.selectedVideo) {
            try {
              const video = await fetchVideoById(videoId);
              if (video) {
                store.dispatch(setSelectedVideo(video));
              }
            } catch (error) {
              console.error('Failed to load video:', error);
            }
          }
          
          return { query, videoId };
        },
        shouldRevalidate: ({ currentUrl, nextUrl }) => {
          const currentQuery = new URLSearchParams(currentUrl.search).get('q');
          const nextQuery = new URLSearchParams(nextUrl.search).get('q');
          
          // Only revalidate if the actual search query changes
          return currentQuery !== nextQuery;
        }
      }
    ],
    shouldRevalidate: ({ currentUrl, nextUrl }) => {
      // Only revalidate root if we're actually navigating to home
      return currentUrl.pathname !== '/' && nextUrl.pathname === '/';
    }
  }
]);