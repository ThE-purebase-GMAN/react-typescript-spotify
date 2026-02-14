import React from 'react';
import { useUserPlaylists } from '../api/spotify/hooks/useSpotifyQueries';
import { Playlist } from '../data-objects/interface/spotify-interface';

const PlaylistList: React.FC = () => {
  const { data: playlists, isLoading, error } = useUserPlaylists();

  if (isLoading) {
    return <div className="text-white p-4">Loading playlists...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">Error loading playlists</div>;
  }

  if (!playlists?.items || playlists.items.length === 0) {
    return <div className="text-white p-4">No playlists found.</div>;
  }

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold mb-4">Your Playlists</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {playlists.items.map((playlist: Playlist) => (
          <div key={playlist.id} className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition cursor-pointer">
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
  );
};

export default PlaylistList;
