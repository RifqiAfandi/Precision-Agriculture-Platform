import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { MapPin, Loader2 } from "lucide-react";
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
import api from "@/services/api";
import { toast } from "sonner";

export function AgriinoDashboard() {
  const [activeTab, setActiveTab] = useState("monitoring");
  const [selectedPlantId, setSelectedPlantId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPlants: 0,
    avgChlorophyll: '0',
    avgNitrogen: '0',
    needsAttention: 0,
  });
  const [plants, setPlants] = useState([]);
  const [devices, setDevices] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState(null);

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Update selected plant when plants or selectedPlantId changes
  useEffect(() => {
    if (selectedPlantId && plants.length > 0) {
      const plant = plants.find(p => p.id === selectedPlantId);
      if (plant) {
        fetchPlantDetails(selectedPlantId);
      }
    } else {
      setSelectedPlant(null);
    }
  }, [selectedPlantId, plants]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch stats and plants in parallel
      const [statsData, plantsData, devicesData] = await Promise.all([
        api.getAgriinoStats().catch(() => ({
          total_plants: 0,
          avg_chlorophyll: 0,
          avg_nitrogen: 0,
          needs_attention: 0,
        })),
        api.getPlants().catch(() => []),
        api.getDevices().catch(() => [])
      ]);

      setStats({
        totalPlants: statsData.total_plants || 0,
        avgChlorophyll: statsData.avg_chlorophyll || '0',
        avgNitrogen: statsData.avg_nitrogen || '0',
        needsAttention: statsData.needs_attention || 0,
      });

      setPlants(Array.isArray(plantsData) ? plantsData : []);
      setDevices(Array.isArray(devicesData) ? devicesData : []);

      // Auto-select first plant if none selected
      if (!selectedPlantId && plantsData.length > 0) {
        setSelectedPlantId(plantsData[0].id);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Gagal memuat data dashboard: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const fetchPlantDetails = async (plantId) => {
    try {
      const plantData = await api.getPlant(plantId);
      setSelectedPlant(plantData);
    } catch (error) {
      console.error('Error fetching plant details:', error);
      toast.error('Gagal memuat detail tanaman');
    }
  };

  const handleAddPlant = async (formData) => {
    try {
      // Get first device or show error
      if (devices.length === 0) {
        toast.error('Anda belum memiliki device. Silakan tambahkan device terlebih dahulu.');
        return;
      }

      const plantData = {
        device: devices[0].id, // Use first device
        name: formData.name,
        description: formData.description || '',
        location: formData.location,
        // Add coordinates if available from GPS
        latitude: null,
        longitude: null,
      };

      await api.createPlant(plantData);
      toast.success('Tanaman berhasil ditambahkan');
      
      // Refresh data
      await fetchDashboardData();
      
      // Switch to monitoring tab
      setActiveTab("monitoring");
    } catch (error) {
      console.error('Error adding plant:', error);
      toast.error('Gagal menambahkan tanaman');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

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
