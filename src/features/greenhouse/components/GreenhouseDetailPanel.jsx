import React from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Thermometer,
  Droplets,
  Activity,
  Sun,
  TrendingUp,
  Download,
  Settings,
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
  getTemperatureStatus,
  getHumidityStatus,
  getCO2Status,
  getRecommendation,
} from "../utils/greenhouseHelpers";

export function GreenhouseDetailPanel({ greenhouse, onControl }) {
  if (!greenhouse) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Settings className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Pilih Greenhouse
        </h3>
        <p className="text-gray-500 max-w-sm">
          Pilih greenhouse dari daftar untuk melihat detail monitoring dan kontrol
        </p>
      </div>
    );
  }

  const statusConfig = {
    optimal: { color: "bg-green-100 text-green-800", label: "Optimal" },
    warning: { color: "bg-yellow-100 text-yellow-800", label: "Perhatian" },
    danger: { color: "bg-red-100 text-red-800", label: "Bahaya" },
  };

  const tempStatus = getTemperatureStatus(greenhouse.currentTemp);
  const humidityStatus = getHumidityStatus(greenhouse.currentHumidity);
  const co2Status = getCO2Status(greenhouse.currentCO2);

  const metrics = [
    {
      icon: Thermometer,
      label: "Suhu",
      value: `${greenhouse.currentTemp}°C`,
      status: tempStatus,
      recommendation: getRecommendation("temperature", greenhouse.currentTemp),
      color: "text-red-500",
    },
    {
      icon: Droplets,
      label: "Kelembaban",
      value: `${greenhouse.currentHumidity}%`,
      status: humidityStatus,
      recommendation: getRecommendation("humidity", greenhouse.currentHumidity),
      color: "text-blue-500",
    },
    {
      icon: Activity,
      label: "CO₂ Level",
      value: `${greenhouse.currentCO2} ppm`,
      status: co2Status,
      recommendation: getRecommendation("co2", greenhouse.currentCO2),
      color: "text-purple-500",
    },
    {
      icon: Sun,
      label: "Intensitas Cahaya",
      value: `${greenhouse.lightIntensity} lux`,
      status: "optimal",
      recommendation: "Pencahayaan optimal",
      color: "text-yellow-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          const statusStyle = statusConfig[metric.status] || statusConfig.optimal;
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
                    {metric.recommendation}
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
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span>Tren 24 Jam Terakhir</span>
          </h4>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={greenhouse.history}>
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
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={() => onControl && onControl(greenhouse.id)}
          className="flex-1 bg-green-600 hover:bg-green-700"
        >
          <Settings className="w-4 h-4 mr-2" />
          Panel Kontrol
        </Button>
        <Button variant="outline" className="flex-1">
          <Download className="w-4 h-4 mr-2" />
          Ekspor Data
        </Button>
      </div>
    </div>
  );
}
