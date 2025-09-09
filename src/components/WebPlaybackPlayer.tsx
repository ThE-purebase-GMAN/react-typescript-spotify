import React from 'react';
import { useSpotifyPlayer } from '../hooks/useSpotifyPlayer';

const WebPlaybackPlayer: React.FC = () => {
  const {
    is_ready,
    playerState,
    togglePlay,
    nextTrack,
    previousTrack,
    setVolume,
  } = useSpotifyPlayer();

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${parseInt(seconds) < 10 ? '0' : ''}${seconds}`;
  };

  if (!is_ready) {
    return (
      <div className="bg-gray-800 p-4 rounded-lg">
        <div className="text-center text-gray-400">
          <div className="loading loading-spinner loading-sm mr-2"></div>
          Connecting to Spotify Web Player...
        </div>
      </div>
    );
  }

  if (!playerState.current_track) {
    return (
      <div className="bg-gray-800 p-4 rounded-lg">
        <div className="text-center text-gray-400">
          <p>No track playing</p>
          <p className="text-sm mt-2">
            Device ID: {playerState.device_id}
          </p>
          <p className="text-xs mt-1 text-green-400">
            ✓ Web Player Ready
          </p>
        </div>
      </div>
    );
  }

  const track = playerState.current_track;

  return (
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 rounded-lg shadow-xl">
      {/* Track Info */}
      <div className="flex items-center space-x-4 mb-4">
        {track.album?.images?.[0] && (
          <img 
            src={track.album.images[0].url} 
            alt={track.album.name}
            className="w-16 h-16 rounded-lg shadow-lg"
          />
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold truncate">
            {track.name}
          </h3>
          <p className="text-gray-400 text-sm truncate">
            {track.artists.map(artist => artist.name).join(', ')}
          </p>
          <p className="text-gray-500 text-xs truncate">
            {track.album.name}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-4 mb-4">
        <button
          onClick={previousTrack}
          className="text-gray-400 hover:text-white transition-colors p-2"
          title="Previous"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 9H17a1 1 0 110 2h-5.586l4.293 4.293a1 1 0 010 1.414zM6 6a1 1 0 012 0v8a1 1 0 11-2 0V6z" clipRule="evenodd" />
          </svg>
        </button>
        
        <button
          onClick={togglePlay}
          className="bg-white text-black rounded-full p-3 hover:scale-105 transition-transform shadow-lg"
          title={playerState.is_paused ? 'Play' : 'Pause'}
        >
          {playerState.is_paused ? (
            <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        <button
          onClick={nextTrack}
          className="text-gray-400 hover:text-white transition-colors p-2"
          title="Next"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414-1.414L8.586 11H3a1 1 0 110-2h5.586L4.293 5.707a1 1 0 010-1.414zM14 6a1 1 0 112 0v8a1 1 0 11-2 0V6z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center space-x-3 text-xs text-gray-400 mb-3">
        <span>{formatTime(playerState.position)}</span>
        <div className="flex-1 bg-gray-700 rounded-full h-1">
          <div 
            className="bg-white h-1 rounded-full transition-all duration-300"
            style={{ 
              width: playerState.duration 
                ? `${(playerState.position / playerState.duration) * 100}%` 
                : '0%' 
            }}
          />
        </div>
        <span>{playerState.duration ? formatTime(playerState.duration) : '--:--'}</span>
      </div>

      {/* Volume Control */}
      <div className="flex items-center space-x-3">
        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.146 13.2A1 1 0 014 12.4V7.6a1 1 0 01.146-.8L8.383 3.207a1 1 0 011 0zM12 5a1 1 0 011.414 0L15 6.586A1 1 0 0115 8H13a1 1 0 01-1-1V5zm3 8a1 1 0 001.414 0L17 12.414A1 1 0 0017 11h-2a1 1 0 00-1 1v1z" clipRule="evenodd" />
        </svg>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          defaultValue="0.5"
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
        />
      </div>

      {/* Device Info */}
      <div className="mt-4 pt-3 border-t border-gray-700">
        <p className="text-xs text-gray-500 text-center">
          Playing on Web Player • Device: {playerState.device_id?.substring(0, 8)}...
        </p>
      </div>
    </div>
  );
};

export default WebPlaybackPlayer;
