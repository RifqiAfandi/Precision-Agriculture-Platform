import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
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
  Minus,
  Square,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import api from '@/services/api';
import { realTimeDataStore, classifyNitrogen, getClassificationColor, NITROGEN_THRESHOLDS } from '@/services/dummyDataGenerator';
import * as turf from '@turf/turf';
import { contours } from 'd3-contour';

// MapTiler API Key
const MAPTILER_API_KEY = import.meta.env.VITE_MAPTILER_API_KEY || 'bedLj81C0j3GdguncpGN';

// Map marker colors based on nitrogen classification
// Deficient = Red (merah), Subnormal = Orange (oranye), Normal = Yellow (kuning), High = Green (hijau), No Data = Gray
const MARKER_COLORS = {
  deficient: { fill: '#E53935', border: '#C62828', label: 'Deficient' },
  subnormal: { fill: '#FB8C00', border: '#EF6C00', label: 'Subnormal' },
  normal: { fill: '#FDD835', border: '#F9A825', label: 'Normal' },
  high: { fill: '#43A047', border: '#2E7D32', label: 'High' },
  no_data: { fill: '#9ca3af', border: '#6b7280', label: 'No Data' },
  unknown: { fill: '#6b7280', border: '#4b5563', label: 'Unknown' },
};

// Default influence radius in kilometers (50 meters)
const DEFAULT_INFLUENCE_RADIUS_KM = 0.05;

/**
 * Get classification label in Indonesian
 */
const getClassificationLabel = (classification) => {
  const labels = {
    deficient: 'Defisien',
    subnormal: 'Subnormal',
    normal: 'Normal',
    high: 'Tinggi',
    unknown: 'Unknown',
  };
  return labels[classification] || 'Unknown';
};

/**
 * Device Details Panel
 */
const DeviceDetailsPanel = ({ device }) => {
  if (!device) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-8">
        <Info className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p>Pilih device untuk melihat detail</p>
      </div>
    );
  }

  const classification = classifyNitrogen(device.nitrogen);
  const colors = MARKER_COLORS[classification] || MARKER_COLORS.unknown;

  const StatusIcon =
    classification === 'deficient'
      ? XCircle
      : classification === 'high'
      ? CheckCircle
      : AlertTriangle;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-gray-100">{device.device_id}</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {device.lat?.toFixed(6)}, {device.lng?.toFixed(6)}
          </p>
        </div>
        <Badge style={{ backgroundColor: colors.fill, color: 'white' }}>
          {getClassificationLabel(classification)}
        </Badge>
      </div>

      {/* Main metrics */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-3">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mb-1">
            <Target className="w-4 h-4" />
            <span>Nitrogen</span>
          </div>
          <p className="text-xl font-bold" style={{ color: colors.fill }}>
            {device.nitrogen?.toFixed(4) || 'N/A'}
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-3">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mb-1">
            <Layers className="w-4 h-4" />
            <span>SPAD</span>
          </div>
          <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
            {device.spad?.toFixed(2) || 'N/A'}
          </p>
        </div>
      </div>

      {/* RGB Values */}
      <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-3">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">RGB Values</p>
        <div className="grid grid-cols-3 gap-2 text-center text-sm">
          <div>
            <p className="font-medium text-red-500">R</p>
            <p className="text-gray-900 dark:text-gray-100">{device.R?.toFixed(1) || 'N/A'}</p>
          </div>
          <div>
            <p className="font-medium text-green-500">G</p>
            <p className="text-gray-900 dark:text-gray-100">{device.G?.toFixed(1) || 'N/A'}</p>
          </div>
          <div>
            <p className="font-medium text-blue-500">B</p>
            <p className="text-gray-900 dark:text-gray-100">{device.B?.toFixed(1) || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Classification Info */}
      <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
        <StatusIcon className="w-4 h-4" style={{ color: colors.fill }} />
        <span>
          Klasifikasi EQ1: <strong>{device.class_eq1 || 'N/A'}</strong>
        </span>
      </div>

      {/* Timestamp */}
      {device.timestamp && (
        <p className="text-xs text-gray-400 dark:text-gray-500">
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
        <p className="text-gray-500 dark:text-gray-400">Sedang melakukan analisis Kriging...</p>
      </div>
    );
  }

  if (!analysisResult) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-8">
        <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p>Pilih area di peta dan klik "Mulai Analisis"</p>
        <p className="text-sm mt-2">untuk menjalankan interpolasi Kriging</p>
      </div>
    );
  }

  const { statistics, thresholds, variogram_params } = analysisResult;

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3">
          <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">Rata-rata Nitrogen</p>
          <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{statistics.mean_value?.toFixed(4)}</p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-3">
          <p className="text-sm text-purple-600 dark:text-purple-400 mb-1">Std Deviasi</p>
          <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{statistics.std_value?.toFixed(4)}</p>
        </div>
      </div>

      {/* Min/Max */}
      <div className="flex items-center justify-between bg-gray-50 dark:bg-slate-700 rounded-lg p-3">
        <div className="flex items-center gap-2">
          <TrendingDown className="w-4 h-4 text-red-500" />
          <span className="text-sm text-gray-700 dark:text-gray-300">Min: {statistics.min_value?.toFixed(4)}</span>
        </div>
        <Minus className="w-4 h-4 text-gray-400" />
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-green-500" />
          <span className="text-sm text-gray-700 dark:text-gray-300">Max: {statistics.max_value?.toFixed(4)}</span>
        </div>
      </div>

      {/* Classification counts */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Distribusi Klasifikasi</p>
        <div className="grid grid-cols-5 gap-1">
          <div className="rounded-lg p-2 text-center" style={{ backgroundColor: 'rgba(229, 57, 53, 0.2)' }}>
            <p className="text-lg font-bold" style={{ color: '#E53935' }}>{statistics.deficient_count || 0}</p>
            <p className="text-xs" style={{ color: '#E53935' }}>Defisien</p>
          </div>
          <div className="rounded-lg p-2 text-center" style={{ backgroundColor: 'rgba(251, 140, 0, 0.2)' }}>
            <p className="text-lg font-bold" style={{ color: '#FB8C00' }}>{statistics.subnormal_count || 0}</p>
            <p className="text-xs" style={{ color: '#FB8C00' }}>Subnormal</p>
          </div>
          <div className="rounded-lg p-2 text-center" style={{ backgroundColor: 'rgba(253, 216, 53, 0.2)' }}>
            <p className="text-lg font-bold" style={{ color: '#F9A825' }}>{statistics.normal_count || 0}</p>
            <p className="text-xs" style={{ color: '#F9A825' }}>Normal</p>
          </div>
          <div className="rounded-lg p-2 text-center" style={{ backgroundColor: 'rgba(67, 160, 71, 0.2)' }}>
            <p className="text-lg font-bold" style={{ color: '#43A047' }}>{statistics.high_count || 0}</p>
            <p className="text-xs" style={{ color: '#43A047' }}>Tinggi</p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-700/30 rounded-lg p-2 text-center">
            <p className="text-lg font-bold text-gray-500 dark:text-gray-400">{statistics.no_data_count || 0}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">No Data</p>
          </div>
        </div>
      </div>

      {/* Variogram Info */}
      {variogram_params && (
        <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-3 text-sm">
          <p className="font-medium text-gray-700 dark:text-gray-300 mb-2">Parameter Variogram</p>
          <div className="grid grid-cols-2 gap-2 text-gray-600 dark:text-gray-400">
            <p>
              Model: <strong className="text-gray-900 dark:text-gray-100">{variogram_params.model}</strong>
            </p>
            <p>
              Range: <strong className="text-gray-900 dark:text-gray-100">{variogram_params.range?.toFixed(4)}</strong>
            </p>
            <p>
              Nugget: <strong className="text-gray-900 dark:text-gray-100">{variogram_params.nugget?.toFixed(4)}</strong>
            </p>
            <p>
              Sill: <strong className="text-gray-900 dark:text-gray-100">{variogram_params.sill?.toFixed(4)}</strong>
            </p>
            <p className="col-span-2">
              Influence Radius: <strong className="text-gray-900 dark:text-gray-100">{((variogram_params.influence_radius || 0.05) * 1000).toFixed(0)}m</strong>
            </p>
          </div>
        </div>
      )}

      {/* Thresholds */}
      <div className="text-xs text-gray-400 dark:text-gray-500">
        Threshold: Defisien &lt; {thresholds?.deficient || 1.8} | Subnormal {thresholds?.deficient || 1.8} - {thresholds?.subnormal || 2.71} | Normal {thresholds?.subnormal || 2.71} - {thresholds?.normal || 3.31} | Tinggi &gt; {thresholds?.normal || 3.31}
      </div>
    </div>
  );
};

AnalysisResultsPanel.propTypes = {
  analysisResult: PropTypes.object,
  isAnalyzing: PropTypes.bool,
};

/**
 * Main KrigingMap Component with MapTiler
 */
export function KrigingMap({ areaId, areaName, devices: propDevices, onRefresh }) {
  // Refs
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef([]);
  const polygonRef = useRef(null);
  const drawPointsRef = useRef([]);
  const isDrawingRef = useRef(false);

  // State - use propDevices if provided, otherwise fall back to internal state
  const [internalDevices, setInternalDevices] = useState([]);
  const devices = propDevices && propDevices.length > 0 ? propDevices : internalDevices;
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showGrid, setShowGrid] = useState(true);
  const [activeTab, setActiveTab] = useState('devices');
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedArea, setSelectedArea] = useState(null);

  // Calculate bounds from devices
  const bounds = useMemo(() => {
    if (devices.length === 0) return null;

    const lats = devices.map((d) => d.lat).filter(Boolean);
    const lngs = devices.map((d) => d.lng).filter(Boolean);

    if (lats.length === 0 || lngs.length === 0) return null;

    const padding = 0.002;
    return {
      min_lat: Math.min(...lats) - padding,
      max_lat: Math.max(...lats) + padding,
      min_lng: Math.min(...lngs) - padding,
      max_lng: Math.max(...lngs) + padding,
    };
  }, [devices]);

  // Initialize Map
  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/satellite/style.json?key=${MAPTILER_API_KEY}`,
      center: [113.7176052, -8.1653927], // Default center (from database.txt)
      zoom: 17,
    });

    // Add navigation controls
    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    map.current.on('load', () => {
      setMapLoaded(true);
      
      // Add source for polygon drawing
      map.current.addSource('draw-polygon', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      });

      // Add polygon fill layer
      map.current.addLayer({
        id: 'draw-polygon-fill',
        type: 'fill',
        source: 'draw-polygon',
        paint: {
          'fill-color': '#22c55e',
          'fill-opacity': 0.2,
        },
      });

      // Add polygon outline layer
      map.current.addLayer({
        id: 'draw-polygon-outline',
        type: 'line',
        source: 'draw-polygon',
        paint: {
          'line-color': '#22c55e',
          'line-width': 2,
        },
      });

      // Add kriging result source - for heatmap/fill visualization
      map.current.addSource('kriging-grid', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      });

      // Add kriging grid layer as filled squares for area visualization
      map.current.addLayer({
        id: 'kriging-grid-layer',
        type: 'fill',
        source: 'kriging-grid',
        paint: {
          'fill-color': ['get', 'color'],
          'fill-opacity': 0.75,
        },
      });

      // Add kriging grid outline layer
      map.current.addLayer({
        id: 'kriging-grid-outline',
        type: 'line',
        source: 'kriging-grid',
        paint: {
          'line-color': ['get', 'color'],
          'line-width': 0.5,
          'line-opacity': 0.3,
        },
      });
    });

    // Handle map click for polygon drawing
    map.current.on('click', (e) => {
      if (!isDrawingRef.current) return;

      const point = [e.lngLat.lng, e.lngLat.lat];
      drawPointsRef.current.push(point);

      // Update polygon source - show polygon even with 2 points as line
      if (drawPointsRef.current.length >= 2) {
        const polygon = {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              geometry: {
                type: 'Polygon',
                coordinates: [[...drawPointsRef.current, drawPointsRef.current[0]]],
              },
            },
          ],
        };
        map.current.getSource('draw-polygon').setData(polygon);
      }
      
      if (drawPointsRef.current.length >= 3) {
        setSelectedArea([...drawPointsRef.current]);
      }
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Load device data from dummy generator only if no propDevices provided
  useEffect(() => {
    // If propDevices are provided, use them instead of dummy data
    if (propDevices && propDevices.length > 0) {
      setIsLoading(false);
      return;
    }

    const loadData = () => {
      setIsLoading(true);
      // Start the data store
      realTimeDataStore.start(60000);
      const data = realTimeDataStore.getCurrentData();
      setInternalDevices(data);
      setIsLoading(false);
    };

    loadData();

    // Subscribe to updates
    const unsubscribe = realTimeDataStore.subscribe((data) => {
      setInternalDevices(data);
    });

    return () => {
      unsubscribe();
    };
  }, [propDevices]);

  // Update markers when devices change
  useEffect(() => {
    if (!map.current || !mapLoaded || devices.length === 0) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add new markers
    devices.forEach((device) => {
      if (!device.lat || !device.lng) return;

      const classification = classifyNitrogen(device.nitrogen);
      const colors = MARKER_COLORS[classification] || MARKER_COLORS.unknown;

      // Create marker element with proper positioning
      const el = document.createElement('div');
      el.className = 'kriging-marker';
      el.style.cssText = `
        width: 28px;
        height: 28px;
        background-color: ${colors.fill};
        border: 3px solid ${colors.border};
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 6px rgba(0,0,0,0.4);
        position: relative;
      `;
      // Use text color based on background brightness
      const textColor = colors.fill === '#ffff00' ? '#333' : 'white';
      el.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="${textColor}"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`;

      // Handle click for device selection
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        setSelectedDevice(device);
        setActiveTab('devices');
      });

      // Create popup
      const popup = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 15,
      }).setHTML(`
        <div style="padding: 8px; font-size: 12px;">
          <strong>${device.device_id}</strong><br/>
          Nitrogen: <span style="color: ${colors.fill}">${device.nitrogen?.toFixed(3) || 'N/A'}</span><br/>
          SPAD: ${device.spad?.toFixed(2) || 'N/A'}<br/>
          <span style="color: ${colors.fill}">${getClassificationLabel(classification)}</span>
        </div>
      `);

      const marker = new maplibregl.Marker({ 
        element: el,
        anchor: 'center'  // Fix marker position during zoom
      })
        .setLngLat([device.lng, device.lat])
        .setPopup(popup)
        .addTo(map.current);

      markersRef.current.push(marker);
    });

    // Fit bounds to show all markers
    if (bounds && devices.length > 0) {
      map.current.fitBounds(
        [
          [bounds.min_lng, bounds.min_lat],
          [bounds.max_lng, bounds.max_lat],
        ],
        { padding: 50 }
      );
    }
  }, [devices, mapLoaded, bounds]);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    if (onRefresh) {
      // Use prop callback if provided
      onRefresh();
      toast.success('Data berhasil diperbarui');
    } else {
      // Fall back to internal data
      setIsLoading(true);
      const data = realTimeDataStore.getCurrentData();
      setInternalDevices(data);
      setIsLoading(false);
      toast.success('Data berhasil diperbarui');
    }
  }, [onRefresh]);

  // Toggle drawing mode
  const handleToggleDrawing = useCallback(() => {
    if (isDrawing) {
      // Stop drawing
      isDrawingRef.current = false;
      setIsDrawing(false);
    } else {
      // Start drawing - clear previous polygon
      drawPointsRef.current = [];
      setSelectedArea(null);
      if (map.current && map.current.getSource('draw-polygon')) {
        map.current.getSource('draw-polygon').setData({
          type: 'FeatureCollection',
          features: [],
        });
      }
      isDrawingRef.current = true;
      setIsDrawing(true);
      toast.info('Klik pada peta untuk menggambar area analisis');
    }
  }, [isDrawing]);

  // Clear polygon
  const handleClearPolygon = useCallback(() => {
    drawPointsRef.current = [];
    setSelectedArea(null);
    setAnalysisResult(null);
    isDrawingRef.current = false;
    setIsDrawing(false);
    if (map.current && map.current.getSource('draw-polygon')) {
      map.current.getSource('draw-polygon').setData({
        type: 'FeatureCollection',
        features: [],
      });
    }
    if (map.current && map.current.getSource('kriging-grid')) {
      map.current.getSource('kriging-grid').setData({
        type: 'FeatureCollection',
        features: [],
      });
    }
    toast.info('Area analisis dihapus');
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
      const deviceData = devices.map((d) => ({
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

      // Determine analysis bounds (selected area or all devices)
      let analysisBounds = bounds;
      if (selectedArea && selectedArea.length >= 3) {
        const lngs = selectedArea.map((p) => p[0]);
        const lats = selectedArea.map((p) => p[1]);
        analysisBounds = {
          min_lat: Math.min(...lats),
          max_lat: Math.max(...lats),
          min_lng: Math.min(...lngs),
          max_lng: Math.max(...lngs),
        };
      }

      // Call backend Kriging API
      const result = await api.performKrigingAnalysis({
        device_data: deviceData,
        area_id: areaId,
        area_name: areaName,
        grid_resolution: 50,
        variogram_model: 'spherical',
        low_threshold: NITROGEN_THRESHOLDS.deficient.max,
        high_threshold: NITROGEN_THRESHOLDS.normal.max,
        ...analysisBounds,
      });

      if (result.success) {
        setAnalysisResult(result);
        
        // Update map with kriging grid as filled polygons
        if (map.current && map.current.getSource('kriging-grid') && result.grid_points) {
          const gridFeatures = createGridPolygons(result.grid_points, selectedArea || analysisBounds);

          map.current.getSource('kriging-grid').setData({
            type: 'FeatureCollection',
            features: gridFeatures,
          });
        }
        
        toast.success('Analisis Kriging berhasil!');
      } else {
        throw new Error(result.message || 'Analisis gagal');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error(`Gagal melakukan analisis: ${error.message || 'Unknown error'}`);

      // Generate mock analysis result for demo
      const mockResult = generateMockAnalysisResult(devices, selectedArea || bounds);
      setAnalysisResult(mockResult);
      
      // Update map with mock grid as filled polygons
      if (map.current && map.current.getSource('kriging-grid') && mockResult.grid_points) {
        const gridFeatures = createGridPolygons(mockResult.grid_points, selectedArea || bounds);

        map.current.getSource('kriging-grid').setData({
          type: 'FeatureCollection',
          features: gridFeatures,
        });
      }
    } finally {
      setIsAnalyzing(false);
    }
  }, [devices, bounds, areaId, areaName, selectedArea]);

  // Create smooth contour polygons from grid points using d3-contour
  const createGridPolygons = (gridPoints, boundsData) => {
    if (!gridPoints || gridPoints.length === 0) return [];
    
    // Get bounds
    let minLat, maxLat, minLng, maxLng;
    let clipPolygon = null;
    
    if (boundsData) {
      if (Array.isArray(boundsData)) {
        const lngs = boundsData.map((p) => p[0]);
        const lats = boundsData.map((p) => p[1]);
        minLat = Math.min(...lats);
        maxLat = Math.max(...lats);
        minLng = Math.min(...lngs);
        maxLng = Math.max(...lngs);
        // Close the polygon for clipping
        clipPolygon = turf.polygon([[...boundsData, boundsData[0]]]);
      } else {
        minLat = boundsData.min_lat;
        maxLat = boundsData.max_lat;
        minLng = boundsData.min_lng;
        maxLng = boundsData.max_lng;
      }
    } else {
      const lats = gridPoints.map(p => p.latitude);
      const lngs = gridPoints.map(p => p.longitude);
      minLat = Math.min(...lats);
      maxLat = Math.max(...lats);
      minLng = Math.min(...lngs);
      maxLng = Math.max(...lngs);
    }

    const width = maxLng - minLng;
    const height = maxLat - minLat;
    
    // Filter only valid points with nitrogen data (relaxed condition for better coverage)
    const validPoints = gridPoints.filter(p => 
      p.classification !== 'no_data' && 
      typeof p.predicted_value === 'number' && 
      !isNaN(p.predicted_value) && 
      p.predicted_value > 0
    );
    
    // If no valid points, try to show all points with predicted values
    const pointsToUse = validPoints.length > 0 ? validPoints : gridPoints.filter(p => 
      typeof p.predicted_value === 'number' && 
      !isNaN(p.predicted_value) && 
      p.predicted_value > 0
    );
    
    if (pointsToUse.length === 0) return [];

    // Create a higher resolution grid for smoother contours
    const gridSize = 50;
    const values = new Array(gridSize * gridSize).fill(0);
    const counts = new Array(gridSize * gridSize).fill(0);

    // Create grid values using IDW interpolation from grid points
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const lng = minLng + (x / (gridSize - 1)) * width;
        const lat = minLat + (y / (gridSize - 1)) * height;
        
        // IDW interpolation
        let weightSum = 0;
        let valueSum = 0;
        
        pointsToUse.forEach(point => {
          const dx = lng - point.longitude;
          const dy = lat - point.latitude;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const weight = 1 / Math.max(dist, 0.00001);
          weightSum += weight;
          valueSum += weight * point.predicted_value;
        });
        
        if (weightSum > 0) {
          values[y * gridSize + x] = valueSum / weightSum;
          counts[y * gridSize + x] = 1;
        }
      }
    }

    // Define thresholds for contour bands
    const thresholds = [
      { min: 0, max: 1.80, classification: 'deficient', color: '#E53935' },
      { min: 1.80, max: 2.71, classification: 'subnormal', color: '#FB8C00' },
      { min: 2.71, max: 3.31, classification: 'normal', color: '#FDD835' },
      { min: 3.31, max: 5.0, classification: 'high', color: '#43A047' },
    ];

    const features = [];

    // Generate isobands (filled contours) for each threshold range
    thresholds.forEach(threshold => {
      try {
        // Generate contours for this threshold
        const contourGenerator = contours()
          .size([gridSize, gridSize])
          .thresholds([threshold.min, threshold.max]);
        
        const contourData = contourGenerator(values);
        
        // Find the contour band between min and max
        contourData.forEach((contour, idx) => {
          if (contour.value >= threshold.min && contour.value < threshold.max) {
            // Convert contour coordinates from grid space to geo coordinates
            contour.coordinates.forEach(ring => {
              if (ring.length > 0) {
                const geoCoords = ring.map(subring => 
                  subring.map(point => [
                    minLng + (point[0] / (gridSize - 1)) * width,
                    minLat + (point[1] / (gridSize - 1)) * height
                  ])
                );

                // Create polygon feature
                let polygon = {
                  type: 'Feature',
                  geometry: {
                    type: 'Polygon',
                    coordinates: geoCoords,
                  },
                  properties: {
                    value: contour.value,
                    color: threshold.color,
                    classification: threshold.classification,
                  },
                };

                // Clip to boundary if exists
                if (clipPolygon) {
                  try {
                    const clipped = turf.intersect(
                      turf.featureCollection([polygon, clipPolygon])
                    );
                    if (clipped) {
                      clipped.properties = polygon.properties;
                      features.push(clipped);
                    }
                  } catch (e) {
                    // If clipping fails, use original
                    features.push(polygon);
                  }
                } else {
                  features.push(polygon);
                }
              }
            });
          }
        });
      } catch (e) {
        console.warn('Contour generation error:', e);
      }
    });

    // If contour generation failed or produced no results, fall back to simplified rendering
    if (features.length === 0) {
      // Create smooth blobs around each device using Turf buffers
      return pointsToUse.map(point => {
        const center = turf.point([point.longitude, point.latitude]);
        const radius = 0.03; // 30 meters
        const buffered = turf.buffer(center, radius, { units: 'kilometers' });
        
        if (buffered) {
          buffered.properties = {
            value: point.predicted_value,
            color: getClassificationColor(point.classification),
            classification: point.classification,
          };
          
          // Clip to boundary if exists
          if (clipPolygon) {
            try {
              const clipped = turf.intersect(
                turf.featureCollection([buffered, clipPolygon])
              );
              if (clipped) {
                clipped.properties = buffered.properties;
                return clipped;
              }
            } catch (e) {
              return buffered;
            }
          }
          return buffered;
        }
        return null;
      }).filter(Boolean);
    }

    return features;
  };

  // Generate mock analysis result for demo
  const generateMockAnalysisResult = (deviceList, boundsData) => {
    const nitrogenValues = deviceList.map((d) => d.nitrogen).filter(v => typeof v === 'number' && !isNaN(v));
    const gridPoints = [];

    // Helper function to check if point is inside polygon
    const isPointInPolygon = (point, polygon) => {
      if (!polygon || !Array.isArray(polygon)) return true;
      let inside = false;
      const x = point[0], y = point[1];
      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i][0], yi = polygon[i][1];
        const xj = polygon[j][0], yj = polygon[j][1];
        const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
      }
      return inside;
    };

    // Helper function to calculate haversine distance in km
    const haversineDistance = (lat1, lng1, lat2, lng2) => {
      const R = 6371; // Earth's radius in km
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLng = (lng2 - lng1) * Math.PI / 180;
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLng / 2) * Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    // Check if point is within influence radius of any device (increased for better coverage)
    const isWithinInfluenceRadius = (lat, lng, devices, radiusKm = DEFAULT_INFLUENCE_RADIUS_KM * 2) => {
      for (const device of devices) {
        if (!device.lat || !device.lng) continue;
        const dist = haversineDistance(lat, lng, device.lat, device.lng);
        if (dist <= radiusKm) {
          return true;
        }
      }
      return false;
    };

    // Get minimum distance to any device
    const getMinDistanceToDevice = (lat, lng, devices) => {
      let minDist = Infinity;
      for (const device of devices) {
        const dist = haversineDistance(lat, lng, device.lat, device.lng);
        if (dist < minDist) {
          minDist = dist;
        }
      }
      return minDist;
    };

    let minLat, maxLat, minLng, maxLng;
    let polygonPoints = null;

    // Calculate bounds from boundsData or from devices
    if (boundsData) {
      if (Array.isArray(boundsData)) {
        // selectedArea is array of points
        polygonPoints = boundsData;
        const lngs = boundsData.map((p) => p[0]);
        const lats = boundsData.map((p) => p[1]);
        minLat = Math.min(...lats);
        maxLat = Math.max(...lats);
        minLng = Math.min(...lngs);
        maxLng = Math.max(...lngs);
      } else {
        // bounds object
        minLat = boundsData.min_lat;
        maxLat = boundsData.max_lat;
        minLng = boundsData.min_lng;
        maxLng = boundsData.max_lng;
      }
    } else {
      // Calculate bounds from devices if no boundsData provided
      const validDevices = deviceList.filter(d => d.lat && d.lng);
      if (validDevices.length === 0) {
        // Return empty result if no valid devices
        return {
          success: true,
          grid_points: [],
          input_points: [],
          statistics: {
            min_value: 0,
            max_value: 0,
            mean_value: 0,
            std_value: 0,
            deficient_count: 0,
            subnormal_count: 0,
            normal_count: 0,
            high_count: 0,
            no_data_count: 0,
            total_points: 0,
            data_points: 0,
          },
          variogram_params: {
            model: 'spherical',
            nugget: 0,
            sill: 0,
            range: 0,
            influence_radius: DEFAULT_INFLUENCE_RADIUS_KM,
          },
          thresholds: {
            deficient: NITROGEN_THRESHOLDS.deficient.max,
            subnormal: NITROGEN_THRESHOLDS.subnormal.max,
            normal: NITROGEN_THRESHOLDS.normal.max,
          },
          bounds: null,
        };
      }
      
      const lats = validDevices.map(d => d.lat);
      const lngs = validDevices.map(d => d.lng);
      const padding = 0.002; // Add padding around devices
      minLat = Math.min(...lats) - padding;
      maxLat = Math.max(...lats) + padding;
      minLng = Math.min(...lngs) - padding;
      maxLng = Math.max(...lngs) + padding;
    }

    // Generate grid points
    const resolution = 50;
    for (let i = 0; i < resolution; i++) {
      for (let j = 0; j < resolution; j++) {
        const lat = minLat + ((i + 0.5) / resolution) * (maxLat - minLat);
        const lng = minLng + ((j + 0.5) / resolution) * (maxLng - minLng);
        
        // Only include points inside the polygon if polygon is defined
        if (polygonPoints && !isPointInPolygon([lng, lat], polygonPoints)) {
          continue;
        }
        
        // Check if point is within influence radius of any device
        const withinInfluence = isWithinInfluenceRadius(lat, lng, deviceList);
        
        // Generate nitrogen value based on proximity to devices with interpolation
        let value = 0;
        let classification = 'no_data';
        
        if (withinInfluence && deviceList.length > 0) {
          // Simple IDW interpolation for more realistic values
          // Use squared distance for smoother decay
          let weightSum = 0;
          let valueSum = 0;
          deviceList.forEach(device => {
            if (!device.lat || !device.lng || !device.nitrogen) return;
            const dist = haversineDistance(lat, lng, device.lat, device.lng);
            // Use squared inverse distance for smoother interpolation
            const weight = 1 / Math.max(dist * dist, 0.0000001);
            weightSum += weight;
            valueSum += weight * device.nitrogen;
          });
          if (weightSum > 0) {
            value = valueSum / weightSum;
            classification = classifyNitrogen(value);
          }
        }
        
        gridPoints.push({
          latitude: lat,
          longitude: lng,
          predicted_value: value,
          variance: 0.1,
          classification: classification,
        });
      }
    }

    const deficientCount = gridPoints.filter((p) => p.classification === 'deficient').length;
    const subnormalCount = gridPoints.filter((p) => p.classification === 'subnormal').length;
    const normalCount = gridPoints.filter((p) => p.classification === 'normal').length;
    const highCount = gridPoints.filter((p) => p.classification === 'high').length;
    const noDataCount = gridPoints.filter((p) => p.classification === 'no_data').length;

    // Calculate standard deviation
    const meanValue = nitrogenValues.length > 0 ? nitrogenValues.reduce((a, b) => a + b, 0) / nitrogenValues.length : 0;
    const stdValue = nitrogenValues.length > 1 
      ? Math.sqrt(nitrogenValues.reduce((sum, val) => sum + Math.pow(val - meanValue, 2), 0) / nitrogenValues.length)
      : 0;

    return {
      success: true,
      grid_points: gridPoints,
      input_points: deviceList.map((d) => ({
        ...d,
        latitude: d.lat,
        longitude: d.lng,
        classification: classifyNitrogen(d.nitrogen),
      })),
      statistics: {
        min_value: nitrogenValues.length > 0 ? Math.min(...nitrogenValues) : 0,
        max_value: nitrogenValues.length > 0 ? Math.max(...nitrogenValues) : 0,
        mean_value: meanValue,
        std_value: stdValue,
        deficient_count: deficientCount,
        subnormal_count: subnormalCount,
        normal_count: normalCount,
        high_count: highCount,
        no_data_count: noDataCount,
        total_points: gridPoints.length,
        data_points: gridPoints.length - noDataCount,
      },
      variogram_params: {
        model: 'spherical',
        nugget: stdValue * 0.1,
        sill: stdValue * 0.9,
        range: 0.1014,
        influence_radius: DEFAULT_INFLUENCE_RADIUS_KM,
      },
      thresholds: {
        deficient: NITROGEN_THRESHOLDS.deficient.max,
        subnormal: NITROGEN_THRESHOLDS.subnormal.max,
        normal: NITROGEN_THRESHOLDS.normal.max,
      },
      bounds: boundsData,
    };
  };

  // Toggle grid visibility
  const handleToggleGrid = useCallback(() => {
    setShowGrid(!showGrid);
    if (map.current) {
      const visibility = !showGrid ? 'visible' : 'none';
      if (map.current.getLayer('kriging-grid-layer')) {
        map.current.setLayoutProperty('kriging-grid-layer', 'visibility', visibility);
      }
      if (map.current.getLayer('kriging-grid-outline')) {
        map.current.setLayoutProperty('kriging-grid-outline', 'visibility', visibility);
      }
    }
  }, [showGrid]);

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
        <div className="flex items-center gap-2">
          <Button
            variant={isDrawing ? 'default' : 'outline'}
            size="sm"
            onClick={handleToggleDrawing}
            className={isDrawing ? 'bg-orange-500 hover:bg-orange-600' : ''}
          >
            <Square className="w-4 h-4 mr-1" />
            {isDrawing ? 'Selesai Gambar' : 'Pilih Area'}
          </Button>
          {selectedArea && (
            <Button variant="outline" size="sm" onClick={handleClearPolygon}>
              <Trash2 className="w-4 h-4 mr-1" />
              Hapus Area
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
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

      {/* Drawing Instructions */}
      {isDrawing && (
        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-lg p-3 text-sm text-orange-700 dark:text-orange-400">
          <p className="font-medium">Mode Pemilihan Area Aktif</p>
          <p>Klik pada peta untuk menambahkan titik sudut area. Minimal 3 titik untuk membentuk area.</p>
          {selectedArea && <p className="mt-1">Sudut terbentuk: {selectedArea.length} titik</p>}
        </div>
      )}

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
            {/* Map Legend */}
            <div className="mt-3 flex flex-wrap gap-3 text-sm">
              {Object.entries(NITROGEN_THRESHOLDS).map(([key, value]) => (
                <div key={key} className="flex items-center gap-1">
                  <div
                    className="w-4 h-4 rounded-full border-2 border-white shadow"
                    style={{ backgroundColor: value.color }}
                  />
                  <span className="capitalize">{value.label}</span>
                </div>
              ))}
            </div>
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
      {devices.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Daftar Device</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              {devices.map((device) => {
                const classification = classifyNitrogen(device.nitrogen);
                const colors = MARKER_COLORS[classification] || MARKER_COLORS.unknown;
                const isSelected = selectedDevice?.device_id === device.device_id;

                return (
                  <div
                    key={device.device_id}
                    className={`
                      p-2 rounded-lg border cursor-pointer transition-all
                      ${isSelected ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' : 'border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700'}
                    `}
                    onClick={() => setSelectedDevice(device)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium truncate text-gray-900 dark:text-gray-100">{device.device_id}</span>
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: colors.fill }}
                      />
                    </div>
                    <p className="text-lg font-bold" style={{ color: colors.fill }}>
                      {device.nitrogen?.toFixed(3) || 'N/A'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{getClassificationLabel(classification)}</p>
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
  devices: PropTypes.array,
  onRefresh: PropTypes.func,
};

export default KrigingMap;
