import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

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
