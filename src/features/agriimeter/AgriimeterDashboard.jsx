import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { TreePine, Ruler, Activity, Target } from "lucide-react";
import { toast } from "sonner";
import { TreeCard } from "./components/TreeCard";
import { TreeDetailPanel } from "./components/TreeDetailPanel";
import { AddTreeForm } from "./components/AddTreeForm";
import { DBHHistoryTable } from "./components/DBHHistoryTable";
import { StatCard } from "@/components/common/StatCard";
import { trees, getTreeStatistics } from "./data/agriimeterData";

export function AgriimeterDashboard() {
  const [activeTab, setActiveTab] = useState("monitoring");
  const [selectedTree, setSelectedTree] = useState(null);

  const stats = getTreeStatistics(trees);

  const handleAddTree = () => {
    toast.success("Pohon berhasil ditambahkan!");
  };

  const handleMeasureDBH = () => {
    toast.success("Pengukuran DBH berhasil disimpan!");
  };

  const handleExportData = () => {
    toast.success("Data sedang diproses untuk download");
  };

  const selectedTreeData = trees.find((t) => t.id === selectedTree);

  return (
    <div className="space-y-3 sm:space-y-4 md:space-y-6 p-2 sm:p-4 md:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
        <StatCard
          icon={TreePine}
          iconColor="bg-green-100 text-green-600"
          label="Total Pohon"
          value={stats.totalTrees}
        />
        <StatCard
          icon={Ruler}
          iconColor="bg-blue-100 text-blue-600"
          label="Rata-rata DBH"
          value={stats.avgDBH}
          unit="cm"
        />
        <StatCard
          icon={Activity}
          iconColor="bg-purple-100 text-purple-600"
          label="Pertumbuhan Aktif"
          value={stats.activeGrowth}
        />
        <StatCard
          icon={Target}
          iconColor="bg-orange-100 text-orange-600"
          label="Volume Biomassa"
          value={stats.totalVolume}
          unit="m³"
        />
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="add">Tambah Pohon</TabsTrigger>
          <TabsTrigger value="monitoring">Peta Monitoring</TabsTrigger>
          <TabsTrigger value="history">Riwayat DBH</TabsTrigger>
        </TabsList>
        <TabsContent value="add" className="space-y-4">
          <AddTreeForm onSubmit={handleAddTree} />
        </TabsContent>
        <TabsContent value="monitoring" className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-base md:text-lg">
                  <TreePine className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
                  <span>Lokasi Pohon</span>
                </CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Klik untuk melihat detail pertumbuhan DBH
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {trees.map((tree) => (
                  <TreeCard
                    key={tree.id}
                    tree={tree}
                    isSelected={selectedTree === tree.id}
                    onClick={() => setSelectedTree(tree.id)}
                  />
                ))}
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-base md:text-lg">Detail Pertumbuhan DBH</CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  {selectedTreeData
                    ? `Pengukuran terakhir: ${selectedTreeData.lastMeasurement}`
                    : "Pilih pohon untuk melihat detail pertumbuhan"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TreeDetailPanel
                  tree={selectedTreeData}
                  onMeasure={handleMeasureDBH}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="history" className="space-y-4">
          <DBHHistoryTable trees={trees} onExport={handleExportData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
