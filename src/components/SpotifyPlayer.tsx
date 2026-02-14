import React, {useState} from 'react';
import {useCurrentPlayback, useSpotifySearch} from '../api/spotify/hooks/useSpotifyQueries';
import {useLibraryControls, usePlaybackControls} from '../api/spotify/hooks/useSpotifyMutations';
import {Artist, Track} from '../data-objects/interface/spotify-interface';
import DeviceSelector from './DeviceSelector';

const SpotifyPlayer: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [useWebPlayer] = useState(false);

  // Queries - only fetch when using Web API mode
  const { data: currentPlayback, isLoading: isLoadingPlayback } = useCurrentPlayback();
  const { data: searchResults, isLoading: isSearching } = useSpotifySearch(
    searchQuery, 
    ['track', 'artist', 'album'], 
    { enabled: searchQuery.length > 0 && !useWebPlayer }
  );

  // Mutations
  const playbackControls = usePlaybackControls();
  const libraryControls = useLibraryControls();

  const handlePlay = async (trackUri?: string, contextUri?: string) => {
    try {
      console.log('🎵 Attempting to play:', { trackUri, contextUri });
      
      if (trackUri || contextUri) {
        await playbackControls.play.mutateAsync({
          uris: trackUri ? [trackUri] : undefined,
          context_uri: contextUri,
        });
      } else {
        await playbackControls.play.mutateAsync({});
      }
      
      console.log('✅ Play request successful');
    } catch (error: unknown) {
      console.error('❌ Error playing track:', error);
      const errorObj = error as {
        message?: string;
        response?: {
          status?: number;
          statusText?: string;
          data?: {
            error?: {
              reason?: string;
            };
          };
        };
        config?: unknown;
      };
      console.error('Error details:', {
        message: errorObj?.message,
        status: errorObj?.response?.status,
        statusText: errorObj?.response?.statusText,
        data: errorObj?.response?.data,
        config: errorObj?.config
      });
      
      // Check for specific error types
      if (errorObj?.response?.status === 500) {
        alert('🔧 Server Error (500)\\n\\nThis could be:\\n• Spotify API temporary issue\\n• Rate limiting\\n• Invalid request data\\n\\nPlease:\\n• Wait a moment and try again\\n• Check browser console for details\\n• Ensure you have an active Spotify device');
      } else if (errorObj?.message?.includes('No active device') || errorObj?.response?.data?.error?.reason === 'NO_ACTIVE_DEVICE') {
        alert('⚠️ No Active Spotify Device Found!\\n\\nPlease:\\n• Open Spotify Desktop App and start playing\\n• Use Spotify Mobile App with active music\\n• Open Spotify Web Player (open.spotify.com)\\n\\nThen try again!');
      } else if (errorObj?.response?.status === 429) {
        alert('⏱️ Rate Limit Exceeded\\n\\nToo many requests! Please wait a moment before trying again.');
      } else if (errorObj?.response?.status === 401) {
        alert('🔐 Authentication Error\\n\\nYour session may have expired. Please refresh the page and login again.');
      } else {
        alert(`❌ Playbook Error (${errorObj?.response?.status || 'Unknown'})\\n\\n${errorObj?.message || 'Unknown error occurred'}\\n\\nCheck browser console for more details.`);
      }
    }
  };

  const handlePause = async () => {
    try {
      await playbackControls.pause.mutateAsync(undefined);
    } catch (error: unknown) {
      console.error('Error pausing playback:', error);
    }
  };

  const handleNext = async () => {
    try {
      await playbackControls.next.mutateAsync(undefined);
    } catch (error: unknown) {
      console.error('Error skipping to next track:', error);
    }
  };

  const handlePrevious = async () => {
    try {
      await playbackControls.previous.mutateAsync(undefined);
    } catch (error: unknown) {
      console.error('Error skipping to previous track:', error);
    }
  };

  const handleSaveTrack = async (trackId: string) => {
    try {
      await libraryControls.saveTrack.mutateAsync(trackId);
    } catch (error: unknown) {
      console.error('Error saving track:', error);
    }
  };

  const renderCurrentPlayback = () => {
    if (isLoadingPlayback) {
      return <div className="text-gray-400">Loading playback info...</div>;
    }

    if (currentPlayback?.item) {
      return (
        <div className="bg-gray-800 p-4 rounded-lg flex items-center space-x-4">
          {currentPlayback.item.album?.images?.[0] && (
            <img 
              src={currentPlayback.item.album.images[0].url} 
              alt="Album cover"
              className="w-16 h-16 rounded-lg"
            />
          )}
          <div className="flex-1">
            <h3 className="font-semibold">{currentPlayback.item.name}</h3>
            <p className="text-gray-400">
              {currentPlayback.item.artists?.map((artist: Artist) => artist.name).join(', ')}
            </p>
            <p className="text-sm text-gray-500">{currentPlayback.item.album?.name}</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handlePrevious}
              className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
            >
              ⏮️
            </button>
            <button
              onClick={currentPlayback.is_playing ? handlePause : () => handlePlay()}
              className="p-2 bg-green-600 hover:bg-green-700 rounded-lg"
            >
              {currentPlayback.is_playing ? '⏸️' : '▶️'}
            </button>
            <button
              onClick={handleNext}
              className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
            >
              ⏭️
            </button>
          </div>
        </div>
      );
    }

    return <div className="text-gray-400">No track currently playing</div>;
  };

  const renderSearchResults = () => {
    if (isSearching) {
      return <div className="text-gray-400">Searching...</div>;
    }

    if (searchResults?.tracks?.items) {
      return (
        <div className="space-y-2">
          {searchResults.tracks.items.slice(0, 10).map((track: Track) => (
            <div key={track.id} className="bg-gray-800 p-3 rounded-lg flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {track.album?.images?.[0] && (
                  <img 
                    src={track.album.images[0].url} 
                    alt="Album cover"
                    className="w-12 h-12 rounded"
                  />
                )}
                <div>
                  <h4 className="font-medium">{track.name}</h4>
                  <p className="text-sm text-gray-400">
                    {track.artists?.map((artist: Artist) => artist.name).join(', ')}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePlay(track.uri)}
                  className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm"
                >
                  Play
                </button>
                <button
                  onClick={() => handleSaveTrack(track.id)}
                  className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm"
                >
                  ❤️
                </button>
              </div>
            </div>
          ))}
        </div>
      );
    }

    return <div className="text-gray-400">No results found</div>;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-black min-h-screen text-white">

      {/* Device Management */}
      <div className="mb-8">
        <DeviceSelector />
      </div>

      {/* Search */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Search Music</h2>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for tracks, artists, albums..."
          className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
        />
      </div>

      {/* Current Playback */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Current Playback</h2>
        {renderCurrentPlayback()}
      </div>

      {/* Search Results */}
      {searchQuery && (
        <div>
          <h2 className="text-xl font-semibold mb-3">Search Results</h2>
          {renderSearchResults()}
        </div>
      )}
    </div>
  );
};

export default SpotifyPlayer;
