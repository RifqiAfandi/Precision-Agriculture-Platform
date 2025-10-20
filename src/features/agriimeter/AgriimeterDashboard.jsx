import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/Tabs";
import { TreePine, Ruler, Activity, Target } from "lucide-react";
import { toast } from "sonner";

// Feature components
import { TreeCard } from "./components/TreeCard";
import { TreeDetailPanel } from "./components/TreeDetailPanel";
import { AddTreeForm } from "./components/AddTreeForm";
import { DBHHistoryTable } from "./components/DBHHistoryTable";

// Shared components
import { StatCard } from "../../../components/common/StatCard";

// Data & utilities
import { trees, getTreeStatistics } from "./data/agriimeterData";

/**
 * AgriimeterDashboard - Main orchestrator component
 * Manages state and coordinates between sub-components
 * 
 * Refactored from 750 lines to ~150 lines by extracting:
 * - Data to data/agriimeterData.js
 * - Utilities to utils/agriimeterHelpers.js
 * - Sub-components to components/ folder
 * - Shared StatCard to components/common/
 */
export function AgriimeterDashboard() {
  const [activeTab, setActiveTab] = useState("monitoring");
  const [selectedTree, setSelectedTree] = useState(null);

  // Get statistics from data
  const stats = getTreeStatistics(trees);

  // Handler untuk menambah pohon baru
  const handleAddTree = (treeData) => {
    // TODO: Implement API call to add tree
    console.log("Adding tree:", treeData);
    // Note: In production, this would add to state/database
  };

  // Handler untuk simulasi pengukuran DBH
  const handleMeasureDBH = (treeId) => {
    toast.success("Pengukuran DBH berhasil disimpan!");
    // TODO: Implement measurement logic
  };

  // Handler untuk export data
  const handleExportData = () => {
    toast.success("Data sedang diproses untuk download");
    // TODO: Implement export logic
  };

  // Get selected tree object
  const selectedTreeData = trees.find((t) => t.id === selectedTree);

  return (
    <div className="space-y-6">
      {/* Header Statistics */}
      <div className="grid md:grid-cols-4 gap-4">
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

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="add">Tambah Pohon</TabsTrigger>
          <TabsTrigger value="monitoring">Peta Monitoring</TabsTrigger>
          <TabsTrigger value="history">Riwayat DBH</TabsTrigger>
        </TabsList>

        {/* Tab 1: Add Tree Form */}
        <TabsContent value="add" className="space-y-4">
          <AddTreeForm onSubmit={handleAddTree} />
        </TabsContent>

        {/* Tab 2: Monitoring Map */}
        <TabsContent value="monitoring" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Tree List */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TreePine className="w-5 h-5 text-green-600" />
                  <span>Lokasi Pohon</span>
                </CardTitle>
                <CardDescription>
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

            {/* Monitoring Detail */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Detail Pertumbuhan DBH</CardTitle>
                <CardDescription>
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

        {/* Tab 3: DBH History */}
        <TabsContent value="history" className="space-y-4">
          <DBHHistoryTable trees={trees} onExport={handleExportData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
