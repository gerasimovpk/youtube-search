import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { searchVideos } from '../store/videoSlice';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Match {
  id: number;
  homeTeam: {
    name: string;
    crest: string;
  };
  awayTeam: {
    name: string;
    crest: string;
  };
  score: {
    fullTime: {
      home: number;
      away: number;
    };
  };
  competition: string;
  utcDate: string;
}

const FeaturedMatches: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const TOP_10_CLUBS = [
    "Manchester City FC",
    "Real Madrid CF",
    "FC Bayern München",
    "Paris Saint-Germain FC",
    "Manchester United FC",
    "Liverpool FC",
    "FC Barcelona",
    "Inter Milano",
    "Arsenal FC",
    "Borussia Dortmund"
  ];
  
  // Helper functions to categorize matches
const isTopClub = (teamName: string): boolean => {
    return TOP_10_CLUBS.includes(teamName);
  };
  
  const getMatchPriority = (match: Match): number => {
    const isHomeTop = isTopClub(match.homeTeam.name);
    const isAwayTop = isTopClub(match.awayTeam.name);
    const totalGoals = (match.score?.fullTime?.home || 0) + (match.score?.fullTime?.away || 0);
  
    // Priority 1: Both teams are top clubs
    if (isHomeTop && isAwayTop) return 1;
    // Priority 2: One team is a top club
    if (isHomeTop || isAwayTop) return 2;
    // Priority 3: High scoring game (4+ goals)
    if (totalGoals >= 4) return 3;
    // Priority 4: Other matches
    return 4;
  };
  

  useEffect(() => {
    fetchRecentMatches();
  }, []);

  const fetchRecentMatches = async () => {
    try {
      setLoading(true);
      
      const today = new Date();
      const lastWeek = new Date(today);
      lastWeek.setDate(today.getDate() - 7);
      
      const fromDate = lastWeek.toISOString().split('T')[0];
      const toDate = today.toISOString().split('T')[0];
  
      const competitions = [2001, 2014, 2021, 2002, 2019, 2015].join(',');
      
      const response = await fetch(
        `http://localhost:3001/api/football/matches?` +
        `dateFrom=${fromDate}&` +
        `dateTo=${toDate}&` +
        `competitions=${competitions}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        }
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Sort matches by priority and date
      const sortedMatches = data.matches
        ?.sort((a: Match, b: Match) => {
          const priorityA = getMatchPriority(a);
          const priorityB = getMatchPriority(b);
          
          // First sort by priority
          if (priorityA !== priorityB) {
            return priorityA - priorityB;
          }
          
          // Then by date (most recent first)
          return new Date(b.utcDate).getTime() - new Date(a.utcDate).getTime();
        })
        ?.slice(0, 9) || [];
        
      setMatches(sortedMatches);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load matches');
    } finally {
      setLoading(false);
    }
  };
  
  
  const handleMatchClick = (match: Match) => {
    const searchQuery = `${match.homeTeam.name} vs ${match.awayTeam.name} ${
      new Date(match.utcDate).getFullYear()
    } full match`;
    
    // Update URL and trigger search in one go
    const searchParams = new URLSearchParams();
    searchParams.set('q', searchQuery);
    navigate(`/search?${searchParams.toString()}`);
  };
  
  

  const formatMatchDate = (utcDate: string) => {
    const date = new Date(utcDate);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Format the time
    const timeString = date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });

    // Check if the match is today/yesterday/tomorrow
    if (date.toDateString() === today.toDateString()) {
      return `Today, ${timeString}`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow, ${timeString}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${timeString}`;
    }

    // Otherwise show full date
    return `${date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })}, ${timeString}`;
  };

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-100 rounded-lg h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-gray-500 mt-8">
        <p>Unable to load recent matches.</p>
        <p className="text-sm mt-2">Try searching for a specific match instead.</p>
      </div>
    );
  }

  // FeaturedMatches.tsx (partial update)
  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      {/* Looking for a match text */}
      <div className="text-center mb-8 md:mb-12">
        <p className="text-gray-600 mb-4">Looking for a specific match? Use the search above or check out these recent games:</p>
      </div>

      {/* Matches Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {matches.map((match) => (
          <button
            key={match.id}
            onClick={() => handleMatchClick(match)}
            className="bg-white p-4 md:p-5 rounded-xl shadow-sm hover:shadow-md transition-all 
              border border-gray-100 text-left group relative overflow-hidden md:scale-95"
          >
            {/* Match badges */}
            <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
              {/* Top Match Badge */}
              {(isTopClub(match.homeTeam.name) && isTopClub(match.awayTeam.name)) && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full whitespace-nowrap">
                  Top Match
                </span>
              )}
              {/* High Score Badge */}
              {((match.score?.fullTime?.home || 0) + (match.score?.fullTime?.away || 0) >= 4) && (
                <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full whitespace-nowrap">
                  High Score
                </span>
              )}
            </div>

            {/* Match Content */}
            <div className="flex flex-col gap-3">
              {/* Home Team */}
              <div className="flex items-center gap-3">
                <img 
                  src={match.homeTeam.crest} 
                  alt={match.homeTeam.name}
                  className="w-7 h-7 object-contain"
                />
                <span className="font-medium text-gray-900">
                  {match.homeTeam.name}
                </span>
              </div>
              
              {/* VS line */}
              <div className="flex items-center gap-2">
                <div className="flex-1 h-px bg-gray-100"></div>
                <span className="text-sm font-medium text-gray-400">VS</span>
                <div className="flex-1 h-px bg-gray-100"></div>
              </div>
              
              {/* Away Team */}
              <div className="flex items-center gap-3">
                <img 
                  src={match.awayTeam.crest} 
                  alt={match.awayTeam.name}
                  className="w-7 h-7 object-contain"
                />
                <span className="font-medium text-gray-900">
                  {match.awayTeam.name}
                </span>
              </div>
            </div>
            
            {/* Date/Time and Watch Button */}
            <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
              <span className="text-sm text-gray-500">
                {formatMatchDate(match.utcDate)}
              </span>
              <span className="text-sm text-blue-600 opacity-0 group-hover:opacity-100 
                transition-opacity flex items-center gap-1">
                Watch Now
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FeaturedMatches;