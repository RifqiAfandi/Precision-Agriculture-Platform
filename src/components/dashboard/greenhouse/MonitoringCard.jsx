import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/Card";
import { Badge } from "../../ui/Badge";

export function MonitoringCard({ title, icon: Icon, iconColor, data, footer }) {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Icon className={`w-5 h-5 ${iconColor}`} />
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-gray-600">{item.label}</span>
              <div className="text-right">
                <span
                  className={`${
                    item.isMain
                      ? "text-2xl font-bold text-gray-900"
                      : "font-medium"
                  }`}
                >
                  {item.value}
                  {typeof item.value === "number" &&
                    (item.label.includes("Suhu") ? "°C" : "%")}
                </span>
                {item.status && (
                  <Badge
                    className={`${item.status.bg} ${item.status.color} ml-2`}
                  >
                    {item.status.label}
                  </Badge>
                )}
              </div>
            </div>
          ))}
          {footer && <div className="pt-2 border-t">{footer}</div>}
        </div>
      </CardContent>
    </Card>
  );
}
