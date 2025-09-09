import React from 'react';
import { useAuthToken } from '../hooks/useAuthToken';

const SpotifyApiDebugger: React.FC = () => {
  const { accessToken, isAuthenticated } = useAuthToken();

  const testPlaybackAPI = async () => {
    if (!accessToken || !isAuthenticated) {
      console.error('❌ Not authenticated');
      return;
    }

    try {
      console.log('🔍 Testing Spotify API directly...');
      console.log('Access Token (first 20 chars):', accessToken.substring(0, 20) + '...');

      // Test 1: Get available devices
      console.log('🔍 Test 1: Getting available devices...');
      const devicesResponse = await fetch('https://api.spotify.com/v1/me/player/devices', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Devices Response Status:', devicesResponse.status);
      const devicesData = await devicesResponse.text();
      console.log('Devices Response:', devicesData);

      if (!devicesResponse.ok) {
        console.error('❌ Devices API failed');
        return;
      }

      const devices = JSON.parse(devicesData);
      console.log('📱 Available devices:', devices);

      if (!devices.devices || devices.devices.length === 0) {
        console.warn('⚠️ No devices available - this will cause 404 errors');
        alert('⚠️ No devices found! Please open Spotify Desktop/Mobile app and start playing music first.');
        return;
      }

      const activeDevice = devices.devices.find((d: any) => d.is_active);
      console.log('🎵 Active device:', activeDevice);

      // Test 2: Try to play/resume
      console.log('🔍 Test 2: Testing play API...');
      const playResponse = await fetch('https://api.spotify.com/v1/me/player/play', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      });

      console.log('Play Response Status:', playResponse.status);
      
      if (playResponse.status === 204) {
        console.log('✅ Play request successful (204 No Content)');
        alert('✅ Play request successful! Check your Spotify device.');
      } else {
        const playResponseText = await playResponse.text();
        console.log('Play Response Body:', playResponseText);
        
        if (!playResponse.ok) {
          console.error('❌ Play API failed');
          alert(`❌ Play failed with status ${playResponse.status}: ${playResponseText}`);
        }
      }

    } catch (error) {
      console.error('🚨 API Test Error:', error);
      alert(`🚨 API Test Error: ${error}`);
    }
  };

  const testWithTrack = async () => {
    if (!accessToken || !isAuthenticated) {
      console.error('❌ Not authenticated');
      return;
    }

    try {
      console.log('🔍 Testing play with specific track...');
      
      // Try playing a specific track (Taylor Swift - Anti-Hero as example)
      const testTrackUri = 'spotify:track:0V3wPSX9ygBnCm8psDIegu';
      
      const playResponse = await fetch('https://api.spotify.com/v1/me/player/play', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uris: [testTrackUri]
        })
      });

      console.log('Play Track Response Status:', playResponse.status);
      
      if (playResponse.status === 204) {
        console.log('✅ Play track successful');
        alert('✅ Track should be playing! Check your Spotify device.');
      } else {
        const responseText = await playResponse.text();
        console.log('Play Track Response:', responseText);
        alert(`Status ${playResponse.status}: ${responseText}`);
      }

    } catch (error) {
      console.error('🚨 Play Track Error:', error);
      alert(`🚨 Play Track Error: ${error}`);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
        <p className="text-red-700">Not authenticated. Please login first.</p>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <h3 className="font-semibold text-blue-800 mb-3">🔍 Spotify API Debugger</h3>
      <div className="space-y-2">
        <button
          onClick={testPlaybackAPI}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
        >
          Test API & Devices
        </button>
        <button
          onClick={testWithTrack}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Test Play Specific Track
        </button>
      </div>
      <p className="text-blue-600 text-sm mt-2">
        Check browser console for detailed logs after clicking buttons.
      </p>
    </div>
  );
};

export default SpotifyApiDebugger;
