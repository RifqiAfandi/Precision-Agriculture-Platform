import React from "react";
import PropTypes from "prop-types";
import { Card, CardContent } from "../ui/Card";

/**
 * StatCard Component
 * 
 * A reusable statistics card component that displays an icon, label, and value.
 * Used throughout dashboards for displaying key metrics.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {React.ElementType} props.icon - Lucide icon component to display
 * @param {string} [props.iconColor='bg-gray-100 text-gray-600'] - Tailwind classes for icon background and text color
 * @param {string} props.label - Label text describing the statistic
 * @param {string|number} props.value - The statistic value to display
 * @param {string} [props.unit] - Optional unit suffix (e.g., '%', 'kg')
 * @param {string} [props.className] - Additional CSS classes for the card
 * @returns {React.ReactElement} Rendered StatCard component
 * 
 * @example
 * // Basic usage
 * <StatCard
 *   icon={Leaf}
 *   iconColor="text-green-600"
 *   label="Total Devices"
 *   value={10}
 * />
 * 
 * @example
 * // With unit
 * <StatCard
 *   icon={BarChart3}
 *   iconColor="text-blue-600"
 *   label="Average Nitrogen"
 *   value="0.123"
 *   unit="%"
 * />
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
      <CardContent className="p-2 sm:p-3 md:p-4">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div
            className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 ${bgColorClass} dark:bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0`}
          >
            <IconComponent className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ${textColorClass}`} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] sm:text-xs md:text-sm text-gray-500 dark:text-gray-400 truncate">{label}</p>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100">
              {value}
              {unit && (
                <span className="text-[10px] sm:text-xs md:text-sm text-gray-500 dark:text-gray-400 ml-1 font-normal">
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
