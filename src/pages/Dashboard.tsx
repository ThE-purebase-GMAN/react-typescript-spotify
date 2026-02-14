import Header from "../components/Header/Header.tsx";
import MainContent from "../components/MainContent.tsx";
import AuthDebugger from "../components/AuthDebugger.tsx";
import SpotifyApiDebugger from "../components/SpotifyApiDebugger.tsx";

const Dashboard = () => {
  return (
    <div className="outfit-font max-auto" data-testid="dashboard-element">
      <Header />
      <div className="flex flex-row gap-2 px-2 h-[79vh] overflow-y-auto">
        <MainContent />
      </div>

        {/* Debug tools for troubleshooting */}
        <div className="px-2 pt-2 space-y-2">
            <AuthDebugger />
            <SpotifyApiDebugger />
            {/* Temporarily disabled SpotifyApiTest to fix auth errors */}
            {/* <SpotifyApiTest /> */}
        </div>
    </div>
  );
};

export default Dashboard;
