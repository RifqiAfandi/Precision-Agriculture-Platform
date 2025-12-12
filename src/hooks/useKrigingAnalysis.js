import { useState, useCallback } from 'react';
import api from '@/services/api';

/**
 * Custom hook for Kriging analysis
 * 
 * @param {Object} options - Hook options
 * @param {number} options.gridResolution - Grid resolution (default: 20)
 * @param {string} options.variogramModel - Variogram model (default: 'spherical')
 * @param {Object} options.thresholds - Classification thresholds
 * @returns {Object} Analysis state and control functions
 */
export function useKrigingAnalysis(options = {}) {
  const {
    gridResolution = 20,
    variogramModel = 'spherical',
    thresholds = { low: 1.5, high: 2.5 },
  } = options;

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Perform full Kriging analysis
   * 
   * @param {Array} devices - Array of device data with lat, lng, nitrogen
   * @param {Object} analysisOptions - Optional analysis parameters
   * @returns {Promise<Object>} Analysis result
   */
  const analyze = useCallback(async (devices, analysisOptions = {}) => {
    if (!devices || devices.length < 1) {
      const err = new Error('Minimal 1 device diperlukan untuk analisis');
      setError(err.message);
      throw err;
    }

    setLoading(true);
    setError(null);

    try {
      // Prepare device data for backend
      const deviceData = devices.map(d => ({
        device_id: d.device_id,
        lat: d.lat,
        lng: d.lng,
        nitrogen: d.nitrogen,
        spad: d.spad,
        A_RGB: d.A_RGB,
        A_R: d.A_R,
        A_G: d.A_G,
        A_B: d.A_B,
        R: d.R,
        G: d.G,
        B: d.B,
        O: d.O,
        V: d.V,
        Y: d.Y,
        T_R: d.T_R,
        T_G: d.T_G,
        T_B: d.T_B,
        eq1: d.eq1,
        eq2: d.eq2,
        class_eq1: d.class_eq1,
        class_eq2: d.class_eq2,
        timestamp: d.timestamp,
      }));

      // Calculate bounds from devices
      const lats = devices.map(d => d.lat).filter(Boolean);
      const lngs = devices.map(d => d.lng).filter(Boolean);
      const padding = 0.001;
      const bounds = lats.length > 0 && lngs.length > 0 ? {
        min_lat: Math.min(...lats) - padding,
        max_lat: Math.max(...lats) + padding,
        min_lng: Math.min(...lngs) - padding,
        max_lng: Math.max(...lngs) + padding,
      } : null;

      // Make API request
      const response = await api.performKrigingAnalysis({
        device_data: deviceData,
        grid_resolution: analysisOptions.gridResolution || gridResolution,
        variogram_model: analysisOptions.variogramModel || variogramModel,
        low_threshold: analysisOptions.lowThreshold || thresholds.low,
        high_threshold: analysisOptions.highThreshold || thresholds.high,
        area_id: analysisOptions.areaId,
        area_name: analysisOptions.areaName,
        ...bounds,
      });

      if (response.success) {
        setResult(response);
        return response;
      } else {
        throw new Error(response.message || 'Analisis gagal');
      }
    } catch (err) {
      console.error('Kriging analysis error:', err);
      setError(err.message || 'Terjadi kesalahan saat analisis');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [gridResolution, variogramModel, thresholds]);

  /**
   * Perform quick Kriging analysis with simplified format
   * 
   * @param {Array} points - Array of {lat, lng, nitrogen} objects
   * @param {Object} quickOptions - Optional parameters
   * @returns {Promise<Object>} Analysis result
   */
  const quickAnalyze = useCallback(async (points, quickOptions = {}) => {
    if (!points || points.length < 1) {
      const err = new Error('Minimal 1 titik diperlukan untuk analisis');
      setError(err.message);
      throw err;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.quickKrigingAnalysis(points, {
        resolution: quickOptions.resolution || gridResolution,
        model: quickOptions.model || variogramModel,
        lowThreshold: quickOptions.lowThreshold || thresholds.low,
        highThreshold: quickOptions.highThreshold || thresholds.high,
      });

      if (response.success) {
        setResult(response);
        return response;
      } else {
        throw new Error(response.message || 'Analisis gagal');
      }
    } catch (err) {
      console.error('Quick Kriging analysis error:', err);
      setError(err.message || 'Terjadi kesalahan saat analisis');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [gridResolution, variogramModel, thresholds]);

  /**
   * Clear analysis result
   */
  const clear = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  /**
   * Get grid points by classification
   */
  const getGridByClassification = useCallback((classification) => {
    if (!result?.grid_points) return [];
    return result.grid_points.filter(p => p.classification === classification);
  }, [result]);

  /**
   * Get input points by classification
   */
  const getInputByClassification = useCallback((classification) => {
    if (!result?.input_points) return [];
    return result.input_points.filter(p => p.classification === classification);
  }, [result]);

  return {
    // State
    result,
    loading,
    error,
    
    // Actions
    analyze,
    quickAnalyze,
    clear,
    
    // Computed
    gridPoints: result?.grid_points || [],
    inputPoints: result?.input_points || [],
    statistics: result?.statistics || null,
    variogramParams: result?.variogram_params || null,
    bounds: result?.bounds || null,
    analysisThresholds: result?.thresholds || thresholds,
    
    // Helpers
    getGridByClassification,
    getInputByClassification,
    
    // Status
    hasResult: !!result,
    isSuccess: result?.success || false,
  };
}

export default useKrigingAnalysis;
