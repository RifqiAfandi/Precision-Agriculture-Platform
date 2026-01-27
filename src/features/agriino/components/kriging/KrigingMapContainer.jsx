/**
 * KrigingMapContainer Component
 * 
 * Main container component for Kriging map visualization.
 * Refactored from the original KrigingMap.jsx (1588 lines) into smaller components.
 * 
 * Original file: 1588 lines
 * This file: ~200 lines (composition of extracted components)
 */

import React from 'react';
import PropTypes from 'prop-types';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import {
  MapPin,
  Play,
  Loader2,
  RefreshCw,
  Square,
  Trash2,
} from 'lucide-react';

// Import extracted components
import { DeviceDetailsPanel, AnalysisResultsPanel } from './panels';
import { MapLegend } from './MapLegend';
import { DeviceListCard } from './DeviceListCard';
import { useKrigingMap } from './hooks/useKrigingMap';

/**
 * Drawing Instructions Banner
 */
function DrawingInstructions({ isDrawing, selectedArea }) {
  if (!isDrawing) return null;

  return (
    <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-lg p-3 text-sm text-orange-700 dark:text-orange-400">
      <p className="font-medium">Mode Pemilihan Area Aktif</p>
      <p>Klik pada peta untuk menambahkan titik sudut area. Minimal 3 titik untuk membentuk area.</p>
      {selectedArea && <p className="mt-1">Sudut terbentuk: {selectedArea.length} titik</p>}
    </div>
  );
}

DrawingInstructions.propTypes = {
  isDrawing: PropTypes.bool,
  selectedArea: PropTypes.array,
};

/**
 * Header Controls Component
 */
function HeaderControls({
  isDrawing,
  selectedArea,
  isLoading,
  isAnalyzing,
  devicesCount,
  onToggleDrawing,
  onClearPolygon,
  onRefresh,
  onAnalysis,
}) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant={isDrawing ? 'default' : 'outline'}
        size="sm"
        onClick={onToggleDrawing}
        className={isDrawing ? 'bg-orange-500 hover:bg-orange-600' : ''}
      >
        <Square className="w-4 h-4 mr-1" />
        {isDrawing ? 'Selesai Gambar' : 'Pilih Area'}
      </Button>
      {selectedArea && (
        <Button variant="outline" size="sm" onClick={onClearPolygon}>
          <Trash2 className="w-4 h-4 mr-1" />
          Hapus Area
        </Button>
      )}
      <Button variant="outline" size="sm" onClick={onRefresh} disabled={isLoading}>
        <RefreshCw className={`w-4 h-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
        Refresh
      </Button>
      <Button
        size="sm"
        onClick={onAnalysis}
        disabled={isAnalyzing || devicesCount < 1}
        className="bg-green-600 hover:bg-green-700"
      >
        {isAnalyzing ? (
          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
        ) : (
          <Play className="w-4 h-4 mr-1" />
        )}
        Mulai Analisis
      </Button>
    </div>
  );
}

HeaderControls.propTypes = {
  isDrawing: PropTypes.bool,
  selectedArea: PropTypes.array,
  isLoading: PropTypes.bool,
  isAnalyzing: PropTypes.bool,
  devicesCount: PropTypes.number,
  onToggleDrawing: PropTypes.func,
  onClearPolygon: PropTypes.func,
  onRefresh: PropTypes.func,
  onAnalysis: PropTypes.func,
};

/**
 * Main KrigingMapContainer Component
 */
export function KrigingMapContainer({ areaId, areaName, devices: propDevices, onRefresh }) {
  const {
    // Refs
    mapContainer,
    
    // State
    devices,
    selectedDevice,
    isLoading,
    isAnalyzing,
    analysisResult,
    showGrid,
    activeTab,
    isDrawing,
    selectedArea,
    
    // Setters
    setSelectedDevice,
    setActiveTab,
    
    // Handlers
    handleRefresh,
    handleToggleDrawing,
    handleClearPolygon,
    handleAnalysis,
    handleToggleGrid,
  } = useKrigingMap({ areaId, areaName, propDevices, onRefresh });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <MapPin className="w-5 h-5 text-green-600 dark:text-green-400" />
            Peta Analisis Kriging
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {devices.length} device terdeteksi | MapTiler Satellite
          </p>
        </div>
        <HeaderControls
          isDrawing={isDrawing}
          selectedArea={selectedArea}
          isLoading={isLoading}
          isAnalyzing={isAnalyzing}
          devicesCount={devices.length}
          onToggleDrawing={handleToggleDrawing}
          onClearPolygon={handleClearPolygon}
          onRefresh={handleRefresh}
          onAnalysis={handleAnalysis}
        />
      </div>

      {/* Drawing Instructions */}
      <DrawingInstructions isDrawing={isDrawing} selectedArea={selectedArea} />

      {/* Map and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Map */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Peta Lokasi Device</CardTitle>
              <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={showGrid}
                  onChange={handleToggleGrid}
                  className="rounded border-gray-300 dark:border-slate-600"
                />
                Tampilkan Grid Kriging
              </label>
            </div>
            <CardDescription>Klik marker untuk melihat detail device</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              ref={mapContainer}
              className="w-full h-96 rounded-lg border-2 border-gray-200 dark:border-slate-700"
              style={{ minHeight: '400px' }}
            />
            <MapLegend className="mt-3" />
          </CardContent>
        </Card>

        {/* Details Panel */}
        <Card>
          <CardHeader className="pb-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="devices">Device</TabsTrigger>
                <TabsTrigger value="analysis">Hasil</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            {activeTab === 'devices' ? (
              <DeviceDetailsPanel device={selectedDevice} />
            ) : (
              <AnalysisResultsPanel analysisResult={analysisResult} isAnalyzing={isAnalyzing} />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Device List */}
      <DeviceListCard
        devices={devices}
        selectedDevice={selectedDevice}
        onDeviceSelect={setSelectedDevice}
      />
    </div>
  );
}

KrigingMapContainer.propTypes = {
  areaId: PropTypes.number,
  areaName: PropTypes.string,
  devices: PropTypes.array,
  onRefresh: PropTypes.func,
};

export default KrigingMapContainer;
