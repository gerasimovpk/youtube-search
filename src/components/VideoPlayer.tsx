import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { X, Maximize2, Minimize2 } from 'lucide-react';

interface VideoPlayerProps {
  onClose: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ onClose }) => {
  const { selectedVideo, hideSpoilers } = useSelector((state: RootState) => state.videos);
  const [isLoading, setIsLoading] = useState(true);
  const [isCustomFullscreen, setIsCustomFullscreen] = useState(false);
  const [showIframe, setShowIframe] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (selectedVideo) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedVideo, onClose]);

  useEffect(() => {
    if (selectedVideo) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setShowIframe(true);
      }, 100);
      return () => {
        clearTimeout(timer);
        setShowIframe(false);
      };
    }
  }, [selectedVideo?.id]);

  const handleIframeLoad = () => {
    setTimeout(() => setIsLoading(false), 1500);
  };

  if (!selectedVideo) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div 
        ref={modalRef}
        className={`bg-white rounded-lg relative ${
          isCustomFullscreen ? 'w-full h-full rounded-none' : 'max-w-4xl w-full'
        }`}
      >
        <div className={`relative ${isCustomFullscreen ? 'h-full' : 'pt-[56.25%]'}`}>
          {/* Loading overlay */}
          {(isLoading || !showIframe) && hideSpoilers && (
            <div className="absolute inset-0 bg-black flex flex-col items-center justify-center z-20">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-400 border-t-white mb-4" />
              <p className="text-white text-lg font-medium">Loading video...</p>
              <p className="text-gray-400 text-sm mt-2">Protecting you from spoilers</p>
            </div>
          )}
          
          {/* Title protection */}
          {hideSpoilers && (
            <div className="absolute top-0 left-0 right-0 h-12 bg-black z-10" />
          )}
          
          {/* Controls */}
          <div className="absolute top-4 right-4 flex gap-2 z-30">
            <button
              onClick={() => setIsCustomFullscreen(!isCustomFullscreen)}
              className="p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 transition-all text-white"
            >
              {isCustomFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 transition-all text-white"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* YouTube iframe */}
          {showIframe && (
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1&modestbranding=1&rel=0&showinfo=0&controls=1&playsinline=1&mute=1&start=1${
                hideSpoilers ? '&controls=1' : ''
              }`}
              title={selectedVideo.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen={false}
              onLoad={handleIframeLoad}
            />
          )}
        </div>
        
        {!isCustomFullscreen && (
          <div className="p-4">
            <h2 className="text-xl font-bold">{selectedVideo.title}</h2>
            <p className="text-gray-600">{selectedVideo.channelTitle}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;