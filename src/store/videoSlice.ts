import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Video, SearchState } from '../types';
import { sanitizeFootballScore } from '../utils/spoilerUtils';
import { fetchVideoDetails } from '../utils/youtube';

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/search';

interface YoutubeSearchResult {
  id: { videoId: string };
  snippet: {
    title: string;
    thumbnails: { medium: { url: string } };
    channelTitle: string;
    publishedAt: string;
  };
}

export const searchVideos = createAsyncThunk(
  'videos/search',
  async (searchTerm: string) => {
    const response = await fetch(
      `${YOUTUBE_API_URL}?part=snippet&maxResults=20&q=${searchTerm} full match&type=video&key=${YOUTUBE_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch videos');
    }

    const data = await response.json();
    const videos = data.items.map((item: YoutubeSearchResult) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      originalTitle: item.snippet.title,
      thumbnail: item.snippet.thumbnails.medium.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
    }));

    const durations = await fetchVideoDetails(videos.map((v: Video) => v.id));
    return videos.map((video: Video): Video => ({
      ...video,
      duration: durations[video.id]
    }));
  }
);

const videoSlice = createSlice({
  name: 'videos',
  initialState: {
    videos: [],
    selectedVideo: null,
    loading: false,
    error: null,
    hideSpoilers: true,
    lastQuery: null,
  } as SearchState,
  reducers: {
    setSelectedVideo: (state, action: PayloadAction<Video | null>) => {
      state.selectedVideo = action.payload;
    },
    toggleSpoilers: (state) => {
      state.hideSpoilers = !state.hideSpoilers;
      state.videos = state.videos.map((video: Video): Video => ({
        ...video,
        title: state.hideSpoilers ? sanitizeFootballScore(video.originalTitle) : video.originalTitle
      }));
      if (state.selectedVideo) {
        state.selectedVideo = {
          ...state.selectedVideo,
          title: state.hideSpoilers 
            ? sanitizeFootballScore(state.selectedVideo.originalTitle)
            : state.selectedVideo.originalTitle
        };
      }
    },
    clearVideos: (state) => {
      state.videos = [];
      state.selectedVideo = null;
      state.lastQuery = null;
      state.error = null;
      state.loading = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchVideos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.videos = action.payload.map((video: Video): Video => ({
          ...video,
          title: state.hideSpoilers ? sanitizeFootballScore(video.originalTitle) : video.originalTitle
        }));
        state.lastQuery = action.meta.arg;
      })
      .addCase(searchVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'An error occurred';
      });
  },
});

export const { setSelectedVideo, toggleSpoilers, clearVideos } = videoSlice.actions;
export default videoSlice.reducer;