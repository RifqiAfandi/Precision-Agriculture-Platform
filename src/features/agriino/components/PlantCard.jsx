import React from "react";
import { Badge } from "../../../components/ui/Badge";
import { MapPin, Eye, TrendingUp, TrendingDown } from "lucide-react";
import { getStatusColor, getStatusLabel } from "../utils/agriinoHelpers";

/**
 * PlantCard component displays plant summary in list view
 * Shows plant name, status, location, and trend indicator
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.plant - Plant data object
 * @param {string} props.plant.id - Plant ID
 * @param {string} props.plant.name - Plant name
 * @param {string} props.plant.description - Plant description
 * @param {string} props.plant.location - Plant location
 * @param {'excellent'|'good'|'warning'} props.plant.status - Health status
 * @param {'up'|'down'} props.plant.trend - Trend direction
 * @param {boolean} props.isSelected - Whether this plant is selected
 * @param {Function} props.onClick - Click handler
 * 
 * @example
 * <PlantCard
 *   plant={plantData}
 *   isSelected={selectedId === plantData.id}
 *   onClick={() => handleSelect(plantData.id)}
 * />
 */
export function PlantCard({ plant, isSelected, onClick }) {
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
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h4 className="font-medium text-gray-900">{plant.name}</h4>
            <Badge className={getStatusColor(plant.status)}>
              {getStatusLabel(plant.status)}
            </Badge>
          </div>
          <p className="text-sm text-gray-600 mb-2">{plant.description}</p>
          <p className="text-xs text-gray-500 flex items-center">
            <MapPin className="w-3 h-3 mr-1" />
            {plant.location}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {plant.trend === "up" ? (
            <TrendingUp className="w-4 h-4 text-green-500" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-500" />
          )}
          <Eye className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    </div>
  );
}
