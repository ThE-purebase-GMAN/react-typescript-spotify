import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import WebPlaybackPlayer from '../WebPlaybackPlayer';

// Mock the useSpotifyPlayer hook
const mockUseSpotifyPlayer = vi.fn();
vi.mock('../../hooks/useSpotifyPlayer', () => ({
  useSpotifyPlayer: () => mockUseSpotifyPlayer()
}));

// Mock window.matchMedia for responsive components
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );
};

describe('WebPlaybackPlayer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state when not ready', async () => {
    mockUseSpotifyPlayer.mockReturnValue({
      is_ready: false,
      playerState: {
        is_paused: true,
        is_active: false,
        position: 0,
        duration: 0,
        current_track: null,
        device_id: null,
      },
      togglePlay: vi.fn(),
      nextTrack: vi.fn(),
      previousTrack: vi.fn(),
      setVolume: vi.fn(),
    });

    await act(async () => {
      renderWithProviders(<WebPlaybackPlayer />);
    });

    expect(screen.getByText('Connecting to Spotify Web Player...')).toBeInTheDocument();
  });

  it('shows no track message when ready but no track playing', async () => {
    mockUseSpotifyPlayer.mockReturnValue({
      is_ready: true,
      playerState: {
        is_paused: true,
        is_active: false,
        position: 0,
        duration: 0,
        current_track: null,
        device_id: 'test-device-id',
      },
      togglePlay: vi.fn(),
      nextTrack: vi.fn(),
      previousTrack: vi.fn(),
      setVolume: vi.fn(),
    });

    await act(async () => {
      renderWithProviders(<WebPlaybackPlayer />);
    });

    expect(screen.getByText('No track playing')).toBeInTheDocument();
    expect(screen.getByText('Device ID: test-device-id')).toBeInTheDocument();
    expect(screen.getByText('✓ Web Player Ready')).toBeInTheDocument();
  });

  it('displays track information and controls when track is playing', async () => {
    const mockTrack = {
      id: 'track-1',
      uri: 'spotify:track:1',
      name: 'Test Song',
      is_playable: true,
      album: {
        uri: 'spotify:album:1',
        name: 'Test Album',
        images: [{ url: 'https://example.com/album.jpg' }],
      },
      artists: [
        { uri: 'spotify:artist:1', name: 'Test Artist' }
      ],
    };

    const mockTogglePlay = vi.fn();
    const mockNextTrack = vi.fn();
    const mockPreviousTrack = vi.fn();
    const mockSetVolume = vi.fn();

    mockUseSpotifyPlayer.mockReturnValue({
      is_ready: true,
      playerState: {
        is_paused: false,
        is_active: true,
        position: 30000, // 30 seconds
        duration: 180000, // 3 minutes
        current_track: mockTrack,
        device_id: 'test-device-id',
      },
      togglePlay: mockTogglePlay,
      nextTrack: mockNextTrack,
      previousTrack: mockPreviousTrack,
      setVolume: mockSetVolume,
    });

    await act(async () => {
      renderWithProviders(<WebPlaybackPlayer />);
    });

    // Check track information
    expect(screen.getByText('Test Song')).toBeInTheDocument();
    expect(screen.getByText('Test Artist')).toBeInTheDocument();
    expect(screen.getByText('Test Album')).toBeInTheDocument();

    // Check album image
    const albumImage = screen.getByAltText('Test Album');
    expect(albumImage).toBeInTheDocument();
    expect(albumImage).toHaveAttribute('src', 'https://example.com/album.jpg');

    // Check time display
    expect(screen.getByText('0:30')).toBeInTheDocument(); // position
    expect(screen.getByText('3:00')).toBeInTheDocument(); // duration
  });

  it('calls control functions when buttons are clicked', async () => {
    const mockTrack = {
      id: 'track-1',
      uri: 'spotify:track:1',
      name: 'Test Song',
      is_playable: true,
      album: {
        uri: 'spotify:album:1',
        name: 'Test Album',
        images: [{ url: 'https://example.com/album.jpg' }],
      },
      artists: [
        { uri: 'spotify:artist:1', name: 'Test Artist' }
      ],
    };

    const mockTogglePlay = vi.fn();
    const mockNextTrack = vi.fn();
    const mockPreviousTrack = vi.fn();
    const mockSetVolume = vi.fn();

    mockUseSpotifyPlayer.mockReturnValue({
      is_ready: true,
      playerState: {
        is_paused: true,
        is_active: true,
        position: 0,
        duration: 0,
        current_track: mockTrack,
        device_id: 'test-device-id',
      },
      togglePlay: mockTogglePlay,
      nextTrack: mockNextTrack,
      previousTrack: mockPreviousTrack,
      setVolume: mockSetVolume,
    });

    await act(async () => {
      renderWithProviders(<WebPlaybackPlayer />);
    });

    // Test play/pause button
    const playButton = screen.getByTitle('Play');
    await act(async () => {
      fireEvent.click(playButton);
    });
    expect(mockTogglePlay).toHaveBeenCalledTimes(1);

    // Test previous button
    const prevButton = screen.getByTitle('Previous');
    await act(async () => {
      fireEvent.click(prevButton);
    });
    expect(mockPreviousTrack).toHaveBeenCalledTimes(1);

    // Test next button
    const nextButton = screen.getByTitle('Next');
    await act(async () => {
      fireEvent.click(nextButton);
    });
    expect(mockNextTrack).toHaveBeenCalledTimes(1);
  });

  it('handles volume control changes', async () => {
    const mockTrack = {
      id: 'track-1',
      uri: 'spotify:track:1',
      name: 'Test Song',
      is_playable: true,
      album: {
        uri: 'spotify:album:1',
        name: 'Test Album',
        images: [],
      },
      artists: [
        { uri: 'spotify:artist:1', name: 'Test Artist' }
      ],
    };

    const mockSetVolume = vi.fn();

    mockUseSpotifyPlayer.mockReturnValue({
      is_ready: true,
      playerState: {
        is_paused: true,
        is_active: true,
        position: 0,
        duration: 0,
        current_track: mockTrack,
        device_id: 'test-device-id',
      },
      togglePlay: vi.fn(),
      nextTrack: vi.fn(),
      previousTrack: vi.fn(),
      setVolume: mockSetVolume,
    });

    await act(async () => {
      renderWithProviders(<WebPlaybackPlayer />);
    });

    // Test volume slider
    const volumeSlider = screen.getByRole('slider');
    await act(async () => {
      fireEvent.change(volumeSlider, { target: { value: '0.8' } });
    });
    expect(mockSetVolume).toHaveBeenCalledWith(0.8);
  });

  it('displays correct play/pause icon based on state', async () => {
    const mockTrack = {
      id: 'track-1',
      uri: 'spotify:track:1',
      name: 'Test Song',
      is_playable: true,
      album: {
        uri: 'spotify:album:1',
        name: 'Test Album',
        images: [],
      },
      artists: [
        { uri: 'spotify:artist:1', name: 'Test Artist' }
      ],
    };

    mockUseSpotifyPlayer.mockReturnValue({
      is_ready: true,
      playerState: {
        is_paused: false, // Playing
        is_active: true,
        position: 0,
        duration: 0,
        current_track: mockTrack,
        device_id: 'test-device-id',
      },
      togglePlay: vi.fn(),
      nextTrack: vi.fn(),
      previousTrack: vi.fn(),
      setVolume: vi.fn(),
    });

    await act(async () => {
      renderWithProviders(<WebPlaybackPlayer />);
    });

    expect(screen.getByTitle('Pause')).toBeInTheDocument();
  });

  it('formats time correctly', async () => {
    const mockTrack = {
      id: 'track-1',
      uri: 'spotify:track:1',
      name: 'Test Song',
      is_playable: true,
      album: {
        uri: 'spotify:album:1',
        name: 'Test Album',
        images: [],
      },
      artists: [
        { uri: 'spotify:artist:1', name: 'Test Artist' }
      ],
    };

    mockUseSpotifyPlayer.mockReturnValue({
      is_ready: true,
      playerState: {
        is_paused: false,
        is_active: true,
        position: 125000, // 2:05
        duration: 0,
        current_track: mockTrack,
        device_id: 'test-device-id',
      },
      togglePlay: vi.fn(),
      nextTrack: vi.fn(),
      previousTrack: vi.fn(),
      setVolume: vi.fn(),
    });

    await act(async () => {
      renderWithProviders(<WebPlaybackPlayer />);
    });

    expect(screen.getByText('2:05')).toBeInTheDocument();
  });
});
