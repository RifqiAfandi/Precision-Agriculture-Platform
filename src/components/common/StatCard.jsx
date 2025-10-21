import React from "react";
import PropTypes from "prop-types";
import { Card, CardContent } from "../ui/Card";

/**
 * StatCard Component - Displays a statistic with an icon
 * @param {Object} props - Component props
 * @param {React.ComponentType} props.icon - Lucide icon component
 * @param {string} props.iconColor - Tailwind classes for icon background and text color
 * @param {string} props.label - Label text for the statistic
 * @param {string|number} props.value - The value to display
 * @param {string} props.unit - Optional unit to display after value
 * @param {string} props.className - Additional CSS classes
 */
export function StatCard({
  icon: IconComponent,
  iconColor = "bg-gray-100 text-gray-600",
  label,
  value,
  unit,
  className = "",
}) {
  const bgColorClass = iconColor.split(" ").find((c) => c.startsWith("bg-")) || "bg-gray-100";
  const textColorClass = iconColor.split(" ").find((c) => c.startsWith("text-")) || "text-gray-600";

  return (
    <Card className={`glass-card ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <div
            className={`w-10 h-10 ${bgColorClass} rounded-lg flex items-center justify-center flex-shrink-0`}
          >
            <IconComponent className={`w-5 h-5 ${textColorClass}`} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm text-gray-500 truncate">{label}</p>
            <p className="text-2xl font-bold text-gray-900">
              {value}
              {unit && (
                <span className="text-sm text-gray-500 ml-1 font-normal">
                  {unit}
                </span>
              )}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

StatCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  iconColor: PropTypes.string,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  unit: PropTypes.string,
  className: PropTypes.string,
};
