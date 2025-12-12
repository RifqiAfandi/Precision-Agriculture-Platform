import { useState, useEffect, useCallback, useRef } from 'react';
import firebaseService from '@/services/firebase';

/**
 * Custom hook for managing Firebase device data
 * 
 * @param {string} path - Firebase database path (default: 'devices')
 * @param {Object} options - Hook options
 * @param {boolean} options.realtime - Enable real-time updates (default: true)
 * @param {Object} options.thresholds - Nitrogen classification thresholds
 * @returns {Object} Device data and control functions
 */
export function useFirebaseDevices(path = 'devices', options = {}) {
  const {
    realtime = true,
    thresholds = { low: 1.5, high: 2.5 },
  } = options;

  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connected, setConnected] = useState(false);
  const unsubscribeRef = useRef(null);

  // Classify nitrogen level
  const classifyNitrogen = useCallback((value) => {
    if (value === undefined || value === null) return 'unknown';
    if (value < thresholds.low) return 'low';
    if (value > thresholds.high) return 'high';
    return 'normal';
  }, [thresholds]);

  // Process devices with classification
  const processDevices = useCallback((rawDevices) => {
    return rawDevices.map(device => ({
      ...device,
      classification: classifyNitrogen(device.nitrogen),
    }));
  }, [classifyNitrogen]);

  // Initialize Firebase and subscribe
  useEffect(() => {
    let isMounted = true;

    const initializeFirebase = async () => {
      try {
        setLoading(true);
        setError(null);
        
        await firebaseService.initialize();

        if (!isMounted) return;

        if (realtime) {
          // Subscribe to real-time updates
          unsubscribeRef.current = firebaseService.subscribeToDevices(path, (data) => {
            if (isMounted) {
              setDevices(processDevices(data));
              setConnected(true);
              setLoading(false);
            }
          });
        } else {
          // One-time fetch
          const data = await firebaseService.getDevicesOnce(path);
          if (isMounted) {
            setDevices(processDevices(data));
            setConnected(true);
            setLoading(false);
          }
        }
      } catch (err) {
        console.error('Firebase hook error:', err);
        if (isMounted) {
          setError(err.message || 'Failed to connect to Firebase');
          setConnected(false);
          setLoading(false);
        }
      }
    };

    initializeFirebase();

    return () => {
      isMounted = false;
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [path, realtime, processDevices]);

  // Manual refresh
  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const data = await firebaseService.getDevicesOnce(path);
      setDevices(processDevices(data));
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to refresh data');
    } finally {
      setLoading(false);
    }
  }, [path, processDevices]);

  // Compute statistics
  const statistics = useCallback(() => {
    if (devices.length === 0) {
      return {
        count: 0,
        avgNitrogen: 0,
        minNitrogen: 0,
        maxNitrogen: 0,
        lowCount: 0,
        normalCount: 0,
        highCount: 0,
      };
    }

    const nitrogenValues = devices
      .map(d => d.nitrogen)
      .filter(v => typeof v === 'number');

    return {
      count: devices.length,
      avgNitrogen: nitrogenValues.length > 0 
        ? nitrogenValues.reduce((a, b) => a + b, 0) / nitrogenValues.length 
        : 0,
      minNitrogen: nitrogenValues.length > 0 ? Math.min(...nitrogenValues) : 0,
      maxNitrogen: nitrogenValues.length > 0 ? Math.max(...nitrogenValues) : 0,
      lowCount: devices.filter(d => d.classification === 'low').length,
      normalCount: devices.filter(d => d.classification === 'normal').length,
      highCount: devices.filter(d => d.classification === 'high').length,
    };
  }, [devices]);

  // Compute bounds
  const bounds = useCallback(() => {
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

  return {
    devices,
    loading,
    error,
    connected,
    refresh,
    statistics: statistics(),
    bounds: bounds(),
    thresholds,
  };
}

export default useFirebaseDevices;
