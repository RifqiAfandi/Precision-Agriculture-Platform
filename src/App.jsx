import React, { useState, useEffect } from "react";
import { LandingPage, LoginPage, RegisterPage, DashboardLayout } from "./pages";
import { Toaster } from "./components/ui/Sonner";

export default function App() {
  // currentPage: "landing" | "login" | "register" | "dashboard"
  const [currentPage, setCurrentPage] = useState("landing");
  // user = { id, name, email } | null
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check for saved user session
    const savedUser = localStorage.getItem("agri-user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setCurrentPage("dashboard");
    }

    // Check for dark mode preference
    const savedDarkMode = localStorage.getItem("agri-dark-mode");
    if (savedDarkMode === "true") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const handleLogin = (userData) => {
    const user = { id: "1", ...userData };
    setUser(user);
    localStorage.setItem("agri-user", JSON.stringify(user));
    setCurrentPage("dashboard");
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("agri-user");
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

  const renderPage = () => {
    switch (currentPage) {
      case "landing":
        return <LandingPage onNavigate={setCurrentPage} />;
      case "login":
        return <LoginPage onNavigate={setCurrentPage} onLogin={handleLogin} />;
      case "register":
        return <RegisterPage onNavigate={setCurrentPage} />;
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
      {renderPage()}
      <Toaster />
    </div>
  );
}
