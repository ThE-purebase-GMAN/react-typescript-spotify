import { useContentStore } from "../stores/useContentStore.ts";
import SpotifyPlayer from "./SpotifyPlayer.tsx";
import { useAuth } from "../context/AuthContext.tsx";

const MainContent = () => {
  const { currentContent } = useContentStore();
  const { accessToken } = useAuth();
  console.log('Current content:', currentContent); // Keep for debugging
  
  return (
    <div
      data-testid="main-content-element"
      className="card bg-base-300 my-10 basis-3/4 shadow-xl max-h-screen overflow-y-auto"
    >

      {accessToken ? (
        <SpotifyPlayer />
      ) : (
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">🎵 Spotify Player</h3>
            <p className="text-gray-600">Please authenticate to access Spotify features</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainContent;
