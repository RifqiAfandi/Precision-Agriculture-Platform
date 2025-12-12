import React, { useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { 
  MapPin, 
  Play, 
  Loader2, 
  RefreshCw, 
  Target,
  Layers,
  Info,
  CheckCircle,
  AlertTriangle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import { toast } from 'sonner';
import api from '@/services/api';
import firebaseService from '@/services/firebase';

// Nitrogen classification thresholds
const DEFAULT_THRESHOLDS = {
  low: 1.5,
  high: 2.5,
};

// Map marker colors
const MARKER_COLORS = {
  low: { fill: '#ef4444', border: '#dc2626', bg: 'bg-red-500', text: 'text-red-500' },
  normal: { fill: '#3b82f6', border: '#2563eb', bg: 'bg-blue-500', text: 'text-blue-500' },
  high: { fill: '#22c55e', border: '#16a34a', bg: 'bg-green-500', text: 'text-green-500' },
  unknown: { fill: '#6b7280', border: '#4b5563', bg: 'bg-gray-500', text: 'text-gray-500' },
};

/**
 * Classify nitrogen level
 */
const classifyNitrogen = (value, thresholds = DEFAULT_THRESHOLDS) => {
  if (value === undefined || value === null) return 'unknown';
  if (value < thresholds.low) return 'low';
  if (value > thresholds.high) return 'high';
  return 'normal';
};

/**
 * Get classification label in Indonesian
 */
const getClassificationLabel = (classification) => {
  switch (classification) {
    case 'low': return 'Rendah';
    case 'high': return 'Tinggi';
    case 'normal': return 'Normal';
    default: return 'Unknown';
  }
};

/**
 * DeviceMarker Component - Represents a device on the map
 */
const DeviceMarker = ({ device, isSelected, onClick }) => {
  const classification = classifyNitrogen(device.nitrogen);
  const colors = MARKER_COLORS[classification];

  return (
    <div
      className={`
        relative cursor-pointer transition-all duration-200
        ${isSelected ? 'z-10 scale-125' : 'hover:scale-110'}
      `}
      onClick={() => onClick(device)}
      title={`${device.device_id}: Nitrogen ${device.nitrogen?.toFixed(3) || 'N/A'}`}
    >
      <div
        className={`
          w-8 h-8 rounded-full flex items-center justify-center
          border-2 shadow-lg
          ${colors.bg} border-white
        `}
      >
        <MapPin className="w-4 h-4 text-white" />
      </div>
      {isSelected && (
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 translate-y-full">
          <div className="bg-white rounded-md shadow-lg p-2 text-xs whitespace-nowrap">
            <p className="font-medium">{device.device_id}</p>
            <p className={colors.text}>N: {device.nitrogen?.toFixed(3) || 'N/A'}</p>
          </div>
        </div>
      )}
    </div>
  );
};

DeviceMarker.propTypes = {
  device: PropTypes.object.isRequired,
  isSelected: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};

/**
 * Simple Map Component using absolute positioning
 * In production, replace with Google Maps or Leaflet
 */
const SimpleMap = ({ 
  devices, 
  gridPoints, 
  selectedDevice, 
  onDeviceClick,
  bounds,
  showGrid 
}) => {
  const mapRef = useRef(null);
  
  // Calculate device position on map
  const getDevicePosition = (device) => {
    if (!bounds || !device.lat || !device.lng) return { left: '50%', top: '50%' };
    
    const latRange = bounds.max_lat - bounds.min_lat || 0.01;
    const lngRange = bounds.max_lng - bounds.min_lng || 0.01;
    
    const left = ((device.lng - bounds.min_lng) / lngRange) * 100;
    const top = (1 - (device.lat - bounds.min_lat) / latRange) * 100;
    
    return {
      left: `${Math.max(5, Math.min(95, left))}%`,
      top: `${Math.max(5, Math.min(95, top))}%`,
    };
  };

  return (
    <div 
      ref={mapRef}
      className="relative w-full h-96 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border-2 border-gray-200 overflow-hidden"
    >
      {/* Grid overlay for Kriging results */}
      {showGrid && gridPoints.length > 0 && (
        <div className="absolute inset-0 opacity-50">
          {gridPoints.map((point, idx) => {
            const pos = getDevicePosition({ lat: point.latitude, lng: point.longitude });
            const colors = MARKER_COLORS[point.classification];
            return (
              <div
                key={idx}
                className="absolute w-3 h-3 rounded-sm transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: pos.left,
                  top: pos.top,
                  backgroundColor: colors.fill,
                  opacity: 0.6,
                }}
              />
            );
          })}
        </div>
      )}
      
      {/* Device markers */}
      {devices.map((device) => {
        const pos = getDevicePosition(device);
        return (
          <div
            key={device.device_id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: pos.left, top: pos.top }}
          >
            <DeviceMarker
              device={device}
              isSelected={selectedDevice?.device_id === device.device_id}
              onClick={onDeviceClick}
            />
          </div>
        );
      })}
      
      {/* Map legend */}
      <div className="absolute bottom-2 right-2 bg-white/90 rounded-md p-2 text-xs shadow-md">
        <div className="flex items-center gap-1 mb-1">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span>Rendah (&lt;{DEFAULT_THRESHOLDS.low})</span>
        </div>
        <div className="flex items-center gap-1 mb-1">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span>Normal</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span>Tinggi (&gt;{DEFAULT_THRESHOLDS.high})</span>
        </div>
      </div>
      
      {/* No devices message */}
      {devices.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Tidak ada device yang ditemukan</p>
            <p className="text-sm">Sambungkan ke Firebase untuk melihat data</p>
          </div>
        </div>
      )}
    </div>
  );
};

SimpleMap.propTypes = {
  devices: PropTypes.array.isRequired,
  gridPoints: PropTypes.array,
  selectedDevice: PropTypes.object,
  onDeviceClick: PropTypes.func.isRequired,
  bounds: PropTypes.object,
  showGrid: PropTypes.bool,
};

/**
 * Device Details Panel
 */
const DeviceDetailsPanel = ({ device }) => {
  if (!device) {
    return (
      <div className="text-center text-gray-500 py-8">
        <Info className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p>Pilih device untuk melihat detail</p>
      </div>
    );
  }

  const classification = classifyNitrogen(device.nitrogen);
  const colors = MARKER_COLORS[classification];
  
  const StatusIcon = classification === 'low' 
    ? XCircle 
    : classification === 'high' 
      ? CheckCircle 
      : AlertTriangle;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold">{device.device_id}</h4>
          <p className="text-sm text-gray-500">
            {device.lat?.toFixed(6)}, {device.lng?.toFixed(6)}
          </p>
        </div>
        <Badge className={`${colors.bg} text-white`}>
          {getClassificationLabel(classification)}
        </Badge>
      </div>

      {/* Main metrics */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
            <Target className="w-4 h-4" />
            <span>Nitrogen</span>
          </div>
          <p className={`text-xl font-bold ${colors.text}`}>
            {device.nitrogen?.toFixed(4) || 'N/A'}
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
            <Layers className="w-4 h-4" />
            <span>SPAD</span>
          </div>
          <p className="text-xl font-bold text-purple-600">
            {device.spad?.toFixed(2) || 'N/A'}
          </p>
        </div>
      </div>

      {/* RGB Values */}
      <div className="bg-gray-50 rounded-lg p-3">
        <p className="text-sm text-gray-500 mb-2">RGB Values</p>
        <div className="grid grid-cols-3 gap-2 text-center text-sm">
          <div>
            <p className="font-medium text-red-500">R</p>
            <p>{device.R?.toFixed(1) || 'N/A'}</p>
          </div>
          <div>
            <p className="font-medium text-green-500">G</p>
            <p>{device.G?.toFixed(1) || 'N/A'}</p>
          </div>
          <div>
            <p className="font-medium text-blue-500">B</p>
            <p>{device.B?.toFixed(1) || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Classification Info */}
      <div className="flex items-center gap-2 text-sm">
        <StatusIcon className={`w-4 h-4 ${colors.text}`} />
        <span>
          Klasifikasi EQ1: <strong>{device.class_eq1 || 'N/A'}</strong>
        </span>
      </div>
      
      {/* Timestamp */}
      {device.timestamp && (
        <p className="text-xs text-gray-400">
          Update: {new Date(device.timestamp).toLocaleString('id-ID')}
        </p>
      )}
    </div>
  );
};

DeviceDetailsPanel.propTypes = {
  device: PropTypes.object,
};

/**
 * Analysis Results Panel
 */
const AnalysisResultsPanel = ({ analysisResult, isAnalyzing }) => {
  if (isAnalyzing) {
    return (
      <div className="text-center py-8">
        <Loader2 className="w-8 h-8 mx-auto mb-2 animate-spin text-blue-500" />
        <p className="text-gray-500">Sedang melakukan analisis Kriging...</p>
      </div>
    );
  }

  if (!analysisResult) {
    return (
      <div className="text-center text-gray-500 py-8">
        <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p>Klik "Mulai Analisis" untuk menjalankan interpolasi Kriging</p>
      </div>
    );
  }

  const { statistics, thresholds, variogram_params } = analysisResult;

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-blue-50 rounded-lg p-3">
          <p className="text-sm text-blue-600 mb-1">Rata-rata Nitrogen</p>
          <p className="text-xl font-bold">{statistics.mean_value?.toFixed(4)}</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-3">
          <p className="text-sm text-purple-600 mb-1">Std Deviasi</p>
          <p className="text-xl font-bold">{statistics.std_value?.toFixed(4)}</p>
        </div>
      </div>

      {/* Min/Max */}
      <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
        <div className="flex items-center gap-2">
          <TrendingDown className="w-4 h-4 text-red-500" />
          <span className="text-sm">Min: {statistics.min_value?.toFixed(4)}</span>
        </div>
        <Minus className="w-4 h-4 text-gray-400" />
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-green-500" />
          <span className="text-sm">Max: {statistics.max_value?.toFixed(4)}</span>
        </div>
      </div>

      {/* Classification counts */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Distribusi Klasifikasi</p>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-red-50 rounded-lg p-2 text-center">
            <p className="text-2xl font-bold text-red-600">{statistics.low_count}</p>
            <p className="text-xs text-red-500">Rendah</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-2 text-center">
            <p className="text-2xl font-bold text-blue-600">{statistics.normal_count}</p>
            <p className="text-xs text-blue-500">Normal</p>
          </div>
          <div className="bg-green-50 rounded-lg p-2 text-center">
            <p className="text-2xl font-bold text-green-600">{statistics.high_count}</p>
            <p className="text-xs text-green-500">Tinggi</p>
          </div>
        </div>
      </div>

      {/* Variogram Info */}
      <div className="bg-gray-50 rounded-lg p-3 text-sm">
        <p className="font-medium text-gray-700 mb-2">Parameter Variogram</p>
        <div className="grid grid-cols-2 gap-2 text-gray-600">
          <p>Model: <strong>{variogram_params.model}</strong></p>
          <p>Range: <strong>{variogram_params.range?.toFixed(4)}</strong></p>
          <p>Nugget: <strong>{variogram_params.nugget?.toFixed(4)}</strong></p>
          <p>Sill: <strong>{variogram_params.sill?.toFixed(4)}</strong></p>
        </div>
      </div>

      {/* Thresholds */}
      <div className="text-xs text-gray-400">
        Threshold: Rendah &lt; {thresholds.low} | Tinggi &gt; {thresholds.high}
      </div>
    </div>
  );
};

AnalysisResultsPanel.propTypes = {
  analysisResult: PropTypes.object,
  isAnalyzing: PropTypes.bool,
};

/**
 * Main KrigingMap Component
 * Integrates Firebase data, Google Maps markers, and Kriging analysis
 */
export function KrigingMap({ areaId, areaName }) {
  // State
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showGrid, setShowGrid] = useState(true);
  const [firebaseConnected, setFirebaseConnected] = useState(false);
  const [activeTab, setActiveTab] = useState('devices');

  // Calculate bounds from devices
  const bounds = React.useMemo(() => {
    if (devices.length === 0) return null;
    
    const lats = devices.map(d => d.lat).filter(Boolean);
    const lngs = devices.map(d => d.lng).filter(Boolean);
    
    if (lats.length === 0 || lngs.length === 0) return null;
    
    const padding = 0.001;
    return {
      min_lat: Math.min(...lats) - padding,
      max_lat: Math.max(...lats) + padding,
      min_lng: Math.min(...lngs) - padding,
      max_lng: Math.max(...lngs) + padding,
    };
  }, [devices]);

  // Initialize Firebase and subscribe to updates
  useEffect(() => {
    let unsubscribe = null;

    const initFirebase = async () => {
      try {
        setIsLoading(true);
        await firebaseService.initialize();
        
        unsubscribe = firebaseService.subscribeToDevices('devices', (data) => {
          setDevices(data);
          setFirebaseConnected(true);
        });
      } catch (error) {
        console.error('Firebase initialization error:', error);
        toast.error('Gagal terhubung ke Firebase');
        // Load mock data for demo
        loadMockData();
      } finally {
        setIsLoading(false);
      }
    };

    initFirebase();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Load mock data for demo purposes
  const loadMockData = useCallback(() => {
    const mockDevices = [
      { device_id: 'DEV001', lat: -8.1653927, lng: 113.7176052, nitrogen: 2.11, spad: 24.83, R: 1569.4, G: 5980.8, B: 1236.8, class_eq1: 'RED' },
      { device_id: 'DEV002', lat: -8.1658, lng: 113.7180, nitrogen: 1.85, spad: 22.15, R: 1420.2, G: 5500.3, B: 1180.5, class_eq1: 'YELLOW' },
      { device_id: 'DEV003', lat: -8.1650, lng: 113.7170, nitrogen: 1.32, spad: 18.90, R: 1800.5, G: 4200.1, B: 1050.3, class_eq1: 'RED' },
      { device_id: 'DEV004', lat: -8.1660, lng: 113.7165, nitrogen: 2.78, spad: 28.45, R: 1200.8, G: 6500.2, B: 1350.7, class_eq1: 'GREEN' },
      { device_id: 'DEV005', lat: -8.1655, lng: 113.7185, nitrogen: 1.95, spad: 23.50, R: 1480.3, G: 5700.6, B: 1220.4, class_eq1: 'YELLOW' },
    ];
    setDevices(mockDevices);
  }, []);

  // Refresh data from Firebase
  const handleRefresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await firebaseService.getDevicesOnce('devices');
      setDevices(data);
      toast.success('Data berhasil diperbarui');
    } catch (error) {
      console.error('Refresh error:', error);
      toast.error('Gagal memperbarui data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Perform Kriging analysis
  const handleAnalysis = useCallback(async () => {
    if (devices.length < 1) {
      toast.error('Minimal 1 device diperlukan untuk analisis');
      return;
    }

    setIsAnalyzing(true);
    setActiveTab('analysis');

    try {
      // Prepare device data for backend
      const deviceData = devices.map(d => ({
        device_id: d.device_id,
        lat: d.lat,
        lng: d.lng,
        nitrogen: d.nitrogen,
        spad: d.spad,
        A_RGB: d.A_RGB,
        R: d.R,
        G: d.G,
        B: d.B,
        timestamp: d.timestamp,
      }));

      // Call backend Kriging API
      const result = await api.performKrigingAnalysis({
        device_data: deviceData,
        area_id: areaId,
        area_name: areaName,
        grid_resolution: 15,
        variogram_model: 'spherical',
        low_threshold: DEFAULT_THRESHOLDS.low,
        high_threshold: DEFAULT_THRESHOLDS.high,
        ...bounds,
      });

      if (result.success) {
        setAnalysisResult(result);
        toast.success('Analisis Kriging berhasil!');
      } else {
        throw new Error(result.message || 'Analisis gagal');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error(`Gagal melakukan analisis: ${error.message || 'Unknown error'}`);
      
      // Demo: Generate mock analysis result
      const mockResult = generateMockAnalysisResult(devices);
      setAnalysisResult(mockResult);
    } finally {
      setIsAnalyzing(false);
    }
  }, [devices, bounds, areaId, areaName]);

  // Generate mock analysis result for demo
  const generateMockAnalysisResult = (deviceList) => {
    const nitrogenValues = deviceList.map(d => d.nitrogen);
    const gridPoints = [];
    
    if (bounds) {
      const resolution = 10;
      for (let i = 0; i < resolution; i++) {
        for (let j = 0; j < resolution; j++) {
          const lat = bounds.min_lat + (i / resolution) * (bounds.max_lat - bounds.min_lat);
          const lng = bounds.min_lng + (j / resolution) * (bounds.max_lng - bounds.min_lng);
          const value = nitrogenValues[Math.floor(Math.random() * nitrogenValues.length)] + (Math.random() - 0.5) * 0.5;
          gridPoints.push({
            latitude: lat,
            longitude: lng,
            predicted_value: value,
            variance: 0.1,
            classification: classifyNitrogen(value),
          });
        }
      }
    }

    return {
      success: true,
      grid_points: gridPoints,
      input_points: deviceList.map(d => ({
        ...d,
        latitude: d.lat,
        longitude: d.lng,
        classification: classifyNitrogen(d.nitrogen),
      })),
      statistics: {
        min_value: Math.min(...nitrogenValues),
        max_value: Math.max(...nitrogenValues),
        mean_value: nitrogenValues.reduce((a, b) => a + b, 0) / nitrogenValues.length,
        std_value: 0.35,
        low_count: gridPoints.filter(p => p.classification === 'low').length,
        normal_count: gridPoints.filter(p => p.classification === 'normal').length,
        high_count: gridPoints.filter(p => p.classification === 'high').length,
        total_points: gridPoints.length,
      },
      variogram_params: {
        model: 'spherical',
        nugget: 0.05,
        sill: 0.25,
        range: 0.002,
      },
      thresholds: DEFAULT_THRESHOLDS,
      bounds,
    };
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <MapPin className="w-5 h-5 text-green-600" />
            Peta Analisis Kriging
          </h3>
          <p className="text-sm text-gray-500">
            {devices.length} device terdeteksi
            {firebaseConnected && <span className="text-green-500 ml-2">● Connected</span>}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={handleAnalysis}
            disabled={isAnalyzing || devices.length < 1}
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
      </div>

      {/* Map and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Map */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Peta Lokasi Device</CardTitle>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={showGrid}
                  onChange={(e) => setShowGrid(e.target.checked)}
                  className="rounded"
                />
                Tampilkan Grid
              </label>
            </div>
            <CardDescription>
              Klik marker untuk melihat detail device
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-96 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-green-600" />
              </div>
            ) : (
              <SimpleMap
                devices={devices}
                gridPoints={analysisResult?.grid_points || []}
                selectedDevice={selectedDevice}
                onDeviceClick={setSelectedDevice}
                bounds={bounds}
                showGrid={showGrid && analysisResult}
              />
            )}
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
              <AnalysisResultsPanel 
                analysisResult={analysisResult} 
                isAnalyzing={isAnalyzing}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Device List */}
      {devices.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Daftar Device</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              {devices.map((device) => {
                const classification = classifyNitrogen(device.nitrogen);
                const colors = MARKER_COLORS[classification];
                const isSelected = selectedDevice?.device_id === device.device_id;
                
                return (
                  <div
                    key={device.device_id}
                    className={`
                      p-2 rounded-lg border cursor-pointer transition-all
                      ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}
                    `}
                    onClick={() => setSelectedDevice(device)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium truncate">{device.device_id}</span>
                      <div className={`w-3 h-3 rounded-full ${colors.bg}`} />
                    </div>
                    <p className={`text-lg font-bold ${colors.text}`}>
                      {device.nitrogen?.toFixed(3) || 'N/A'}
                    </p>
                    <p className="text-xs text-gray-500">{getClassificationLabel(classification)}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

KrigingMap.propTypes = {
  areaId: PropTypes.number,
  areaName: PropTypes.string,
};

export default KrigingMap;
