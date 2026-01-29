// Dummy Data Generator Service for Agriino
// Generates real-time and weekly dummy data based on database.txt specifications

import {
  NITROGEN_THRESHOLDS,
  DEFAULT_INFLUENCE_RADIUS_KM,
  classifyNitrogenValue,
} from '@/constants';
import { MARKER_COLORS, getClassificationFillColor } from '@/constants/colors';

/**
 * Re-export NITROGEN_THRESHOLDS from constants for backward compatibility
 * @deprecated Import directly from '@/constants' instead
 * 
 * deficient: <1.80%
 * subnormal: 1.80 - 2.71%
 * normal: 2.71 - 3.31%
 * high: >3.31%
 * no_data: outside sensor influence radius (neutral/gray)
 */
export { NITROGEN_THRESHOLDS };

/**
 * Default influence radius in kilometers (0.05 km = 50 meters)
 * @deprecated Import DEFAULT_INFLUENCE_RADIUS_KM from '@/constants' instead
 */
export const DEFAULT_INFLUENCE_RADIUS = DEFAULT_INFLUENCE_RADIUS_KM;

/**
 * Base location for devices (based on database.txt)
 */
const BASE_LOCATION = {
  lat: -8.1653927,
  lng: 113.7176052,
};

/**
 * Device configurations for generating realistic data
 */
const DEVICE_CONFIGS = [
  { id: 'DEV001', latOffset: 0, lngOffset: 0, nitrogenBase: 2.11 },
  { id: 'DEV002', latOffset: 0.0004, lngOffset: 0.0004, nitrogenBase: 2.85 },
  { id: 'DEV003', latOffset: -0.0003, lngOffset: -0.0006, nitrogenBase: 1.65 },
  { id: 'DEV004', latOffset: 0.0006, lngOffset: -0.0011, nitrogenBase: 3.15 },
  { id: 'DEV005', latOffset: 0.0001, lngOffset: 0.0009, nitrogenBase: 2.45 },
];

/**
 * Generate random value within a range
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number}
 */
const randomInRange = (min, max) => Math.random() * (max - min) + min;

/**
 * Generate random variation around a base value
 * @param {number} base - Base value
 * @param {number} variance - Maximum variance (±)
 * @returns {number}
 */
const withVariance = (base, variance) => base + randomInRange(-variance, variance);

/**
 * Classify nitrogen level based on thresholds
 * @param {number} nitrogen - Nitrogen value
 * @returns {string} Classification
 */
export const classifyNitrogen = (nitrogen) => {
  // Use the centralized classification function
  return classifyNitrogenValue(nitrogen);
};

/**
 * Get color for nitrogen classification
 * @param {string} classification - Nitrogen classification
 * @returns {string} Hex color
 */
export const getClassificationColor = (classification) => {
  // Use the centralized color function
  return getClassificationFillColor(classification);
};

/**
 * Generate RGB values based on nitrogen level
 * @param {number} nitrogen - Nitrogen value
 * @returns {Object} RGB values
 */
const generateRGBFromNitrogen = (nitrogen) => {
  // Higher nitrogen = more green, lower = more red
  const normalizedN = Math.min(Math.max(nitrogen, 1.0), 4.0);
  const ratio = (normalizedN - 1.0) / 3.0;
  
  return {
    R: Math.round(withVariance(1800 - ratio * 600, 100)),
    G: Math.round(withVariance(4000 + ratio * 2500, 200)),
    B: Math.round(withVariance(1100 + ratio * 200, 50)),
    O: Math.round(withVariance(4400, 200)),
    V: Math.round(withVariance(375, 25)),
    Y: Math.round(withVariance(7500, 300)),
  };
};

/**
 * Generate SPAD value from nitrogen
 * @param {number} nitrogen - Nitrogen value
 * @returns {number} SPAD value
 */
const generateSPADFromNitrogen = (nitrogen) => {
  // SPAD correlates positively with nitrogen
  const baseSPAD = 15 + (nitrogen * 5);
  return withVariance(baseSPAD, 2);
};

/**
 * Generate equation values
 * @param {number} nitrogen - Nitrogen value
 * @returns {Object} Equation values
 */
const generateEquationValues = (nitrogen) => {
  const eq1 = withVariance(nitrogen * 8, 2);
  const eq2 = withVariance(nitrogen * 7.5, 2);
  
  let classEq = 'YELLOW';
  if (nitrogen < 1.80) classEq = 'RED';
  else if (nitrogen > 3.0) classEq = 'GREEN';
  
  return { eq1, eq2, class_eq1: classEq, class_eq2: classEq };
};

/**
 * Generate A_RGB and T values
 * @param {Object} rgb - RGB values
 * @returns {Object} Calculated values
 */
const generateCalculatedValues = (rgb) => {
  const total = rgb.R + rgb.G + rgb.B;
  return {
    A_R: rgb.R / total,
    A_G: rgb.G / total,
    A_B: rgb.B / total,
    A_RGB: (rgb.R + rgb.G + rgb.B) / (rgb.O || 1),
    T_R: rgb.R / (rgb.Y || 1) * 0.1,
    T_G: rgb.G / (rgb.Y || 1) * 0.1,
    T_B: rgb.B / (rgb.Y || 1) * 0.01,
  };
};

/**
 * Generate a single device reading
 * @param {Object} config - Device configuration
 * @param {number} timestamp - Reading timestamp
 * @returns {Object} Device reading data
 */
export const generateDeviceReading = (config, timestamp = Date.now()) => {
  const nitrogen = withVariance(config.nitrogenBase, 0.15);
  const rgb = generateRGBFromNitrogen(nitrogen);
  const calculated = generateCalculatedValues(rgb);
  const equations = generateEquationValues(nitrogen);
  const spad = generateSPADFromNitrogen(nitrogen);
  
  return {
    device_id: config.id,
    lat: BASE_LOCATION.lat + config.latOffset,
    lng: BASE_LOCATION.lng + config.lngOffset,
    nitrogen,
    spad,
    ...rgb,
    ...calculated,
    ...equations,
    timestamp,
    classification: classifyNitrogen(nitrogen),
  };
};

/**
 * Generate current real-time data for all devices
 * @returns {Array} Array of device readings
 */
export const generateRealTimeData = () => {
  const timestamp = Date.now();
  return DEVICE_CONFIGS.map(config => generateDeviceReading(config, timestamp));
};

/**
 * Generate historical data for a specific time range
 * @param {number} minutesBack - How many minutes of data to generate
 * @param {number} intervalMinutes - Interval between readings (default: 1 minute)
 * @returns {Array} Array of readings with timestamps
 */
export const generateHistoricalData = (minutesBack = 60, intervalMinutes = 1) => {
  const now = Date.now();
  const readings = [];
  
  for (let i = minutesBack; i >= 0; i -= intervalMinutes) {
    const timestamp = now - (i * 60 * 1000);
    DEVICE_CONFIGS.forEach(config => {
      readings.push(generateDeviceReading(config, timestamp));
    });
  }
  
  return readings;
};

/**
 * Generate weekly average data
 * Each day's data is the average of 1440 readings (1 per minute)
 * @returns {Array} Array of daily averages for 7 days
 */
export const generateWeeklyData = () => {
  const weeklyData = [];
  const now = new Date();
  
  for (let dayOffset = 6; dayOffset >= 0; dayOffset--) {
    const date = new Date(now);
    date.setDate(date.getDate() - dayOffset);
    date.setHours(0, 0, 0, 0);
    
    // Generate averages for each device
    const dailyDeviceData = DEVICE_CONFIGS.map(config => {
      // Simulate daily variation - nitrogen slightly varies day to day
      const dailyVariance = withVariance(0, 0.2);
      const adjustedBase = config.nitrogenBase + dailyVariance;
      
      // Generate average values (simulating 1440 readings averaged)
      const nitrogen = withVariance(adjustedBase, 0.05);
      const rgb = generateRGBFromNitrogen(nitrogen);
      const calculated = generateCalculatedValues(rgb);
      const equations = generateEquationValues(nitrogen);
      const spad = generateSPADFromNitrogen(nitrogen);
      
      return {
        device_id: config.id,
        lat: BASE_LOCATION.lat + config.latOffset,
        lng: BASE_LOCATION.lng + config.lngOffset,
        nitrogen,
        spad,
        ...rgb,
        ...calculated,
        ...equations,
        classification: classifyNitrogen(nitrogen),
      };
    });
    
    // Calculate overall average for the day
    const avgNitrogen = dailyDeviceData.reduce((sum, d) => sum + d.nitrogen, 0) / dailyDeviceData.length;
    const avgSpad = dailyDeviceData.reduce((sum, d) => sum + d.spad, 0) / dailyDeviceData.length;
    const avgR = dailyDeviceData.reduce((sum, d) => sum + d.R, 0) / dailyDeviceData.length;
    const avgG = dailyDeviceData.reduce((sum, d) => sum + d.G, 0) / dailyDeviceData.length;
    const avgB = dailyDeviceData.reduce((sum, d) => sum + d.B, 0) / dailyDeviceData.length;
    
    weeklyData.push({
      date: date.toISOString().split('T')[0],
      dateLabel: date.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' }),
      avgNitrogen,
      avgSpad,
      avgR,
      avgG,
      avgB,
      classification: classifyNitrogen(avgNitrogen),
      devices: dailyDeviceData,
      readingsCount: 1440, // Simulated readings count per day
    });
  }
  
  return weeklyData;
};

/**
 * Real-time data store that updates every minute
 */
class RealTimeDataStore {
  constructor() {
    this.currentData = generateRealTimeData();
    this.historicalData = [];
    this.weeklyData = generateWeeklyData();
    this.subscribers = new Set();
    this.intervalId = null;
  }
  
  /**
   * Start generating real-time data
   * @param {number} intervalMs - Update interval in milliseconds (default: 60000 = 1 minute)
   */
  start(intervalMs = 60000) {
    if (this.intervalId) return;
    
    // Generate initial historical data (last hour)
    this.historicalData = generateHistoricalData(60, 1);
    
    this.intervalId = setInterval(() => {
      const newData = generateRealTimeData();
      this.currentData = newData;
      
      // Add to historical (keep last 60 readings per device)
      this.historicalData.push(...newData);
      const maxHistorical = DEVICE_CONFIGS.length * 60;
      if (this.historicalData.length > maxHistorical) {
        this.historicalData = this.historicalData.slice(-maxHistorical);
      }
      
      // Notify subscribers
      this.subscribers.forEach(callback => callback(this.currentData));
    }, intervalMs);
    
    console.log('RealTimeDataStore started');
  }
  
  /**
   * Stop generating real-time data
   */
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('RealTimeDataStore stopped');
    }
  }
  
  /**
   * Subscribe to data updates
   * @param {Function} callback - Callback function
   * @returns {Function} Unsubscribe function
   */
  subscribe(callback) {
    this.subscribers.add(callback);
    // Immediately call with current data
    callback(this.currentData);
    
    return () => {
      this.subscribers.delete(callback);
    };
  }
  
  /**
   * Get current data
   * @returns {Array} Current device readings
   */
  getCurrentData() {
    return this.currentData;
  }
  
  /**
   * Get historical data
   * @param {number} minutes - Minutes of history to retrieve
   * @returns {Array} Historical readings
   */
  getHistoricalData(minutes = 60) {
    const cutoff = Date.now() - (minutes * 60 * 1000);
    return this.historicalData.filter(r => r.timestamp >= cutoff);
  }
  
  /**
   * Get weekly data
   * @returns {Array} Weekly average data
   */
  getWeeklyData() {
    return this.weeklyData;
  }
  
  /**
   * Get data for a specific device
   * @param {string} deviceId - Device ID
   * @returns {Object|null} Device data
   */
  getDeviceData(deviceId) {
    return this.currentData.find(d => d.device_id === deviceId) || null;
  }
  
  /**
   * Get historical data for a specific device
   * @param {string} deviceId - Device ID
   * @param {number} minutes - Minutes of history
   * @returns {Array} Device historical data
   */
  getDeviceHistory(deviceId, minutes = 60) {
    const cutoff = Date.now() - (minutes * 60 * 1000);
    return this.historicalData.filter(
      r => r.device_id === deviceId && r.timestamp >= cutoff
    );
  }
}

// Export singleton instance
export const realTimeDataStore = new RealTimeDataStore();

// Export class for testing
export { RealTimeDataStore };

export default {
  generateRealTimeData,
  generateHistoricalData,
  generateWeeklyData,
  generateDeviceReading,
  classifyNitrogen,
  getClassificationColor,
  NITROGEN_THRESHOLDS,
  realTimeDataStore,
};
