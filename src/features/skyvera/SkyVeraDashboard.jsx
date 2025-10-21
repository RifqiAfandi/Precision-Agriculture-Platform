import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import {
  Wind,
  Droplets,
  Thermometer,
  Cloud,
  AlertCircle,
  Gauge,
  Eye,
  Sun,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { WeatherParameterCard } from "./components/WeatherParameterCard";
import WeatherOverviewCard from "./components/WeatherOverviewCard";
import AIInsightsPanel from "./components/AIInsightsPanel";
import ForecastPanel from "./components/ForecastPanel";
import ExportPanel from "./components/ExportPanel";
import {
  currentWeatherData,
  hourlyWeatherData,
  dailyWeatherData,
  weatherInsights,
  weatherForecast,
  getParameterStatus,
} from "./data/skyveraData";
import {
  exportToCSV,
  exportToJSON,
  generateWeatherReport,
  getAQILevel,
  formatTimestamp,
} from "./utils/skyveraHelpers";
const SkyVeraDashboard = () => {
  const [activeTab, setActiveTab] = useState("monitoring");
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
      iconColor: "text-blue-500",
      status: { status: "Normal", color: "text-blue-600", bg: "bg-blue-100" },
      trend: "stable",
      description: "Hujan ringan",
    },
    {
      title: "Suhu Udara",
      value: currentWeatherData.temperature,
      unit: "°C",
      icon: Thermometer,
      iconColor: "text-orange-600",
      status: getParameterStatus(currentWeatherData.temperature, "temperature"),
      trend: "down",
      description: "Suhu optimal",
    },
    {
      title: "Kelembaban",
      value: currentWeatherData.humidity,
      unit: "%",
      icon: Droplets,
      iconColor: "text-teal-600",
      status: getParameterStatus(currentWeatherData.humidity, "humidity"),
      trend: "up",
      description: "Kelembaban tinggi",
    },
    {
      title: "CO₂",
      value: currentWeatherData.co2,
      unit: "ppm",
      icon: Cloud,
      iconColor: "text-green-600",
      status: getParameterStatus(currentWeatherData.co2, "co2"),
      trend: "stable",
      description: "Level normal",
    },
    {
      title: "TVOC",
      value: currentWeatherData.tvoc,
      unit: "mg/m³",
      icon: AlertCircle,
      iconColor: "text-purple-600",
      status: getParameterStatus(currentWeatherData.tvoc, "tvoc"),
      trend: "down",
      description: "Kualitas baik",
    },
  ];
  const aqiLevel = getAQILevel(currentWeatherData.aqi);
  const weatherOverview = [
    {
      title: "Cuaca Saat Ini",
      value: `${currentWeatherData.temperature}°C`,
      icon: Sun,
      status: { label: "Cerah Berawan", bg: "bg-yellow-100", color: "text-yellow-700" },
    },
    {
      title: "Kualitas Udara",
      value: `AQI ${currentWeatherData.aqi}`,
      icon: Wind,
      status: { label: aqiLevel.level, bg: `bg-${aqiLevel.color}-100`, color: `text-${aqiLevel.color}-700` },
    },
  ];
  const handleExportCSV = () => {
    exportToCSV(hourlyWeatherData, "skyvera_hourly_weather.csv");
  };

  const handleExportJSON = () => {
    const exportData = {
      current: currentWeatherData,
      hourly: hourlyWeatherData,
      daily: dailyWeatherData,
      insights: weatherInsights,
      exportedAt: new Date().toISOString(),
    };
    exportToJSON(exportData, "skyvera_weather_data.json");
  };

  const handleExportPDF = () => {
    const report = generateWeatherReport(currentWeatherData, hourlyWeatherData);
    alert(`PDF Report:\n${JSON.stringify(report, null, 2)}\n\nNote: PDF export requires additional library integration`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">SkyVera Weather Station</h1>
          <p className="text-gray-600 mt-1">
            Real-time monitoring sistem cuaca dan kualitas udara
          </p>
        </div>
        <div className="text-sm text-gray-500">
          Update terakhir: {formatTimestamp(currentWeatherData.lastUpdate)}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {weatherOverview.map((item, index) => (
          <WeatherOverviewCard key={index} {...item} />
        ))}
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="monitoring" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {weatherParameters.map((param, index) => (
              <WeatherParameterCard key={index} {...param} />
            ))}
          </div>

          <ForecastPanel forecasts={weatherForecast} />
          <ExportPanel
            onExportCSV={handleExportCSV}
            onExportPDF={handleExportPDF}
            onExportJSON={handleExportJSON}
          />
        </TabsContent>
        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Suhu & Kelembaban (24 Jam)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={hourlyWeatherData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="temp" stroke="#f97316" name="Suhu (°C)" />
                  <Line yAxisId="right" type="monotone" dataKey="humidity" stroke="#06b6d4" name="Kelembaban (%)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Curah Hujan Mingguan</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dailyWeatherData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="totalRain" fill="#3b82f6" name="Total Hujan (mm)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Trend Kualitas Udara (AQI & CO₂)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={hourlyWeatherData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Area yAxisId="left" type="monotone" dataKey="aqi" stroke="#10b981" fill="#10b98133" name="AQI" />
                  <Area yAxisId="right" type="monotone" dataKey="co2" stroke="#8b5cf6" fill="#8b5cf633" name="CO₂ (ppm)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="insights" className="space-y-6">
          <AIInsightsPanel insights={weatherInsights} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SkyVeraDashboard;
