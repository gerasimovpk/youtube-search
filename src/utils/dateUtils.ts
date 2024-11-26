export const formatPublishedDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // If less than 24 hours ago
    if (diffDays === 1) {
      const hours = Math.ceil(diffTime / (1000 * 60 * 60));
      return `${hours} hours ago`;
    }
    // If less than 7 days ago
    if (diffDays < 7) {
      return `${diffDays} days ago`;
    }
    // If less than 1 month ago
    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    }
  
    // For older videos, show the actual date
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  