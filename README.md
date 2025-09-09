# 🎵 React TypeScript Spotify Integration

A comprehensive Spotify Web API integration built with React, TypeScript, and modern web technologies. This project provides a fully-featured Spotify client with authentication, playback control, music discovery, and library management.

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.0+-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0+-646cff.svg)](https://vitejs.dev/)
[![Test Coverage](https://img.shields.io/badge/Coverage-60%2B%25-brightgreen.svg)](https://vitest.dev/)

## ✨ Features

### 🔐 **Authentication & Security**

- OAuth 2.0 with PKCE flow for secure authentication
- Automatic token refresh and management
- Comprehensive error handling and debugging tools

### 🎮 **Spotify Connect Integration**

- **Playback Control**: Play, pause, next, previous, seek
- **Volume Control**: Adjust playback volume
- **Device Management**: Transfer playback between devices
- **Queue Management**: Add tracks to queue
- **Shuffle & Repeat**: Toggle modes (off, context, track)

### 🎵 **Music Discovery & Management**

- **Search**: Tracks, artists, albums, playlists with real-time results
- **Browse**: Featured playlists, new releases, categories
- **Recommendations**: AI-powered music suggestions
- **User Library**: Save/remove tracks, albums, follow artists
- **Playlist Management**: Create, modify, follow/unfollow playlists

### 📊 **Real-time Features**

- Live playback state updates
- Currently playing track information
- Progress tracking with seeking capability
- Real-time device availability

### 🎨 **Modern UI Components**

- Responsive design with Tailwind CSS and DaisyUI
- Interactive music player interface
- Real-time debugging tools
- Loading states and error boundaries

## 🚀 Quick Start

### Prerequisites

- **Spotify Premium Account** (required for playback control)
- **Node.js 18+** and **npm**
- **Spotify Developer Account** for API credentials

### 1. Clone the Repository

```bash
git clone git@github.com:frank-mendez/react-typescript-spotify.git
cd react-typescript-spotify
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Spotify Developer Setup

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new application
3. Add `http://localhost:5173/` to Redirect URIs
4. Copy your Client ID

### 4. Environment Configuration

Create a `.env` file in the root directory:

```env
VITE_CLIENT_ID=your_spotify_client_id_here
```

### 5. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` and authenticate with your Spotify account!

## 🧪 Testing

### Run Tests

```bash
npm run test
```

### Generate Coverage Report

```bash
npm run coverage
```

**Current Test Coverage: 60%+ with 243+ comprehensive tests**

- Unit tests for all API services
- Hook testing with React Testing Library
- Component integration tests
- Authentication flow testing

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run test suite
- `npm run coverage` - Generate coverage report
- `npm run lint` - Run ESLint

## 🛠️ Tech Stack

### **Frontend**

- **React 18** - Modern React with hooks and concurrent features
- **TypeScript 5** - Full type safety and IntelliSense
- **Vite** - Lightning-fast build tool and dev server
- **React Router DOM 6** - Client-side routing
- **React Query (TanStack)** - Data fetching and caching

### **Styling & UI**

- **Tailwind CSS** - Utility-first CSS framework
- **DaisyUI** - Component library for Tailwind
- **Material-UI Icons** - Comprehensive icon set
- **FontAwesome Icons** - Additional icon library

### **API & State Management**

- **Axios** - HTTP client with interceptors
- **Zustand** - Lightweight state management
- **Spotify Web API** - Official Spotify REST API
- **Spotify Web Playbook SDK** - Browser-based playback

### **Development & Quality**

- **Vitest** - Fast unit testing framework
- **React Testing Library** - Component testing utilities
- **ESLint** - Code linting and formatting
- **Husky & Commitlint** - Git hooks and conventional commits

## 📁 Project Architecture

```
src/
├── api/                    # API layer
│   ├── auth/              # Authentication services
│   ├── spotify/           # Spotify API services
│   └── user/              # User profile services
├── components/            # Reusable UI components
│   ├── Header/           # Navigation components
│   └── Footer/           # Footer components
├── context/              # React Context providers
├── hooks/                # Custom React hooks
├── pages/                # Page components
├── routes/               # Routing configuration
├── stores/               # Zustand stores
├── utils/                # Utility functions
└── data-objects/         # TypeScript interfaces
    ├── interface/        # Type definitions
    └── enum/            # Enum constants
```

## 🔧 Key Features in Detail

### Authentication Flow

- **PKCE (Proof Key for Code Exchange)** for enhanced security
- **Automatic token refresh** with retry logic
- **Comprehensive scope permissions** for full API access
- **Built-in debugging tools** for troubleshooting

### API Services

- **Modular service architecture** with TypeScript interfaces
- **Automatic error handling** and retry mechanisms
- **Rate limiting support** with proper error responses
- **Full CRUD operations** for playlists, library, and user data

### Real-time Updates

- **WebSocket-like experience** with React Query
- **Optimistic updates** for better UX
- **Background sync** for playback state
- **Automatic refetching** strategies

## 🔒 Security Features

- Client-side only (no server secrets exposed)
- PKCE flow prevents code interception attacks
- Secure token storage with automatic cleanup
- Proper CORS configuration
- Rate limiting awareness and handling

## 📚 Documentation

- **[IMPLEMENTATION_COMPLETE.md](IMPLEMENTATION_COMPLETE.md)** - Detailed feature overview
- **[SPOTIFY_API_GUIDE.md](SPOTIFY_API_GUIDE.md)** - Complete API documentation
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Common issues and solutions
- **[AUTHENTICATION_FIX.md](AUTHENTICATION_FIX.md)** - Authentication debugging guide

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines and code of conduct.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Run tests (`npm run test`)
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## ⚠️ Important Notes

### Spotify Premium Requirement

- **Playback control requires Spotify Premium**
- Free accounts can browse and search but cannot control playback
- Web Playbook SDK requires Premium subscription

### Active Device Requirement

- At least one Spotify client must be active for playback control
- Supported clients: Desktop app, mobile app, web player
- Use the device selector to choose playback destination

## 🐛 Troubleshooting

### Common Issues

- **401 Permissions Missing**: Re-authenticate or check scopes
- **No Devices Available**: Start Spotify on another device
- **Playback Not Working**: Ensure Premium account and active device
- **Token Expired**: Use the built-in auth debugger

See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for detailed solutions.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: Questions and community support
- **Documentation**: Comprehensive guides in the `/docs` directory

---

**Built with ❤️ using React, TypeScript, and the Spotify Web API**
