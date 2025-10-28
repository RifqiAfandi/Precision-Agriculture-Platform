import React from "react";
import PropTypes from "prop-types";
import { Badge } from "@/components/ui/Badge";
import { MapPin, Eye, TrendingUp, TrendingDown } from "lucide-react";
import { getStatusColor, getStatusLabel } from "../utils/agriinoHelpers";

export function PlantCard({ plant, isSelected, onClick }) {
  return (
    <div
      className={`p-2 sm:p-3 md:p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
        isSelected
          ? "border-green-300 bg-green-50"
          : "border-gray-200 hover:border-green-200 hover:bg-green-50/50"
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-1.5 sm:space-x-2 mb-0.5 sm:mb-1">
            <h4 className="font-medium text-xs sm:text-sm md:text-base text-gray-900 truncate">{plant.name}</h4>
            <Badge className={`${getStatusColor(plant.status)} text-[10px] sm:text-xs`}>
              {getStatusLabel(plant.status)}
            </Badge>
          </div>
          <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 mb-1 sm:mb-2 truncate">{plant.description}</p>
          <p className="text-[10px] sm:text-xs text-gray-500 flex items-center truncate">
            <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1 flex-shrink-0" />
            {plant.location}
          </p>
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2 ml-1.5 sm:ml-2 flex-shrink-0">
          {plant.trend === "up" ? (
            <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500" />
          )}
          <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
        </div>
      </div>
    </div>
  );
}

PlantCard.propTypes = {
  plant: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    status: PropTypes.oneOf(["optimal", "warning", "critical"]).isRequired,
    trend: PropTypes.oneOf(["up", "down"]).isRequired,
  }).isRequired,
  isSelected: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};
