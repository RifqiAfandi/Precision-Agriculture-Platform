import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Loader2, Target, Activity, Calendar } from "lucide-react";
import { StatCard } from "@/components/common/StatCard";
import { RealTimeMonitoring } from "./components/RealTimeMonitoring";
import { WeeklyHistoryTable } from "./components/WeeklyHistoryTable";
import { KrigingMap } from "./components/KrigingMap";
import {
  Leaf,
  BarChart3,
  AlertCircle,
} from "lucide-react";
import { REFRESH_INTERVALS } from "@/constants/config";
import { 
  realTimeDataStore, 
  classifyNitrogen, 
  NITROGEN_THRESHOLDS 
} from "@/services/dummyDataGenerator";

/**
 * Calculate and update statistics from device data
 * 
 * @param {Array<Object>} deviceData - Array of device objects with nitrogen values
 * @param {Function} setStats - State setter function for stats
 * @returns {void}
 */
const updateStatsFromDevices = (deviceData, setStats) => {
  if (!deviceData || deviceData.length === 0) {
    setStats({
      totalDevices: 0,
      avgNitrogen: '0',
      needsAttention: 0,
    });
    return;
  }

  const nitrogenValues = deviceData.map(d => d.nitrogen);
  const avgNitrogen = nitrogenValues.reduce((a, b) => a + b, 0) / nitrogenValues.length;
  
  // Count devices that need attention (deficient nitrogen)
  const needsAttention = deviceData.filter(
    d => classifyNitrogen(d.nitrogen) === 'deficient'
  ).length;

  setStats({
    totalDevices: deviceData.length,
    avgNitrogen: avgNitrogen.toFixed(3),
    needsAttention,
  });
};

/**
 * AgriinoDashboard Component
 * 
 * Main dashboard for Agriino nitrogen monitoring system.
 * Displays real-time device data, kriging analysis, and historical data.
 * 
 * Features:
 * - Real-time monitoring tab with live device data
 * - Kriging analysis tab for spatial interpolation
 * - History tab for weekly data trends
 * - Statistics cards showing key metrics
 * - Nitrogen classification legend
 * 
 * @component
 * @returns {React.ReactElement} Rendered AgriinoDashboard component
 * 
 * @example
 * <AgriinoDashboard />
 */
export function AgriinoDashboard() {
  const [activeTab, setActiveTab] = useState("monitoring");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDevices: 0,
    avgNitrogen: '0',
    needsAttention: 0,
  });
  // Store devices for potential future use (e.g., passing to child components)
  const [_devices, setDevices] = useState([]);

  // Initialize and subscribe to real-time data
  useEffect(() => {
    const initializeData = () => {
      setLoading(true);
      
      // Start the real-time data store
      realTimeDataStore.start(REFRESH_INTERVALS.SLOW); // Update every minute
      
      // Get initial data
      const currentData = realTimeDataStore.getCurrentData();
      updateStatsFromDevices(currentData, setStats);
      setDevices(currentData);
      setLoading(false);
    };

    initializeData();

    // Subscribe to data updates
    const unsubscribe = realTimeDataStore.subscribe((data) => {
      updateStatsFromDevices(data, setStats);
      setDevices(data);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4 md:space-y-6 p-2 sm:p-4 md:p-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
        <StatCard
          icon={Leaf}
          iconColor="text-green-600"
          label="Total Device"
          value={stats.totalDevices}
        />

        <StatCard
          icon={BarChart3}
          iconColor="text-blue-600"
          label="Rata-rata Nitrogen"
          value={stats.avgNitrogen}
        />

        <StatCard
          icon={AlertCircle}
          iconColor="text-orange-600"
          label="Perlu Perhatian"
          value={stats.needsAttention}
        />
      </div>

      {/* Nitrogen Classification Legend */}
      <Card className="glass-card">
        <CardContent className="py-3">
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <span className="font-medium text-gray-600">Klasifikasi Nitrogen:</span>
            {Object.entries(NITROGEN_THRESHOLDS).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: value.color }}
                />
                <span>
                  {value.label}: {key === 'deficient' ? `<${value.max}%` : 
                    key === 'high' ? `>${value.min}%` : 
                    `${value.min}-${value.max}%`}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="monitoring" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            <span className="hidden sm:inline">Peta Monitoring</span>
            <span className="sm:hidden">Monitoring</span>
          </TabsTrigger>
          <TabsTrigger value="kriging" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            <span className="hidden sm:inline">Analisis Kriging</span>
            <span className="sm:hidden">Kriging</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">Riwayat Monitoring</span>
            <span className="sm:hidden">Riwayat</span>
          </TabsTrigger>
        </TabsList>

        {/* Peta Monitoring - Real-time data with line chart */}
        <TabsContent value="monitoring" className="space-y-3 sm:space-y-4">
          <RealTimeMonitoring />
        </TabsContent>

        {/* Analisis Kriging */}
        <TabsContent value="kriging">
          <Card className="glass-card">
            <CardContent>
              <KrigingMap />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Riwayat Monitoring - Weekly averages */}
        <TabsContent value="history">
          <WeeklyHistoryTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default AgriinoDashboard;
