import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";

/**
 * ParameterCard component for displaying single environmental parameter
 * Simplified card for parameters like CO2, light intensity, etc.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} props.title - Card title
 * @param {React.ComponentType} props.icon - Lucide icon component
 * @param {string} props.iconColor - Tailwind color class for icon
 * @param {number|string} props.value - Main parameter value
 * @param {string} props.unit - Unit of measurement
 * @param {Object} props.status - Status object with label, color, and bg
 * @param {string} [props.description] - Optional description text
 * 
 * @example
 * <ParameterCard
 *   title="CO₂ Level"
 *   icon={Activity}
 *   iconColor="text-purple-600"
 *   value={420}
 *   unit="ppm"
 *   status={{ label: "Optimal", color: "text-green-600", bg: "bg-green-100" }}
 *   description="Ideal untuk fotosintesis optimal"
 * />
 */
export function ParameterCard({
  title,
  icon: Icon,
  iconColor,
  value,
  unit,
  status,
  description,
}) {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Icon className={`w-5 h-5 ${iconColor}`} />
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center space-y-4">
          <div>
            <span className="text-3xl font-bold text-gray-900">{value}</span>
            <span className="text-gray-500 ml-1">{unit}</span>
          </div>
          <Badge className={`${status.bg} ${status.color}`}>
            {status.label}
          </Badge>
          {description && (
            <p className="text-sm text-gray-600">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
