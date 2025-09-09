import React from 'react';
import { useCurrentPlayback } from '../api/spotify/hooks/useSpotifyQueries';
import { useAuthToken } from '../hooks/useAuthToken';

const SpotifyApiTest: React.FC = () => {
  const { accessToken, isAuthenticated, hasValidToken, error: authError } = useAuthToken();
  const { data: playbackState, isLoading, error: apiError, isError } = useCurrentPlayback();

  if (!isAuthenticated) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        <h3 className="font-bold mb-2">❌ Not Authenticated</h3>
        <p>Authentication error: {authError}</p>
      </div>
    );
  }

  if (!hasValidToken) {
    return (
      <div className="bg-orange-100 border border-orange-400 text-orange-700 px-4 py-3 rounded mb-4">
        <h3 className="font-bold mb-2">⚠️ Invalid Token</h3>
        <p>Token is expired or invalid. Please re-authenticate.</p>
      </div>
    );
  }

  return (
    <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
      <h3 className="font-bold mb-2">🎵 Spotify API Test</h3>
      
      <div className="mb-2">
        <strong>Token Status:</strong> {accessToken ? '✅ Valid' : '❌ Missing'}
      </div>
      
      <div className="mb-2">
        <strong>API Loading:</strong> {isLoading ? '🔄 Loading...' : '✅ Ready'}
      </div>
      
      {isError && (
        <div className="mb-2 text-red-600">
          <strong>API Error:</strong> {apiError?.message || 'Unknown error'}
        </div>
      )}
      
      {playbackState && (
        <div className="mb-2">
          <strong>Playback State:</strong> ✅ Retrieved successfully
          <div className="text-sm mt-1">
            Device: {playbackState.device?.name || 'Unknown'} |
            Playing: {playbackState.is_playing ? 'Yes' : 'No'} |
            Track: {playbackState.item?.name || 'None'}
          </div>
        </div>
      )}
      
      {!playbackState && !isLoading && !isError && (
        <div className="mb-2">
          <strong>Playback State:</strong> No active playback (this is normal)
        </div>
      )}
      
      <div className="text-xs text-gray-600">
        This component tests the Spotify API integration end-to-end
      </div>
    </div>
  );
};

export default SpotifyApiTest;
