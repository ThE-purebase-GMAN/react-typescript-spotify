import React from 'react';
import { useAuthToken } from '../hooks/useAuthToken';
import { debugTokenInfo, isTokenExpired } from '../utils/tokenUtils';

const AuthDebugger: React.FC = () => {
  const { 
    accessToken, 
    isLoading, 
    error, 
    isAuthenticated, 
    hasValidToken,
    forceRefresh, 
    login, 
    logout 
  } = useAuthToken();

  const handleDebugInfo = () => {
    debugTokenInfo();
    console.log('=== AUTH HOOK STATUS ===');
    console.log('Access Token:', accessToken ? `${accessToken.substring(0, 20)}...` : 'None');
    console.log('Is Loading:', isLoading);
    console.log('Error:', error);
    console.log('Is Authenticated:', isAuthenticated);
    console.log('Has Valid Token:', hasValidToken);
    console.log('Token Expired:', accessToken ? isTokenExpired() : 'N/A');
    console.log('========================');
  };

  const handleTestAPI = async () => {
    if (!accessToken) {
      console.log('❌ No access token available for testing');
      return;
    }

    try {
      console.log('🔍 Testing Spotify API with current token...');
      console.log('Using token:', `${accessToken.substring(0, 20)}...`);
      
      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        const data = await response.json();
        console.log('✅ API Test Success - User Profile:', data);
      } else {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText };
        }
        console.error('❌ API Test Failed:', response.status, errorData);
      }
    } catch (error) {
      console.error('❌ API Test Error:', error);
    }
  };

  const handleTestPlayerAPI = async () => {
    if (!accessToken) {
      console.log('❌ No access token available for testing');
      return;
    }

    try {
      console.log('🔍 Testing Player API endpoint...');
      console.log('Using token:', `${accessToken.substring(0, 20)}...`);
      
      const response = await fetch('https://api.spotify.com/v1/me/player', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Player API Response status:', response.status);
      console.log('Player API Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (response.status === 204) {
        console.log('✅ Player API Success - No active device (this is normal)');
      } else if (response.ok) {
        const data = await response.json();
        console.log('✅ Player API Success - Playback State:', data);
      } else {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText };
        }
        console.error('❌ Player API Failed:', response.status, errorData);
        
        if (response.status === 401) {
          console.log('💡 This suggests a token/permissions issue');
        }
      }
    } catch (error) {
      console.error('❌ Player API Test Error:', error);
    }
  };

  const handleRefreshToken = async () => {
    try {
      console.log('🔄 Forcing token refresh...');
      await forceRefresh();
    } catch (error) {
      console.error('Error forcing token refresh:', error);
    }
  };

  const handleTestCurrentlyPlaying = async () => {
    if (!accessToken) {
      console.log('❌ No access token available for testing');
      return;
    }

    try {
      console.log('🔍 Testing Currently Playing endpoint...');
      console.log('Using token:', `${accessToken.substring(0, 20)}...`);
      
      const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Currently Playing Response status:', response.status);
      
      if (response.status === 204) {
        console.log('✅ Currently Playing Success - No track playing (normal)');
      } else if (response.ok) {
        const data = await response.json();
        console.log('✅ Currently Playing Success:', data);
      } else {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText };
        }
        console.error('❌ Currently Playing Failed:', response.status, errorData);
      }
    } catch (error) {
      console.error('❌ Currently Playing Test Error:', error);
    }
  };

  const refreshTokenState = localStorage.getItem('refresh_token');

  return (
    <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded mb-4">
      <h3 className="font-bold mb-2">🐛 Auth Debugger</h3>
      
      {isLoading && (
        <div className="mb-2 text-blue-600">
          🔄 Loading authentication...
        </div>
      )}
      
      {error && (
        <div className="mb-2 text-red-600">
          ❌ Error: {error}
        </div>
      )}
      
      <div className="mb-2">
        <strong>Status:</strong> {isAuthenticated ? '✅ Authenticated' : '❌ Not Authenticated'}
      </div>
      
      <div className="mb-2">
        <strong>Token Available:</strong> {accessToken ? '✅ Yes' : '❌ No'}
      </div>
      
      <div className="mb-2">
        <strong>Token Valid:</strong> {hasValidToken ? '✅ Yes' : '❌ No'}
      </div>
      
      <div className="mb-2">
        <strong>Refresh Token:</strong> {refreshTokenState ? '✅ Available' : '❌ Missing'}
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        <button
          onClick={handleDebugInfo}
          className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm"
          disabled={isLoading}
        >
          Show Debug Info
        </button>
        
        <button
          onClick={handleRefreshToken}
          className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm"
          disabled={!refreshTokenState || isLoading}
        >
          Force Refresh
        </button>
        
        <button
          onClick={handleTestAPI}
          className="px-3 py-1 bg-purple-500 hover:bg-purple-600 text-white rounded text-sm"
          disabled={!accessToken || isLoading}
        >
          Test Profile API
        </button>
        
        <button
          onClick={handleTestPlayerAPI}
          className="px-3 py-1 bg-indigo-500 hover:bg-indigo-600 text-white rounded text-sm"
          disabled={!accessToken || isLoading}
        >
          Test Player API
        </button>
        
        <button
          onClick={handleTestCurrentlyPlaying}
          className="px-3 py-1 bg-cyan-500 hover:bg-cyan-600 text-white rounded text-sm"
          disabled={!accessToken || isLoading}
        >
          Test Currently Playing
        </button>
        
        <button
          onClick={login}
          className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm"
          disabled={isLoading}
        >
          Re-authenticate
        </button>
        
        <button
          onClick={logout}
          className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm"
          disabled={isLoading}
        >
          Logout
        </button>
      </div>
      
      <div className="mt-2 text-xs">
        Check browser console for detailed logs and network requests
      </div>
    </div>
  );
};

export default AuthDebugger;
