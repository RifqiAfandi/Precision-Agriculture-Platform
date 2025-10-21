import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
export function WeatherParameterCard({
  title,
  value,
  unit,
  icon: Icon,
  iconColor,
  status,
  trend,
  description,
}) {
  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return "↗️";
      case "down":
        return "↘️";
      case "stable":
        return "→";
      default:
        return "";
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-red-500";
      case "down":
        return "text-green-500";
      case "stable":
        return "text-blue-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <Card className="glass-card hover:shadow-lg transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center ${status.bg}`}
        >
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-bold text-gray-900">{value}</span>
              <span className="text-sm text-gray-500">{unit}</span>
              {trend && (
                <span className={`text-sm ${getTrendColor()}`}>
                  {getTrendIcon()}
                </span>
              )}
            </div>
            {description && (
              <p className="text-xs text-gray-500 mt-1">{description}</p>
            )}
          </div>
          <Badge className={`${status.bg} ${status.color} border-0`}>
            {status.status}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
