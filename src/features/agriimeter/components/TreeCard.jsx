import React from "react";
import { Badge } from "@/components/ui/Badge";
import { MapPin, TrendingUp, TrendingDown, Activity, Eye } from "lucide-react";
import {
  getStatusColor,
  getStatusLabel,
} from "../utils/agriimeterHelpers";
export function TreeCard({ tree, isSelected = false, onClick }) {
  const getGrowthIcon = () => {
    if (tree.growthRate > 0.5) {
      return <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500" />;
    } else if (tree.growthRate > 0.2) {
      return <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500" />;
    } else {
      return <TrendingDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500" />;
    }
  };

  return (
    <div
      className={`p-2 sm:p-3 md:p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
        isSelected
          ? "border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/30"
          : "border-gray-200 dark:border-slate-700 hover:border-green-200 dark:hover:border-green-700 hover:bg-green-50/50 dark:hover:bg-green-900/20"
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-1.5 sm:space-x-2 mb-0.5 sm:mb-1">
            <h4 className="font-medium text-xs sm:text-sm md:text-base text-gray-900 dark:text-gray-100 truncate">{tree.name}</h4>
            <Badge className={`${getStatusColor(tree.status)} text-[10px] sm:text-xs`}>
              {getStatusLabel(tree.status)}
            </Badge>
          </div>
          <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-1 sm:mb-2">
            {tree.species} • {tree.age} bulan
          </p>
          <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 flex items-center truncate">
            <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1 flex-shrink-0" />
            {tree.location}
          </p>
          <div className="flex items-center space-x-2 sm:space-x-4 mt-1 sm:mt-2 text-[10px] sm:text-xs">
            <span className="text-green-600 dark:text-green-400 font-medium">
              DBH: {tree.currentDBH} cm
            </span>
            <span className="text-blue-600 dark:text-blue-400">
              Volume: {tree.estimatedVolume} m³
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2 ml-1.5 sm:ml-2">
          {getGrowthIcon()}
          <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
        </div>
      </div>
    </div>
  );
}
