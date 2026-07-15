// Backend API Wrapper acting as Firebase Service for Agriino Precision Agriculture
// This module redirects queries to the local Django SQLite database where actual
// Firestore leaf scans have been synced.

import deviceApi from '@/services/api/deviceApi';
import { classifyNitrogenValue } from '@/constants';
import { getClassificationFillColor } from '@/constants/colors';

class FirebaseService {
  constructor() {
    this.listeners = new Map();
    this.isInitialized = false;
  }

  /**
   * Initialize connection (mocked to use backend)
   */
  async initialize() {
    this.isInitialized = true;
    console.log('Agriino database service wrapper initialized successfully');
  }

  /**
   * Subscribe to real-time device data updates (emulated via backend polling)
   * @param {string} path - Database path (e.g., 'devices')
   * @param {Function} callback - Callback function for data updates
   * @returns {Function} Unsubscribe function
   */
  subscribeToDevices(path = 'devices', callback) {
    if (!this.isInitialized) {
      this.initialize();
    }

    const pollInterval = 10000; // Poll every 10 seconds

    const fetchAndCallback = async () => {
      try {
        const rawDevices = await deviceApi.getAll();
        const devices = this.parseBackendDevices(rawDevices);
        callback(devices);
      } catch (error) {
        console.error('Error fetching devices in subscription:', error);
      }
    };

    // Initial fetch
    fetchAndCallback();

    const intervalId = setInterval(fetchAndCallback, pollInterval);
    this.listeners.set(path, { intervalId });

    return () => {
      clearInterval(intervalId);
      this.listeners.delete(path);
    };
  }

  /**
   * Get devices data once (non-realtime)
   * @param {string} path - Database path
   * @returns {Promise<Array>} Array of device data
   */
  async getDevicesOnce(path = 'devices') {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const rawDevices = await deviceApi.getAll();
      return this.parseBackendDevices(rawDevices);
    } catch (error) {
      console.error('Error in getDevicesOnce:', error);
      return [];
    }
  }

  /**
   * Parse backend device objects into the flat format expected by frontend components
   * @param {Array} rawDevices - Devices returned from backend
   * @returns {Array} Normalized device array
   */
  parseBackendDevices(rawDevices) {
    const devices = [];

    if (!rawDevices) return devices;

    rawDevices.forEach((d) => {
      const avgData = d.latest_data || {};
      
      if (typeof d.latitude === 'number' && typeof d.longitude === 'number') {
        devices.push({
          device_id: d.device_id,
          name: d.name || `Scan ${d.device_id.substring(0, 6)}`,
          lat: d.latitude,
          lng: d.longitude,
          nitrogen: avgData.nitrogen || 0,
          spad: avgData.spad,
          A_RGB: avgData.a_rgb,
          A_R: avgData.a_r,
          A_G: avgData.a_g,
          A_B: avgData.a_b,
          R: avgData.r,
          G: avgData.g,
          B: avgData.b,
          O: avgData.o,
          V: avgData.v,
          Y: avgData.y,
          T_R: avgData.t_r,
          T_G: avgData.t_g,
          T_B: avgData.t_b,
          eq1: avgData.eq1,
          eq2: avgData.eq2,
          class_eq1: avgData.class_eq1,
          class_eq2: avgData.class_eq2,
          timestamp: avgData.firebase_timestamp,
          // Classification based on nitrogen levels
          classification: this.classifyNitrogen(avgData.nitrogen),
        });
      }
    });

    return devices;
  }

  /**
   * Classify nitrogen level
   * @param {number} nitrogen - Nitrogen value
   * @returns {string} Classification
   */
  classifyNitrogen(nitrogen) {
    return classifyNitrogenValue(nitrogen);
  }

  /**
   * Unsubscribe from all active polling listeners
   */
  unsubscribeAll() {
    this.listeners.forEach(({ intervalId }) => {
      clearInterval(intervalId);
    });
    this.listeners.clear();
  }

  /**
   * Get classification color based on nitrogen level
   * @param {string} classification - classification
   * @returns {Object} Color object with fill and stroke colors
   */
  getClassificationColor(classification) {
    const fill = getClassificationFillColor(classification);
    let stroke = fill;
    let label = 'Unknown';

    if (classification === 'deficient') {
      stroke = '#dc2626';
      label = 'Rendah';
    } else if (classification === 'high') {
      stroke = '#16a34a';
      label = 'Tinggi';
    } else if (classification === 'normal') {
      stroke = '#2563eb';
      label = 'Normal';
    } else if (classification === 'subnormal') {
      stroke = '#d97706';
      label = 'Subnormal';
    }

    return { fill, stroke, label };
  }
}

// Export singleton instance
const firebaseService = new FirebaseService();
export default firebaseService;

// Export class for testing
export { FirebaseService };
