import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Cloud, Thermometer, Droplets, Wind } from "lucide-react";
import { getParameterStatus } from "../data/skyveraData";

export function StationCard({ station, isSelected, onClick }) {
  const statusConfig = {
    good: { color: "bg-green-100 text-green-800", label: "Kondisi Baik" },
    moderate: { color: "bg-yellow-100 text-yellow-800", label: "Moderate" },
    unhealthy: { color: "bg-red-100 text-red-800", label: "Perlu Perhatian" },
  };

  const aqiStatus = getParameterStatus(station.currentAQI, "aqi");
  const status = statusConfig[aqiStatus.status] || statusConfig.good;

  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md ${
        isSelected ? "ring-2 ring-blue-500 shadow-lg" : ""
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Cloud className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{station.name}</h3>
              <p className="text-sm text-gray-500">{station.location}</p>
            </div>
          </div>
          <Badge className={status.color}>{status.label}</Badge>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="flex items-center space-x-1 text-sm">
            <Thermometer className="w-4 h-4 text-red-500" />
            <div>
              <p className="text-xs text-gray-500">Suhu</p>
              <p className="font-semibold text-gray-900">
                {station.currentTemp}°C
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-1 text-sm">
            <Droplets className="w-4 h-4 text-blue-500" />
            <div>
              <p className="text-xs text-gray-500">RH</p>
              <p className="font-semibold text-gray-900">
                {station.currentHumidity}%
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-1 text-sm">
            <Wind className="w-4 h-4 text-teal-500" />
            <div>
              <p className="text-xs text-gray-500">Angin</p>
              <p className="font-semibold text-gray-900">
                {station.currentWindSpeed} km/h
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
