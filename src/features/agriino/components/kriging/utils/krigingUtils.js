/**
 * Kriging Utilities
 * 
 * Contains utility functions for Kriging interpolation and grid generation.
 * Extracted from KrigingMap.jsx for better maintainability.
 */

import { classifyNitrogen, NITROGEN_THRESHOLDS } from '@/services/dummyDataGenerator';
import { DEFAULT_INFLUENCE_RADIUS_KM, KRIGING_GRID_COLORS, classifyNitrogenValue } from '@/constants';

/**
 * Grid colors for Kriging visualization
 */
const GRID_COLORS = KRIGING_GRID_COLORS;

/**
 * Calculate haversine distance between two coordinates in kilometers
 * @param {number} lat1 - Latitude of first point
 * @param {number} lng1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lng2 - Longitude of second point
 * @returns {number} Distance in kilometers
 */
export const haversineDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Check if a point is inside a polygon using ray casting algorithm
 * @param {number[]} point - [lng, lat] coordinates
 * @param {number[][]} polygon - Array of [lng, lat] coordinates
 * @returns {boolean} Whether the point is inside the polygon
 */
export const isPointInPolygon = (point, polygon) => {
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

/**
 * Check if point is within influence radius of any device
 * @param {number} lat - Latitude of point
 * @param {number} lng - Longitude of point
 * @param {Object[]} devices - Array of device objects with lat/lng
 * @param {number} radiusKm - Influence radius in kilometers
 * @returns {boolean} Whether the point is within influence radius
 */
export const isWithinInfluenceRadius = (lat, lng, devices, radiusKm = DEFAULT_INFLUENCE_RADIUS_KM * 2) => {
  for (const device of devices) {
    if (!device.lat || !device.lng) continue;
    const dist = haversineDistance(lat, lng, device.lat, device.lng);
    if (dist <= radiusKm) {
      return true;
    }
  }
  return false;
};

/**
 * Get minimum distance from a point to any device
 * @param {number} lat - Latitude of point
 * @param {number} lng - Longitude of point
 * @param {Object[]} devices - Array of device objects with lat/lng
 * @returns {number} Minimum distance in kilometers
 */
export const getMinDistanceToDevice = (lat, lng, devices) => {
  let minDist = Infinity;
  for (const device of devices) {
    const dist = haversineDistance(lat, lng, device.lat, device.lng);
    if (dist < minDist) {
      minDist = dist;
    }
  }
  return minDist;
};


/**
 * Create grid polygons for Kriging visualization with small grid cells
 * Uses small square cells for smooth appearance
 * @param {Object[]} gridPoints - Array of grid point objects
 * @param {Object|number[][]} boundsData - Bounds object or polygon array
 * @returns {Object[]} Array of GeoJSON features
 */
export const createGridPolygons = (gridPoints, boundsData) => {
  if (!gridPoints || gridPoints.length === 0) {
    return [];
  }
  
  // Get bounds and clip polygon
  let minLat, maxLat, minLng, maxLng;
  let clipPolygonCoords = null;
  
  if (boundsData) {
    if (Array.isArray(boundsData)) {
      const lngs = boundsData.map((p) => p[0]);
      const lats = boundsData.map((p) => p[1]);
      minLat = Math.min(...lats);
      maxLat = Math.max(...lats);
      minLng = Math.min(...lngs);
      maxLng = Math.max(...lngs);
      clipPolygonCoords = boundsData;
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

  // Filter valid points
  const validPoints = gridPoints.filter(p => 
    typeof p.predicted_value === 'number' && 
    !isNaN(p.predicted_value)
  );
  
  validPoints.forEach(p => {
    if (p.classification === 'no_data') {
      p.classification = 'normal';
    }
  });
  
  if (validPoints.length === 0) {
    return [];
  }

  const features = [];
  
  // Calculate small cell size for smooth appearance
  const gridWidth = maxLng - minLng;
  const gridHeight = maxLat - minLat;
  
  // Determine grid resolution from points
  const uniqueLngs = [...new Set(validPoints.map(p => p.longitude.toFixed(6)))].sort();
  const uniqueLats = [...new Set(validPoints.map(p => p.latitude.toFixed(6)))].sort();
  
  // Calculate cell size - make it small
  let cellWidth, cellHeight;
  if (uniqueLngs.length > 1) {
    cellWidth = Math.abs(parseFloat(uniqueLngs[1]) - parseFloat(uniqueLngs[0]));
  } else {
    cellWidth = gridWidth / 50;
  }
  if (uniqueLats.length > 1) {
    cellHeight = Math.abs(parseFloat(uniqueLats[1]) - parseFloat(uniqueLats[0]));
  } else {
    cellHeight = gridHeight / 50;
  }
  
  // Half cell for centering
  const halfWidth = cellWidth / 2;
  const halfHeight = cellHeight / 2;
  
  // Create small square for each grid point
  validPoints.forEach((point) => {
    const lng = point.longitude;
    const lat = point.latitude;
    const classification = point.classification === 'no_data' ? 'normal' : point.classification;
    
    // Check if point is inside clip polygon
    if (clipPolygonCoords && !isPointInPolygon([lng, lat], clipPolygonCoords)) {
      return;
    }
    
    // Create small square cell
    const coords = [
      [lng - halfWidth, lat - halfHeight],
      [lng + halfWidth, lat - halfHeight],
      [lng + halfWidth, lat + halfHeight],
      [lng - halfWidth, lat + halfHeight],
      [lng - halfWidth, lat - halfHeight], // Close polygon
    ];
    
    const feature = {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [coords],
      },
      properties: {
        value: point.predicted_value,
        color: GRID_COLORS[classification] || GRID_COLORS.normal,
        classification: classification,
      },
    };
    
    features.push(feature);
  });
  
  return features;
};

/**
 * Generate mock analysis result for demo/fallback
 * @param {Object[]} deviceList - Array of device objects
 * @param {Object|number[][]} boundsData - Bounds object or polygon array
 * @returns {Object} Mock analysis result
 */
export const generateMockAnalysisResult = (deviceList, boundsData) => {
  const nitrogenValues = deviceList.map((d) => d.nitrogen).filter(v => typeof v === 'number' && !isNaN(v));
  const gridPoints = [];

  let minLat, maxLat, minLng, maxLng;
  let polygonPoints = null;

  // Calculate bounds from boundsData or from devices
  if (boundsData) {
    if (Array.isArray(boundsData)) {
      polygonPoints = boundsData;
      const lngs = boundsData.map((p) => p[0]);
      const lats = boundsData.map((p) => p[1]);
      minLat = Math.min(...lats);
      maxLat = Math.max(...lats);
      minLng = Math.min(...lngs);
      maxLng = Math.max(...lngs);
    } else {
      minLat = boundsData.min_lat;
      maxLat = boundsData.max_lat;
      minLng = boundsData.min_lng;
      maxLng = boundsData.max_lng;
    }
  } else {
    const validDevices = deviceList.filter(d => d.lat && d.lng);
    if (validDevices.length === 0) {
      return createEmptyAnalysisResult();
    }
    
    const lats = validDevices.map(d => d.lat);
    const lngs = validDevices.map(d => d.lng);
    const padding = 0.002;
    minLat = Math.min(...lats) - padding;
    maxLat = Math.max(...lats) + padding;
    minLng = Math.min(...lngs) - padding;
    maxLng = Math.max(...lngs) + padding;
  }

  // Generate grid points
  const resolution = 50;
  const validDevicesForInterpolation = deviceList.filter(d => 
    d.lat && d.lng && typeof d.nitrogen === 'number' && !isNaN(d.nitrogen)
  );

  let devicesToUse;
  if (validDevicesForInterpolation.length > 0) {
    devicesToUse = validDevicesForInterpolation;
  } else {
    devicesToUse = deviceList.filter(d => d.lat && d.lng).map(d => ({
      ...d,
      nitrogen: typeof d.nitrogen === 'number' && !isNaN(d.nitrogen) ? d.nitrogen : 2.5
    }));
  }

  if (devicesToUse.length === 0) {
    // Generate grid points as normal (default)
    for (let i = 0; i < resolution; i++) {
      for (let j = 0; j < resolution; j++) {
        const lat = minLat + ((i + 0.5) / resolution) * (maxLat - minLat);
        const lng = minLng + ((j + 0.5) / resolution) * (maxLng - minLng);
        
        if (polygonPoints && !isPointInPolygon([lng, lat], polygonPoints)) {
          continue;
        }
        
        gridPoints.push({
          latitude: lat,
          longitude: lng,
          predicted_value: 2.9,
          variance: 0.1,
          classification: 'normal',
        });
      }
    }
  } else {
    // Normal interpolation with devices using IDW with influence radius
    // Use direct radius without multiplier for smaller, more precise circles
    const influenceRadius = DEFAULT_INFLUENCE_RADIUS_KM;
    
    for (let i = 0; i < resolution; i++) {
      for (let j = 0; j < resolution; j++) {
        const lat = minLat + ((i + 0.5) / resolution) * (maxLat - minLat);
        const lng = minLng + ((j + 0.5) / resolution) * (maxLng - minLng);
        
        if (polygonPoints && !isPointInPolygon([lng, lat], polygonPoints)) {
          continue;
        }
        
        let value = 0;
        let classification = 'normal'; // Default to normal for areas outside influence
        let minDistToDevice = Infinity;
        
        // IDW interpolation with influence radius constraint
        let weightSum = 0;
        let valueSum = 0;
        let isWithinInfluence = false;
        
        devicesToUse.forEach(device => {
          const dist = haversineDistance(lat, lng, device.lat, device.lng);
          if (dist < minDistToDevice) minDistToDevice = dist;
          
          // Only consider devices within influence radius
          if (dist <= influenceRadius) {
            isWithinInfluence = true;
            const nitrogenValue = typeof device.nitrogen === 'number' && !isNaN(device.nitrogen) 
              ? device.nitrogen 
              : 2.0;
            
            // Weight decreases with distance squared
            const weight = 1 / Math.max(dist * dist, 0.0000001);
            weightSum += weight;
            valueSum += weight * nitrogenValue;
          }
        });
        
        if (isWithinInfluence && weightSum > 0) {
          value = valueSum / weightSum;
          classification = classifyNitrogenValue(value);
        } else {
          // Outside influence radius - default to normal (orange #FF8C00)
          value = 2.9; // Normal range value
          classification = 'normal';
        }
        
        gridPoints.push({
          latitude: lat,
          longitude: lng,
          predicted_value: value,
          variance: minDistToDevice < Infinity ? minDistToDevice * 0.1 : 0.1,
          classification: classification,
        });
      }
    }
  }
  
  // Calculate grid statistics (for zoning/area coverage)
  const deficientCount = gridPoints.filter((p) => p.classification === 'deficient').length;
  const subnormalCount = gridPoints.filter((p) => p.classification === 'subnormal').length;
  const normalCount = gridPoints.filter((p) => p.classification === 'normal' || p.classification === 'no_data').length;
  const highCount = gridPoints.filter((p) => p.classification === 'high').length;
  const noDataCount = 0;

  // Calculate device statistics (actual device counts by classification)
  const deviceStats = { deficient: 0, subnormal: 0, normal: 0, high: 0, no_data: 0 };
  deviceList.forEach(device => {
    if (device.nitrogen != null && !isNaN(device.nitrogen)) {
      const classification = classifyNitrogenValue(device.nitrogen);
      if (deviceStats[classification] !== undefined) {
        deviceStats[classification]++;
      }
    } else {
      deviceStats.no_data++;
    }
  });

  const gridValuesWithData = gridPoints
    .filter(p => p.predicted_value > 0)
    .map(p => p.predicted_value);
  
  const statsValues = gridValuesWithData.length > 0 ? gridValuesWithData : nitrogenValues;
  
  const meanValue = statsValues.length > 0 
    ? statsValues.reduce((a, b) => a + b, 0) / statsValues.length 
    : 0;
  const stdValue = statsValues.length > 1 
    ? Math.sqrt(statsValues.reduce((sum, val) => sum + Math.pow(val - meanValue, 2), 0) / statsValues.length)
    : 0;
  const minValue = statsValues.length > 0 ? Math.min(...statsValues) : 0;
  const maxValue = statsValues.length > 0 ? Math.max(...statsValues) : 0;

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
      min_value: minValue,
      max_value: maxValue,
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
    device_statistics: deviceStats,
    variogram_params: {
      model: 'spherical',
      nugget: stdValue > 0 ? stdValue * 0.2 : 0.1,
      sill: stdValue > 0 ? stdValue * 0.8 : 0.5,
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

/**
 * Create empty analysis result structure
 * @returns {Object} Empty analysis result
 */
export const createEmptyAnalysisResult = () => ({
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
});
