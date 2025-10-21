import React from "react";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import {
  Wifi,
  WifiOff,
  Battery,
  BatteryCharging,
  Signal,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { formatUptime, calculateDeviceHealth, getHealthStatus } from "../utils/devicesHelpers";

/**
 * Device Status Component
 * Displays real-time status and metrics for a device
 * 
 * @param {Object} props
 * @param {Object} props.device - Device object
 * @param {Object} props.metrics - Device metrics
 * @param {string} props.variant - Display variant (full, compact, minimal)
 * @param {boolean} props.showHealth - Show health score
 */
const DeviceStatus = ({
  device,
  metrics = {},
  variant = "full",
  showHealth = true,
}) => {
  const healthScore = calculateDeviceHealth(metrics);
  const healthStatus = getHealthStatus(healthScore);

  const connectionStatus = metrics.isOnline
    ? { label: "Online", color: "text-green-600", icon: Wifi }
    : { label: "Offline", color: "text-gray-500", icon: WifiOff };

  if (variant === "minimal") {
    return (
      <div className="flex items-center gap-2">
        <connectionStatus.icon className={`w-4 h-4 ${connectionStatus.color}`} />
        <span className={`text-sm ${connectionStatus.color}`}>
          {connectionStatus.label}
        </span>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <connectionStatus.icon className={`w-5 h-5 ${connectionStatus.color}`} />
              <div>
                <p className="font-medium text-sm">{device.name}</p>
                <p className={`text-xs ${connectionStatus.color}`}>
                  {connectionStatus.label}
                </p>
              </div>
            </div>
            {showHealth && (
              <Badge className={`${healthStatus.bg} ${healthStatus.color}`}>
                {healthStatus.label}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Full variant
  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        {/* Header with device name and connection status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <connectionStatus.icon className={`w-6 h-6 ${connectionStatus.color}`} />
            <div>
              <h3 className="font-semibold">{device.name}</h3>
              <p className={`text-sm ${connectionStatus.color}`}>
                {connectionStatus.label}
              </p>
            </div>
          </div>
          {showHealth && (
            <div className="text-right">
              <div className="text-2xl font-bold">{healthScore}</div>
              <Badge className={`${healthStatus.bg} ${healthStatus.color}`}>
                {healthStatus.label}
              </Badge>
            </div>
          )}
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Uptime */}
          {metrics.uptime !== undefined && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Uptime</p>
                <p className="font-medium text-sm">{formatUptime(metrics.uptime)}</p>
              </div>
            </div>
          )}

          {/* Signal Strength */}
          {metrics.signalStrength !== undefined && (
            <div className="flex items-center gap-2">
              <Signal className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Signal</p>
                <p className="font-medium text-sm">{metrics.signalStrength}%</p>
              </div>
            </div>
          )}

          {/* Battery Level */}
          {metrics.batteryLevel !== undefined && (
            <div className="flex items-center gap-2">
              {metrics.isCharging ? (
                <BatteryCharging className="w-4 h-4 text-green-600" />
              ) : (
                <Battery
                  className={`w-4 h-4 ${
                    metrics.batteryLevel < 20
                      ? "text-red-600"
                      : metrics.batteryLevel < 50
                      ? "text-yellow-600"
                      : "text-green-600"
                  }`}
                />
              )}
              <div>
                <p className="text-xs text-gray-500">Battery</p>
                <p className="font-medium text-sm">{metrics.batteryLevel}%</p>
              </div>
            </div>
          )}

          {/* Error Rate */}
          {metrics.errorRate !== undefined && (
            <div className="flex items-center gap-2">
              <AlertTriangle
                className={`w-4 h-4 ${
                  metrics.errorRate > 0.1
                    ? "text-red-600"
                    : metrics.errorRate > 0.05
                    ? "text-yellow-600"
                    : "text-gray-400"
                }`}
              />
              <div>
                <p className="text-xs text-gray-500">Error Rate</p>
                <p className="font-medium text-sm">{(metrics.errorRate * 100).toFixed(1)}%</p>
              </div>
            </div>
          )}
        </div>

        {/* Last Seen */}
        {metrics.lastSeen && (
          <div className="pt-3 border-t">
            <p className="text-xs text-gray-500">
              Last seen: {new Date(metrics.lastSeen).toLocaleString("id-ID")}
            </p>
          </div>
        )}

        {/* Data transmission stats */}
        {(metrics.dataReceived || metrics.dataSent) && (
          <div className="pt-3 border-t">
            <div className="flex justify-between text-xs text-gray-500">
              {metrics.dataReceived && (
                <span>↓ {metrics.dataReceived} packets</span>
              )}
              {metrics.dataSent && (
                <span>↑ {metrics.dataSent} packets</span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DeviceStatus;
