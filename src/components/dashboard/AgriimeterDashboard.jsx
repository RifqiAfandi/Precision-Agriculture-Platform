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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/Select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/Tabs";
import {
  TreePine,
  MapPin,
  Plus,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Eye,
  BarChart3,
  Ruler,
  Activity,
  Target,
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
import { toast } from "sonner";

export function AgriimeterDashboard() {
  const [activeTab, setActiveTab] = useState("monitoring");
  const [selectedTree, setSelectedTree] = useState(null);
  const [newTree, setNewTree] = useState({
    name: "",
    species: "",
    age: "",
    location: "",
  });

  const trees = [
    {
      id: "1",
      name: "Jati Unggul A1",
      species: "Jati",
      age: 24,
      location: "Blok A - Baris 1",
      coordinates: { lat: -6.2088, lng: 106.8456 },
      lastMeasurement: "2024-08-01 09:30",
      currentDBH: 18.5,
      previousDBH: 17.8,
      plantedDate: "2022-08-15",
      status: "growing",
      growthRate: 0.7,
      estimatedVolume: 0.12,
    },
    {
      id: "2",
      name: "Sengon Super B2",
      species: "Sengon",
      age: 18,
      location: "Blok B - Baris 2",
      coordinates: { lat: -6.209, lng: 106.846 },
      lastMeasurement: "2024-07-30 10:15",
      currentDBH: 12.3,
      previousDBH: 11.9,
      plantedDate: "2023-02-10",
      status: "optimal",
      growthRate: 0.4,
      estimatedVolume: 0.05,
    },
    {
      id: "3",
      name: "Karet Klon C3",
      species: "Karet",
      age: 36,
      location: "Blok C - Baris 3",
      coordinates: { lat: -6.2085, lng: 106.8465 },
      lastMeasurement: "2024-07-28 08:45",
      currentDBH: 25.7,
      previousDBH: 25.6,
      plantedDate: "2021-08-01",
      status: "slow",
      growthRate: 0.1,
      estimatedVolume: 0.28,
    },
  ];

  const growthData = [
    { month: "Jan", dbh: 16.2, volume: 0.08 },
    { month: "Feb", dbh: 16.5, volume: 0.09 },
    { month: "Mar", dbh: 16.8, volume: 0.09 },
    { month: "Apr", dbh: 17.1, volume: 0.1 },
    { month: "May", dbh: 17.3, volume: 0.1 },
    { month: "Jun", dbh: 17.6, volume: 0.11 },
    { month: "Jul", dbh: 17.8, volume: 0.11 },
    { month: "Agu", dbh: 18.5, volume: 0.12 },
  ];

  const speciesOptions = [
    "Jati",
    "Sengon",
    "Karet",
    "Mahoni",
    "Meranti",
    "Akasia",
    "Eukaliptus",
    "Pinus",
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "optimal":
        return "bg-green-100 text-green-700";
      case "growing":
        return "bg-blue-100 text-blue-700";
      case "slow":
        return "bg-orange-100 text-orange-700";
      case "stagnant":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "optimal":
        return "Optimal";
      case "growing":
        return "Berkembang Baik";
      case "slow":
        return "Pertumbuhan Lambat";
      case "stagnant":
        return "Stagnan";
      default:
        return "Normal";
    }
  };

  const handleAddTree = () => {
    if (!newTree.name || !newTree.species || !newTree.location) {
      toast.error("Mohon lengkapi data wajib");
      return;
    }

    toast.success("Pohon berhasil ditambahkan");
    setNewTree({ name: "", species: "", age: "", location: "" });
  };

  const simulateDBHMeasurement = (treeId) => {
    toast.success("Pengukuran DBH berhasil disimpan!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TreePine className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Pohon</p>
                <p className="text-2xl font-bold text-gray-900">
                  {trees.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Ruler className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Rata-rata DBH</p>
                <p className="text-2xl font-bold text-gray-900">
                  18.8<span className="text-sm text-gray-500 ml-1">cm</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pertumbuhan Aktif</p>
                <p className="text-2xl font-bold text-gray-900">2</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Volume Biomassa</p>
                <p className="text-2xl font-bold text-gray-900">
                  0.45<span className="text-sm text-gray-500 ml-1">m³</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="add">Tambah Pohon</TabsTrigger>
          <TabsTrigger value="monitoring">Peta Monitoring</TabsTrigger>
          <TabsTrigger value="history">Riwayat DBH</TabsTrigger>
        </TabsList>

        {/* Tab: Add Tree */}
        <TabsContent value="add" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="w-5 h-5 text-green-600" />
                <span>Daftarkan Pohon Baru</span>
              </CardTitle>
              <CardDescription>
                Tambahkan pohon baru untuk monitoring pertumbuhan DBH
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="treeName">Nama/ID Pohon *</Label>
                  <Input
                    id="treeName"
                    placeholder="Contoh: Jati Unggul A1"
                    value={newTree.name}
                    onChange={(e) =>
                      setNewTree((prev) => ({ ...prev, name: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="treeSpecies">Jenis Tanaman *</Label>
                  <Select
                    value={newTree.species}
                    onValueChange={(value) =>
                      setNewTree((prev) => ({ ...prev, species: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis pohon" />
                    </SelectTrigger>
                    <SelectContent>
                      {speciesOptions.map((species) => (
                        <SelectItem key={species} value={species}>
                          {species}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="treeAge">Umur Pohon (bulan)</Label>
                  <Input
                    id="treeAge"
                    type="number"
                    placeholder="Contoh: 24"
                    value={newTree.age}
                    onChange={(e) =>
                      setNewTree((prev) => ({ ...prev, age: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="treeLocation">Lokasi Pohon *</Label>
                  <Input
                    id="treeLocation"
                    placeholder="Contoh: Blok A - Baris 1"
                    value={newTree.location}
                    onChange={(e) =>
                      setNewTree((prev) => ({
                        ...prev,
                        location: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                <MapPin className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">GPS Otomatis</p>
                  <p className="text-sm text-blue-700">
                    Koordinat GPS akan direkam otomatis saat menyimpan
                  </p>
                </div>
              </div>

              <Button
                onClick={handleAddTree}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <TreePine className="w-4 h-4 mr-2" />
                Tambah Pohon ke Monitoring
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Monitoring Map */}
        <TabsContent value="monitoring" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Tree List */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-green-600" />
                  <span>Lokasi Pohon</span>
                </CardTitle>
                <CardDescription>
                  Klik untuk melihat detail pertumbuhan DBH
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {trees.map((tree) => (
                  <div
                    key={tree.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                      selectedTree === tree.id
                        ? "border-green-300 bg-green-50"
                        : "border-gray-200 hover:border-green-200 hover:bg-green-50/50"
                    }`}
                    onClick={() => setSelectedTree(tree.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-gray-900">
                            {tree.name}
                          </h4>
                          <Badge className={getStatusColor(tree.status)}>
                            {getStatusLabel(tree.status)}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {tree.species} • {tree.age} bulan
                        </p>
                        <p className="text-xs text-gray-500 flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {tree.location}
                        </p>
                        <div className="flex items-center space-x-4 mt-2 text-xs">
                          <span className="text-green-600 font-medium">
                            DBH: {tree.currentDBH} cm
                          </span>
                          <span className="text-blue-600">
                            Volume: {tree.estimatedVolume} m³
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {tree.growthRate > 0.5 ? (
                          <TrendingUp className="w-4 h-4 text-green-500" />
                        ) : tree.growthRate > 0.2 ? (
                          <Activity className="w-4 h-4 text-blue-500" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-orange-500" />
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
                <CardTitle>Detail Pertumbuhan DBH</CardTitle>
                <CardDescription>
                  {selectedTree
                    ? `Pengukuran terakhir: ${
                        trees.find((p) => p.id === selectedTree)
                          ?.lastMeasurement
                      }`
                    : "Pilih pohon untuk melihat detail pertumbuhan"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedTree ? (
                  <div className="space-y-6">
                    {(() => {
                      const tree = trees.find((p) => p.id === selectedTree);
                      if (!tree) return null;

                      return (
                        <>
                          {/* Tree Information */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-green-50 p-4 rounded-lg">
                              <p className="text-sm text-green-600 mb-1">
                                DBH Saat Ini
                              </p>
                              <p className="text-2xl font-bold text-green-800">
                                {tree.currentDBH} cm
                              </p>
                              <p className="text-xs text-green-600 mt-1">
                                +
                                {(tree.currentDBH - tree.previousDBH).toFixed(
                                  1
                                )}{" "}
                                cm dari bulan lalu
                              </p>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-lg">
                              <p className="text-sm text-blue-600 mb-1">
                                Estimasi Volume
                              </p>
                              <p className="text-2xl font-bold text-blue-800">
                                {tree.estimatedVolume} m³
                              </p>
                              <p className="text-xs text-blue-600 mt-1">
                                Biomassa kayu
                              </p>
                            </div>
                          </div>

                          {/* Growth Chart */}
                          <div>
                            <h4 className="font-medium mb-3 flex items-center space-x-2">
                              <BarChart3 className="w-4 h-4" />
                              <span>Tren Pertumbuhan 8 Bulan</span>
                            </h4>
                            <div className="h-48">
                              <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={growthData}>
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis dataKey="month" />
                                  <YAxis />
                                  <Tooltip />
                                  <Line
                                    type="monotone"
                                    dataKey="dbh"
                                    stroke="#22c55e"
                                    strokeWidth={2}
                                    name="DBH (cm)"
                                  />
                                </LineChart>
                              </ResponsiveContainer>
                            </div>
                          </div>

                          {/* AI Analysis */}
                          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
                            <h4 className="font-medium text-purple-900 mb-2 flex items-center space-x-2">
                              <Target className="w-4 h-4" />
                              <span>Analisis Pertumbuhan AI</span>
                            </h4>
                            <div className="space-y-2 text-sm">
                              <p className="text-purple-800">
                                <strong>Status:</strong>{" "}
                                {getStatusLabel(tree.status)} dengan laju
                                pertumbuhan {tree.growthRate} cm/bulan
                              </p>
                              <p className="text-purple-800">
                                <strong>Prediksi:</strong> Mencapai diameter 20
                                cm dalam{" "}
                                {Math.ceil(
                                  (20 - tree.currentDBH) / tree.growthRate
                                )}{" "}
                                bulan
                              </p>
                              <p className="text-purple-800">
                                <strong>Rekomendasi:</strong>{" "}
                                {tree.growthRate > 0.5
                                  ? "Pertumbuhan optimal, lanjutkan perawatan rutin"
                                  : tree.growthRate > 0.2
                                  ? "Pertimbangkan pemupukan untuk mempercepat pertumbuhan"
                                  : "Periksa kondisi tanah dan sistem irigasi"}
                              </p>
                            </div>
                          </div>

                          {/* Measurement Simulation */}
                          <Button
                            onClick={() => simulateDBHMeasurement(tree.id)}
                            className="w-full bg-blue-600 hover:bg-blue-700"
                          >
                            <Ruler className="w-4 h-4 mr-2" />
                            Simulasi Pengukuran DBH
                          </Button>
                        </>
                      );
                    })()}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <TreePine className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>
                      Pilih pohon dari daftar untuk melihat detail pertumbuhan
                      DBH
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab: DBH History */}
        <TabsContent value="history" className="space-y-4">
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-green-600" />
                  <span>Riwayat Pengukuran DBH</span>
                </CardTitle>
                <CardDescription>Data historis semua pohon</CardDescription>
              </div>
              <Button variant="outline" className="flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export Data</span>
              </Button>
            </CardHeader>
            <CardContent>
              {/* Overview Chart */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Rata-rata Pertumbuhan DBH</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={growthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="dbh" fill="#22c55e" name="DBH (cm)" />
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
                        Pohon
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        DBH (cm)
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Pertumbuhan
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Volume (m³)
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {trees.map((tree, index) => (
                      <tr
                        key={tree.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4">
                          {tree.lastMeasurement.split(" ")[0]}
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">{tree.name}</p>
                            <p className="text-xs text-gray-500">
                              {tree.location}
                            </p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium">{tree.currentDBH}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              tree.growthRate > 0.5
                                ? "bg-green-100 text-green-700"
                                : tree.growthRate > 0.2
                                ? "bg-blue-100 text-blue-700"
                                : "bg-orange-100 text-orange-700"
                            }`}
                          >
                            +{tree.growthRate}/bulan
                          </span>
                        </td>
                        <td className="py-3 px-4">{tree.estimatedVolume}</td>
                        <td className="py-3 px-4">
                          <Badge className={getStatusColor(tree.status)}>
                            {getStatusLabel(tree.status)}
                          </Badge>
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
