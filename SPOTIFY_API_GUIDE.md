# Spotify Web API Integration Guide

This project provides a comprehensive integration with the Spotify Web API, enabling you to:

- 🔐 **Authenticate users** through Spotify OAuth with PKCE flow
- 🎵 **Fetch data** (albums, artists, playlists, tracks, user profile, etc.)
- 🎮 **Control playback** on official Spotify clients via Spotify Connect API
- 🎨 **Build custom UI** for music browsing, playlist management, recommendations
- 📚 **Manage user library** (save/remove tracks, albums, follow artists/playlists)

## 🚀 Quick Start

### 1. Environment Setup

Create a `.env` file in your project root:

```env
VITE_CLIENT_ID=your_spotify_client_id_here
```

### 2. Spotify App Configuration

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Add redirect URI: `http://localhost:5173/`
4. Copy your Client ID to the `.env` file

### 3. Required Scopes

The authentication is configured with the following scopes:

```typescript
const scopes = [
  "user-read-private",
  "user-read-email",
  "user-read-playbook-state",
  "user-modify-playback-state",
  "user-read-currently-playing",
  "user-read-recently-played",
  "user-top-read",
  "playlist-read-private",
  "playlist-read-collaborative",
  "playlist-modify-public",
  "playlist-modify-private",
  "user-follow-modify",
  "user-follow-read",
  "user-library-modify",
  "user-library-read",
  "streaming",
];
```

## 📡 API Services

### Core Services

#### `SpotifyApi` - Main API Class

```typescript
import { SpotifyApi } from "./api/spotify";

const api = new SpotifyApi(accessToken);

// Access individual services
api.artists.getArtist(artistId);
api.albums.getAlbum(albumId);
api.tracks.getTrack(trackId);
api.playlists.getPlaylist(playlistId);
api.playback.getCurrentPlayback();
api.search.search(query, ["track", "artist"]);
api.browse.getFeaturedPlaylists();
```

#### Individual Services

**Artist Service**

```typescript
// Get artist details
const artist = await api.artists.getArtist(artistId);

// Get artist's top tracks
const topTracks = await api.artists.getArtistTopTracks(artistId, "US");

// Get artist's albums
const albums = await api.artists.getArtistAlbums(artistId);

// Follow/unfollow artists
await api.artists.followArtists([artistId]);
await api.artists.unfollowArtists([artistId]);
```

**Album Service**

```typescript
// Get album details
const album = await api.albums.getAlbum(albumId);

// Get album tracks
const tracks = await api.albums.getAlbumTracks(albumId);

// Save/remove albums
await api.albums.saveAlbums([albumId]);
await api.albums.removeAlbums([albumId]);
```

**Track Service**

```typescript
// Get track details
const track = await api.tracks.getTrack(trackId);

// Get audio features
const features = await api.tracks.getTrackAudioFeatures(trackId);

// Get recommendations
const recommendations = await api.tracks.getRecommendations({
  seed_artists: [artistId],
  seed_tracks: [trackId],
  limit: 20,
});

// Save/remove tracks
await api.tracks.saveTracks([trackId]);
await api.tracks.removeTracks([trackId]);
```

**Playlist Service**

```typescript
// Get playlist
const playlist = await api.playlists.getPlaylist(playlistId);

// Create playlist
const newPlaylist = await api.playlists.createPlaylist(userId, {
  name: "My Playlist",
  description: "Created with Spotify API",
  public: true,
});

// Add tracks to playlist
await api.playlists.addItemsToPlaylist(playlistId, {
  uris: ["spotify:track:trackId"],
});

// Remove tracks from playlist
await api.playlists.removeItemsFromPlaylist(playlistId, [
  { uri: "spotify:track:trackId" },
]);
```

**Playback Service (Spotify Connect)**

```typescript
// Get current playback state
const playbackState = await api.playback.getCurrentPlayback();

// Control playback
await api.playback.startResumePlayback({
  uris: ["spotify:track:trackId"],
});
await api.playback.pausePlayback();
await api.playback.skipToNext();
await api.playback.skipToPrevious();

// Transfer playback between devices
await api.playback.transferPlayback([deviceId], true);

// Set volume, repeat, shuffle
await api.playback.setPlaybackVolume(50);
await api.playback.setRepeatMode("track");
await api.playback.toggleShuffle(true);

// Seek to position
await api.playback.seekToPosition(30000); // 30 seconds
```

**Search Service**

```typescript
// General search
const results = await api.search.search("query", ["track", "artist", "album"]);

// Specific searches
const tracks = await api.search.searchTracks("query");
const artists = await api.search.searchArtists("query");
const albums = await api.search.searchAlbums("query");
const playlists = await api.search.searchPlaylists("query");
```

## 🪝 React Hooks

### Query Hooks (Data Fetching)

```typescript
import {
  useSpotifySearch,
  useCurrentPlayback,
  useUserPlaylists,
  useArtist,
} from "./api/spotify/hooks/useSpotifyQueries";

// Search
const { data: searchResults, isLoading } = useSpotifySearch("query", ["track"]);

// Current playbook
const { data: currentPlayback } = useCurrentPlayback();

// User's playlists
const { data: playlists } = useUserPlaylists();

// Artist details
const { data: artist } = useArtist(artistId);
```

### Mutation Hooks (Actions)

```typescript
import {
  usePlaybackControls,
  useLibraryControls,
  usePlaylistControls,
} from "./api/spotify/hooks/useSpotifyMutations";

// Playback controls
const playbackControls = usePlaybackControls();

const handlePlay = () => {
  playbackControls.play.mutate({
    uris: ["spotify:track:trackId"],
  });
};

const handlePause = () => {
  playbackControls.pause.mutate();
};

// Library controls
const libraryControls = useLibraryControls();

const handleSaveTrack = (trackId) => {
  libraryControls.saveTrack.mutate(trackId);
};

// Playlist controls
const playlistControls = usePlaylistControls();

const handleCreatePlaylist = () => {
  playlistControls.createPlaylist.mutate({
    userId: "user123",
    name: "My New Playlist",
    description: "Created with hooks",
  });
};
```

## 🎨 UI Components

### SpotifyPlayer Component

A comprehensive music player component that demonstrates:

- Real-time playback state
- Playback controls (play, pause, next, previous)
- Volume control
- Progress bar with seeking
- Search functionality
- Library management
- Device management

```typescript
import SpotifyPlayer from './components/SpotifyPlayer';

function App() {
  return (
    <div className="App">
      <SpotifyPlayer />
    </div>
  );
}
```

## 🔄 Authentication Flow

The project uses OAuth 2.0 with PKCE (Proof Key for Code Exchange) for secure authentication:

```typescript
import {
  redirectToSpotifyAuthorize,
  getToken,
} from "./api/auth/service/auth.service";

// Redirect to Spotify authorization
await redirectToSpotifyAuthorize();

// Handle callback and exchange code for tokens
const tokens = await getToken(authorizationCode);
```

## 📱 Device Control

Control playback on any Spotify Connect-enabled device:

```typescript
// Get available devices
const { data: devices } = useAvailableDevices();

// Transfer playback to a device
const transferPlayback = (deviceId) => {
  playbackControls.transferPlayback.mutate({
    deviceIds: [deviceId],
    play: true,
  });
};
```

## 🎯 Real-time Updates

The player supports real-time updates for:

- Current playback state (refreshes every second)
- Currently playing track
- Device availability
- Queue changes

## 📊 Data Types

The project includes comprehensive TypeScript interfaces for all Spotify objects:

- `Track` - Song information
- `Artist` - Artist details
- `Album` - Album information
- `Playlist` - Playlist data
- `Device` - Spotify Connect devices
- `PlaybackState` - Current playback information
- `SearchResult` - Search results
- And many more...

## 🚨 Error Handling

All API calls include proper error handling:

```typescript
try {
  const track = await api.tracks.getTrack(trackId);
} catch (error) {
  if (error.response?.status === 401) {
    // Handle authentication error
    console.log("Token expired, need to refresh");
  } else if (error.response?.status === 403) {
    // Handle insufficient permissions
    console.log("Insufficient permissions");
  } else {
    console.error("API error:", error);
  }
}
```

## 📋 Rate Limits

Spotify API has rate limits. The implementation includes:

- Automatic retry logic
- Request queuing
- Error handling for rate limit exceeded

## 🔧 Configuration

### Environment Variables

```env
# Required
VITE_CLIENT_ID=your_spotify_client_id

# Optional (defaults shown)
VITE_REDIRECT_URI=http://localhost:5173/
VITE_API_BASE_URL=https://api.spotify.com/v1
```

### Customization

You can extend the API services or create custom hooks:

```typescript
// Custom hook example
export const useMyCustomSpotifyHook = () => {
  const api = useSpotifyApi();

  return useQuery({
    queryKey: ["custom", "spotify", "data"],
    queryFn: async () => {
      // Custom logic combining multiple API calls
      const [playlists, tracks, albums] = await Promise.all([
        api.playlists.getCurrentUserPlaylists(),
        api.tracks.getUserSavedTracks(),
        api.albums.getUserSavedAlbums(),
      ]);

      return { playlists, tracks, albums };
    },
  });
};
```

## 🔐 Security Best Practices

1. **Never expose your Client Secret** - This implementation uses PKCE flow which doesn't require a client secret
2. **Store tokens securely** - Use secure storage methods
3. **Refresh tokens appropriately** - Implement token refresh logic
4. **Validate user permissions** - Check scopes before making API calls

## 📖 Additional Resources

- [Spotify Web API Documentation](https://developer.spotify.com/documentation/web-api/)
- [Spotify Connect API](https://developer.spotify.com/documentation/web-playbook-sdk/)
- [React Query Documentation](https://tanstack.com/query/latest)

## 🤝 Contributing

Feel free to submit issues and pull requests to improve this Spotify integration!
