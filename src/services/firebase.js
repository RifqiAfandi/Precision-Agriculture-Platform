// Firebase Service for Agriino Precision Agriculture
// This module handles real-time data from Firebase for device sensors

// Firebase configuration - Replace with your actual Firebase config
const FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "your-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "your-project.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://your-project.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "your-project-id",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "your-project.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "your-sender-id",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "your-app-id"
};

/**
 * Firebase Realtime Database Service for Agriino
 * 
 * Data structure expected from Firebase:
 * {
 *   "devices": {
 *     "device_id_1": {
 *       "avg": {
 *         "A_RGB": 2.9473969492908276,
 *         "A_B": 1.3748630806678548,
 *         "A_G": 0.9325154455022591,
 *         "A_R": 0.640018423120714,
 *         "B": 1236.8,
 *         "G": 5980.8,
 *         "O": 4395.8,
 *         "R": 1569.4,
 *         "T_B": 0.04218194719753348,
 *         "T_G": 0.11681021856994982,
 *         "T_R": 0.2290760474383302,
 *         "V": 375,
 *         "Y": 7524.4,
 *         "class_eq1": "RED",
 *         "class_eq2": "RED",
 *         "eq1": 20.624981778366163,
 *         "eq2": 19.50411415100098,
 *         "lat": -8.1653927,
 *         "lng": 113.7176052,
 *         "nitrogen": 2.1100269889944236,
 *         "spad": 24.82756805419922,
 *         "timestamp": 1763714299112
 *       }
 *     }
 *   }
 * }
 */

class FirebaseService {
  constructor() {
    this.database = null;
    this.listeners = new Map();
    this.isInitialized = false;
  }

  /**
   * Initialize Firebase connection
   */
  async initialize() {
    if (this.isInitialized) return;

    try {
      // Dynamic import for Firebase modules
      const { initializeApp } = await import('firebase/app');
      const { getDatabase, ref, onValue, off, get } = await import('firebase/database');

      const app = initializeApp(FIREBASE_CONFIG);
      this.database = getDatabase(app);
      this.dbMethods = { ref, onValue, off, get };
      this.isInitialized = true;

      console.log('Firebase initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Firebase:', error);
      throw error;
    }
  }

  /**
   * Subscribe to real-time device data updates
   * @param {string} path - Firebase database path (e.g., 'devices')
   * @param {Function} callback - Callback function for data updates
   * @returns {Function} Unsubscribe function
   */
  subscribeToDevices(path = 'devices', callback) {
    if (!this.isInitialized) {
      console.error('Firebase not initialized. Call initialize() first.');
      return () => {};
    }

    const { ref, onValue } = this.dbMethods;
    const dbRef = ref(this.database, path);

    const unsubscribe = onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const devices = this.parseFirebaseDevices(data);
        callback(devices);
      }
    }, (error) => {
      console.error('Firebase subscription error:', error);
    });

    // Store listener reference for cleanup
    this.listeners.set(path, { ref: dbRef, unsubscribe });

    return () => {
      const { off } = this.dbMethods;
      off(dbRef);
      this.listeners.delete(path);
    };
  }

  /**
   * Get devices data once (non-realtime)
   * @param {string} path - Firebase database path
   * @returns {Promise<Array>} Array of device data
   */
  async getDevicesOnce(path = 'devices') {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const { ref, get } = this.dbMethods;
    const dbRef = ref(this.database, path);
    const snapshot = await get(dbRef);
    
    if (snapshot.exists()) {
      return this.parseFirebaseDevices(snapshot.val());
    }
    
    return [];
  }

  /**
   * Parse Firebase data into normalized device array
   * @param {Object} data - Raw Firebase data
   * @returns {Array} Normalized device array
   */
  parseFirebaseDevices(data) {
    const devices = [];

    if (!data) return devices;

    // Handle both object format and array format
    if (typeof data === 'object') {
      Object.entries(data).forEach(([deviceId, deviceData]) => {
        // Handle nested 'avg' structure
        const avgData = deviceData.avg || deviceData;
        
        if (avgData && typeof avgData.lat === 'number' && typeof avgData.lng === 'number') {
          devices.push({
            device_id: deviceId,
            lat: avgData.lat,
            lng: avgData.lng,
            nitrogen: avgData.nitrogen || 0,
            spad: avgData.spad,
            A_RGB: avgData.A_RGB,
            A_R: avgData.A_R,
            A_G: avgData.A_G,
            A_B: avgData.A_B,
            R: avgData.R,
            G: avgData.G,
            B: avgData.B,
            O: avgData.O,
            V: avgData.V,
            Y: avgData.Y,
            T_R: avgData.T_R,
            T_G: avgData.T_G,
            T_B: avgData.T_B,
            eq1: avgData.eq1,
            eq2: avgData.eq2,
            class_eq1: avgData.class_eq1,
            class_eq2: avgData.class_eq2,
            timestamp: avgData.timestamp,
            // Classification based on nitrogen levels
            classification: this.classifyNitrogen(avgData.nitrogen),
          });
        }
      });
    }

    return devices;
  }

  /**
   * Classify nitrogen level
   * Based on thresholds from features_update.txt:
   * deficient: < 1.80%
   * subnormal: 1.80 - 2.71
   * normal: 2.71 - 3.31
   * high: > 3.31
   * 
   * @param {number} nitrogen - Nitrogen value
   * @returns {string} Classification: 'deficient', 'subnormal', 'normal', or 'high'
   */
  classifyNitrogen(nitrogen) {
    if (nitrogen === undefined || nitrogen === null || isNaN(nitrogen)) return 'unknown';
    if (nitrogen < 1.80) return 'deficient';
    if (nitrogen < 2.71) return 'subnormal';
    if (nitrogen < 3.31) return 'normal';
    return 'high';
  }

  /**
   * Unsubscribe from all listeners
   */
  unsubscribeAll() {
    if (!this.isInitialized) return;

    const { off } = this.dbMethods;
    this.listeners.forEach(({ ref: dbRef }) => {
      off(dbRef);
    });
    this.listeners.clear();
  }

  /**
   * Get classification color based on nitrogen level
   * @param {string} classification - 'low', 'normal', or 'high'
   * @returns {Object} Color object with fill and stroke colors
   */
  getClassificationColor(classification) {
    switch (classification) {
      case 'low':
        return { fill: '#ef4444', stroke: '#dc2626', label: 'Rendah' }; // Red
      case 'high':
        return { fill: '#22c55e', stroke: '#16a34a', label: 'Tinggi' }; // Green
      case 'normal':
        return { fill: '#3b82f6', stroke: '#2563eb', label: 'Normal' }; // Blue
      default:
        return { fill: '#6b7280', stroke: '#4b5563', label: 'Unknown' }; // Gray
    }
  }
}

// Export singleton instance
const firebaseService = new FirebaseService();
export default firebaseService;

// Export class for testing
export { FirebaseService, FIREBASE_CONFIG };
