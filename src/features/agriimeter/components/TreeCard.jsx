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
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    } else if (tree.growthRate > 0.2) {
      return <Activity className="w-4 h-4 text-blue-500" />;
    } else {
      return <TrendingDown className="w-4 h-4 text-orange-500" />;
    }
  };

  return (
    <div
      className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
        isSelected
          ? "border-green-300 bg-green-50"
          : "border-gray-200 hover:border-green-200 hover:bg-green-50/50"
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h4 className="font-medium text-gray-900 truncate">{tree.name}</h4>
            <Badge className={getStatusColor(tree.status)}>
              {getStatusLabel(tree.status)}
            </Badge>
          </div>
          <p className="text-sm text-gray-600 mb-2">
            {tree.species} • {tree.age} bulan
          </p>
          <p className="text-xs text-gray-500 flex items-center truncate">
            <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
            {tree.location}
          </p>
          <div className="flex items-center space-x-4 mt-2 text-xs">
            <span className="text-green-600 font-medium">
              DBH: {tree.currentDBH} cm
            </span>
            <span className="text-blue-600">
              Volume: {tree.estimatedVolume} m³
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2 ml-2">
          {getGrowthIcon()}
          <Eye className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    </div>
  );
}
