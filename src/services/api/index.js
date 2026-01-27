/**
 * API Module Index
 * 
 * Central export point for all API modules.
 * Import from this file for cleaner imports.
 * 
 * @example
 * // Import specific APIs
 * import { authApi, deviceApi, analysisApi } from '@/services/api';
 * 
 * // Use the APIs
 * await authApi.login(email, password);
 * const devices = await deviceApi.getAll();
 */

// Core client
export { apiClient, default as ApiClient } from './apiClient';

// Domain APIs
export { authApi } from './authApi';
export { deviceApi } from './deviceApi';
export { plantApi, readingsApi } from './plantApi';
export { areaApi } from './areaApi';
export { analysisApi, statsApi } from './analysisApi';
