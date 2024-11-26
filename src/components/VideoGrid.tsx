import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Video } from '../types';
import { formatPublishedDate } from '../utils/dateUtils';

interface VideoGridProps {
  onVideoSelect: (video: Video) => void;
}

export const VideoGrid: React.FC<VideoGridProps> = ({ onVideoSelect }) => {
  const { videos, loading, error, hideSpoilers } = useSelector((state: RootState) => state.videos);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error}</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-4 my-8">
      {videos.map((video: Video) => (
        <div
          key={video.id}
          className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 
            cursor-pointer overflow-hidden border border-gray-100"
          onClick={() => onVideoSelect(video)}
        >
          <div className="relative aspect-video group">
            <img
              src={video.thumbnail}
              alt={video.title}
              className={`w-full h-full object-cover transition-all duration-200 ${
                hideSpoilers ? 'blur-lg brightness-90' : 'blur-0'
              }`}
            />
            {video.duration && (
              <div className="absolute bottom-2 right-2 px-2 py-1 bg-black bg-opacity-75 
                rounded text-white text-xs font-mono">
                {video.duration}
              </div>
            )}
            {hideSpoilers && (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 
                group-hover:opacity-100 transition-opacity duration-200">
                <span className="bg-black bg-opacity-75 text-white px-3 py-1 rounded-full text-sm">
                  Click to watch
                </span>
              </div>
            )}
          </div>
          <div className="p-4 space-y-2">
            <h3 className="text-base font-medium line-clamp-2 text-gray-900">
              {video.title}
            </h3>
            <div className="flex flex-col gap-1">
              <div className="flex items-center text-sm text-gray-600">
                <span className="truncate">{video.channelTitle}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <time dateTime={video.publishedAt}>
                  {formatPublishedDate(video.publishedAt)}
                </time>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VideoGrid;