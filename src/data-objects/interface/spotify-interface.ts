import { ExternalUrls, Followers, Image as SpotifyImage } from './profile-interface';

// Artist interfaces
export interface Artist {
  external_urls: ExternalUrls;
  followers?: Followers;
  genres?: string[];
  href: string;
  id: string;
  images?: SpotifyImage[];
  name: string;
  popularity?: number;
  type: "artist";
  uri: string;
}

export interface ArtistTopTracks {
  tracks: Track[];
}

export interface ArtistAlbums {
  href: string;
  limit: number;
  next?: string;
  offset: number;
  previous?: string;
  total: number;
  items: Album[];
}

// Album interfaces
export interface Album {
  album_type: "album" | "single" | "compilation";
  total_tracks: number;
  available_markets?: string[];
  external_urls: ExternalUrls;
  href: string;
  id: string;
  images: SpotifyImage[];
  name: string;
  release_date: string;
  release_date_precision: "year" | "month" | "day";
  restrictions?: {
    reason: "market" | "product" | "explicit";
  };
  type: "album";
  uri: string;
  artists: Artist[];
  tracks?: {
    href: string;
    limit: number;
    next?: string;
    offset: number;
    previous?: string;
    total: number;
    items: Track[];
  };
  copyrights?: {
    text: string;
    type: "C" | "P";
  }[];
  external_ids?: {
    [key: string]: string;
  };
  genres?: string[];
  label?: string;
  popularity?: number;
}

// Track interfaces
export interface Track {
  album?: Album;
  artists: Artist[];
  available_markets?: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids?: {
    [key: string]: string;
  };
  external_urls: ExternalUrls;
  href: string;
  id: string;
  is_playable?: boolean;
  linked_from?: {
    external_urls: ExternalUrls;
    href: string;
    id: string;
    type: "track";
    uri: string;
  };
  restrictions?: {
    reason: "market" | "product" | "explicit";
  };
  name: string;
  popularity: number;
  preview_url?: string;
  track_number: number;
  type: "track";
  uri: string;
  is_local: boolean;
}

export interface SavedTrack {
  added_at: string;
  track: Track;
}

// Playlist interfaces
export interface Playlist {
  collaborative: boolean;
  description?: string;
  external_urls: ExternalUrls;
  followers: Followers;
  href: string;
  id: string;
  images: SpotifyImage[];
  name: string;
  owner: {
    external_urls: ExternalUrls;
    followers?: Followers;
    href: string;
    id: string;
    type: "user";
    uri: string;
    display_name?: string;
  };
  public?: boolean;
  snapshot_id: string;
  tracks: {
    href: string;
    total: number;
    items?: PlaylistTrack[];
  };
  type: "playlist";
  uri: string;
}

export interface PlaylistTrack {
  added_at: string;
  added_by: {
    external_urls: ExternalUrls;
    followers?: Followers;
    href: string;
    id: string;
    type: "user";
    uri: string;
  };
  is_local: boolean;
  track: Track;
}

// Search interfaces
export interface SearchResult {
  artists?: {
    href: string;
    limit: number;
    next?: string;
    offset: number;
    previous?: string;
    total: number;
    items: Artist[];
  };
  albums?: {
    href: string;
    limit: number;
    next?: string;
    offset: number;
    previous?: string;
    total: number;
    items: Album[];
  };
  tracks?: {
    href: string;
    limit: number;
    next?: string;
    offset: number;
    previous?: string;
    total: number;
    items: Track[];
  };
  playlists?: {
    href: string;
    limit: number;
    next?: string;
    offset: number;
    previous?: string;
    total: number;
    items: Playlist[];
  };
}

// Playback interfaces
export interface Device {
  id?: string;
  is_active: boolean;
  is_private_session: boolean;
  is_restricted: boolean;
  name: string;
  type: string;
  volume_percent?: number;
}

export interface PlaybackState {
  device: Device;
  repeat_state: "off" | "track" | "context";
  shuffle_state: boolean;
  context?: {
    type: "artist" | "playlist" | "album" | "show";
    href: string;
    external_urls: ExternalUrls;
    uri: string;
  };
  timestamp: number;
  progress_ms?: number;
  is_playing: boolean;
  item?: Track;
  currently_playing_type: "track" | "episode" | "ad" | "unknown";
  actions: {
    interrupting_playback?: boolean;
    pausing?: boolean;
    resuming?: boolean;
    seeking?: boolean;
    skipping_next?: boolean;
    skipping_prev?: boolean;
    toggling_repeat_context?: boolean;
    toggling_shuffle?: boolean;
    toggling_repeat_track?: boolean;
    transferring_playback?: boolean;
  };
}

export interface CurrentlyPlaying {
  device: Device;
  repeat_state: "off" | "track" | "context";
  shuffle_state: boolean;
  context?: {
    type: "artist" | "playlist" | "album" | "show";
    href: string;
    external_urls: ExternalUrls;
    uri: string;
  };
  timestamp: number;
  progress_ms?: number;
  is_playing: boolean;
  item?: Track;
  currently_playing_type: "track" | "episode" | "ad" | "unknown";
  actions: {
    disallows: {
      interrupting_playback?: boolean;
      pausing?: boolean;
      resuming?: boolean;
      seeking?: boolean;
      skipping_next?: boolean;
      skipping_prev?: boolean;
      toggling_repeat_context?: boolean;
      toggling_shuffle?: boolean;
      toggling_repeat_track?: boolean;
      transferring_playback?: boolean;
    };
  };
}

// Paginated response interface
export interface PaginatedResponse<T> {
  href: string;
  limit: number;
  next?: string;
  offset: number;
  previous?: string;
  total: number;
  items: T[];
}

// User's saved/library interfaces
export interface UserSavedAlbums extends PaginatedResponse<SavedAlbum> {}

export interface SavedAlbum {
  added_at: string;
  album: Album;
}

export interface UserSavedTracks extends PaginatedResponse<SavedTrack> {}

export interface UserPlaylists extends PaginatedResponse<Playlist> {}

// Featured and new releases
export interface FeaturedPlaylists {
  message?: string;
  playlists: PaginatedResponse<Playlist>;
}

export interface NewReleases {
  albums: PaginatedResponse<Album>;
}

// Recommendations
export interface RecommendationSeed {
  afterFilteringSize: number;
  afterRelinkingSize: number;
  href?: string;
  id: string;
  initialPoolSize: number;
  type: "artist" | "track" | "genre";
}

export interface Recommendations {
  seeds: RecommendationSeed[];
  tracks: Track[];
}

export interface AudioFeatures {
  acousticness: number;
  analysis_url: string;
  danceability: number;
  duration_ms: number;
  energy: number;
  id: string;
  instrumentalness: number;
  key: number;
  liveness: number;
  loudness: number;
  mode: number;
  speechiness: number;
  tempo: number;
  time_signature: number;
  track_href: string;
  type: "audio_features";
  uri: string;
  valence: number;
}

// Categories
export interface Category {
  href: string;
  icons: SpotifyImage[];
  id: string;
  name: string;
}

export interface Categories extends PaginatedResponse<Category> {}
