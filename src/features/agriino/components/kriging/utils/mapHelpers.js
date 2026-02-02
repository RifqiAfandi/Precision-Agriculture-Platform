/**
 * Map Helper Utilities
 * 
 * Contains helper functions for MapLibre map operations.
 */

import maplibregl from 'maplibre-gl';
import { classifyNitrogen } from '@/services/dummyDataGenerator';
import { MAP_CONFIG, MARKER_COLORS } from '@/constants';

/**
 * Get classification label in Indonesian
 */
export const getClassificationLabel = (classification) => {
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
 * Create a device marker element
 * @param {Object} device - Device data object
 * @param {Function} onClick - Click handler function
 * @returns {HTMLElement} Marker DOM element
 */
export const createMarkerElement = (device, onClick) => {
  const classification = classifyNitrogen(device.nitrogen);
  const colors = MARKER_COLORS[classification] || MARKER_COLORS.unknown;

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
  
  const textColor = colors.fill === '#ffff00' ? '#333' : 'white';
  el.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="${textColor}"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`;

  if (onClick) {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      onClick(device);
    });
  }

  return el;
};

/**
 * Create a popup for a device marker
 * @param {Object} device - Device data object
 * @returns {maplibregl.Popup} MapLibre popup instance
 */
export const createDevicePopup = (device) => {
  const classification = classifyNitrogen(device.nitrogen);
  const colors = MARKER_COLORS[classification] || MARKER_COLORS.unknown;

  return new maplibregl.Popup({
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
};

/**
 * Calculate bounds from devices array
 * @param {Object[]} devices - Array of device objects with lat/lng
 * @param {number} padding - Padding to add around bounds (default: 0.002)
 * @returns {Object|null} Bounds object or null if no valid devices
 */
export const calculateBoundsFromDevices = (devices, padding = 0.002) => {
  if (!devices || devices.length === 0) return null;

  const lats = devices.map((d) => d.lat).filter(Boolean);
  const lngs = devices.map((d) => d.lng).filter(Boolean);

  if (lats.length === 0 || lngs.length === 0) return null;

  return {
    min_lat: Math.min(...lats) - padding,
    max_lat: Math.max(...lats) + padding,
    min_lng: Math.min(...lngs) - padding,
    max_lng: Math.max(...lngs) + padding,
  };
};

/**
 * Initialize map sources for drawing and kriging layers
 * @param {maplibregl.Map} map - MapLibre map instance
 */
export const initializeMapSources = (map) => {
  // Add source for polygon drawing
  map.addSource('draw-polygon', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: [],
    },
  });

  // Add polygon fill layer
  map.addLayer({
    id: 'draw-polygon-fill',
    type: 'fill',
    source: 'draw-polygon',
    paint: {
      'fill-color': '#22c55e',
      'fill-opacity': 0.2,
    },
  });

  // Add polygon outline layer
  map.addLayer({
    id: 'draw-polygon-outline',
    type: 'line',
    source: 'draw-polygon',
    paint: {
      'line-color': '#22c55e',
      'line-width': 2,
    },
  });

  // Add kriging result source
  map.addSource('kriging-grid', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: [],
    },
  });

  // Add kriging grid layer as filled squares
  map.addLayer({
    id: 'kriging-grid-layer',
    type: 'fill',
    source: 'kriging-grid',
    paint: {
      'fill-color': ['get', 'color'],
      'fill-opacity': 0.8,
    },
  });

  // Add kriging grid outline layer - hidden by default for smooth look
  map.addLayer({
    id: 'kriging-grid-outline',
    type: 'line',
    source: 'kriging-grid',
    paint: {
      'line-color': ['get', 'color'],
      'line-width': 0,
      'line-opacity': 0,
    },
  });
};

/**
 * Update the drawing polygon source with new points
 * @param {maplibregl.Map} map - MapLibre map instance
 * @param {number[][]} points - Array of [lng, lat] coordinates
 */
export const updateDrawPolygon = (map, points) => {
  if (!map || !map.getSource('draw-polygon')) return;
  
  if (points.length >= 2) {
    const polygon = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [[...points, points[0]]],
          },
        },
      ],
    };
    map.getSource('draw-polygon').setData(polygon);
  }
};

/**
 * Clear the drawing polygon source
 * @param {maplibregl.Map} map - MapLibre map instance
 */
export const clearDrawPolygon = (map) => {
  if (!map || !map.getSource('draw-polygon')) return;
  
  map.getSource('draw-polygon').setData({
    type: 'FeatureCollection',
    features: [],
  });
};

/**
 * Update the kriging grid source with features
 * @param {maplibregl.Map} map - MapLibre map instance
 * @param {Object[]} features - Array of GeoJSON features
 */
export const updateKrigingGrid = (map, features) => {
  if (!map || !map.getSource('kriging-grid')) return;
  
  map.getSource('kriging-grid').setData({
    type: 'FeatureCollection',
    features: features,
  });
};

/**
 * Clear the kriging grid source
 * @param {maplibregl.Map} map - MapLibre map instance
 */
export const clearKrigingGrid = (map) => {
  if (!map || !map.getSource('kriging-grid')) return;
  
  map.getSource('kriging-grid').setData({
    type: 'FeatureCollection',
    features: [],
  });
};

/**
 * Toggle kriging grid visibility
 * @param {maplibregl.Map} map - MapLibre map instance
 * @param {boolean} visible - Whether to show or hide the grid
 */
export const toggleKrigingGridVisibility = (map, visible) => {
  if (!map) return;
  
  const visibility = visible ? 'visible' : 'none';
  
  if (map.getLayer('kriging-grid-layer')) {
    map.setLayoutProperty('kriging-grid-layer', 'visibility', visibility);
  }
  if (map.getLayer('kriging-grid-outline')) {
    map.setLayoutProperty('kriging-grid-outline', 'visibility', visibility);
  }
};

/**
 * Get the MapTiler API key from config
 * @returns {string} MapTiler API key
 */
export const getMapTilerApiKey = () => MAP_CONFIG.MAPTILER_API_KEY;

/**
 * Get the satellite map style URL
 * @returns {string} Map style URL
 */
export const getSatelliteMapStyle = () => 
  `https://api.maptiler.com/maps/satellite/style.json?key=${getMapTilerApiKey()}`;
