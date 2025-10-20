import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/Dialog";
import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";
import { Label } from "../../ui/Label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/Card";
import { Badge } from "../../ui/Badge";
import { Alert, AlertDescription } from "../../ui/Alert";
import {
  Home,
  Leaf,
  Cloud,
  Gauge,
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

const allDevices = [
  {
    id: "agriino",
    name: "Agriino",
    description: "Monitoring Klorofil & Nitrogen",
    longDescription:
      "SPAD Meter low-cost untuk analisis klorofil dan nitrogen tanaman secara real-time",
    icon: Leaf,
    color: "text-green-600",
    bgColor: "bg-green-50",
    price: "Rp 2.500.000",
    features: [
      "SPAD Meter Low-cost",
      "Analisis Real-time",
      "Rekomendasi Pemupukan AI",
    ],
    status: "installed",
  },
  {
    id: "agriimeter",
    name: "Agriimeter",
    description: "Pengukur DBH Pohon",
    longDescription:
      "Sensor pengukur diameter batang pohon untuk monitoring pertumbuhan dan biomassa",
    icon: Cloud,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    price: "Rp 3.200.000",
    features: [
      "Monitoring DBH Real-time",
      "Prediksi Pertumbuhan",
      "Analisis Biomassa",
    ],
    status: "installed",
  },
  {
    id: "greenhouse",
    name: "Greenhouse Compax",
    description: "Monitoring Rumah Kaca",
    longDescription:
      "Sistem monitoring dan kontrol otomatis untuk greenhouse dengan sensor lengkap",
    icon: Home,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    price: "Rp 8.500.000",
    features: ["Kontrol Otomatis", "Monitoring CO₂", "Sistem Ventilasi Pintar"],
    status: "available",
  },
  {
    id: "skyvera",
    name: "SkyVera Weather Station",
    description: "Weather Station Professional",
    longDescription:
      "Stasiun cuaca profesional dengan sensor cuaca lengkap untuk monitoring lingkungan",
    icon: Gauge,
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    price: "Rp 12.000.000",
    features: [
      "Sensor Cuaca Lengkap",
      "Prediksi Cuaca AI",
      "Data Meteorologi Real-time",
    ],
    status: "available",
  },
  {
    id: "soilsense",
    name: "SoilSense Pro",
    description: "Sensor Tanah Multi-Parameter",
    longDescription:
      "Sensor tanah canggih untuk monitoring pH, kelembaban, nutrisi dan temperatura tanah",
    icon: Leaf,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    price: "Rp 4.800.000",
    features: [
      "pH & Nutrisi Tanah",
      "Kelembaban Multi-layer",
      "Analisis Kesuburan AI",
    ],
    status: "coming-soon",
  },
  {
    id: "aquamatic",
    name: "AquaMatic",
    description: "Sistem Irigasi Otomatis",
    longDescription:
      "Sistem irigasi pintar dengan kontrol otomatis berdasarkan data sensor tanah dan cuaca",
    icon: Cloud,
    color: "text-cyan-600",
    bgColor: "bg-cyan-50",
    price: "Rp 6.500.000",
    features: ["Irigasi Otomatis", "Kontrol Jarak Jauh", "Efisiensi Air AI"],
    status: "coming-soon",
  },
];

export function AddDeviceDialog({ open, onOpenChange, onDeviceAdded }) {
  const [step, setStep] = useState("select");
  const [selectedDevice, setSelectedDevice] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Perlu lebih lebar & tampilkan lebih banyak kartu per slide → ubah jadi 4
  const devicesPerSlide = 4;
  const totalSlides = Math.ceil(allDevices.length / devicesPerSlide);

  const getCurrentDevices = () => {
    const startIndex = currentSlide * devicesPerSlide;
    return allDevices.slice(startIndex, startIndex + devicesPerSlide);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleDeviceSelect = (deviceId) => {
    const device = allDevices.find((d) => d.id === deviceId);
    if (device?.status === "coming-soon") {
      toast.error("Perangkat ini belum tersedia");
      return;
    }
    if (device?.status === "installed") {
      toast.error("Perangkat ini sudah terpasang");
      return;
    }

    setSelectedDevice(deviceId);
    setStep("auth");
    setError("");
  };

  const handleAuth = async () => {
    setError("");
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (authCode === "demo123456") {
      onDeviceAdded(selectedDevice);
      onOpenChange(false);
      toast.success(
        `${
          allDevices.find((d) => d.id === selectedDevice)?.name
        } berhasil ditambahkan!`
      );
      // Reset state
      setStep("select");
      setSelectedDevice("");
      setAuthCode("");
      setCurrentSlide(0);
    } else {
      setError("Kode autentikasi tidak valid. Gunakan: demo123456");
    }

    setIsLoading(false);
  };

  const handleClose = () => {
    onOpenChange(false);
    setStep("select");
    setSelectedDevice("");
    setAuthCode("");
    setError("");
    setCurrentSlide(0);
  };

  const getSelectedDeviceInfo = () => {
    return allDevices.find((d) => d.id === selectedDevice);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      {/* Lebarkan dialog (sebelumnya 800px) agar informasi tidak terasa sempit */}
      <DialogContent className="max-w-none w-[1100px] max-h-[92vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {step === "select"
              ? "Tambah Perangkat IoT"
              : "Autentikasi Perangkat"}
          </DialogTitle>
          <DialogDescription>
            {step === "select"
              ? "Pilih perangkat IoT yang ingin ditambahkan ke dashboard Anda"
              : "Masukkan kode autentikasi untuk mengaktifkan perangkat"}
          </DialogDescription>
        </DialogHeader>

        {step === "select" && (
          <div className="space-y-6">
            {/* Device Carousel */}
            <div className="relative">
              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevSlide}
                  disabled={totalSlides <= 1}
                  className="flex items-center space-x-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Sebelumnya</span>
                </Button>

                <div className="flex items-center space-x-2">
                  {Array.from({ length: totalSlides }).map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentSlide ? "bg-green-500" : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextSlide}
                  disabled={totalSlides <= 1}
                  className="flex items-center space-x-2"
                >
                  <span>Selanjutnya</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              {/* Device Cards */}
              {/* Lebarkan grid: pada layar sangat lebar tampilkan 4 kartu agar tidak 'gepeng' */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 min-h-[430px]">
                {getCurrentDevices().map((device) => (
                  <Card
                    key={device.id}
                    className={`glass-card transition-all duration-200 cursor-pointer hover:shadow-lg ${
                      device.status === "coming-soon"
                        ? "opacity-60 cursor-not-allowed"
                        : device.status === "installed"
                        ? "opacity-70 cursor-not-allowed"
                        : "hover:-translate-y-1"
                    }`}
                    onClick={() => handleDeviceSelect(device.id)}
                  >
                    <CardHeader className="text-center pb-3">
                      <div
                        className={`w-12 h-12 mx-auto ${device.bgColor} rounded-xl flex items-center justify-center mb-3`}
                      >
                        <device.icon className={`w-6 h-6 ${device.color}`} />
                      </div>
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <CardTitle className="text-lg">{device.name}</CardTitle>
                        {device.status === "coming-soon" && (
                          <Badge variant="secondary" className="text-xs">
                            Coming Soon
                          </Badge>
                        )}
                        {device.status === "installed" && (
                          <Badge className="text-xs bg-green-100 text-green-700">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Terpasang
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="text-sm">
                        {device.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                        {device.longDescription}
                      </p>

                      <div className="space-y-2 mb-4">
                        {device.features.slice(0, 2).map((feature, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2"
                          >
                            <div
                              className={`w-1.5 h-1.5 ${device.bgColor} rounded-full`}
                            ></div>
                            <span className="text-xs text-gray-700">
                              {feature}
                            </span>
                          </div>
                        ))}
                        {device.features.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{device.features.length - 2} fitur lainnya
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-green-600">
                          {device.price}
                        </span>
                        {device.status === "available" && (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-blue-800">
                    Informasi Pemasangan
                  </p>
                  <p className="text-sm text-blue-700">
                    Setelah memilih perangkat, Anda akan diminta memasukkan kode
                    autentikasi yang tertera pada kemasan perangkat. Untuk demo,
                    gunakan kode:{" "}
                    <code className="bg-blue-100 px-1 rounded">demo123456</code>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === "auth" && (
          <div className="space-y-6">
            {/* Selected Device Info */}
            {(() => {
              const device = getSelectedDeviceInfo();
              return device ? (
                <Card className="glass-card">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-12 h-12 ${device.bgColor} rounded-xl flex items-center justify-center`}
                      >
                        <device.icon className={`w-6 h-6 ${device.color}`} />
                      </div>
                      <div>
                        <CardTitle>{device.name}</CardTitle>
                        <CardDescription>{device.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Fitur Utama:</h4>
                        <ul className="space-y-1">
                          {device.features.map((feature, index) => (
                            <li
                              key={index}
                              className="flex items-center space-x-2 text-sm"
                            >
                              <div
                                className={`w-1.5 h-1.5 ${device.bgColor} rounded-full`}
                              ></div>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Harga:</h4>
                        <p className="text-2xl font-bold text-green-600">
                          {device.price}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : null;
            })()}

            {/* Authentication Form */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="authCode">Kode Autentikasi Perangkat</Label>
                <Input
                  id="authCode"
                  type="text"
                  placeholder="Masukkan kode 8 digit dari kemasan"
                  value={authCode}
                  onChange={(e) => setAuthCode(e.target.value)}
                  className="mt-1"
                  disabled={isLoading}
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-green-800">
                      Demo Mode
                    </p>
                    <p className="text-sm text-green-700">
                      Gunakan kode autentikasi:{" "}
                      <code className="bg-green-100 px-1 rounded font-mono">
                        demo123456
                      </code>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setStep("select")}
                disabled={isLoading}
                className="flex-1"
              >
                Kembali
              </Button>
              <Button
                onClick={handleAuth}
                disabled={isLoading || !authCode}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              >
                {isLoading ? "Memverifikasi..." : "Aktifkan Perangkat"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
