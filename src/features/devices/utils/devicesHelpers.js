/**
 * Device Management Utilities
 * Helper functions for device operations and management
 */

/**
 * Save installed devices to localStorage
 * @param {Array} devices - Array of installed device IDs
 */
export const saveInstalledDevices = (devices) => {
  try {
    localStorage.setItem("agri-installed-devices", JSON.stringify(devices));
    return true;
  } catch (error) {
    console.error("Failed to save installed devices:", error);
    return false;
  }
};

/**
 * Load installed devices from localStorage
 * @param {Array} defaultDevices - Default devices if none saved
 * @returns {Array} Array of installed device IDs
 */
export const loadInstalledDevices = (defaultDevices = ["agriino", "agriimeter"]) => {
  try {
    const saved = localStorage.getItem("agri-installed-devices");
    return saved ? JSON.parse(saved) : defaultDevices;
  } catch (error) {
    console.error("Failed to load installed devices:", error);
    return defaultDevices;
  }
};

/**
 * Add device to installed list
 * @param {string} deviceId - Device identifier
 * @param {Array} currentDevices - Current installed devices
 * @returns {Array} Updated device list
 */
export const addDevice = (deviceId, currentDevices) => {
  if (currentDevices.includes(deviceId)) {
    return currentDevices;
  }
  const updated = [...currentDevices, deviceId];
  saveInstalledDevices(updated);
  return updated;
};

/**
 * Remove device from installed list
 * @param {string} deviceId - Device identifier
 * @param {Array} currentDevices - Current installed devices
 * @returns {Array} Updated device list
 */
export const removeDevice = (deviceId, currentDevices) => {
  const updated = currentDevices.filter((id) => id !== deviceId);
  saveInstalledDevices(updated);
  return updated;
};

/**
 * Validate device installation
 * @param {string} deviceId - Device identifier
 * @param {Object} config - Device configuration
 * @returns {Object} Validation result
 */
export const validateDeviceInstallation = (deviceId, config) => {
  const errors = {};

  if (!deviceId || deviceId.trim() === "") {
    errors.deviceId = "Device ID is required";
  }

  if (config?.serialNumber && config.serialNumber.length < 8) {
    errors.serialNumber = "Serial number must be at least 8 characters";
  }

  if (config?.location && config.location.trim() === "") {
    errors.location = "Location is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Generate device serial number
 * @param {string} deviceId - Device identifier
 * @returns {string} Generated serial number
 */
export const generateSerialNumber = (deviceId) => {
  const prefix = deviceId.substring(0, 3).toUpperCase();
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

/**
 * Format device uptime
 * @param {number} seconds - Uptime in seconds
 * @returns {string} Formatted uptime string
 */
export const formatUptime = (seconds) => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);

  return parts.length > 0 ? parts.join(" ") : "< 1m";
};

/**
 * Calculate device health score
 * @param {Object} deviceMetrics - Device metrics
 * @returns {number} Health score 0-100
 */
export const calculateDeviceHealth = (deviceMetrics) => {
  let score = 100;

  // Connectivity issues
  if (deviceMetrics.lastSeen) {
    const minutesSinceLastSeen = (Date.now() - new Date(deviceMetrics.lastSeen)) / 60000;
    if (minutesSinceLastSeen > 60) score -= 30;
    else if (minutesSinceLastSeen > 30) score -= 15;
    else if (minutesSinceLastSeen > 10) score -= 5;
  }

  // Error rate
  if (deviceMetrics.errorRate > 0.1) score -= 20;
  else if (deviceMetrics.errorRate > 0.05) score -= 10;

  // Battery level (if applicable)
  if (deviceMetrics.batteryLevel !== undefined) {
    if (deviceMetrics.batteryLevel < 20) score -= 15;
    else if (deviceMetrics.batteryLevel < 50) score -= 5;
  }

  // Signal strength
  if (deviceMetrics.signalStrength < 30) score -= 10;
  else if (deviceMetrics.signalStrength < 50) score -= 5;

  return Math.max(0, Math.min(100, score));
};

/**
 * Get health status from score
 * @param {number} score - Health score 0-100
 * @returns {Object} Status object with label and color
 */
export const getHealthStatus = (score) => {
  if (score >= 90) {
    return { label: "Excellent", color: "text-green-600", bg: "bg-green-100" };
  } else if (score >= 70) {
    return { label: "Good", color: "text-blue-600", bg: "bg-blue-100" };
  } else if (score >= 50) {
    return { label: "Fair", color: "text-yellow-600", bg: "bg-yellow-100" };
  } else if (score >= 30) {
    return { label: "Poor", color: "text-orange-600", bg: "bg-orange-100" };
  } else {
    return { label: "Critical", color: "text-red-600", bg: "bg-red-100" };
  }
};

/**
 * Check if device needs maintenance
 * @param {Object} device - Device object
 * @param {Object} metrics - Device metrics
 * @returns {boolean} True if maintenance needed
 */
export const needsMaintenance = (device, metrics) => {
  const healthScore = calculateDeviceHealth(metrics);
  const daysSinceLastMaintenance =
    (Date.now() - new Date(metrics.lastMaintenance || 0)) / 86400000;

  return healthScore < 70 || daysSinceLastMaintenance > 90;
};

/**
 * Export device configuration
 * @param {Object} device - Device object
 * @param {Object} config - Device configuration
 * @returns {string} JSON configuration string
 */
export const exportDeviceConfig = (device, config) => {
  const exportData = {
    device: {
      id: device.id,
      name: device.name,
      type: device.category,
    },
    configuration: config,
    exportedAt: new Date().toISOString(),
    version: "1.0",
  };

  return JSON.stringify(exportData, null, 2);
};

/**
 * Import device configuration
 * @param {string} configString - JSON configuration string
 * @returns {Object} Parsed configuration or null if invalid
 */
export const importDeviceConfig = (configString) => {
  try {
    const config = JSON.parse(configString);

    // Validate required fields
    if (!config.device || !config.configuration) {
      throw new Error("Invalid configuration format");
    }

    return config;
  } catch (error) {
    console.error("Failed to import device configuration:", error);
    return null;
  }
};

/**
 * Get device icon component name
 * @param {string} iconName - Icon name from device data
 * @returns {string} Lucide icon component name
 */
export const getDeviceIcon = (iconName) => {
  const iconMap = {
    Leaf: "Leaf",
    Ruler: "Ruler",
    Home: "Home",
    Cloud: "Cloud",
    Gauge: "Gauge",
    Activity: "Activity",
    Zap: "Zap",
    BarChart: "BarChart2",
  };

  return iconMap[iconName] || "Box";
};

/**
 * Sort devices by criteria
 * @param {Array} devices - Array of devices
 * @param {string} sortBy - Sort criteria (name, category, status)
 * @param {string} order - Sort order (asc, desc)
 * @returns {Array} Sorted devices
 */
export const sortDevices = (devices, sortBy = "name", order = "asc") => {
  const sorted = [...devices].sort((a, b) => {
    let compareValue = 0;

    switch (sortBy) {
      case "name":
        compareValue = a.name.localeCompare(b.name);
        break;
      case "category":
        compareValue = a.category.localeCompare(b.category);
        break;
      case "status":
        compareValue = a.status.localeCompare(b.status);
        break;
      default:
        compareValue = 0;
    }

    return order === "asc" ? compareValue : -compareValue;
  });

  return sorted;
};

/**
 * Filter devices by search query
 * @param {Array} devices - Array of devices
 * @param {string} query - Search query
 * @returns {Array} Filtered devices
 */
export const searchDevices = (devices, query) => {
  if (!query || query.trim() === "") {
    return devices;
  }

  const lowerQuery = query.toLowerCase();

  return devices.filter(
    (device) =>
      device.name.toLowerCase().includes(lowerQuery) ||
      device.description.toLowerCase().includes(lowerQuery) ||
      device.category.toLowerCase().includes(lowerQuery)
  );
};
