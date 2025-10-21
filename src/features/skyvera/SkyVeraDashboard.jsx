import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Cloud, Thermometer, Droplets, Eye, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { weatherStations, getWeatherStats } from "./data/skyveraData";
import { StatCard } from "@/components/common/StatCard";
import { StationCard } from "./components/StationCard";
import { StationDetailPanel } from "./components/StationDetailPanel";
import { AddStationForm } from "./components/AddStationForm";
import { WeatherHistoryTable } from "./components/WeatherHistoryTable";

const SkyVeraDashboard = () => {
  const [activeTab, setActiveTab] = useState("monitoring");
  const [selectedStationId, setSelectedStationId] = useState(null);

  const stats = getWeatherStats();
  const selectedStation = weatherStations.find((ws) => ws.id === selectedStationId);

  const handleAddStation = () => {
    toast.success("Weather station berhasil ditambahkan!");
    setActiveTab("monitoring");
  };

  const handleExport = (stationId) => {
    const station = weatherStations.find((ws) => ws.id === stationId);
    toast.success(`Mengekspor data dari ${station?.name || "station"}`);
  };

  const handleExportAll = () => {
    toast.success("Data sedang diproses untuk download");
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-4 gap-4">
        <StatCard
          icon={Cloud}
          iconColor="bg-blue-100 text-blue-600"
          label="Total Station"
          value={stats.totalStations}
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
          iconColor="bg-teal-100 text-teal-600"
          label="Rata-rata Kelembaban"
          value={stats.avgHumidity}
          unit="%"
        />
        <StatCard
          icon={Eye}
          iconColor="bg-purple-100 text-purple-600"
          label="Rata-rata AQI"
          value={stats.avgAQI}
        />
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="add">Tambah Station</TabsTrigger>
          <TabsTrigger value="monitoring">Peta Monitoring</TabsTrigger>
          <TabsTrigger value="history">Riwayat Data</TabsTrigger>
        </TabsList>
        <TabsContent value="add" className="space-y-4">
          <AddStationForm onSubmit={handleAddStation} />
        </TabsContent>
        <TabsContent value="monitoring" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Cloud className="w-5 h-5 text-blue-600" />
                  <span>Lokasi Weather Station</span>
                </CardTitle>
                <CardDescription>
                  Klik untuk melihat detail monitoring cuaca
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {weatherStations.map((station) => (
                  <StationCard
                    key={station.id}
                    station={station}
                    isSelected={selectedStationId === station.id}
                    onClick={() => setSelectedStationId(station.id)}
                  />
                ))}
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Detail Monitoring</CardTitle>
                <CardDescription>
                  {selectedStation
                    ? `Update terakhir: ${selectedStation.lastUpdate}`
                    : "Pilih weather station untuk melihat detail monitoring"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <StationDetailPanel
                  station={selectedStation}
                  onExport={handleExport}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="history" className="space-y-4">
          <WeatherHistoryTable stations={weatherStations} onExport={handleExportAll} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SkyVeraDashboard;
