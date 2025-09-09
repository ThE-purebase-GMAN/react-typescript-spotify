import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Login from "../pages/Login";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { accessToken } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Give some time for the AuthProvider to check for existing tokens
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="text-lg">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If no access token, show login page
  if (!accessToken) {
    return <Login />;
  }

  // If authenticated, show protected content
  return <>{children}</>;
};

export default ProtectedRoute;
