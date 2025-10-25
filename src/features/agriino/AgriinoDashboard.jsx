import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { MapPin } from "lucide-react";
import { plants, getAgriinoStats, getPlantById } from "./data/agriinoData";
import { StatCard } from "@/components/common/StatCard";
import { PlantCard } from "./components/PlantCard";
import { PlantDetailPanel } from "./components/PlantDetailPanel";
import { AddPlantForm } from "./components/AddPlantForm";
import { HistoryTable } from "./components/HistoryTable";
import {
  Leaf,
  BarChart3,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
export function AgriinoDashboard() {
  const [activeTab, setActiveTab] = useState("monitoring");
  const [selectedPlantId, setSelectedPlantId] = useState(null);

  const stats = getAgriinoStats();
  const selectedPlant = getPlantById(selectedPlantId);
  
  const handleAddPlant = () => {
    setActiveTab("monitoring");
  };

  return (
    <div className="space-y-3 sm:space-y-4 md:space-y-6 p-2 sm:p-4 md:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
        <StatCard
          icon={Leaf}
          iconColor="text-green-600"
          label="Total Tanaman"
          value={stats.totalPlants}
        />

        <StatCard
          icon={BarChart3}
          iconColor="text-blue-600"
          label="Rata-rata Klorofil"
          value={stats.avgChlorophyll}
        />

        <StatCard
          icon={TrendingUp}
          iconColor="text-purple-600"
          label="Nitrogen (mg/L)"
          value={stats.avgNitrogen}
        />

        <StatCard
          icon={AlertCircle}
          iconColor="text-orange-600"
          label="Perlu Perhatian"
          value={stats.needsAttention}
        />
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="add">Tambah Tanaman</TabsTrigger>
          <TabsTrigger value="monitoring">Peta Monitoring</TabsTrigger>
          <TabsTrigger value="history">Riwayat Data</TabsTrigger>
        </TabsList>
        <TabsContent value="add">
          <AddPlantForm onSubmit={handleAddPlant} />
        </TabsContent>
        <TabsContent value="monitoring" className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-base md:text-lg">
                  <MapPin className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
                  <span>Lokasi Tanaman</span>
                </CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Klik untuk melihat detail monitoring
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {plants.map((plant) => (
                  <PlantCard
                    key={plant.id}
                    plant={plant}
                    isSelected={selectedPlantId === plant.id}
                    onClick={() => setSelectedPlantId(plant.id)}
                  />
                ))}
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-base md:text-lg">Detail Monitoring</CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  {selectedPlant
                    ? `Pengukuran terakhir: ${selectedPlant.lastMeasurement}`
                    : "Pilih tanaman untuk melihat detail"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PlantDetailPanel plant={selectedPlant} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="history">
          <HistoryTable plants={plants} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
