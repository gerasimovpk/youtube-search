import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from './App';
import { searchVideos, clearVideos, setSelectedVideo } from './store/videoSlice';
import { store } from './store';
import { fetchVideoById } from './utils/youtube';
import { ErrorBoundary } from './components/ErrorBoundary';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        loader: () => {
          store.dispatch(clearVideos());
          return { query: null, videoId: null };
        }
      },
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
        }
      },
      {
        path: '*',
        element: <Navigate to="/" replace />
      }
    ]
  }
]); 