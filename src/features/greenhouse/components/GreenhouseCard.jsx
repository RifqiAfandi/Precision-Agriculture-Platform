import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Home, TrendingUp, Activity } from "lucide-react";
import { getTemperatureStatus } from "../utils/greenhouseHelpers";

export function GreenhouseCard({ greenhouse, isSelected, onClick }) {
  const statusConfig = {
    optimal: { color: "bg-green-100 text-green-800", label: "Berkembang Baik" },
    warning: { color: "bg-yellow-100 text-yellow-800", label: "Perlu Perhatian" },
    danger: { color: "bg-red-100 text-red-800", label: "Perlu Tindakan" },
  };

  const tempStatus = getTemperatureStatus(greenhouse.currentTemp);
  const status = statusConfig[tempStatus] || statusConfig.optimal;

  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md ${
        isSelected ? "ring-2 ring-green-500 shadow-lg" : ""
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <Home className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{greenhouse.name}</h3>
              <p className="text-sm text-gray-500">{greenhouse.location}</p>
            </div>
          </div>
          <Badge className={status.color}>{status.label}</Badge>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="flex items-center space-x-2 text-sm">
            <TrendingUp className="w-4 h-4 text-blue-500" />
            <div>
              <p className="text-gray-500">Suhu</p>
              <p className="font-semibold text-gray-900">
                {greenhouse.currentTemp}°C
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Activity className="w-4 h-4 text-purple-500" />
            <div>
              <p className="text-gray-500">Kelembaban</p>
              <p className="font-semibold text-gray-900">
                {greenhouse.currentHumidity}%
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
