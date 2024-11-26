import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { toggleSpoilers } from '../store/videoSlice';
import { Eye, EyeOff } from 'lucide-react';

export const SpoilerToggle: React.FC = () => {
  const hideSpoilers = useSelector((state: RootState) => state.videos.hideSpoilers);
  const dispatch = useDispatch();

  return (
    <button
      onClick={() => dispatch(toggleSpoilers())}
      className={`flex items-center gap-1.5 py-1 px-2 rounded-full text-xs ${
        hideSpoilers ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'
      }`}
      title={hideSpoilers ? "Spoiler protection on" : "Spoiler protection off"}
    >
      {hideSpoilers ? <EyeOff size={14} /> : <Eye size={14} />}
      <span>{hideSpoilers ? 'On' : 'Off'}</span>
    </button>
  );
};