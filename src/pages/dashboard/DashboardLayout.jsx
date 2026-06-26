import React, { useState, useEffect, lazy, Suspense } from "react";
import PropTypes from "prop-types";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  User,
  LogOut,
  Leaf,
  Moon,
  Sun,
  Activity,
  Calendar,
  Menu,
  X,
} from "lucide-react";
import { Logo } from "@/components/common/Logo";

// Lazy load feature dashboards for better performance
const AgriinoDashboard = lazy(() => import("@/features/agriino/AgriinoDashboard").then(m => ({ default: m.AgriinoDashboard })));
const ProfilePage = lazy(() => import("./ProfilePage").then(m => ({ default: m.ProfilePage })));

// Feature loading spinner
const FeatureLoader = () => (
  <div className="flex-1 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500 mx-auto"></div>
      <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">Memuat fitur...</p>
    </div>
  </div>
);

export function DashboardLayout({ user, onLogout, darkMode, toggleDarkMode }) {
  const [currentPage, setCurrentPage] = useState("agriino");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [sidebarOpen]);

  const menuItems = [
    {
      id: "agriino",
      label: "Agriino",
      icon: Leaf,
      description: "Monitoring Klorofil & Nitrogen",
      status: "active",
    },
  ];

  const getCurrentDate = () => {
    return new Date().toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderContent = () => {
    const content = (() => {
      switch (currentPage) {
        case "agriino":
          return <AgriinoDashboard />;
        case "profile":
          return <ProfilePage user={user} />;
        default:
          return <AgriinoDashboard />;
      }
    })();

    return <Suspense fallback={<FeatureLoader />}>{content}</Suspense>;
  };

  return (
    <div className="h-screen bg-gradient-to-br from-green-50/30 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex overflow-hidden">
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`${
          sidebarCollapsed ? "lg:w-20" : "lg:w-72"
        } w-72 transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-r border-green-100 dark:border-slate-700 flex flex-col fixed inset-y-0 left-0 z-50 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="p-4 lg:p-6 border-b border-green-100 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {sidebarCollapsed ? (
                <Logo size="lg" showText={false} className="hidden lg:flex" />
              ) : (
                <Logo size="lg" />
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <nav className="flex-1 p-3 lg:p-4 overflow-y-auto">
          <div className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl transition-all duration-200 text-left group ${
                  currentPage === item.id
                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg"
                    : "hover:bg-green-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                <item.icon
                  className={`w-5 h-5 flex-shrink-0 ${
                    currentPage === item.id
                      ? "text-white"
                      : "text-gray-500 group-hover:text-green-600"
                  }`}
                />
                <div className={`flex-1 min-w-0 ${sidebarCollapsed ? "hidden lg:block" : ""}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-medium truncate text-sm lg:text-base">{item.label}</span>
                    {item.status === "active" && (
                      <Badge
                        variant="secondary"
                        className={`text-xs ${
                          currentPage === item.id
                            ? "bg-white/20 text-white"
                            : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                        }`}
                      >
                        Aktif
                      </Badge>
                    )}
                  </div>
                  <p
                    className={`text-xs truncate ${
                      currentPage === item.id
                        ? "text-white/80"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {item.description}
                  </p>
                </div>
              </button>
            ))}

          </div>
        </nav>

        <div className="p-3 lg:p-4 border-t border-green-100 dark:border-slate-700 space-y-2">
          <button
            onClick={() => {
              setCurrentPage("profile");
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center space-x-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl transition-all duration-200 ${
              currentPage === "profile"
                ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                : "hover:bg-green-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className={`flex-1 min-w-0 ${sidebarCollapsed ? "hidden lg:block" : ""}`}>
              <p className="font-medium truncate text-sm lg:text-base">{user?.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
            </div>
          </button>

          <button
            onClick={onLogout}
            className={`w-full lg:hidden flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-red-600 hover:bg-red-50 hover:text-red-700`}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium text-sm">
              Logout
            </span>
          </button>
        </div>
      </div>

      <div
        className={`flex-1 flex flex-col transition-[margin] duration-300 ${
          sidebarCollapsed ? "lg:ml-20" : "lg:ml-72"
        } ml-0`}
      >
        <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-b border-green-100 dark:border-slate-700 px-4 lg:px-6 py-3 lg:py-4 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 lg:space-x-4 flex-1 min-w-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="p-2 lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 hidden lg:flex"
              >
                <Activity className="w-5 h-5" />
              </Button>
              
              <div className="min-w-0 flex-1">
                <h2 className="text-base lg:text-xl font-bold text-gray-900 dark:text-gray-100 truncate">
                  {menuItems.find((item) => item.id === currentPage)?.label ||
                    "Dashboard"}
                </h2>
                <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-1 lg:space-x-2">
                  <Calendar className="w-3 h-3 lg:w-4 lg:h-4 flex-shrink-0" />
                  <span className="truncate hidden sm:inline">{getCurrentDate()}</span>
                  <span className="truncate sm:hidden">
                    {new Date().toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 lg:space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDarkMode}
                className="p-2 hidden sm:flex"
              >
                {darkMode ? (
                  <Sun className="w-4 h-4 lg:w-5 lg:h-5" />
                ) : (
                  <Moon className="w-4 h-4 lg:w-5 lg:h-5" />
                )}
              </Button>

              <div className="hidden md:flex items-center space-x-2 px-2 lg:px-3 py-1.5 lg:py-2 bg-green-50 dark:bg-green-900/30 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-green"></div>
                <span className="text-xs lg:text-sm font-medium text-green-700 dark:text-green-400">
                  Online
                </span>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={onLogout}
                className="hidden lg:flex p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{renderContent()}</main>
      </div>
    </div>
  );
}

DashboardLayout.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }).isRequired,
  onLogout: PropTypes.func.isRequired,
  darkMode: PropTypes.bool.isRequired,
  toggleDarkMode: PropTypes.func.isRequired,
};
