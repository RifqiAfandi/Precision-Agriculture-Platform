/**
 * useKrigingMap Hook
 * 
 * Custom hook that encapsulates all map-related logic for the Kriging visualization.
 * Extracted from KrigingMap.jsx for better separation of concerns.
 */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import maplibregl from 'maplibre-gl';
import { toast } from 'sonner';
import api from '@/services/api';
import { realTimeDataStore, NITROGEN_THRESHOLDS } from '@/services/dummyDataGenerator';
import { REFRESH_INTERVALS } from '@/constants/config';
import {
  createMarkerElement,
  createDevicePopup,
  calculateBoundsFromDevices,
  initializeMapSources,
  updateDrawPolygon,
  clearDrawPolygon,
  updateKrigingGrid,
  clearKrigingGrid,
  toggleKrigingGridVisibility,
  getSatelliteMapStyle,
} from '../utils/mapHelpers';
import {
  createGridPolygons,
  generateMockAnalysisResult,
} from '../utils/krigingUtils';
import { MAP_CONFIG, STORAGE_KEYS } from '@/constants';

// =============================================================================
// HELPER FUNCTIONS FOR PERSISTENCE
// =============================================================================

/**
 * Save selected area to localStorage
 * @param {Array|null} area - Array of [lng, lat] coordinates
 */
function saveSelectedArea(area) {
  try {
    if (area && area.length >= 3) {
      localStorage.setItem(STORAGE_KEYS.KRIGING_SELECTED_AREA, JSON.stringify(area));
    } else {
      localStorage.removeItem(STORAGE_KEYS.KRIGING_SELECTED_AREA);
    }
  } catch (error) {
    console.warn('Failed to save selected area to localStorage:', error);
  }
}

/**
 * Load selected area from localStorage
 * @returns {Array|null} Saved area coordinates or null
 */
function loadSelectedArea() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.KRIGING_SELECTED_AREA);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length >= 3) {
        // If the coordinates are from the shifted Silo center (lng > 113.75), ignore to load original UNEJ area
        const firstLng = parsed[0][0];
        if (firstLng > 113.75) {
          localStorage.removeItem(STORAGE_KEYS.KRIGING_SELECTED_AREA);
        } else {
          return parsed;
        }
      }
    }
  } catch (error) {
    console.warn('Failed to load selected area from localStorage:', error);
  }
  // Default polygon enclosing the original devices in UNEJ Jember campus
  return [
    [113.7160, -8.1640],
    [113.7198, -8.1640],
    [113.7200, -8.1652],
    [113.7195, -8.1663],
    [113.7162, -8.1663],
    [113.7158, -8.1652],
    [113.7160, -8.1640]
  ];
}

/**
 * Custom hook for managing the Kriging map state and operations
 * @param {Object} options - Hook options
 * @param {number} options.areaId - Area ID for analysis
 * @param {string} options.areaName - Area name for display
 * @param {Object[]} options.propDevices - Devices passed as prop
 * @param {Function} options.onRefresh - Callback for refresh action
 * @returns {Object} Map state and handlers
 */
export function useKrigingMap({ areaId, areaName, propDevices, onRefresh }) {
  // Refs
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef([]);
  const drawPointsRef = useRef([]);
  const isDrawingRef = useRef(false);

  // State
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
  // Initialize selectedArea from localStorage
  const [selectedArea, setSelectedArea] = useState(() => loadSelectedArea());

  // Calculate bounds from devices
  const bounds = useMemo(() => calculateBoundsFromDevices(devices), [devices]);

  // Persist selectedArea to localStorage when it changes
  useEffect(() => {
    saveSelectedArea(selectedArea);
  }, [selectedArea]);

  // Restore saved polygon on map when map loads
  useEffect(() => {
    if (!map.current || !mapLoaded) return;
    
    const savedArea = loadSelectedArea();
    if (savedArea && savedArea.length >= 3) {
      // Restore the polygon drawing on the map
      drawPointsRef.current = [...savedArea];
      updateDrawPolygon(map.current, savedArea);
    }
  }, [mapLoaded]);

  // Initialize Map
  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: getSatelliteMapStyle(),
      center: [MAP_CONFIG.DEFAULT_CENTER.lng, MAP_CONFIG.DEFAULT_CENTER.lat],
      zoom: MAP_CONFIG.DEFAULT_ZOOM,
    });

    // Add navigation controls
    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    map.current.on('load', () => {
      setMapLoaded(true);
      initializeMapSources(map.current);
    });

    // Handle map click for polygon drawing
    map.current.on('click', (e) => {
      if (!isDrawingRef.current) return;

      const point = [e.lngLat.lng, e.lngLat.lat];
      drawPointsRef.current.push(point);

      updateDrawPolygon(map.current, drawPointsRef.current);
      
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
    if (propDevices && propDevices.length > 0) {
      setIsLoading(false);
      return;
    }

    const loadData = () => {
      setIsLoading(true);
      realTimeDataStore.start(REFRESH_INTERVALS.SLOW);
      const data = realTimeDataStore.getCurrentData();
      setInternalDevices(data);
      setIsLoading(false);
    };

    loadData();

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

      const el = createMarkerElement(device, (d) => {
        setSelectedDevice(d);
        setActiveTab('devices');
      });

      const popup = createDevicePopup(device);

      const marker = new maplibregl.Marker({ 
        element: el,
        anchor: 'center'
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
      onRefresh();
      toast.success('Data berhasil diperbarui');
    } else {
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
      // Finishing drawing mode
      if (drawPointsRef.current.length < 3) {
        toast.error('Area tidak terpilih, silahkan memilih area');
        return;
      }

      isDrawingRef.current = false;
      setIsDrawing(false);
      setSelectedArea([...drawPointsRef.current]);
      toast.success('Area tersimpan');
      return;
    }

    // Starting new drawing - clear existing for new selection
    drawPointsRef.current = [];
    clearDrawPolygon(map.current);
    isDrawingRef.current = true;
    setIsDrawing(true);
    toast.info('Klik pada peta untuk menggambar area analisis. Klik "Selesai Memilih Area" untuk menyimpan.');
  }, [isDrawing]);

  const handleCancelDrawing = useCallback(() => {
    if (!isDrawing) return;

    drawPointsRef.current = [];
    isDrawingRef.current = false;
    setIsDrawing(false);
    clearDrawPolygon(map.current);

    if (selectedArea && selectedArea.length >= 3) {
      updateDrawPolygon(map.current, selectedArea);
    }
  }, [isDrawing, selectedArea]);

  // Clear polygon (explicit user action to delete saved area)
  const handleClearPolygon = useCallback(() => {
    const confirmed = window.confirm('Hapus area yang dipilih ?');
    if (!confirmed) return;
    drawPointsRef.current = [];
    setSelectedArea(null); // This will trigger useEffect to clear localStorage
    setAnalysisResult(null);
    isDrawingRef.current = false;
    setIsDrawing(false);
    clearDrawPolygon(map.current);
    clearKrigingGrid(map.current);
    toast.info('Area analisis dihapus');
  }, []);

  // Perform Kriging analysis
  const handleAnalysis = useCallback(async () => {
    console.log('=== HANDLE ANALYSIS START ===');

    if (!selectedArea || selectedArea.length < 3) {
      toast.error('Minimal area terpilih 3');
      return;
    }

    if (devices.length < 1) {
      toast.error('Minimal 1 device diperlukan untuk analisis');
      return;
    }

    setIsAnalyzing(true);
    setActiveTab('analysis');

    try {
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
        
        if (map.current && map.current.getSource('kriging-grid') && result.grid_points) {
          const gridFeatures = createGridPolygons(result.grid_points, selectedArea || analysisBounds);
          updateKrigingGrid(map.current, gridFeatures);
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
      
      if (map.current && map.current.getSource('kriging-grid') && mockResult.grid_points) {
        const gridFeatures = createGridPolygons(mockResult.grid_points, selectedArea || bounds);
        updateKrigingGrid(map.current, gridFeatures);
      }
    } finally {
      setIsAnalyzing(false);
      console.log('=== HANDLE ANALYSIS END ===');
    }
  }, [devices, bounds, areaId, areaName, selectedArea]);

  // Toggle grid visibility
  const handleToggleGrid = useCallback(() => {
    setShowGrid(!showGrid);
    toggleKrigingGridVisibility(map.current, !showGrid);
  }, [showGrid]);

  return {
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
    handleCancelDrawing,
    handleAnalysis,
    handleToggleGrid,
  };
}

export default useKrigingMap;
