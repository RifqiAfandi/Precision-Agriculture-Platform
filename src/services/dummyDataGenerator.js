// Real database data wrapper acting as Dummy Data Generator Service for Agriino
// This module intercepts dummy requests and serves actual synced database data.

import firebaseService from './firebase';
import deviceApi from './api/deviceApi';
import { NITROGEN_THRESHOLDS } from '@/constants';

export const classifyNitrogen = (nitrogen) => {
  return firebaseService.classifyNitrogen(nitrogen);
};

export const getClassificationColor = (classification) => {
  return firebaseService.getClassificationColor(classification).fill;
};

class RealTimeDataStore {
  constructor() {
    this.currentData = [];
    this.historicalData = [];
    this.weeklyData = [];
    this.subscribers = new Set();
    this.intervalId = null;
    this.pollInterval = 10000; // Poll every 10 seconds
  }

  /**
   * Fetch actual data from backend
   */
  async fetchRealData() {
    try {
      // 1. Fetch current devices (synced Firestore scans)
      const devices = await firebaseService.getDevicesOnce();
      this.currentData = devices;
      
      // Sort by timestamp for chronological history representation
      this.historicalData = [...devices].sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
      
      // 2. Fetch weekly averages from backend
      const weekly = await deviceApi.getDailyAverages();
      this.weeklyData = weekly;
      
      // Notify all subscribers
      this.subscribers.forEach((callback) => callback(this.currentData));
    } catch (error) {
      console.error("Error in RealTimeDataStore fetchRealData:", error);
    }
  }

  /**
   * Start fetching actual data on interval
   * @param {number} intervalMs - Polling interval in ms
   */
  start(intervalMs = 10000) {
    if (this.intervalId) return;
    
    this.pollInterval = intervalMs;
    this.fetchRealData();
    
    this.intervalId = setInterval(() => {
      this.fetchRealData();
    }, this.pollInterval);
    
    console.log('RealTimeDataStore initialized with active backend polling');
  }

  /**
   * Stop interval polling
   */
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('RealTimeDataStore stopped');
    }
  }

  /**
   * Subscribe to updates
   * @param {Function} callback - Callback function
   * @returns {Function} Unsubscribe function
   */
  subscribe(callback) {
    this.subscribers.add(callback);
    callback(this.currentData);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  getCurrentData() {
    return this.currentData;
  }

  getHistoricalData(minutes = 60) {
    // Return chronological history of synced scans
    return this.historicalData;
  }

  getWeeklyData() {
    return this.weeklyData;
  }

  getDeviceData(deviceId) {
    return this.currentData.find((d) => d.device_id === deviceId) || null;
  }

  getDeviceHistory(deviceId, minutes = 60) {
    return this.historicalData.filter((r) => r.device_id === deviceId);
  }
}

export const realTimeDataStore = new RealTimeDataStore();

export { NITROGEN_THRESHOLDS };
export default {
  classifyNitrogen,
  getClassificationColor,
  NITROGEN_THRESHOLDS,
  realTimeDataStore,
};
