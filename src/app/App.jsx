import React, { useState, useEffect, lazy, Suspense } from "react";
import PropTypes from "prop-types";
import { Toaster } from "@/components/ui/Sonner";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

// Lazy load pages for better initial load performance
const LandingPage = lazy(() => import("@/pages/LandingPage").then(m => ({ default: m.LandingPage })));
const LoginPage = lazy(() => import("@/pages/auth/LoginPage").then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import("@/pages/auth/RegisterPage").then(m => ({ default: m.RegisterPage })));
const DashboardLayout = lazy(() => import("@/pages/dashboard/DashboardLayout").then(m => ({ default: m.DashboardLayout })));

// Loading spinner component
const PageLoader = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
      <p className="mt-4 text-gray-600 dark:text-gray-400">Memuat...</p>
    </div>
  </div>
);

function AppContent() {
  const [currentPage, setCurrentPage] = useState("landing");
  const [darkMode, setDarkMode] = useState(false);
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      setCurrentPage("dashboard");
    } else if (!isAuthenticated && currentPage === "dashboard") {
      setCurrentPage("landing");
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("agri-dark-mode");
    if (savedDarkMode === "true") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const handleLogin = (userData) => {
    setCurrentPage("dashboard");
  };

  const handleLogout = async () => {
    await logout();
    setCurrentPage("landing");
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("agri-dark-mode", newDarkMode.toString());

    if (newDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Memuat...</p>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case "landing":
        return <LandingPage onNavigate={setCurrentPage} />;
      case "login":
        return <LoginPage onNavigate={setCurrentPage} onLogin={handleLogin} />;
      case "register":
        return <RegisterPage onNavigate={setCurrentPage} onLogin={handleLogin} />;
      case "dashboard":
        return (
          <DashboardLayout
            user={user}
            onLogout={handleLogout}
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
          />
        );
      default:
        return <LandingPage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<PageLoader />}>
        {renderPage()}
      </Suspense>
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
