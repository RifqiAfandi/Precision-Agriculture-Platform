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
  Square,
  Trash2,
  X,
} from 'lucide-react';

// Import extracted components
import { DeviceDetailsPanel, AnalysisResultsPanel } from './panels';
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
  hasAnalysis,
  hasSelectedArea,
  isDrawing,
  isAnalyzing,
  onToggleDrawing,
  onCancelDrawing,
  onClearPolygon,
  onAnalysis,
}) {
  const isProcessing = isAnalyzing;
  let label = 'Pilih Area';
  let Icon = Square;
  let onClick = onToggleDrawing;
  let variant = 'outline';
  let className = '';

  if (hasAnalysis) {
    label = 'Hapus Area';
    Icon = Trash2;
    onClick = onClearPolygon;
    variant = 'outline';
  } else if (isDrawing) {
    label = 'Selesai Memilih Area';
    Icon = Square;
    onClick = onToggleDrawing;
    variant = 'default';
    className = 'bg-orange-500 hover:bg-orange-600';
  } else if (hasSelectedArea) {
    label = 'Mulai Analisis';
    Icon = Play;
    onClick = onAnalysis;
    variant = 'default';
    className = 'bg-green-600 hover:bg-green-700';
  }

  return (
    <div className="flex items-center gap-2">
      {isDrawing && (
        <Button
          variant="outline"
          size="sm"
          onClick={onCancelDrawing}
          disabled={isProcessing}
        >
          <X className="w-4 h-4 mr-1" />
          Batal
        </Button>
      )}
      <Button
        variant={variant}
        size="sm"
        onClick={onClick}
        disabled={isProcessing}
        className={className}
      >
        {isProcessing ? (
          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
        ) : (
          <Icon className="w-4 h-4 mr-1" />
        )}
        {isProcessing ? 'Memproses...' : label}
      </Button>
    </div>
  );
}

HeaderControls.propTypes = {
  hasAnalysis: PropTypes.bool,
  hasSelectedArea: PropTypes.bool,
  isDrawing: PropTypes.bool,
  isAnalyzing: PropTypes.bool,
  onToggleDrawing: PropTypes.func,
  onCancelDrawing: PropTypes.func,
  onClearPolygon: PropTypes.func,
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
    isAnalyzing,
    analysisResult,
    showGrid,
    activeTab,
    isDrawing,
    selectedArea,
    
    // Setters
    setActiveTab,
    
    // Handlers
    handleToggleDrawing,
    handleCancelDrawing,
    handleClearPolygon,
    handleAnalysis,
    handleToggleGrid,
  } = useKrigingMap({ areaId, areaName, propDevices, onRefresh });
  const hasAnalysis = !!analysisResult;
  const hasSelectedArea = Array.isArray(selectedArea) && selectedArea.length >= 3;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pt-5">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <MapPin className="w-5 h-5 text-green-600 dark:text-green-400" />
            Peta Analisis Kriging
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {devices.length} device terdeteksi
          </p>
        </div>
        <HeaderControls
          hasAnalysis={hasAnalysis}
          hasSelectedArea={hasSelectedArea}
          isDrawing={isDrawing}
          isAnalyzing={isAnalyzing}
          onToggleDrawing={handleToggleDrawing}
          onCancelDrawing={handleCancelDrawing}
          onClearPolygon={handleClearPolygon}
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
