/**
 * Utility functions for greenhouse monitoring and control
 * Pure functions for status calculations, formatting, and validation
 */

import { optimalRanges } from "../data/greenhouseData";

/**
 * Get parameter status based on value and optimal range
 * @param {number} value - Current parameter value
 * @param {number} min - Minimum optimal value
 * @param {number} max - Maximum optimal value
 * @returns {Object} Status object with label, color, and background classes
 */
export const getStatus = (value, min, max) => {
  if (value >= min && value <= max) {
    return {
      label: "Optimal",
      color: "text-green-600",
      bg: "bg-green-100",
    };
  }
  if (value < min || value > max) {
    return {
      label: "Perhatian",
      color: "text-orange-600",
      bg: "bg-orange-100",
    };
  }
  return {
    label: "Normal",
    color: "text-blue-600",
    bg: "bg-blue-100",
  };
};

/**
 * Get temperature status
 * @param {number} temperature - Temperature in Celsius
 * @returns {Object} Status object
 */
export const getTemperatureStatus = (temperature) => {
  const { min, max } = optimalRanges.temperature;
  return getStatus(temperature, min, max);
};

/**
 * Get humidity status
 * @param {number} humidity - Humidity percentage
 * @returns {Object} Status object
 */
export const getHumidityStatus = (humidity) => {
  const { min, max } = optimalRanges.humidity;
  return getStatus(humidity, min, max);
};

/**
 * Get CO2 level status
 * @param {number} co2Level - CO2 concentration in ppm
 * @returns {Object} Status object
 */
export const getCO2Status = (co2Level) => {
  const { min, max } = optimalRanges.co2;
  return getStatus(co2Level, min, max);
};

/**
 * Get soil moisture status
 * @param {number} moisture - Soil moisture percentage
 * @returns {Object} Status object
 */
export const getSoilMoistureStatus = (moisture) => {
  const { min, max } = optimalRanges.soilMoisture;
  return getStatus(moisture, min, max);
};

/**
 * Format temperature difference
 * @param {number} insideTemp - Inside temperature
 * @param {number} outsideTemp - Outside temperature
 * @returns {string} Formatted temperature difference
 */
export const formatTempDifference = (insideTemp, outsideTemp) => {
  const diff = Math.abs(outsideTemp - insideTemp).toFixed(1);
  const comparison = outsideTemp > insideTemp ? "lebih panas" : "lebih dingin";
  return `${diff}°C ${comparison}`;
};

/**
 * Get recommendation message based on parameter status
 * @param {string} parameter - Parameter name (temp, humidity, co2)
 * @param {number} value - Current value
 * @returns {string} Recommendation message
 */
export const getRecommendation = (parameter, value) => {
  const ranges = {
    temp: optimalRanges.temperature,
    humidity: optimalRanges.humidity,
    co2: optimalRanges.co2,
  };

  const range = ranges[parameter];
  if (!range) return "Tidak ada rekomendasi";

  if (value < range.min) {
    const actions = {
      temp: "Aktifkan sistem pemanas atau tutup ventilasi",
      humidity: "Aktifkan sistem irigasi kabut",
      co2: "Aktifkan CO₂ enrichment system",
    };
    return actions[parameter];
  }

  if (value > range.max) {
    const actions = {
      temp: "Aktifkan exhaust fan dan buka ventilasi atap",
      humidity: "Tingkatkan ventilasi udara",
      co2: "Tingkatkan ventilasi dan kurangi CO₂ enrichment",
    };
    return actions[parameter];
  }

  return "Kondisi optimal untuk pertumbuhan";
};

/**
 * Validate control state change
 * @param {boolean} autoMode - Current auto mode state
 * @param {string} controlKey - Control device key
 * @returns {Object} Validation result
 */
export const validateControlChange = (autoMode, controlKey) => {
  if (autoMode) {
    return {
      isValid: false,
      message: "Matikan mode otomatis untuk kontrol manual",
    };
  }

  const validControls = [
    "exhaustFan",
    "roofVent",
    "irrigationSystem",
    "heatingSystem",
  ];

  if (!validControls.includes(controlKey)) {
    return {
      isValid: false,
      message: "Control device tidak valid",
    };
  }

  return {
    isValid: true,
    message: "Kontrol dapat diubah",
  };
};

/**
 * Format control action message
 * @param {string} controlLabel - Control device label
 * @param {boolean} newState - New control state
 * @returns {string} Formatted action message
 */
export const formatControlAction = (controlLabel, newState) => {
  const action = newState ? "Dinyalakan" : "Dimatikan";
  return `${controlLabel} ${action}`;
};

/**
 * Get badge variant for action type
 * @param {'auto'|'manual'} type - Action type
 * @returns {string} Badge variant
 */
export const getActionTypeBadgeVariant = (type) => {
  return type === "auto" ? "outline" : "destructive";
};

/**
 * Get badge variant for action status
 * @param {string} status - Action status
 * @returns {string} Badge variant
 */
export const getActionStatusBadgeVariant = (status) => {
  return status.includes("Dinyalakan") ? "default" : "secondary";
};

/**
 * Calculate environmental health score
 * @param {number} temp - Current temperature
 * @param {number} humidity - Current humidity
 * @param {number} co2 - Current CO2 level
 * @returns {Object} Health score object
 */
export const calculateHealthScore = (temp, humidity, co2) => {
  const tempStatus = getTemperatureStatus(temp);
  const humidityStatus = getHumidityStatus(humidity);
  const co2Status = getCO2Status(co2);

  const optimalCount = [tempStatus, humidityStatus, co2Status].filter(
    (s) => s.label === "Optimal"
  ).length;

  const score = (optimalCount / 3) * 100;

  let rating = "Buruk";
  let color = "text-red-600";
  let bg = "bg-red-100";

  if (score >= 90) {
    rating = "Sempurna";
    color = "text-green-600";
    bg = "bg-green-100";
  } else if (score >= 66) {
    rating = "Baik";
    color = "text-blue-600";
    bg = "bg-blue-100";
  } else if (score >= 33) {
    rating = "Perhatian";
    color = "text-orange-600";
    bg = "bg-orange-100";
  }

  return {
    score: Math.round(score),
    rating,
    color,
    bg,
    optimalCount,
    totalParams: 3,
  };
};

/**
 * Format timestamp for display
 * @param {string} timestamp - ISO timestamp or formatted time
 * @returns {string} Formatted time
 */
export const formatTimestamp = (timestamp) => {
  if (!timestamp) return "-";
  
  // If already in HH:MM format, return as is
  if (/^\d{2}:\d{2}$/.test(timestamp)) {
    return timestamp;
  }

  try {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    return timestamp;
  }
};
