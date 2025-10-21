import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Home, Thermometer, Droplets, Activity, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { greenhouses, getGreenhouseStats } from "./data/greenhouseData";
import { StatCard } from "@/components/common/StatCard";
import { GreenhouseCard } from "./components/GreenhouseCard";
import { GreenhouseDetailPanel } from "./components/GreenhouseDetailPanel";
import { AddGreenhouseForm } from "./components/AddGreenhouseForm";
import { HistoryTable } from "./components/HistoryTable";

export function GreenhouseDashboard() {
  const [activeTab, setActiveTab] = useState("monitoring");
  const [selectedGreenhouseId, setSelectedGreenhouseId] = useState(null);

  const stats = getGreenhouseStats();
  const selectedGreenhouse = greenhouses.find((gh) => gh.id === selectedGreenhouseId);

  const handleAddGreenhouse = () => {
    toast.success("Greenhouse berhasil ditambahkan!");
    setActiveTab("monitoring");
  };

  const handleControl = (id) => {
    toast.info("Membuka panel kontrol untuk " + greenhouses.find((gh) => gh.id === id)?.name);
  };

  const handleExportData = () => {
    toast.success("Data sedang diproses untuk download");
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-4 gap-4">
        <StatCard
          icon={Home}
          iconColor="bg-green-100 text-green-600"
          label="Total Greenhouse"
          value={stats.totalGreenhouses}
        />
        <StatCard
          icon={Thermometer}
          iconColor="bg-red-100 text-red-600"
          label="Rata-rata Suhu"
          value={stats.avgTemp}
          unit="°C"
        />
        <StatCard
          icon={Droplets}
          iconColor="bg-blue-100 text-blue-600"
          label="Rata-rata Kelembaban"
          value={stats.avgHumidity}
          unit="%"
        />
        <StatCard
          icon={CheckCircle}
          iconColor="bg-purple-100 text-purple-600"
          label="Status Optimal"
          value={stats.optimalCount}
        />
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="add">Tambah Greenhouse</TabsTrigger>
          <TabsTrigger value="monitoring">Peta Monitoring</TabsTrigger>
          <TabsTrigger value="history">Riwayat Aksi</TabsTrigger>
        </TabsList>
        <TabsContent value="add" className="space-y-4">
          <AddGreenhouseForm onSubmit={handleAddGreenhouse} />
        </TabsContent>
        <TabsContent value="monitoring" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Home className="w-5 h-5 text-green-600" />
                  <span>Lokasi Greenhouse</span>
                </CardTitle>
                <CardDescription>
                  Klik untuk melihat detail monitoring
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {greenhouses.map((greenhouse) => (
                  <GreenhouseCard
                    key={greenhouse.id}
                    greenhouse={greenhouse}
                    isSelected={selectedGreenhouseId === greenhouse.id}
                    onClick={() => setSelectedGreenhouseId(greenhouse.id)}
                  />
                ))}
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Detail Monitoring</CardTitle>
                <CardDescription>
                  {selectedGreenhouse
                    ? `Update terakhir: ${selectedGreenhouse.lastUpdate}`
                    : "Pilih greenhouse untuk melihat detail monitoring"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GreenhouseDetailPanel
                  greenhouse={selectedGreenhouse}
                  onControl={handleControl}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="history" className="space-y-4">
          <HistoryTable greenhouses={greenhouses} onExport={handleExportData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
