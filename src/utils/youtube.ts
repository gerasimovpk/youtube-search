import { Video } from '../types';

export async function fetchVideoById(videoId: string): Promise<Video | null> {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${import.meta.env.VITE_YOUTUBE_API_KEY}`
    );
    
    if (!response.ok) return null;
    
    const data = await response.json();
    if (!data.items?.[0]) return null;
    
    const item = data.items[0];
    return {
      id: item.id,
      title: item.snippet.title,
      originalTitle: item.snippet.title,
      thumbnail: item.snippet.thumbnails.medium.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      duration: formatDuration(item.contentDetails.duration)
    };
  } catch (error) {
    console.error('Error fetching video:', error);
    return null;
  }
}

export async function fetchVideoDetails(videoIds: string[]): Promise<Record<string, string>> {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds.join(',')}&key=${import.meta.env.VITE_YOUTUBE_API_KEY}`
    );
    
    if (!response.ok) return {};
    
    const data = await response.json();
    const durations: Record<string, string> = {};
    
    data.items.forEach((item: any) => {
      durations[item.id] = formatDuration(item.contentDetails.duration);
    });
    
    return durations;
  } catch (error) {
    console.error('Error fetching video durations:', error);
    return {};
  }
}

function formatDuration(duration: string): string {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  
  if (!match) return '0:00';
  
  const hours = match[1] ? match[1].replace('H', '') : '';
  const minutes = match[2] ? match[2].replace('M', '') : '';
  const seconds = match[3] ? match[3].replace('S', '') : '';
  
  if (hours) {
    return `${hours}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
  }
  
  return `${minutes || '0'}:${seconds.padStart(2, '0')}`;
}