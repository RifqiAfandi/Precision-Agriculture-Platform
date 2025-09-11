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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/Select";
import {
  Cloud,
  Wind,
  Droplets,
  Thermometer,
  Activity,
  Eye,
  AlertTriangle,
  Download,
  RefreshCw,
  Calendar,
  TrendingUp,
  Sun,
  Gauge,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts";
import { toast } from "sonner";
import { WeatherParameterCard } from "./skyvera/WeatherParameterCard";
import {
  currentWeatherData,
  hourlyWeatherData,
  dailyWeatherData,
  weatherInsights,
  getParameterStatus,
  getStatusLabel,
} from "./skyvera/skyveraData";

export function SkyVeraDashboard() {
  const [activeTab, setActiveTab] = useState("monitoring");
  const [timeRange, setTimeRange] = useState("24h");
  const [lastUpdate, setLastUpdate] = useState("2024-08-02 14:35:00");

  const weatherParameters = [
    {
      title: "Kecepatan Angin",
      value: currentWeatherData.windSpeed,
      unit: "km/h",
      icon: Wind,
      iconColor: "text-blue-600",
      status: getParameterStatus(currentWeatherData.windSpeed, "windSpeed"),
      trend: "up",
      description: "Angin sedang",
    },
    {
      title: "Curah Hujan",
      value: currentWeatherData.rainfall,
      unit: "mm",
      icon: Droplets,
      iconColor: "text-cyan-600",
      status: { status: "normal", color: "text-blue-600", bg: "bg-blue-100" },
      trend: "stable",
      description: "Hujan ringan",
    },
    {
      title: "Suhu",
      value: currentWeatherData.temperature,
      unit: "°C",
      icon: Thermometer,
      iconColor: "text-red-600",
      status: getParameterStatus(currentWeatherData.temperature, "temperature"),
      trend: "down",
      description: "Optimal",
    },
    {
      title: "Kelembaban",
      value: currentWeatherData.humidity,
      unit: "%",
      icon: Droplets,
      iconColor: "text-blue-500",
      status: getParameterStatus(currentWeatherData.humidity, "humidity"),
      trend: "up",
      description: "Normal",
    },
    {
      title: "CO₂",
      value: currentWeatherData.co2,
      unit: "ppm",
      icon: Activity,
      iconColor: "text-green-600",
      status: getParameterStatus(currentWeatherData.co2, "co2"),
      trend: "stable",
      description: "Baik",
    },
    {
      title: "TVOC",
      value: currentWeatherData.tvoc,
      unit: "ppm",
      icon: Eye,
      iconColor: "text-purple-600",
      status: getParameterStatus(currentWeatherData.tvoc, "tvoc"),
      trend: "down",
      description: "Sangat baik",
    },
    {
      title: "AQI",
      value: currentWeatherData.aqi,
      unit: "",
      icon: Gauge,
      iconColor: "text-orange-600",
      status: getParameterStatus(currentWeatherData.aqi, "aqi"),
      trend: "up",
      description: "Sedang",
    },
    {
      title: "Tekanan Udara",
      value: currentWeatherData.pressure,
      unit: "hPa",
      icon: Gauge,
      iconColor: "text-gray-600",
      status: { status: "normal", color: "text-blue-600", bg: "bg-blue-100" },
      trend: "stable",
      description: "Stabil",
    },
  ];

  const refreshData = () => {
    setLastUpdate(
      new Date().toLocaleString("id-ID", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    );
    toast.success("Data berhasil diperbarui");
  };

  const exportData = (format) => {
    toast.success(
      `Data ${format.toUpperCase()} sedang diproses untuk download`
    );
  };

  const getChartData = () => {
    return timeRange === "7d" ? dailyWeatherData : hourlyWeatherData;
  };

  return (
    <div className="space-y-6">
      {/* Header dengan refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            SkyVera Weather Station
          </h2>
          <p className="text-gray-600">Update terakhir: {lastUpdate}</p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">24 Jam</SelectItem>
              <SelectItem value="7d">7 Hari</SelectItem>
              <SelectItem value="30d">30 Hari</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={refreshData}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="monitoring">Live Monitoring</TabsTrigger>
          <TabsTrigger value="trends">Tren & Grafik</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        {/* Tab: Live Monitoring */}
        <TabsContent value="monitoring" className="space-y-6">
          {/* Parameter Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {weatherParameters.map((param, index) => (
              <WeatherParameterCard
                key={index}
                title={param.title}
                value={param.value}
                unit={param.unit}
                icon={param.icon}
                iconColor={param.iconColor}
                status={{
                  ...param.status,
                  status: getStatusLabel(param.status.status),
                }}
                trend={param.trend}
                description={param.description}
              />
            ))}
          </div>

          {/* Weather Overview */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Cloud className="w-5 h-5 text-blue-600" />
                  <span>Kondisi Cuaca Saat Ini</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto bg-blue-50 rounded-full flex items-center justify-center mb-4">
                      <Cloud className="w-10 h-10 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold">Berawan</h3>
                    <p className="text-gray-600">
                      Hujan ringan dengan angin sedang
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Indeks UV</p>
                      <p className="text-lg font-semibold">
                        {currentWeatherData.uvIndex}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Jarak Pandang</p>
                      <p className="text-lg font-semibold">
                        {currentWeatherData.visibility} km
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-green-600" />
                  <span>Status Kualitas Udara</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto bg-orange-50 rounded-full flex items-center justify-center mb-4">
                      <span className="text-2xl font-bold text-orange-600">
                        {currentWeatherData.aqi}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold">Sedang</h3>
                    <p className="text-gray-600">Aman untuk aktivitas normal</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">CO₂</span>
                      <span className="font-medium">
                        {currentWeatherData.co2} ppm
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">TVOC</span>
                      <span className="font-medium">
                        {currentWeatherData.tvoc} ppm
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Trend Chart */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Tren 12 Jam Terakhir</CardTitle>
              <CardDescription>
                Suhu, kelembaban, dan kecepatan angin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={hourlyWeatherData.slice(-12)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="temp"
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
                      dataKey="wind"
                      stroke="#22c55e"
                      strokeWidth={2}
                      name="Angin (km/h)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Tren & Grafik */}
        <TabsContent value="trends" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Temperature & Humidity Chart */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Suhu & Kelembaban</CardTitle>
                <CardDescription>
                  Tren {timeRange === "7d" ? "7 hari" : "24 jam"} terakhir
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={getChartData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey={timeRange === "7d" ? "day" : "time"} />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey={timeRange === "7d" ? "avgTemp" : "temp"}
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
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* AQI & CO2 Chart */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Kualitas Udara</CardTitle>
                <CardDescription>AQI dan CO₂ level</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={getChartData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey={timeRange === "7d" ? "day" : "time"} />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey={timeRange === "7d" ? "avgAQI" : "aqi"}
                        stroke="#f59e0b"
                        strokeWidth={2}
                        name="AQI"
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

            {/* Rainfall Chart */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Curah Hujan</CardTitle>
                <CardDescription>
                  {timeRange === "7d" ? "Total harian" : "Per jam"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getChartData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey={timeRange === "7d" ? "day" : "time"} />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey={timeRange === "7d" ? "totalRain" : "rainfall"}
                        fill="#06b6d4"
                        name="Curah Hujan (mm)"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Wind Speed Chart */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Kecepatan Angin</CardTitle>
                <CardDescription>
                  {timeRange === "7d" ? "Maksimum harian" : "Per jam"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={getChartData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey={timeRange === "7d" ? "day" : "time"} />
                      <YAxis />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey={timeRange === "7d" ? "maxWind" : "wind"}
                        stroke="#22c55e"
                        fill="#dcfce7"
                        name="Kecepatan Angin (km/h)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Export Options */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Download className="w-5 h-5 text-green-600" />
                <span>Export Data</span>
              </CardTitle>
              <CardDescription>
                Download data dalam berbagai format
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  onClick={() => exportData("csv")}
                  className="flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>CSV Data</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => exportData("pdf")}
                  className="flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>PDF Report</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => exportData("json")}
                  className="flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>JSON Raw</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: AI Insights */}
        <TabsContent value="insights" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <span>AI Weather Insights</span>
              </CardTitle>
              <CardDescription>
                Analisis otomatis dan rekomendasi berdasarkan data cuaca terkini
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weatherInsights.map((insight, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-l-4 ${
                      insight.priority === "high"
                        ? "border-red-400 bg-red-50"
                        : insight.priority === "medium"
                        ? "border-yellow-400 bg-yellow-50"
                        : "border-blue-400 bg-blue-50"
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          insight.priority === "high"
                            ? "bg-red-100"
                            : insight.priority === "medium"
                            ? "bg-yellow-100"
                            : "bg-blue-100"
                        }`}
                      >
                        {insight.icon === "AlertTriangle" && (
                          <AlertTriangle
                            className={`w-4 h-4 ${
                              insight.priority === "high"
                                ? "text-red-600"
                                : insight.priority === "medium"
                                ? "text-yellow-600"
                                : "text-blue-600"
                            }`}
                          />
                        )}
                        {insight.icon === "Droplets" && (
                          <Droplets
                            className={`w-4 h-4 ${
                              insight.priority === "high"
                                ? "text-red-600"
                                : insight.priority === "medium"
                                ? "text-yellow-600"
                                : "text-blue-600"
                            }`}
                          />
                        )}
                        {insight.icon === "Sun" && (
                          <Sun
                            className={`w-4 h-4 ${
                              insight.priority === "high"
                                ? "text-red-600"
                                : insight.priority === "medium"
                                ? "text-yellow-600"
                                : "text-blue-600"
                            }`}
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">
                            {insight.title}
                          </h4>
                          <Badge
                            className={
                              insight.priority === "high"
                                ? "bg-red-100 text-red-700"
                                : insight.priority === "medium"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-blue-100 text-blue-700"
                            }
                          >
                            {insight.priority === "high"
                              ? "Penting"
                              : insight.priority === "medium"
                              ? "Sedang"
                              : "Info"}
                          </Badge>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">
                          {insight.description}
                        </p>
                        <div className="bg-white/50 p-3 rounded-lg">
                          <p className="text-sm font-medium text-gray-900 mb-1">
                            Rekomendasi:
                          </p>
                          <p className="text-sm text-gray-700">
                            {insight.recommendation}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Weather Forecast Summary */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span>Prediksi 24 Jam</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Sore Ini</h4>
                  <p className="text-sm text-blue-700">
                    Hujan ringan akan berlanjut dengan intensitas menurun
                  </p>
                  <p className="text-xs text-blue-600 mt-2">
                    Suhu: 27-29°C | Angin: 10-15 km/h
                  </p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">Malam Ini</h4>
                  <p className="text-sm text-green-700">
                    Cuaca akan membaik, angin mereda
                  </p>
                  <p className="text-xs text-green-600 mt-2">
                    Suhu: 25-27°C | Angin: 5-10 km/h
                  </p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-medium text-yellow-900 mb-2">
                    Besok Pagi
                  </h4>
                  <p className="text-sm text-yellow-700">
                    Cerah berawan, kondisi optimal untuk aktivitas
                  </p>
                  <p className="text-xs text-yellow-600 mt-2">
                    Suhu: 26-30°C | Angin: 8-12 km/h
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
