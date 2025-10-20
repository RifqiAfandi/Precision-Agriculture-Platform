import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/Tabs";
import { MapPin } from "lucide-react";

// Data imports
import { plants, getAgriinoStats, getPlantById } from "./data/agriinoData";

// Component imports
import { StatCard } from "../../components/common/StatCard";
import { PlantCard } from "./components/PlantCard";
import { PlantDetailPanel } from "./components/PlantDetailPanel";
import { AddPlantForm } from "./components/AddPlantForm";
import { HistoryTable } from "./components/HistoryTable";

// Icons
import {
  Leaf,
  BarChart3,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

/**
 * AgriinoDashboard - Main dashboard for plant monitoring (Chlorophyll & Nitrogen)
 * 
 * Features:
 * - Plant registration and management
 * - Real-time chlorophyll and nitrogen monitoring
 * - AI-powered fertilization recommendations
 * - Historical data visualization
 * - CSV export functionality
 * 
 * @component
 */
export function AgriinoDashboard() {
  const [activeTab, setActiveTab] = useState("monitoring");
  const [selectedPlantId, setSelectedPlantId] = useState(null);

  const stats = getAgriinoStats();
  const selectedPlant = getPlantById(selectedPlantId);

  /**
   * Handle new plant submission
   * @param {Object} plantData - New plant data from form
   */
  const handleAddPlant = (plantData) => {
    console.log("Adding plant:", plantData);
    // In production, this would call API to save plant
    // Then update local state and switch to monitoring tab
    setActiveTab("monitoring");
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid md:grid-cols-4 gap-4">
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

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="add">Tambah Tanaman</TabsTrigger>
          <TabsTrigger value="monitoring">Peta Monitoring</TabsTrigger>
          <TabsTrigger value="history">Riwayat Data</TabsTrigger>
        </TabsList>

        {/* Tab: Add Plant */}
        <TabsContent value="add">
          <AddPlantForm onSubmit={handleAddPlant} />
        </TabsContent>

        {/* Tab: Monitoring Map */}
        <TabsContent value="monitoring" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Plant List */}
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
                  <PlantCard
                    key={plant.id}
                    plant={plant}
                    isSelected={selectedPlantId === plant.id}
                    onClick={() => setSelectedPlantId(plant.id)}
                  />
                ))}
              </CardContent>
            </Card>

            {/* Monitoring Detail */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Detail Monitoring</CardTitle>
                <CardDescription>
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

        {/* Tab: Data History */}
        <TabsContent value="history">
          <HistoryTable plants={plants} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
