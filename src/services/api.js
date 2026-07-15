/**
 * API Service - Precision Agriculture Platform
 * 
 * This file serves as a backward-compatible facade for the refactored API modules.
 * The original 577 line file has been split into modular domain-specific APIs.
 * 
 * Refactored structure:
 * - api/apiClient.js (~210 lines) - Core HTTP client with auth
 * - api/authApi.js (~110 lines) - Authentication endpoints
 * - api/deviceApi.js (~90 lines) - Device management
 * - api/plantApi.js (~110 lines) - Plant and readings management
 * - api/areaApi.js (~100 lines) - Area management
 * - api/analysisApi.js (~100 lines) - Kriging analysis and stats
 * 
 * For new code, prefer importing from '@/services/api':
 * @example
 * import { authApi, deviceApi, analysisApi } from '@/services/api';
 * 
 * @deprecated Direct import of this file is deprecated for new code.
 * Use modular imports from '@/services/api' instead.
 */

import { apiClient } from './api/apiClient';
import { authApi } from './api/authApi';
import { deviceApi } from './api/deviceApi';
import { plantApi, readingsApi } from './api/plantApi';
import { areaApi } from './api/areaApi';
import { analysisApi, statsApi } from './api/analysisApi';

/**
 * Backward-compatible API Service class
 * Wraps all modular APIs into a single interface
 */
class ApiService {
  constructor() {
    this.baseURL = apiClient.baseURL;
    this.timeout = apiClient.timeout;
  }

  // ==========================================
  // TOKEN MANAGEMENT (delegated to apiClient)
  // ==========================================

  getAccessToken() {
    return apiClient.getAccessToken();
  }

  getRefreshToken() {
    return apiClient.getRefreshToken();
  }

  setTokens(accessToken, refreshToken) {
    apiClient.setTokens(accessToken, refreshToken);
  }

  clearTokens() {
    apiClient.clearTokens();
  }

  isAuthenticated() {
    return apiClient.isAuthenticated();
  }

  getStoredUser() {
    return apiClient.getStoredUser();
  }

  // Core request (for custom endpoints)
  async request(endpoint, options = {}) {
    return apiClient.request(endpoint, options);
  }

  async refreshAccessToken() {
    return apiClient.refreshAccessToken();
  }

  // ==========================================
  // AUTH METHODS (delegated to authApi)
  // ==========================================

  async register(userData) {
    return authApi.register(userData);
  }

  async login(email, password) {
    return authApi.login(email, password);
  }

  async logout() {
    return authApi.logout();
  }

  async getProfile() {
    return authApi.getProfile();
  }

  async updateProfile(profileData) {
    return authApi.updateProfile(profileData);
  }

  async changePassword(passwordData) {
    return authApi.changePassword(passwordData);
  }

  // ==========================================
  // DEVICE METHODS (delegated to deviceApi)
  // ==========================================

  async getDevices() {
    return deviceApi.getAll();
  }

  async getDevice(deviceId) {
    return deviceApi.getById(deviceId);
  }

  async createDevice(deviceData) {
    return deviceApi.create(deviceData);
  }

  async updateDevice(deviceId, deviceData) {
    return deviceApi.update(deviceId, deviceData);
  }

  async deleteDevice(deviceId) {
    return deviceApi.delete(deviceId);
  }

  async getDeviceData(deviceId) {
    return deviceApi.getData(deviceId);
  }

  // ==========================================
  // KRIGING ANALYSIS (delegated to analysisApi)
  // ==========================================

  async performKrigingAnalysis(analysisData) {
    return analysisApi.performKriging(analysisData);
  }

  async quickKrigingAnalysis(points, options = {}) {
    return analysisApi.quickKriging(points, options);
  }

  async syncFirebaseDevices(devices, saveToDb = false) {
    return deviceApi.syncFromFirebase(devices, saveToDb);
  }

  async getDailyAverages() {
    return deviceApi.getDailyAverages();
  }

  async getApiHealth() {
    return statsApi.getHealth();
  }

  // ==========================================
  // AREA METHODS (delegated to areaApi)
  // ==========================================

  async getAreas() {
    return areaApi.getAll();
  }

  async getArea(areaId) {
    return areaApi.getById(areaId);
  }

  async createArea(areaData) {
    return areaApi.create(areaData);
  }

  async updateArea(areaId, areaData) {
    return areaApi.update(areaId, areaData);
  }

  async deleteArea(areaId) {
    return areaApi.delete(areaId);
  }

  async addDeviceToArea(areaId, deviceId) {
    return areaApi.addDevice(areaId, deviceId);
  }

  async removeDeviceFromArea(areaId, deviceId) {
    return areaApi.removeDevice(areaId, deviceId);
  }

  async getAreaDevices(areaId) {
    return areaApi.getDevices(areaId);
  }

  async getAreaAnalysisHistory(areaId) {
    return areaApi.getAnalysisHistory(areaId);
  }

  async getAnalysisResult(analysisId) {
    return analysisApi.getResultById(analysisId);
  }

  async getAnalysisResults() {
    return analysisApi.getResults();
  }
}

// Export singleton instance for backward compatibility
export default new ApiService();

// Also export modular APIs for new code
export { 
  apiClient, 
  authApi, 
  deviceApi, 
  plantApi, 
  readingsApi, 
  areaApi, 
  analysisApi, 
  statsApi 
};
