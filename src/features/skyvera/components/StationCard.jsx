import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Cloud, Thermometer, Droplets, Wind } from "lucide-react";
import { getParameterStatus } from "../data/skyveraData";

export function StationCard({ station, isSelected, onClick }) {
  const statusConfig = {
    good: { color: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400", label: "Kondisi Baik" },
    moderate: { color: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400", label: "Moderate" },
    unhealthy: { color: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400", label: "Perlu Perhatian" },
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
      <CardContent className="p-2 sm:p-3 md:p-4">
        <div className="flex items-start justify-between flex-wrap gap-2">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-blue-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
              <Cloud className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-xs sm:text-sm md:text-base text-gray-900 dark:text-gray-100">{station.name}</h3>
              <p className="text-[10px] sm:text-xs md:text-sm text-gray-500 dark:text-gray-400">{station.location}</p>
            </div>
          </div>
          <Badge className={`${status.color} text-[10px] sm:text-xs`}>{status.label}</Badge>
        </div>
        <div className="mt-2 sm:mt-3 md:mt-4 grid grid-cols-3 gap-1.5 sm:gap-2">
          <div className="flex items-center space-x-1 text-xs sm:text-sm">
            <Thermometer className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Suhu</p>
              <p className="font-semibold text-xs sm:text-sm text-gray-900 dark:text-gray-100 truncate">
                {station.currentTemp}°C
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-1 text-xs sm:text-sm">
            <Droplets className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">RH</p>
              <p className="font-semibold text-xs sm:text-sm text-gray-900 dark:text-gray-100 truncate">
                {station.currentHumidity}%
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-1 text-xs sm:text-sm">
            <Wind className="w-3 h-3 sm:w-4 sm:h-4 text-teal-500 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Angin</p>
              <p className="font-semibold text-xs sm:text-sm text-gray-900 dark:text-gray-100 truncate">
                {station.currentWindSpeed} km/h
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
