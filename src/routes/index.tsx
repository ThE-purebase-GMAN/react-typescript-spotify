import { createBrowserRouter, RouteObject } from "react-router-dom";
import Dashboard from "../pages/Dashboard.tsx";
import Login from "../pages/Login.tsx";
import ProtectedRoute from "../components/ProtectedRoute.tsx";

const routes: RouteObject[] = [
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  { path: "/login", element: <Login /> },
];

export const router = createBrowserRouter(routes);
