import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/Switch";
import { Badge } from "@/components/ui/Badge";
import { Power, PowerOff, Settings } from "lucide-react";
import { controlDevices } from "../data/greenhouseData";
export function ControlPanel({
  autoMode,
  controls,
  onControlChange,
  onAutoModeToggle,
}) {
  return (
    <div className="space-y-6">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-gray-600" />
            <span>Mode Operasi</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Sistem Otomatis</p>
              <p className="text-sm text-gray-500">
                {autoMode
                  ? "Sistem mengontrol perangkat berdasarkan sensor"
                  : "Kontrol manual oleh pengguna"}
              </p>
            </div>
            <Switch checked={autoMode} onCheckedChange={onAutoModeToggle} />
          </div>
        </CardContent>
      </Card>
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Kontrol Perangkat</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {controlDevices.map((device) => {
              const isActive = controls[device.key];
              
              return (
                <div
                  key={device.key}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        isActive ? "bg-green-100" : "bg-gray-200"
                      }`}
                    >
                      {isActive ? (
                        <Power className="w-5 h-5 text-green-600" />
                      ) : (
                        <PowerOff className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{device.label}</p>
                      <p className="text-sm text-gray-500">
                        {device.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge
                      className={
                        isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }
                    >
                      {isActive ? "ON" : "OFF"}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onControlChange(device.key)}
                      disabled={autoMode}
                      className={
                        autoMode ? "opacity-50 cursor-not-allowed" : ""
                      }
                    >
                      {isActive ? "Matikan" : "Nyalakan"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
          {autoMode && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                Mode otomatis aktif. Matikan mode otomatis untuk kontrol manual.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
