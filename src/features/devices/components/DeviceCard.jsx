import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Leaf,
  Ruler,
  Home,
  Cloud,
  Gauge,
  Activity,
  ArrowRight,
  Settings,
  Power,
} from "lucide-react";

const iconComponents = {
  Leaf,
  Ruler,
  Home,
  Cloud,
  Gauge,
  Activity,
};

/**
 * Device Card Component
 * Displays individual device information with actions
 * 
 * @param {Object} props
 * @param {Object} props.device - Device object from catalog
 * @param {boolean} props.isInstalled - Whether device is installed
 * @param {Function} props.onNavigate - Navigation handler
 * @param {Function} props.onInstall - Install handler
 * @param {Function} props.onConfigure - Configure handler
 * @param {boolean} props.showActions - Show action buttons
 * @param {string} props.variant - Card variant (default, compact, detailed)
 */
const DeviceCard = ({
  device,
  isInstalled = false,
  onNavigate,
  onInstall,
  onConfigure,
  showActions = true,
  variant = "default",
}) => {
  const IconComponent = iconComponents[device.icon] || Activity;

  if (variant === "compact") {
    return (
      <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer"
onClick={() => onNavigate && onNavigate(device.id)}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 ${device.color.light} rounded-lg`}>
                <IconComponent className={`w-5 h-5 ${device.color.text}`} />
              </div>
              <div>
                <h3 className="font-semibold text-sm">{device.name}</h3>
                <p className="text-xs text-gray-500">{device.category}</p>
              </div>
            </div>
            {isInstalled && (
              <Badge className="bg-green-100 text-green-700">Aktif</Badge>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-lg transition-all duration-300 group">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-3">
          <div className={`p-3 ${device.color.light} rounded-lg`}>
            <IconComponent className={`w-6 h-6 ${device.color.text}`} />
          </div>
          <div>
            <CardTitle className="text-lg">{device.name}</CardTitle>
            <p className="text-sm text-gray-500 mt-1">{device.description}</p>
          </div>
        </div>
        {isInstalled && (
          <Badge className="bg-green-100 text-green-700 flex items-center gap-1">
            <Power className="w-3 h-3" />
            Aktif
          </Badge>
        )}
      </CardHeader>

      <CardContent>
        {/* Features */}
        <div className="space-y-2 mb-4">
          {device.features.slice(0, 3).map((feature, index) => (
            <div key={index} className="flex items-start space-x-2 text-sm">
              <div className={`w-1 h-1 rounded-full ${device.color.primary} mt-2`} />
              <span className="text-gray-600">{feature}</span>
            </div>
          ))}
        </div>

        {/* Specifications (for detailed variant) */}
        {variant === "detailed" && device.specifications && (
          <div className={`mb-4 p-3 ${device.color.light} rounded-lg`}>
            <h4 className="text-xs font-semibold text-gray-700 mb-2">Specifications</h4>
            <div className="space-y-1 text-xs text-gray-600">
              {Object.entries(device.specifications).slice(0, 3).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2 mt-4">
            {isInstalled ? (
              <>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => onNavigate && onNavigate(device.id)}
                  className="flex-1"
                >
                  <Activity className="w-4 h-4 mr-2" />
                  Open Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                {onConfigure && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onConfigure(device.id)}
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                )}
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onInstall && onInstall(device.id)}
                className={`flex-1 border-2 ${device.color.border} ${device.color.text} hover:${device.color.light}`}
              >
                Install Device
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        )}

        {/* Category badge */}
        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
          <span className="capitalize">{device.category}</span>
          {device.specifications?.connectivity && (
            <span>{device.specifications.connectivity.split(',')[0]}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DeviceCard;
