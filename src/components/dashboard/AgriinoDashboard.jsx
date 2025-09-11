import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { Badge } from "../ui/Badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/Tabs";
import {
  Leaf,
  MapPin,
  Plus,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Eye,
  BarChart3,
  AlertCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export function AgriinoDashboard() {
  const [activeTab, setActiveTab] = useState("monitoring");
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [newPlant, setNewPlant] = useState({
    name: "",
    description: "",
    location: "",
  });

  const plants = [
    {
      id: "1",
      name: "Tomat Hidroponik A",
      description: "Varietas Cherry, umur 45 hari",
      location: "Blok A - Lahan 1",
      coordinates: { lat: -6.2088, lng: 106.8456 },
      lastMeasurement: "2024-08-02 14:30",
      chlorophyll: 42.5,
      nitrogen: 2.6,
      recommendation: "Perlu penambahan pupuk nitrogen dalam 3 hari",
      status: "good",
      trend: "up",
    },
    {
      id: "2",
      name: "Cabai Merah B",
      description: "Varietas Keriting, umur 60 hari",
      location: "Blok B - Lahan 2",
      coordinates: { lat: -6.209, lng: 106.846 },
      lastMeasurement: "2024-08-02 14:25",
      chlorophyll: 38.2,
      nitrogen: 1.9,
      recommendation: "Kadar nitrogen rendah, segera lakukan pemupukan",
      status: "warning",
      trend: "down",
    },
    {
      id: "3",
      name: "Selada Green C",
      description: "Varietas Romaine, umur 30 hari",
      location: "Blok C - Lahan 3",
      coordinates: { lat: -6.2085, lng: 106.8465 },
      lastMeasurement: "2024-08-02 14:35",
      chlorophyll: 48.8,
      nitrogen: 3.2,
      recommendation: "Kondisi optimal, pertahankan rutinitas pemeliharaan",
      status: "excellent",
      trend: "up",
    },
  ];

  const historicalData = [
    { date: "25 Jul", chlorophyll: 45, nitrogen: 2.8 },
    { date: "26 Jul", chlorophyll: 44, nitrogen: 2.7 },
    { date: "27 Jul", chlorophyll: 43, nitrogen: 2.6 },
    { date: "28 Jul", chlorophyll: 42, nitrogen: 2.5 },
    { date: "29 Jul", chlorophyll: 41, nitrogen: 2.4 },
    { date: "30 Jul", chlorophyll: 40, nitrogen: 2.3 },
    { date: "31 Jul", chlorophyll: 39, nitrogen: 2.2 },
    { date: "01 Agu", chlorophyll: 38, nitrogen: 1.9 },
    { date: "02 Agu", chlorophyll: 42.5, nitrogen: 2.6 },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "excellent":
        return "bg-green-100 text-green-700";
      case "good":
        return "bg-blue-100 text-blue-700";
      case "warning":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "excellent":
        return "Sangat Baik";
      case "good":
        return "Baik";
      case "warning":
        return "Perlu Perhatian";
      default:
        return "Normal";
    }
  };

  const handleAddPlant = () => {
    if (!newPlant.name || !newPlant.location) return;

    console.log("Adding plant:", newPlant);
    setNewPlant({ name: "", description: "", location: "" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Leaf className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Tanaman</p>
                <p className="text-2xl font-bold text-gray-900">
                  {plants.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Rata-rata Klorofil</p>
                <p className="text-2xl font-bold text-gray-900">43.2</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Nitrogen (mg/L)</p>
                <p className="text-2xl font-bold text-gray-900">2.4</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Perlu Perhatian</p>
                <p className="text-2xl font-bold text-gray-900">1</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="add">Tambah Tanaman</TabsTrigger>
          <TabsTrigger value="monitoring">Peta Monitoring</TabsTrigger>
          <TabsTrigger value="history">Riwayat Data</TabsTrigger>
        </TabsList>

        {/* Tab: Add Plant */}
        <TabsContent value="add" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="w-5 h-5 text-green-600" />
                <span>Tambah Lokasi Tanaman Baru</span>
              </CardTitle>
              <CardDescription>
                Daftarkan tanaman baru untuk monitoring klorofil dan nitrogen
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="plantName">Nama Tanaman</Label>
                  <Input
                    id="plantName"
                    placeholder="Contoh: Tomat Hidroponik A"
                    value={newPlant.name}
                    onChange={(e) =>
                      setNewPlant((prev) => ({ ...prev, name: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Lokasi</Label>
                  <Input
                    id="location"
                    placeholder="Contoh: Blok A - Lahan 1"
                    value={newPlant.location}
                    onChange={(e) =>
                      setNewPlant((prev) => ({
                        ...prev,
                        location: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi (Opsional)</Label>
                <Input
                  id="description"
                  placeholder="Contoh: Varietas Cherry, umur 45 hari"
                  value={newPlant.description}
                  onChange={(e) =>
                    setNewPlant((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                <MapPin className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">GPS Otomatis</p>
                  <p className="text-sm text-blue-700">
                    Lokasi akan dideteksi otomatis saat menyimpan
                  </p>
                </div>
              </div>

              <Button
                onClick={handleAddPlant}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Simpan Lokasi Tanaman
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Monitoring Map */}
        <TabsContent value="monitoring" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Add Plant */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-green-600" />
                  <span>Lokasi Tanaman</span>
                </CardTitle>
                <CardDescription>
                  Klik untuk melihat detail monitoring
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {plants.map((plant) => (
                  <div
                    key={plant.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                      selectedPlant === plant.id
                        ? "border-green-300 bg-green-50"
                        : "border-gray-200 hover:border-green-200 hover:bg-green-50/50"
                    }`}
                    onClick={() => setSelectedPlant(plant.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-gray-900">
                            {plant.name}
                          </h4>
                          <Badge className={getStatusColor(plant.status)}>
                            {getStatusLabel(plant.status)}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {plant.description}
                        </p>
                        <p className="text-xs text-gray-500 flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {plant.location}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {plant.trend === "up" ? (
                          <TrendingUp className="w-4 h-4 text-green-500" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-500" />
                        )}
                        <Eye className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Monitoring Detail */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Detail Monitoring</CardTitle>
                <CardDescription>
                  {selectedPlant
                    ? `Pengukuran terakhir: ${
                        plants.find((p) => p.id === selectedPlant)
                          ?.lastMeasurement
                      }`
                    : "Pilih tanaman untuk melihat detail"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedPlant ? (
                  <div className="space-y-6">
                    {(() => {
                      const plant = plants.find((p) => p.id === selectedPlant);
                      if (!plant) return null;

                      return (
                        <>
                          {/* Trend Chart */}
                          <div>
                            <h4 className="font-medium mb-3 flex items-center space-x-2">
                              <BarChart3 className="w-4 h-4" />
                              <span>Tren 7 Hari Terakhir</span>
                            </h4>
                            <div className="h-48">
                              <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={historicalData.slice(-7)}>
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis dataKey="date" />
                                  <YAxis />
                                  <Tooltip />
                                  <Line
                                    type="monotone"
                                    dataKey="chlorophyll"
                                    stroke="#22c55e"
                                    strokeWidth={2}
                                    name="Klorofil"
                                  />
                                  <Line
                                    type="monotone"
                                    dataKey="nitrogen"
                                    stroke="#3b82f6"
                                    strokeWidth={2}
                                    name="Nitrogen"
                                  />
                                </LineChart>
                              </ResponsiveContainer>
                            </div>
                          </div>

                          {/* Score */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-green-50 p-4 rounded-lg">
                              <p className="text-sm text-green-600 mb-1">
                                Indeks Klorofil
                              </p>
                              <p className="text-2xl font-bold text-green-800">
                                {plant.chlorophyll}
                              </p>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-lg">
                              <p className="text-sm text-blue-600 mb-1">
                                Nitrogen (mg/L)
                              </p>
                              <p className="text-2xl font-bold text-blue-800">
                                {plant.nitrogen}
                              </p>
                            </div>
                          </div>

                          {/* AI Recommendation */}
                          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
                            <h4 className="font-medium text-purple-900 mb-2 flex items-center space-x-2">
                              <AlertCircle className="w-4 h-4" />
                              <span>Rekomendasi AI</span>
                            </h4>
                            <p className="text-purple-800">
                              {plant.recommendation}
                            </p>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>
                      Pilih tanaman dari daftar untuk melihat detail monitoring
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab: Data History */}
        <TabsContent value="history" className="space-y-4">
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-green-600" />
                  <span>Riwayat Pengukuran</span>
                </CardTitle>
                <CardDescription>Data historis semua tanaman</CardDescription>
              </div>
              <Button variant="outline" className="flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export Data</span>
              </Button>
            </CardHeader>
            <CardContent>
              {/* Trend Chart */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">
                  Tren Rata-rata (9 Hari Terakhir)
                </h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={historicalData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="chlorophyll"
                        fill="#22c55e"
                        name="Klorofil"
                      />
                      <Bar dataKey="nitrogen" fill="#3b82f6" name="Nitrogen" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Tanggal
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Lokasi
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Indeks Klorofil
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Kadar Nitrogen
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Saran Pemupukan
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {plants.map((plant, index) => (
                      <tr
                        key={plant.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4">02 Agu 2024</td>
                        <td className="py-3 px-4">{plant.location}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              plant.chlorophyll > 45
                                ? "bg-green-100 text-green-700"
                                : plant.chlorophyll > 40
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {plant.chlorophyll}
                          </span>
                        </td>
                        <td className="py-3 px-4">{plant.nitrogen} mg/L</td>
                        <td className="py-3 px-4 text-gray-600 max-w-xs truncate">
                          {plant.recommendation}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
