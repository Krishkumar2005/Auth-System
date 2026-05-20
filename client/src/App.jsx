import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";

// Redirect logged-in users away from auth pages
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/login" replace />} />
    <Route
      path="/login"
      element={
        <PublicRoute>
          <LoginPage />
        </PublicRoute>
      }
    />
    <Route
      path="/register"
      element={
        <PublicRoute>
          <RegisterPage />
        </PublicRoute>
      }
    />
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      }
    />
    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
);

const App = () => (
  <AuthProvider>
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: "#131d35",
          color: "#e8edf5",
          border: "1px solid rgba(0,229,200,0.15)",
          borderRadius: "12px",
          fontSize: "14px",
          fontFamily: "'DM Sans', sans-serif",
        },
        success: {
          iconTheme: { primary: "#00e5c8", secondary: "#0a0e1a" },
        },
        error: {
          iconTheme: { primary: "#ff4d6d", secondary: "#0a0e1a" },
        },
        duration: 4000,
      }}
    />
    <AppRoutes />
  </AuthProvider>
);

export default App;
