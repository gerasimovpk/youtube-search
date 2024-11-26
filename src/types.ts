export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
  originalTitle: string;
  duration?: string;
}

export interface SearchState {
  videos: Video[];
  selectedVideo: Video | null;
  loading: boolean;
  error: string | null;
  hideSpoilers: boolean;
  lastQuery: string | null;
}