import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";

/**
 * MonitoringCard component for displaying environmental parameter data
 * Shows main parameter value with status badge and additional metrics
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} props.title - Card title
 * @param {React.ComponentType} props.icon - Lucide icon component
 * @param {string} props.iconColor - Tailwind color class for icon (e.g., "text-red-600")
 * @param {Array<Object>} props.data - Array of data items to display
 * @param {string} props.data[].label - Data label
 * @param {number|string} props.data[].value - Data value
 * @param {Object} [props.data[].status] - Status object with label, color, and bg
 * @param {boolean} [props.data[].isMain] - Whether this is the main metric
 * @param {React.ReactNode} [props.footer] - Optional footer content
 * 
 * @example
 * <MonitoringCard
 *   title="Suhu Greenhouse"
 *   icon={Thermometer}
 *   iconColor="text-red-600"
 *   data={[
 *     {
 *       label: "Dalam Greenhouse",
 *       value: 26.8,
 *       status: { label: "Optimal", color: "text-green-600", bg: "bg-green-100" },
 *       isMain: true
 *     },
 *     {
 *       label: "Luar Greenhouse",
 *       value: "28.5°C"
 *     }
 *   ]}
 *   footer={<div>Additional info</div>}
 * />
 */
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
