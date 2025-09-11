import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/Tabs";
import {
  Home,
  Thermometer,
  Droplets,
  Activity,
  Calendar,
  Download,
  TrendingUp,
  CheckCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { toast } from "sonner";
import { MonitoringCard } from "./greenhouse/MonitoringCard";
import { ControlPanel } from "./greenhouse/ControlPanel";
import {
  currentData,
  hourlyData,
  actionHistory,
  getStatus,
} from "./greenhouse/GreenhouseData";

export function GreenhouseDashboard() {
  const [activeTab, setActiveTab] = useState("monitoring");
  const [autoMode, setAutoMode] = useState(true);
  const [controls, setControls] = useState({
    exhaustFan: true,
    roofVent: false,
    irrigationSystem: false,
    heatingSystem: false,
  });

  const handleControlChange = (control) => {
    if (autoMode) {
      toast.warning("Matikan mode otomatis untuk kontrol manual");
      return;
    }

    setControls((prev) => ({
      ...prev,
      [control]: !prev[control],
    }));

    const action = controls[control] ? "Dimatikan" : "Dinyalakan";
    toast.success(`${control} ${action}`);
  };

  const toggleAutoMode = () => {
    setAutoMode(!autoMode);
    if (!autoMode) {
      toast.success("Mode otomatis diaktifkan");
    } else {
      toast.info("Mode manual diaktifkan");
    }
  };

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

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="monitoring">Dashboard Monitoring</TabsTrigger>
          <TabsTrigger value="control">Halaman Kendali</TabsTrigger>
          <TabsTrigger value="history">Riwayat</TabsTrigger>
        </TabsList>

        {/* Tab: Dashboard Monitoring */}
        <TabsContent value="monitoring" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <MonitoringCard
              title="Suhu Greenhouse"
              icon={Thermometer}
              iconColor="text-red-600"
              data={[
                {
                  label: "Dalam Greenhouse",
                  value: currentData.insideTemp,
                  status: getStatus(currentData.insideTemp, 24, 28),
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
                    {(currentData.outsideTemp - currentData.insideTemp).toFixed(
                      1
                    )}
                    °C lebih dingin
                  </span>
                </div>
              }
            />

            <MonitoringCard
              title="Kelembaban"
              icon={Droplets}
              iconColor="text-blue-600"
              data={[
                {
                  label: "Dalam Greenhouse",
                  value: currentData.insideHumidity,
                  status: getStatus(currentData.insideHumidity, 60, 75),
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
                  <span>Kondisi optimal untuk pertumbuhan</span>
                </div>
              }
            />

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-purple-600" />
                  <span>CO₂ Level</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div>
                    <span className="text-3xl font-bold text-gray-900">
                      {currentData.co2Level}
                    </span>
                    <span className="text-gray-500 ml-1">ppm</span>
                  </div>
                  <Badge
                    className={
                      getStatus(currentData.co2Level, 380, 450).bg +
                      " " +
                      getStatus(currentData.co2Level, 380, 450).color
                    }
                  >
                    {getStatus(currentData.co2Level, 380, 450).label}
                  </Badge>
                  <p className="text-sm text-gray-600">
                    Ideal untuk fotosintesis optimal
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 24h Chart */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Tren 24 Jam Terakhir</CardTitle>
              <CardDescription>Suhu, kelembaban, dan CO₂ level</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={hourlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="insideTemp"
                      stroke="#ef4444"
                      strokeWidth={2}
                      name="Suhu (°C)"
                    />
                    <Line
                      type="monotone"
                      dataKey="humidity"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      name="Kelembaban (%)"
                    />
                    <Line
                      type="monotone"
                      dataKey="co2"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      name="CO₂ (ppm)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Back */}
        <TabsContent value="control">
          <ControlPanel
            autoMode={autoMode}
            controls={controls}
            onControlChange={handleControlChange}
            onAutoModeToggle={toggleAutoMode}
          />
        </TabsContent>

        {/* Tab: History */}
        <TabsContent value="history" className="space-y-4">
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-green-600" />
                  <span>Riwayat Aksi Sistem</span>
                </CardTitle>
                <CardDescription>
                  Log aktivitas otomatis dan manual
                </CardDescription>
              </div>
              <Button variant="outline" className="flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {actionHistory.map((action, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="text-sm font-medium text-gray-500">
                      {action.time}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{action.action}</span>
                        <Badge
                          variant={
                            action.status.includes("Dinyalakan")
                              ? "default"
                              : "secondary"
                          }
                        >
                          {action.status}
                        </Badge>
                        <Badge
                          variant={
                            action.type === "auto" ? "outline" : "destructive"
                          }
                        >
                          {action.type === "auto" ? "Otomatis" : "Manual"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {action.reason}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
