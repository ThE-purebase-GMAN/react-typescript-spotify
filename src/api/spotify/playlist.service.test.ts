import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PlaylistService } from './playlist.service';
import type { SpotifyApiClient } from './base.service';

const mockApiClient = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
} as unknown as SpotifyApiClient;

const playlistService = new PlaylistService(mockApiClient);

beforeEach(() => {
  vi.clearAllMocks();
});

describe('PlaylistService', () => {
  it('getPlaylist calls apiClient.get with correct args', async () => {
    mockApiClient.get = vi.fn().mockResolvedValue('playlist');
    const result = await playlistService.getPlaylist('id', { market: 'US' });
    expect(mockApiClient.get).toHaveBeenCalledWith('/playlists/id', { market: 'US' });
    expect(result).toBe('playlist');
  });

  it('getPlaylistItems calls apiClient.get with correct args', async () => {
    mockApiClient.get = vi.fn().mockResolvedValue('items');
    const result = await playlistService.getPlaylistItems('id', { limit: 10 });
    expect(mockApiClient.get).toHaveBeenCalledWith('/playlists/id/tracks', { limit: 10 });
    expect(result).toBe('items');
  });

  it('getCurrentUserPlaylists calls apiClient.get with correct args', async () => {
    mockApiClient.get = vi.fn().mockResolvedValue('userPlaylists');
    const result = await playlistService.getCurrentUserPlaylists({ limit: 5 });
    expect(mockApiClient.get).toHaveBeenCalledWith('/me/playlists', { limit: 5 });
    expect(result).toBe('userPlaylists');
  });

  it('getUserPlaylists calls apiClient.get with correct args', async () => {
    mockApiClient.get = vi.fn().mockResolvedValue('userPlaylists');
    const result = await playlistService.getUserPlaylists('userId', { offset: 2 });
    expect(mockApiClient.get).toHaveBeenCalledWith('/users/userId/playlists', { offset: 2 });
    expect(result).toBe('userPlaylists');
  });

  it('createPlaylist calls apiClient.post with correct args', async () => {
    mockApiClient.post = vi.fn().mockResolvedValue('playlist');
    const data = { name: 'My Playlist', public: true };
    const result = await playlistService.createPlaylist('userId', data);
    expect(mockApiClient.post).toHaveBeenCalledWith('/users/userId/playlists', data);
    expect(result).toBe('playlist');
  });

  it('addItemsToPlaylist calls apiClient.post with correct args', async () => {
    mockApiClient.post = vi.fn().mockResolvedValue({ snapshot_id: 'snap' });
    const data = { uris: ['uri1'], position: 1 };
    const result = await playlistService.addItemsToPlaylist('playlistId', data);
    expect(mockApiClient.post).toHaveBeenCalledWith('/playlists/playlistId/tracks', data);
    expect(result).toEqual({ snapshot_id: 'snap' });
  });

  it('removeItemsFromPlaylist calls apiClient.delete with correct args', async () => {
    mockApiClient.delete = vi.fn().mockResolvedValue({ snapshot_id: 'snap' });
    const tracks = [{ uri: 'uri1', positions: [0] }];
    const result = await playlistService.removeItemsFromPlaylist('playlistId', tracks);
    expect(mockApiClient.delete).toHaveBeenCalledWith('/playlists/playlistId/tracks', { tracks });
    expect(result).toEqual({ snapshot_id: 'snap' });
  });

  it('replacePlaylistItems calls apiClient.put with correct args', async () => {
    mockApiClient.put = vi.fn().mockResolvedValue(undefined);
    const uris = ['uri1', 'uri2'];
    await playlistService.replacePlaylistItems('playlistId', uris);
    expect(mockApiClient.put).toHaveBeenCalledWith('/playlists/playlistId/tracks', { uris });
  });

  it('updatePlaylistDetails calls apiClient.put with correct args', async () => {
    mockApiClient.put = vi.fn().mockResolvedValue(undefined);
    const data = { name: 'New Name', public: false };
    await playlistService.updatePlaylistDetails('playlistId', data);
    expect(mockApiClient.put).toHaveBeenCalledWith('/playlists/playlistId', data);
  });

  it('followPlaylist calls apiClient.put with correct args', async () => {
    mockApiClient.put = vi.fn().mockResolvedValue(undefined);
    await playlistService.followPlaylist('playlistId', false);
    expect(mockApiClient.put).toHaveBeenCalledWith('/playlists/playlistId/followers', { public: false });
  });

  it('unfollowPlaylist calls apiClient.delete with correct args', async () => {
    mockApiClient.delete = vi.fn().mockResolvedValue(undefined);
    await playlistService.unfollowPlaylist('playlistId');
    expect(mockApiClient.delete).toHaveBeenCalledWith('/playlists/playlistId/followers');
  });

  it('getFeaturedPlaylists calls apiClient.get with correct args', async () => {
    mockApiClient.get = vi.fn().mockResolvedValue('featured');
    const result = await playlistService.getFeaturedPlaylists({ country: 'US' });
    expect(mockApiClient.get).toHaveBeenCalledWith('/browse/featured-playlists', { country: 'US' });
    expect(result).toBe('featured');
  });

  it('getCategoryPlaylists calls apiClient.get with correct args', async () => {
    mockApiClient.get = vi.fn().mockResolvedValue('category');
    const result = await playlistService.getCategoryPlaylists('catId', { limit: 2 });
    expect(mockApiClient.get).toHaveBeenCalledWith('/browse/categories/catId/playlists', { limit: 2 });
    expect(result).toBe('category');
  });

  it('reorderPlaylistItems calls apiClient.put with correct args', async () => {
    mockApiClient.put = vi.fn().mockResolvedValue({ snapshot_id: 'snap' });
    const data = { range_start: 0, insert_before: 1 };
    const result = await playlistService.reorderPlaylistItems('playlistId', data);
    expect(mockApiClient.put).toHaveBeenCalledWith('/playlists/playlistId/tracks', data);
    expect(result).toEqual({ snapshot_id: 'snap' });
  });
});
