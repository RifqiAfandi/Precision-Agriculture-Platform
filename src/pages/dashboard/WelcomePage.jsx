import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Leaf,
  Home,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  MapPin,
  TreePine,
  Ruler,
  Plus,
  Gauge,
  Wind,
  Thermometer,
} from "lucide-react";
import { DeviceCard } from "@/features/devices";
import { getAvailableDevices, getDeviceById } from "@/features/devices/data/devicesData";

export function WelcomePage({ user, onNavigate, installedDevices }) {
  const dashboardStats = [
    {
      title: "Total Perangkat",
      value: installedDevices.length.toString(),
      change: "Aktif dan terhubung",
      trend: "up",
      icon: Activity,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Lokasi Monitoring",
      value: (
        (installedDevices.includes("agriino") ? 3 : 0) +
        (installedDevices.includes("agriimeter") ? 3 : 0) +
        (installedDevices.includes("greenhouse") ? 1 : 0) +
        (installedDevices.includes("skyvera") ? 1 : 0)
      ).toString(),
      change: "Area terpantau",
      trend: "up",
      icon: MapPin,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Peringatan",
      value: installedDevices.includes("skyvera") ? "3" : "2",
      change: "1 perlu perhatian",
      trend: "warning",
      icon: AlertTriangle,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Status Sistem",
      value: "100%",
      change: "Operasional",
      trend: "up",
      icon: CheckCircle,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
  ];

  const getProductStatus = () => {
    return installedDevices
      .map(deviceId => {
        const device = getDeviceById(deviceId);
        if (!device) return null;
        
        return {
          id: device.id,
          name: device.name,
          description: device.description,
          icon: device.icon,
          status: 'active',
          devices: device.id === 'agriino' ? 5 : device.id === 'agriimeter' ? 3 : 1,
          lastUpdate: device.id === 'skyvera' ? '30 detik lalu' : device.id === 'greenhouse' ? '1 menit lalu' : device.id === 'agriino' ? '2 menit lalu' : '5 menit lalu',
          alerts: device.id === 'agriino' || device.id === 'skyvera' ? 1 : 0,
          data: device.specifications,
        };
      })
      .filter(Boolean);
  };

  const productStatus = getProductStatus();

  const recentAlerts = [
    {
      type: "warning",
      product: "Agriino",
      message: "Kadar klorofil tanaman A turun 10% dalam 3 hari",
      time: "15 menit lalu",
      location: "Blok A - Lahan 1",
    },
    {
      type: "info",
      product: "Agriimeter",
      message: "Pohon Jati A1 mencapai DBH 18.5 cm, pertumbuhan normal",
      time: "1 jam lalu",
      location: "Blok A - Baris 1",
    },
  ];

  if (installedDevices.includes("greenhouse")) {
    recentAlerts.push({
      type: "success",
      product: "Greenhouse",
      message: "Sistem ventilasi otomatis berhasil menjaga suhu optimal",
      time: "2 jam lalu",
      location: "Greenhouse #1",
    });
  }

  if (installedDevices.includes("skyvera")) {
    recentAlerts.unshift({
      type: "warning",
      product: "SkyVera",
      message: "AQI meningkat ke 57 (sedang), batasi aktivitas outdoor",
      time: "5 menit lalu",
      location: "Weather Station Utama",
    });
  }

  const availableDevicesData = getAvailableDevices(installedDevices);

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Selamat Datang, {user?.name?.split(" ")[0]}! 👋
            </h1>
            <p className="text-green-100 text-lg">
              {productStatus.length > 0
                ? `${productStatus.length} sistem IoT pertanian Anda berjalan dengan baik hari ini`
                : "Mulai tambahkan perangkat IoT untuk monitoring pertanian"}
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center">
              <Activity className="w-16 h-16 text-white animate-float" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {dashboardStats.map((stat, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-green-100 text-sm">{stat.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {productStatus.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productStatus.map((product) => (
            <Card
              key={product.id}
              className="glass-card hover:shadow-xl transition-all duration-300 group cursor-pointer"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                    <product.icon className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <CardDescription>{product.description}</CardDescription>
                  </div>
                </div>
                <Badge
                  variant="default"
                  className="bg-green-100 text-green-700"
                >
                  Aktif
                </Badge>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    {product.id === "agriimeter"
                      ? "Pohon Terdaftar"
                      : product.id === "skyvera"
                      ? "Stasiun Cuaca"
                      : "Perangkat Aktif"}
                  </span>
                  <span className="font-medium">{product.devices} unit</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Update Terakhir</span>
                  <span className="font-medium text-green-600">
                    {product.lastUpdate}
                  </span>
                </div>

                {product.alerts > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Peringatan</span>
                    <Badge
                      variant="destructive"
                      className="bg-orange-100 text-orange-700"
                    >
                      {product.alerts}
                    </Badge>
                  </div>
                )}
                <div className="pt-4 border-t border-gray-100">
                  {product.id === "agriino" && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">
                          Rata-rata Klorofil
                        </span>
                        <span className="font-medium">
                          {product.data.avgChlorophyll}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Nitrogen (mg/L)</span>
                        <span className="font-medium">
                          {product.data.avgNitrogen}
                        </span>
                      </div>
                    </div>
                  )}

                  {product.id === "agriimeter" && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 flex items-center">
                          <Ruler className="w-3 h-3 mr-1" />
                          Rata-rata DBH
                        </span>
                        <span className="font-medium">
                          {product.data.avgDBH} cm
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 flex items-center">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Laju Pertumbuhan
                        </span>
                        <span className="font-medium">
                          {product.data.growthRate} cm/bulan
                        </span>
                      </div>
                    </div>
                  )}

                  {product.id === "greenhouse" && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Suhu Dalam</span>
                        <span className="font-medium">
                          {product.data.insideTemp}°C
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">CO₂ Level</span>
                        <span className="font-medium">
                          {product.data.co2Level} ppm
                        </span>
                      </div>
                    </div>
                  )}

                  {product.id === "skyvera" && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 flex items-center">
                          <Thermometer className="w-3 h-3 mr-1" />
                          Suhu
                        </span>
                        <span className="font-medium">
                          {product.data.temperature}°C
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 flex items-center">
                          <Wind className="w-3 h-3 mr-1" />
                          Angin
                        </span>
                        <span className="font-medium">
                          {product.data.windSpeed} km/h
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">AQI</span>
                        <span className="font-medium">{product.data.aqi}</span>
                      </div>
                    </div>
                  )}
                </div>

                <Button
                  className="w-full mt-4 group-hover:bg-green-600 transition-colors"
                  onClick={() => onNavigate(product.id)}
                >
                  Lihat Detail
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
          {availableDevicesData.length > 0 && (
            <Card className="glass-card hover:shadow-xl transition-all duration-300 group cursor-pointer border-2 border-dashed border-gray-300 hover:border-green-400">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-green-50 transition-colors">
                  <Plus className="w-8 h-8 text-gray-400 group-hover:text-green-600 transition-colors" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Tambah Perangkat
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Pasang perangkat IoT baru untuk monitoring yang lebih lengkap
                </p>
                <div className="space-y-1">
                  {availableDevicesData.map((device, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200 block"
                    >
                      {device.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <Card className="glass-card text-center py-12">
          <CardContent>
            <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Plus className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Belum Ada Perangkat
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Mulai dengan menambahkan perangkat IoT pertama Anda untuk
              monitoring pertanian yang lebih efektif
            </p>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Perangkat Pertama
            </Button>
          </CardContent>
        </Card>
      )}
      {recentAlerts.length > 0 && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              <span>Notifikasi Terbaru</span>
            </CardTitle>
            <CardDescription>
              Peringatan dan update sistem dalam 24 jam terakhir
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAlerts.map((alert, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg"
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      alert.type === "warning"
                        ? "bg-orange-500"
                        : alert.type === "info"
                        ? "bg-blue-500"
                        : "bg-green-500"
                    }`}
                  ></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900">
                        {alert.product}
                      </span>
                      <span className="text-sm text-gray-500">
                        {alert.time}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-1">{alert.message}</p>
                    <p className="text-sm text-gray-500 flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {alert.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
