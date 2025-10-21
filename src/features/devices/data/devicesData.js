/**
 * Device Registry Data Module
 * Central registry for all IoT devices and their configurations
 */

/**
 * Device catalog with metadata and specifications
 */
export const deviceCatalog = {
  agriino: {
    id: "agriino",
    name: "Agriino",
    displayName: "Agriino SPAD Meter",
    icon: "Leaf",
    category: "monitoring",
    description: "Monitoring Klorofil & Nitrogen",
    status: "active",
    features: [
      "SPAD Meter Low-cost",
      "Analisis Real-time",
      "Rekomendasi Pemupukan",
      "Multi-tanaman Support",
    ],
    specifications: {
      sensorType: "Optical Sensor",
      measurementRange: "0-99 SPAD",
      accuracy: "±2 SPAD units",
      connectivity: "WiFi, Bluetooth",
      powerSource: "Battery / Solar",
      dataInterval: "5 minutes",
    },
    endpoints: {
      dashboard: "/dashboard/agriino",
      api: "/api/agriino",
    },
    color: {
      primary: "bg-green-500",
      light: "bg-green-50",
      text: "text-green-700",
      border: "border-green-200",
    },
  },

  agriimeter: {
    id: "agriimeter",
    name: "Agriimeter",
    displayName: "Agriimeter DBH Meter",
    icon: "Ruler",
    category: "measurement",
    description: "Pengukur DBH Pohon",
    status: "active",
    features: [
      "Pengukuran DBH Otomatis",
      "Tracking Pertumbuhan",
      "Database Pohon",
      "Export Data CSV",
    ],
    specifications: {
      sensorType: "Ultrasonic Distance Sensor",
      measurementRange: "10-200 cm diameter",
      accuracy: "±0.5 cm",
      connectivity: "WiFi, Bluetooth",
      powerSource: "Battery",
      dataInterval: "On-demand",
    },
    endpoints: {
      dashboard: "/dashboard/agriimeter",
      api: "/api/agriimeter",
    },
    color: {
      primary: "bg-blue-500",
      light: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
    },
  },

  greenhouse: {
    id: "greenhouse",
    name: "Greenhouse Compax",
    displayName: "Greenhouse Compax",
    icon: "Home",
    category: "automation",
    description: "Monitoring & Kontrol Rumah Kaca",
    status: "active",
    features: [
      "Monitoring 6 Parameter",
      "Kontrol Otomatis",
      "History & Analytics",
      "Threshold Alerts",
    ],
    specifications: {
      sensorTypes: "Temp, Humidity, CO2, Soil, Light, pH",
      controlOutputs: "Fan, Pump, Light, Heater",
      connectivity: "WiFi, Ethernet",
      powerSource: "AC Power",
      dataInterval: "1 minute",
    },
    endpoints: {
      dashboard: "/dashboard/greenhouse",
      api: "/api/greenhouse",
    },
    color: {
      primary: "bg-emerald-500",
      light: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
    },
  },

  skyvera: {
    id: "skyvera",
    name: "SkyVera",
    displayName: "SkyVera Weather Station",
    icon: "Cloud",
    category: "monitoring",
    description: "Weather Station Professional",
    status: "active",
    features: [
      "12 Parameter Cuaca",
      "AI Weather Insights",
      "24H Forecast",
      "Multi-format Export",
    ],
    specifications: {
      sensorTypes: "Wind, Rain, Temp, Humidity, CO2, AQI, TVOC, UV, Pressure",
      measurementAccuracy: "High-precision sensors",
      connectivity: "WiFi, Ethernet, 4G",
      powerSource: "AC Power + Battery Backup",
      dataInterval: "30 seconds",
    },
    endpoints: {
      dashboard: "/dashboard/skyvera",
      api: "/api/skyvera",
    },
    color: {
      primary: "bg-sky-500",
      light: "bg-sky-50",
      text: "text-sky-700",
      border: "border-sky-200",
    },
  },
};

/**
 * Device status definitions
 */
export const deviceStatus = {
  active: {
    label: "Aktif",
    color: "text-green-600",
    bg: "bg-green-100",
    description: "Device online dan berfungsi normal",
  },
  inactive: {
    label: "Tidak Aktif",
    color: "text-gray-600",
    bg: "bg-gray-100",
    description: "Device offline atau tidak terpasang",
  },
  error: {
    label: "Error",
    color: "text-red-600",
    bg: "bg-red-100",
    description: "Device mengalami error atau malfunction",
  },
  maintenance: {
    label: "Maintenance",
    color: "text-yellow-600",
    bg: "bg-yellow-100",
    description: "Device sedang dalam maintenance",
  },
  pending: {
    label: "Pending",
    color: "text-blue-600",
    bg: "bg-blue-100",
    description: "Device menunggu setup atau konfigurasi",
  },
};

/**
 * Device categories
 */
export const deviceCategories = {
  monitoring: {
    label: "Monitoring",
    description: "Devices untuk monitoring parameter lingkungan",
    icon: "Activity",
  },
  measurement: {
    label: "Measurement",
    description: "Devices untuk pengukuran fisik",
    icon: "Ruler",
  },
  automation: {
    label: "Automation",
    description: "Devices untuk kontrol dan automasi",
    icon: "Zap",
  },
  analysis: {
    label: "Analysis",
    description: "Devices untuk analisis data",
    icon: "BarChart",
  },
};

/**
 * Get device by ID
 * @param {string} deviceId - Device identifier
 * @returns {Object|null} Device object or null if not found
 */
export const getDeviceById = (deviceId) => {
  return deviceCatalog[deviceId] || null;
};

/**
 * Get all devices as array
 * @returns {Array} Array of all devices
 */
export const getAllDevices = () => {
  return Object.values(deviceCatalog);
};

/**
 * Get devices by category
 * @param {string} category - Category name
 * @returns {Array} Array of devices in category
 */
export const getDevicesByCategory = (category) => {
  return getAllDevices().filter((device) => device.category === category);
};

/**
 * Get devices by status
 * @param {string} status - Status name
 * @returns {Array} Array of devices with status
 */
export const getDevicesByStatus = (status) => {
  return getAllDevices().filter((device) => device.status === status);
};

/**
 * Check if device is installed
 * @param {string} deviceId - Device identifier
 * @param {Array} installedDevices - Array of installed device IDs
 * @returns {boolean} True if device is installed
 */
export const isDeviceInstalled = (deviceId, installedDevices) => {
  return installedDevices.includes(deviceId);
};

/**
 * Get available devices for installation
 * @param {Array} installedDevices - Array of installed device IDs
 * @returns {Array} Array of available devices
 */
export const getAvailableDevices = (installedDevices) => {
  return getAllDevices().filter((device) => !installedDevices.includes(device.id));
};

/**
 * Get installed devices
 * @param {Array} installedDevices - Array of installed device IDs
 * @returns {Array} Array of installed device objects
 */
export const getInstalledDevices = (installedDevices) => {
  return installedDevices
    .map((id) => getDeviceById(id))
    .filter((device) => device !== null);
};
