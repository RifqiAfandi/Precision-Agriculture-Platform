import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { WelcomePage } from "./WelcomePage";
import { AgriinoDashboard } from "@/features/agriino/AgriinoDashboard";
import { AgriimeterDashboard } from "@/features/agriimeter/AgriimeterDashboard";
import { GreenhouseDashboard } from "@/features/greenhouse/GreenhouseDashboard";
import SkyVeraDashboard from "@/features/skyvera/SkyVeraDashboard";
import { ProfilePage } from "./ProfilePage";
import AddDeviceDialog from "@/features/devices/components/AddDeviceDialog";
import { loadInstalledDevices, addDevice } from "@/features/devices/utils/devicesHelpers";

export function DashboardLayout({ user, onLogout, darkMode, toggleDarkMode }) {
  const [currentPage, setCurrentPage] = useState("welcome");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showAddDevice, setShowAddDevice] = useState(false);
  const [installedDevices, setInstalledDevices] = useState([]);

  useEffect(() => {
    const devices = loadInstalledDevices();
    setInstalledDevices(devices);
  }, []);

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
    },
    {
      id: "agriimeter",
      label: "Agriimeter",
      icon: Cloud,
      description: "Pengukur DBH Pohon",
      status: "active",
    },
    {
      id: "greenhouse",
      label: "Greenhouse Compax",
      icon: Home,
      description: "Monitoring Rumah Kaca",
      status: "active",
    },
    {
      id: "skyvera",
      label: "SkyVera",
      icon: Gauge,
      description: "Weather Station Professional",
      status: "active",
    },
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
  };

  return (
    <div className="h-screen bg-gradient-to-br from-green-50/30 via-white to-blue-50/30 flex overflow-hidden">
      <div
        className={`${
          sidebarCollapsed ? "w-20" : "w-72"
        } transition-all duration-300 bg-white/80 backdrop-blur-lg border-r border-green-100 flex flex-col fixed inset-y-0 left-0 z-40`}
      >
        <div className="p-6 border-b border-green-100">
          <div className="flex items-center space-x-3">
            {sidebarCollapsed ? (
              <Logo size="lg" showText={false} />
            ) : (
              <Logo size="lg" />
            )}
          </div>
        </div>

        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-left group ${
                  currentPage === item.id
                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg"
                    : "hover:bg-green-50 text-gray-700"
                }`}
              >
                <item.icon
                  className={`w-5 h-5 flex-shrink-0 ${
                    currentPage === item.id
                      ? "text-white"
                      : "text-gray-500 group-hover:text-green-600"
                  }`}
                />
                {!sidebarCollapsed && (
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium truncate">{item.label}</span>
                      {item.status === "active" && (
                        <Badge
                          variant="secondary"
                          className={`text-xs ${
                            currentPage === item.id
                              ? "bg-white/20 text-white"
                              : "bg-green-100 text-green-700"
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
                          : "text-gray-500"
                      }`}
                    >
                      {item.description}
                    </p>
                  </div>
                )}
              </button>
            ))}

            {!sidebarCollapsed && (
              <button
                onClick={() => setShowAddDevice(true)}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-left group border-2 border-dashed border-gray-300 hover:border-green-400 hover:bg-green-50 text-gray-600 hover:text-green-700"
              >
                <Plus className="w-5 h-5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="font-medium">Tambah Alat</span>
                  <p className="text-xs text-gray-500">Pasang perangkat baru</p>
                </div>
              </button>
            )}
          </div>
        </nav>

        <div className="p-4 border-t border-green-100">
          <button
            onClick={() => setCurrentPage("profile")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              currentPage === "profile"
                ? "bg-green-100 text-green-800"
                : "hover:bg-green-50 text-gray-700"
            }`}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-white" />
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            )}
          </button>
        </div>
      </div>

      <div
        className={`flex-1 flex flex-col transition-[margin] duration-300 ${
          sidebarCollapsed ? "ml-20" : "ml-72"
        }`}
      >
        <header className="bg-white/80 backdrop-blur-lg border-b border-green-100 px-6 py-4 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2"
              >
                <Activity className="w-5 h-5" />
              </Button>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {menuItems.find((item) => item.id === currentPage)?.label ||
                    "Dashboard"}
                </h2>
                <p className="text-sm text-gray-500 flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{getCurrentDate()}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                onClick={() => setShowAddDevice(true)}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2 border-green-200 text-green-700 hover:bg-green-50"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Alat</span>
              </Button>

              <Button variant="ghost" size="sm" className="relative p-2">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  3
                </span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDarkMode}
                className="p-2"
              >
                {darkMode ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </Button>

              <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-green"></div>
                <span className="text-sm font-medium text-green-700">
                  Online
                </span>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={onLogout}
                className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">{renderContent()}</main>
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
