import React from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Thermometer,
  Droplets,
  Wind,
  Cloud,
  AlertCircle,
  Eye,
  TrendingUp,
  Download,
  BarChart3,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  getParameterStatus,
  getStatusLabel,
} from "../data/skyveraData";

export function StationDetailPanel({ station, onExport }) {
  if (!station) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <BarChart3 className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Pilih Weather Station
        </h3>
        <p className="text-gray-500 max-w-sm">
          Pilih weather station dari daftar untuk melihat detail monitoring cuaca
        </p>
      </div>
    );
  }

  const statusConfig = {
    excellent: { color: "bg-green-100 text-green-800", label: "Sangat Baik" },
    optimal: { color: "bg-green-100 text-green-800", label: "Optimal" },
    good: { color: "bg-green-100 text-green-800", label: "Baik" },
    normal: { color: "bg-blue-100 text-blue-800", label: "Normal" },
    moderate: { color: "bg-yellow-100 text-yellow-800", label: "Sedang" },
    calm: { color: "bg-green-100 text-green-800", label: "Tenang" },
    warning: { color: "bg-orange-100 text-orange-800", label: "Peringatan" },
    unhealthy: { color: "bg-red-100 text-red-800", label: "Tidak Sehat" },
  };

  const tempStatus = getParameterStatus(station.currentTemp, "temperature");
  const humidityStatus = getParameterStatus(station.currentHumidity, "humidity");
  const windStatus = getParameterStatus(station.currentWindSpeed, "windSpeed");
  const aqiStatus = getParameterStatus(station.currentAQI, "aqi");
  const co2Status = getParameterStatus(station.currentCO2, "co2");
  const tvocStatus = getParameterStatus(station.currentTVOC, "tvoc");

  const metrics = [
    {
      icon: Thermometer,
      label: "Suhu Udara",
      value: `${station.currentTemp}°C`,
      status: tempStatus.status,
      description: `Kondisi ${getStatusLabel(tempStatus.status)}`,
      color: "text-red-500",
    },
    {
      icon: Droplets,
      label: "Kelembaban",
      value: `${station.currentHumidity}%`,
      status: humidityStatus.status,
      description: `Tingkat ${getStatusLabel(humidityStatus.status)}`,
      color: "text-blue-500",
    },
    {
      icon: Wind,
      label: "Kecepatan Angin",
      value: `${station.currentWindSpeed} km/h`,
      status: windStatus.status,
      description: `Angin ${getStatusLabel(windStatus.status)}`,
      color: "text-teal-500",
    },
    {
      icon: Cloud,
      label: "CO₂ Level",
      value: `${station.currentCO2} ppm`,
      status: co2Status.status,
      description: `Kualitas ${getStatusLabel(co2Status.status)}`,
      color: "text-green-500",
    },
    {
      icon: Eye,
      label: "AQI (Kualitas Udara)",
      value: station.currentAQI,
      status: aqiStatus.status,
      description: `${getStatusLabel(aqiStatus.status)}`,
      color: "text-purple-500",
    },
    {
      icon: AlertCircle,
      label: "TVOC",
      value: `${station.currentTVOC} mg/m³`,
      status: tvocStatus.status,
      description: `${getStatusLabel(tvocStatus.status)}`,
      color: "text-orange-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          const statusStyle = statusConfig[metric.status] || statusConfig.normal;
          return (
            <div
              key={idx}
              className="flex items-start justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-start space-x-3 flex-1">
                <div
                  className={`w-10 h-10 rounded-full bg-white flex items-center justify-center ${metric.color}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">{metric.label}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {metric.value}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {metric.description}
                  </p>
                </div>
              </div>
              <Badge className={statusStyle.color}>{statusStyle.label}</Badge>
            </div>
          );
        })}
      </div>

      <div className="bg-white border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <span>Tren 24 Jam Terakhir</span>
          </h4>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={station.history}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="temp"
              stroke="#ef4444"
              name="Suhu (°C)"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="humidity"
              stroke="#3b82f6"
              name="Kelembaban (%)"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="wind"
              stroke="#14b8a6"
              name="Angin (km/h)"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={() => onExport && onExport(station.id)}
          className="flex-1 bg-blue-600 hover:bg-blue-700"
        >
          <Download className="w-4 h-4 mr-2" />
          Ekspor Data
        </Button>
        <Button variant="outline" className="flex-1">
          <BarChart3 className="w-4 h-4 mr-2" />
          Lihat Analitik
        </Button>
      </div>
    </div>
  );
}
