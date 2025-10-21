import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Badge } from "@/components/ui/Badge";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import {
  Leaf,
  Ruler,
  Home,
  Cloud,
  Gauge,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { getAvailableDevices } from "../data/devicesData";
import {
  validateDeviceInstallation,
  generateSerialNumber,
} from "../utils/devicesHelpers";

const iconComponents = {
  Leaf,
  Ruler,
  Home,
  Cloud,
  Gauge,
};
const AddDeviceDialog = ({ open, onOpenChange, onDeviceAdded, installedDevices = [] }) => {
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [activeTab, setActiveTab] = useState("select");
  const [installing, setInstalling] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);
  const [config, setConfig] = useState({
    serialNumber: "",
  });
  const [errors, setErrors] = useState({});

  const availableDevices = getAvailableDevices(installedDevices);

  const handleSelectDevice = (device) => {
    setSelectedDevice(device);
    setConfig({
      ...config,
      serialNumber: generateSerialNumber(device.id),
    });
    setErrors({});
    setActiveTab("configure");
  };

  const handleConfigChange = (field, value) => {
    setConfig({ ...config, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  const handleInstall = async () => {
    if (!selectedDevice) return;
    const validation = validateDeviceInstallation(selectedDevice.id, config);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setInstalling(true);
    setErrors({});
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setInstalling(false);
    setInstallSuccess(true);
    setActiveTab("success");
    if (onDeviceAdded) {
      onDeviceAdded(selectedDevice.id, config);
    }
    setTimeout(() => {
      handleClose();
    }, 1500);
  };

  const handleClose = () => {
    setSelectedDevice(null);
    setActiveTab("select");
    setInstalling(false);
    setInstallSuccess(false);
    setConfig({ serialNumber: "" });
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Add New Device</DialogTitle>
          <DialogDescription>
            Install and configure a new IoT device for your farm
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="select">Select Device</TabsTrigger>
            <TabsTrigger value="configure" disabled={!selectedDevice}>
              Configure
            </TabsTrigger>
            <TabsTrigger value="success" disabled={!installSuccess}>
              Complete
            </TabsTrigger>
          </TabsList>
          <TabsContent value="select" className="space-y-4 mt-6">
            {availableDevices.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableDevices.map((device) => {
                  const IconComponent = iconComponents[device.icon] || Gauge;
                  return (
                    <div
                      key={device.id}
                      onClick={() => handleSelectDevice(device)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        selectedDevice?.id === device.id
                          ? `${device.color.border} ${device.color.light}`
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 ${device.color.light} rounded-lg`}>
                            <IconComponent className={`w-5 h-5 ${device.color.text}`} />
                          </div>
                          <div>
                            <h3 className="font-semibold">{device.name}</h3>
                            <p className="text-sm text-gray-500">{device.description}</p>
                          </div>
                        </div>
                        {selectedDevice?.id === device.id && (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        )}
                      </div>

                      <div className="space-y-1">
                        {device.features.slice(0, 3).map((feature, idx) => (
                          <div key={idx} className="flex items-center space-x-2 text-sm">
                            <div className={`w-1.5 h-1.5 rounded-full ${device.color.primary}`} />
                            <span className="text-gray-600">{feature}</span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <Badge variant="outline" className="text-xs capitalize">
                          {device.category}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {device.specifications?.connectivity?.split(',')[0] || 'WiFi'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <Alert>
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>
                  All available devices are already installed. Remove a device to install a new one.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
          <TabsContent value="configure" className="space-y-6 mt-6">
            {selectedDevice && (
              <>
                <div className={`p-4 ${selectedDevice.color.light} rounded-lg border ${selectedDevice.color.border}`}>
                  <div className="flex items-center space-x-3">
                    {(() => {
                      const IconComponent = iconComponents[selectedDevice.icon] || Gauge;
                      return (
                        <div className={`p-2 bg-white rounded-lg`}>
                          <IconComponent className={`w-5 h-5 ${selectedDevice.color.text}`} />
                        </div>
                      );
                    })()}
                    <div>
                      <h3 className="font-semibold">{selectedDevice.name}</h3>
                      <p className="text-sm text-gray-600">{selectedDevice.description}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="serialNumber">Serial Number *</Label>
                    <Input
                      id="serialNumber"
                      value={config.serialNumber}
                      onChange={(e) => handleConfigChange("serialNumber", e.target.value)}
                      placeholder="AUTO-GENERATED-SERIAL"
                      className={errors.serialNumber ? "border-red-500" : ""}
                    />
                    {errors.serialNumber && (
                      <p className="text-xs text-red-600 mt-1">{errors.serialNumber}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Device will be automatically configured with this serial number
                    </p>
                  </div>
                </div>
                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setActiveTab("select")}>
                    Back
                  </Button>
                  <Button
                    onClick={handleInstall}
                    disabled={installing}
                    className={selectedDevice.color.primary}
                  >
                    {installing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Installing...
                      </>
                    ) : (
                      "Install Device"
                    )}
                  </Button>
                </div>
              </>
            )}
          </TabsContent>
          <TabsContent value="success" className="space-y-6 mt-6">
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Device Installed Successfully!</h3>
              <p className="text-gray-600 mb-6">
                {selectedDevice?.name} has been added to your system
              </p>
              <div className="inline-flex items-center gap-2 text-sm text-gray-500">
                <span>� Serial Number:</span>
                <Badge variant="outline" className="font-mono">{config.serialNumber}</Badge>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AddDeviceDialog;
