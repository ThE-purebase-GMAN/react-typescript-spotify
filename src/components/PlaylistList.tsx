import React, { useState } from 'react';
import { useUserPlaylists, useUserSavedTracks } from '../api/spotify/hooks/useSpotifyQueries';
import { Playlist } from '../data-objects/interface';
import SpotifyPlayer from './SpotifyPlayer';

const PlaylistList: React.FC = () => {
  const { data: playlists, isLoading: isLoadingPlaylists, error } = useUserPlaylists();
  const { data: savedTracks, isLoading: isLoadingTracks } = useUserSavedTracks(1); // Fetch just 1 to get total count

  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [showLikedSongs, setShowLikedSongs] = useState(false);

  const handlePlaylistClick = (playlistId: string) => {
    setSelectedPlaylistId(playlistId);
    setShowLikedSongs(false);
  };

  const handleLikedSongsClick = () => {
    setShowLikedSongs(true);
    setSelectedPlaylistId(null);
  };

  const isSelectionActive = selectedPlaylistId || showLikedSongs;

  if (isLoadingPlaylists) {
    return <div className="text-white p-4">Loading playlists...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">Error loading playlists</div>;
  }

  return (
    <div className="flex h-full">
      {/* Playlist List - Left Side */}
      <div className={`p-6 text-white overflow-y-auto ${isSelectionActive ? 'w-1/3 border-r border-gray-700' : 'w-full'}`}>
        <h2 className="text-2xl font-bold mb-4">Your Playlists</h2>
        <div className={`grid gap-4 ${isSelectionActive ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'}`}>

          {/* Liked Songs Card */}
          <div
            onClick={handleLikedSongsClick}
            className={`bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition cursor-pointer group ${showLikedSongs ? 'ring-2 ring-green-500' : ''}`}
          >
            <div className="w-full aspect-square mb-2 rounded flex items-center justify-center bg-gradient-to-br from-indigo-700 to-purple-400">
              <span className="text-4xl">💜</span>
            </div>
            <h3 className="font-semibold truncate">Liked Songs</h3>
            <p className="text-sm text-gray-400">
              {isLoadingTracks ? '...' : `${savedTracks?.total || 0} tracks`}
            </p>
          </div>

          {/* User Playlists */}
          {playlists?.items?.map((playlist: Playlist) => (
            <div
              key={playlist.id}
              onClick={() => handlePlaylistClick(playlist.id)}
              className={`bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition cursor-pointer ${selectedPlaylistId === playlist.id ? 'ring-2 ring-green-500' : ''}`}
            >
              {playlist.images?.[0] ? (
                <img
                  src={playlist.images[0].url}
                  alt={playlist.name}
                  className="w-full aspect-square object-cover rounded mb-2"
                />
              ) : (
                <div className="w-full aspect-square bg-gray-600 rounded mb-2 flex items-center justify-center">
                  <span className="text-4xl">🎵</span>
                </div>
              )}
              <h3 className="font-semibold truncate">{playlist.name}</h3>
              <p className="text-sm text-gray-400">{playlist.tracks?.total} tracks</p>
            </div>
          ))}
        </div>
      </div>

      {/* Player / Details - Right Side */}
      {isSelectionActive && (
        <div className="w-2/3 h-full overflow-y-auto bg-black border-l border-gray-800">
          <SpotifyPlayer
            playlistId={selectedPlaylistId || undefined}
            isLikedSongs={showLikedSongs}
          />
        </div>
      )}
    </div>
  );
};

export default PlaylistList;
