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
        <div className="w-20 h-20 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
          <Settings className="w-10 h-10 text-gray-400 dark:text-gray-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Pilih Greenhouse
        </h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-sm">
          Pilih greenhouse dari daftar untuk melihat detail monitoring dan kontrol
        </p>
      </div>
    );
  }

  const statusConfig = {
    optimal: { color: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400", label: "Optimal" },
    warning: { color: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400", label: "Perhatian" },
    danger: { color: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400", label: "Bahaya" },
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
    <div className="space-y-2 sm:space-y-4 md:space-y-6">
      <div className="space-y-2 sm:space-y-3 md:space-y-4">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          const statusStyle = statusConfig[metric.status] || statusConfig.optimal;
          return (
            <div
              key={idx}
              className="flex items-start justify-between p-2 sm:p-3 md:p-4 bg-gray-50 dark:bg-slate-700 rounded-lg gap-2 sm:gap-3"
            >
              <div className="flex items-start space-x-1.5 sm:space-x-2 md:space-x-3 flex-1 min-w-0">
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-white dark:bg-slate-600 flex items-center justify-center flex-shrink-0 ${metric.color}`}
                >
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] sm:text-xs md:text-sm text-gray-500 dark:text-gray-400">{metric.label}</p>
                  <p className="text-base sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 truncate">
                    {metric.value}
                  </p>
                  <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-0.5 sm:mt-1">
                    {metric.recommendation}
                  </p>
                </div>
              </div>
              <Badge className={`${statusStyle.color} flex-shrink-0 text-[10px] sm:text-xs`}>{statusStyle.label}</Badge>
            </div>
          );
        })}
      </div>

      <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-lg p-2 sm:p-3 md:p-4">
        <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4">
          <h4 className="text-xs sm:text-sm md:text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center space-x-1 sm:space-x-2">
            <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-green-600" />
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

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <Button
          onClick={() => onControl && onControl(greenhouse.id)}
          className="flex-1 bg-green-600 hover:bg-green-700 h-8 sm:h-10 text-xs sm:text-sm"
        >
          <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
          Panel Kontrol
        </Button>
        <Button variant="outline" className="flex-1 h-8 sm:h-10 text-xs sm:text-sm">
          <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
          Ekspor Data
        </Button>
      </div>
    </div>
  );
}
