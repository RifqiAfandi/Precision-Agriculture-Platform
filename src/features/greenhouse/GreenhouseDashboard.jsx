import React, { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/Tabs";
import { Home, Thermometer, Droplets, Activity, TrendingUp, CheckCircle } from "lucide-react";
import { toast } from "sonner";

// Data imports
import {
  currentData,
  hourlyData,
  actionHistory,
} from "./data/greenhouseData";

// Helper imports
import {
  getTemperatureStatus,
  getHumidityStatus,
  getCO2Status,
  formatTempDifference,
  validateControlChange,
  formatControlAction,
  getRecommendation,
} from "./utils/greenhouseHelpers";

// Component imports
import { MonitoringCard } from "./components/MonitoringCard";
import { ParameterCard } from "./components/ParameterCard";
import { ControlPanel } from "./components/ControlPanel";
import { TrendChart } from "./components/TrendChart";
import { ActionHistoryPanel } from "./components/ActionHistoryPanel";

/**
 * GreenhouseDashboard - Main dashboard for greenhouse monitoring and control
 * 
 * Features:
 * - Real-time environmental monitoring (temp, humidity, CO2)
 * - Manual and automatic device control
 * - 24-hour trend visualization
 * - Action history log
 * 
 * @component
 */
export function GreenhouseDashboard() {
  const [activeTab, setActiveTab] = useState("monitoring");
  const [autoMode, setAutoMode] = useState(true);
  const [controls, setControls] = useState({
    exhaustFan: true,
    roofVent: false,
    irrigationSystem: false,
    heatingSystem: false,
  });

  /**
   * Handle control device toggle
   * @param {string} controlKey - Device key to toggle
   */
  const handleControlChange = (controlKey) => {
    const validation = validateControlChange(autoMode, controlKey);

    if (!validation.isValid) {
      toast.warning(validation.message);
      return;
    }

    const newState = !controls[controlKey];
    setControls((prev) => ({
      ...prev,
      [controlKey]: newState,
    }));

    // Get device label for toast message
    const deviceLabels = {
      exhaustFan: "Exhaust Fan",
      roofVent: "Atap Ventilasi",
      irrigationSystem: "Sistem Irigasi",
      heatingSystem: "Sistem Pemanas",
    };

    const message = formatControlAction(deviceLabels[controlKey], newState);
    toast.success(message);
  };

  /**
   * Toggle automatic/manual mode
   */
  const toggleAutoMode = () => {
    const newMode = !autoMode;
    setAutoMode(newMode);

    if (newMode) {
      toast.success("Mode otomatis diaktifkan");
    } else {
      toast.info("Mode manual diaktifkan");
    }
  };

  // Chart configuration
  const trendLines = [
    { dataKey: "insideTemp", stroke: "#ef4444", name: "Suhu (°C)" },
    { dataKey: "humidity", stroke: "#3b82f6", name: "Kelembaban (%)" },
    { dataKey: "co2", stroke: "#8b5cf6", name: "CO₂ (ppm)" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Greenhouse #1</h2>
            <p className="text-green-100">Status: Operasional Optimal</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-green-100 text-sm">Mode Operasi</p>
              <Badge
                className={`${
                  autoMode
                    ? "bg-white/20 text-white"
                    : "bg-orange-200 text-orange-800"
                }`}
              >
                {autoMode ? "Otomatis" : "Manual"}
              </Badge>
            </div>
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
              <Home className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="monitoring">Dashboard Monitoring</TabsTrigger>
          <TabsTrigger value="control">Halaman Kendali</TabsTrigger>
          <TabsTrigger value="history">Riwayat</TabsTrigger>
        </TabsList>

        {/* Tab: Dashboard Monitoring */}
        <TabsContent value="monitoring" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Temperature Card */}
            <MonitoringCard
              title="Suhu Greenhouse"
              icon={Thermometer}
              iconColor="text-red-600"
              data={[
                {
                  label: "Dalam Greenhouse",
                  value: currentData.insideTemp,
                  status: getTemperatureStatus(currentData.insideTemp),
                  isMain: true,
                },
                {
                  label: "Luar Greenhouse",
                  value: `${currentData.outsideTemp}°C`,
                },
              ]}
              footer={
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span>
                    Selisih:{" "}
                    {formatTempDifference(
                      currentData.insideTemp,
                      currentData.outsideTemp
                    )}
                  </span>
                </div>
              }
            />

            {/* Humidity Card */}
            <MonitoringCard
              title="Kelembaban"
              icon={Droplets}
              iconColor="text-blue-600"
              data={[
                {
                  label: "Dalam Greenhouse",
                  value: currentData.insideHumidity,
                  status: getHumidityStatus(currentData.insideHumidity),
                  isMain: true,
                },
                {
                  label: "Kelembaban Tanah",
                  value: `${currentData.soilMoisture}%`,
                },
              ]}
              footer={
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>{getRecommendation("humidity", currentData.insideHumidity)}</span>
                </div>
              }
            />

            {/* CO2 Card */}
            <ParameterCard
              title="CO₂ Level"
              icon={Activity}
              iconColor="text-purple-600"
              value={currentData.co2Level}
              unit="ppm"
              status={getCO2Status(currentData.co2Level)}
              description={getRecommendation("co2", currentData.co2Level)}
            />
          </div>

          {/* 24h Trend Chart */}
          <TrendChart
            title="Tren 24 Jam Terakhir"
            description="Suhu, kelembaban, dan CO₂ level"
            data={hourlyData}
            lines={trendLines}
          />
        </TabsContent>

        {/* Tab: Control Panel */}
        <TabsContent value="control">
          <ControlPanel
            autoMode={autoMode}
            controls={controls}
            onControlChange={handleControlChange}
            onAutoModeToggle={toggleAutoMode}
          />
        </TabsContent>

        {/* Tab: History */}
        <TabsContent value="history">
          <ActionHistoryPanel history={actionHistory} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
