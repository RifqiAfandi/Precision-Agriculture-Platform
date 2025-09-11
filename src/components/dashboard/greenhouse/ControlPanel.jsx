import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/Card";
import { Button } from "../../ui/Button";
import { Switch } from "../../ui/Switch";
import { Badge } from "../../ui/Badge";
import { Power, PowerOff, Settings } from "lucide-react";

export function ControlPanel({
  autoMode,
  controls,
  onControlChange,
  onAutoModeToggle,
}) {
  const controlItems = [
    {
      key: "exhaustFan",
      label: "Exhaust Fan",
      description: "Ventilasi udara keluar",
      status: controls.exhaustFan,
    },
    {
      key: "roofVent",
      label: "Atap Ventilasi",
      description: "Bukaan atap otomatis",
      status: controls.roofVent,
    },
    {
      key: "irrigationSystem",
      label: "Sistem Irigasi",
      description: "Penyiraman otomatis",
      status: controls.irrigationSystem,
    },
    {
      key: "heatingSystem",
      label: "Sistem Pemanas",
      description: "Kontrol suhu minimum",
      status: controls.heatingSystem,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Auto Mode Toggle */}
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

      {/* Control Switches */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Kontrol Perangkat</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {controlItems.map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      item.status ? "bg-green-100" : "bg-gray-200"
                    }`}
                  >
                    {item.status ? (
                      <Power className="w-5 h-5 text-green-600" />
                    ) : (
                      <PowerOff className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge
                    className={
                      item.status
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }
                  >
                    {item.status ? "ON" : "OFF"}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onControlChange(item.key)}
                    disabled={autoMode}
                    className={autoMode ? "opacity-50 cursor-not-allowed" : ""}
                  >
                    {item.status ? "Matikan" : "Nyalakan"}
                  </Button>
                </div>
              </div>
            ))}
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
