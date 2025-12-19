import React, { useState, useEffect, lazy, Suspense } from "react";
import PropTypes from "prop-types";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  User,
  LogOut,
  Leaf,
  Cloud,
  Home,
  Bell,
  Moon,
  Sun,
  Activity,
  Calendar,
  Plus,
  Gauge,
  Menu,
  X,
} from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { WelcomePage } from "./WelcomePage";
import AddDeviceDialog from "@/features/devices/components/AddDeviceDialog";
import { loadInstalledDevices, addDevice } from "@/features/devices/utils/devicesHelpers";

// Lazy load feature dashboards for better performance
const AgriinoDashboard = lazy(() => import("@/features/agriino/AgriinoDashboard").then(m => ({ default: m.AgriinoDashboard })));
const AgriimeterDashboard = lazy(() => import("@/features/agriimeter/AgriimeterDashboard").then(m => ({ default: m.AgriimeterDashboard })));
const GreenhouseDashboard = lazy(() => import("@/features/greenhouse/GreenhouseDashboard").then(m => ({ default: m.GreenhouseDashboard })));
const SkyVeraDashboard = lazy(() => import("@/features/skyvera/SkyVeraDashboard"));
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
  const [currentPage, setCurrentPage] = useState("welcome");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAddDevice, setShowAddDevice] = useState(false);
  const [installedDevices, setInstalledDevices] = useState([]);

  useEffect(() => {
    const devices = loadInstalledDevices();
    setInstalledDevices(devices);
  }, []);

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

  const handleDeviceAdded = (deviceId) => {
    const updatedDevices = addDevice(deviceId, installedDevices);
    setInstalledDevices(updatedDevices);

    if (deviceId === "greenhouse") {
      setCurrentPage("greenhouse");
    } else if (deviceId === "skyvera") {
      setCurrentPage("skyvera");
    }
  };

  const menuItems = [
    {
      id: "welcome",
      label: "Dashboard",
      icon: Activity,
      description: "Ringkasan monitoring",
      always: true,
    },
    {
      id: "agriino",
      label: "Agriino",
      icon: Leaf,
      description: "Monitoring Klorofil & Nitrogen",
      status: "active",
      always: true, // Agriino selalu ditampilkan
    },
    // Alat lainnya di-disable (hide) untuk sementara
    // {
    //   id: "agriimeter",
    //   label: "Agriimeter",
    //   icon: Cloud,
    //   description: "Pengukur DBH Pohon",
    //   status: "active",
    // },
    // {
    //   id: "greenhouse",
    //   label: "Greenhouse Compax",
    //   icon: Home,
    //   description: "Monitoring Rumah Kaca",
    //   status: "active",
    // },
    // {
    //   id: "skyvera",
    //   label: "SkyVera",
    //   icon: Gauge,
    //   description: "Weather Station Professional",
    //   status: "active",
    // },
  ].filter((item) => item.always || installedDevices.includes(item.id));

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
        case "welcome":
          return (
            <WelcomePage
              user={user}
              onNavigate={setCurrentPage}
              installedDevices={installedDevices}
            />
          );
        case "agriino":
          return <AgriinoDashboard />;
        case "agriimeter":
          return <AgriimeterDashboard />;
        case "greenhouse":
          return <GreenhouseDashboard />;
        case "skyvera":
          return <SkyVeraDashboard />;
        case "profile":
          return <ProfilePage user={user} />;
        default:
          return (
            <WelcomePage
              user={user}
              onNavigate={setCurrentPage}
              installedDevices={installedDevices}
            />
          );
      }
    })();

    // Wrap lazy-loaded components with Suspense
    if (currentPage !== "welcome") {
      return <Suspense fallback={<FeatureLoader />}>{content}</Suspense>;
    }
    return content;
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

            <button
              onClick={() => {
                setShowAddDevice(true);
                setSidebarOpen(false);
              }}
              className={`w-full lg:hidden flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-left group border-2 border-dashed border-gray-300 dark:border-slate-600 hover:border-green-400 hover:bg-green-50 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300 hover:text-green-700`}
            >
              <Plus className="w-5 h-5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="font-medium text-sm">Tambah Alat</span>
                <p className="text-xs text-gray-500">Pasang perangkat baru</p>
              </div>
            </button>
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
                onClick={() => setShowAddDevice(true)}
                variant="outline"
                size="sm"
                className="hidden lg:flex items-center space-x-2 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-slate-700"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Alat</span>
              </Button>

              <Button variant="ghost" size="sm" className="relative p-2">
                <Bell className="w-4 h-4 lg:w-5 lg:h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs flex items-center justify-center">
                  <span className="text-[8px] text-white font-bold">3</span>
                </span>
              </Button>

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

      <AddDeviceDialog
        open={showAddDevice}
        onOpenChange={setShowAddDevice}
        onDeviceAdded={handleDeviceAdded}
      />
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
