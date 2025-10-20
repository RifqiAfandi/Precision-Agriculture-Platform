/**
 * Utility functions for Agriino plant monitoring
 * Pure functions for status, calculations, and validation
 */

import {
  chlorophyllRanges,
  nitrogenRanges,
} from "../data/agriinoData";

/**
 * Get status color class based on plant health status
 * @param {'excellent'|'good'|'warning'} status - Plant health status
 * @returns {string} Tailwind CSS classes
 */
export const getStatusColor = (status) => {
  const colors = {
    excellent: "bg-green-100 text-green-700",
    good: "bg-blue-100 text-blue-700",
    warning: "bg-orange-100 text-orange-700",
  };
  return colors[status] || "bg-gray-100 text-gray-700";
};

/**
 * Get status label in Indonesian
 * @param {'excellent'|'good'|'warning'} status - Plant health status
 * @returns {string} Status label
 */
export const getStatusLabel = (status) => {
  const labels = {
    excellent: "Sangat Baik",
    good: "Baik",
    warning: "Perlu Perhatian",
  };
  return labels[status] || "Normal";
};

/**
 * Determine plant health status based on chlorophyll and nitrogen levels
 * @param {number} chlorophyll - Chlorophyll index
 * @param {number} nitrogen - Nitrogen level (mg/L)
 * @returns {'excellent'|'good'|'warning'} Health status
 */
export const calculatePlantStatus = (chlorophyll, nitrogen) => {
  // Check chlorophyll level
  if (chlorophyll >= chlorophyllRanges.excellent.min) {
    // Excellent chlorophyll, check nitrogen
    if (nitrogen >= nitrogenRanges.optimal.min) {
      return "excellent";
    }
    return "good";
  }

  if (chlorophyll >= chlorophyllRanges.good.min) {
    // Good chlorophyll, check nitrogen
    if (nitrogen >= nitrogenRanges.moderate.min) {
      return "good";
    }
    return "warning";
  }

  // Low chlorophyll
  return "warning";
};

/**
 * Get chlorophyll level status color for table
 * @param {number} chlorophyll - Chlorophyll index
 * @returns {string} Tailwind CSS classes
 */
export const getChlorophyllColor = (chlorophyll) => {
  if (chlorophyll > 45) {
    return "bg-green-100 text-green-700";
  }
  if (chlorophyll > 40) {
    return "bg-yellow-100 text-yellow-700";
  }
  return "bg-red-100 text-red-700";
};

/**
 * Get nitrogen level interpretation
 * @param {number} nitrogen - Nitrogen level (mg/L)
 * @returns {Object} Interpretation object
 */
export const getNitrogenInterpretation = (nitrogen) => {
  if (nitrogen >= nitrogenRanges.high.min) {
    return {
      level: "Tinggi",
      color: "text-blue-600",
      bg: "bg-blue-100",
      recommendation: "Level nitrogen sangat baik, pertahankan pemeliharaan",
    };
  }

  if (nitrogen >= nitrogenRanges.optimal.min) {
    return {
      level: "Optimal",
      color: "text-green-600",
      bg: "bg-green-100",
      recommendation: "Level nitrogen optimal untuk pertumbuhan",
    };
  }

  if (nitrogen >= nitrogenRanges.moderate.min) {
    return {
      level: "Cukup",
      color: "text-yellow-600",
      bg: "bg-yellow-100",
      recommendation: "Pertimbangkan penambahan pupuk dalam beberapa hari",
    };
  }

  return {
    level: "Rendah",
    color: "text-red-600",
    bg: "bg-red-100",
    recommendation: "Segera lakukan pemupukan nitrogen",
  };
};

/**
 * Generate AI recommendation based on plant data
 * @param {number} chlorophyll - Chlorophyll index
 * @param {number} nitrogen - Nitrogen level
 * @param {'up'|'down'} trend - Trend direction
 * @returns {string} AI recommendation
 */
export const generateRecommendation = (chlorophyll, nitrogen, trend) => {
  const status = calculatePlantStatus(chlorophyll, nitrogen);
  const nitrogenInfo = getNitrogenInterpretation(nitrogen);

  if (status === "excellent" && trend === "up") {
    return "Kondisi optimal, pertahankan rutinitas pemeliharaan saat ini";
  }

  if (status === "excellent" && trend === "down") {
    return "Kondisi masih baik, monitor penurunan dan siapkan tindakan preventif";
  }

  if (status === "good") {
    if (nitrogen < nitrogenRanges.optimal.min) {
      return "Perlu penambahan pupuk nitrogen dalam 3-5 hari";
    }
    return "Kondisi baik, lanjutkan pemeliharaan rutin";
  }

  if (status === "warning") {
    if (chlorophyll < chlorophyllRanges.good.min) {
      return "Klorofil rendah - periksa intensitas cahaya dan kesehatan daun";
    }
    return nitrogenInfo.recommendation;
  }

  return "Monitor kondisi tanaman secara berkala";
};

/**
 * Validate new plant form data
 * @param {Object} plantData - Plant form data
 * @param {string} plantData.name - Plant name
 * @param {string} plantData.location - Plant location
 * @param {string} [plantData.description] - Plant description
 * @returns {Object} Validation result
 */
export const validatePlantForm = (plantData) => {
  const errors = {};

  if (!plantData.name || plantData.name.trim().length === 0) {
    errors.name = "Nama tanaman harus diisi";
  } else if (plantData.name.trim().length < 3) {
    errors.name = "Nama tanaman minimal 3 karakter";
  }

  if (!plantData.location || plantData.location.trim().length === 0) {
    errors.location = "Lokasi harus diisi";
  } else if (plantData.location.trim().length < 3) {
    errors.location = "Lokasi minimal 3 karakter";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Calculate trend direction from historical data
 * @param {Array} history - Historical data array
 * @param {string} metric - Metric to analyze ('chlorophyll' or 'nitrogen')
 * @returns {'up'|'down'|'stable'} Trend direction
 */
export const calculateTrend = (history, metric = "chlorophyll") => {
  if (!history || history.length < 2) return "stable";

  const recent = history.slice(-3);
  const values = recent.map((d) => d[metric]);

  const increasing = values.every((val, i) => i === 0 || val >= values[i - 1]);
  const decreasing = values.every((val, i) => i === 0 || val <= values[i - 1]);

  if (increasing) return "up";
  if (decreasing) return "down";
  return "stable";
};

/**
 * Format timestamp for display
 * @param {string} timestamp - ISO timestamp or formatted datetime
 * @returns {string} Formatted timestamp
 */
export const formatTimestamp = (timestamp) => {
  if (!timestamp) return "-";

  try {
    const date = new Date(timestamp);
    return date.toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    return timestamp;
  }
};

/**
 * Calculate health score percentage
 * @param {number} chlorophyll - Chlorophyll index
 * @param {number} nitrogen - Nitrogen level
 * @returns {number} Health score (0-100)
 */
export const calculateHealthScore = (chlorophyll, nitrogen) => {
  // Normalize chlorophyll (0-60 range to 0-100)
  const chlorophyllScore = Math.min((chlorophyll / 50) * 100, 100);

  // Normalize nitrogen (0-4 range to 0-100)
  const nitrogenScore = Math.min((nitrogen / 3.5) * 100, 100);

  // Weighted average (chlorophyll 60%, nitrogen 40%)
  const healthScore = chlorophyllScore * 0.6 + nitrogenScore * 0.4;

  return Math.round(healthScore);
};

/**
 * Get fertilization schedule recommendation
 * @param {number} nitrogen - Current nitrogen level
 * @returns {Object} Schedule recommendation
 */
export const getFertilizationSchedule = (nitrogen) => {
  if (nitrogen >= nitrogenRanges.high.min) {
    return {
      urgency: "low",
      days: 10,
      message: "Pemupukan berikutnya dalam 10 hari",
      color: "text-green-600",
    };
  }

  if (nitrogen >= nitrogenRanges.optimal.min) {
    return {
      urgency: "medium",
      days: 5,
      message: "Pemupukan disarankan dalam 5 hari",
      color: "text-blue-600",
    };
  }

  if (nitrogen >= nitrogenRanges.moderate.min) {
    return {
      urgency: "high",
      days: 3,
      message: "Perlu pemupukan dalam 3 hari",
      color: "text-orange-600",
    };
  }

  return {
    urgency: "urgent",
    days: 1,
    message: "Pemupukan segera diperlukan",
    color: "text-red-600",
  };
};

/**
 * Export plant data to CSV format
 * @param {Array} plants - Array of plant objects
 * @returns {string} CSV string
 */
export const exportToCsv = (plants) => {
  const headers = [
    "Nama Tanaman",
    "Lokasi",
    "Deskripsi",
    "Indeks Klorofil",
    "Nitrogen (mg/L)",
    "Status",
    "Rekomendasi",
    "Pengukuran Terakhir",
  ];

  const rows = plants.map((plant) => [
    plant.name,
    plant.location,
    plant.description,
    plant.chlorophyll,
    plant.nitrogen,
    getStatusLabel(plant.status),
    plant.recommendation,
    plant.lastMeasurement,
  ]);

  const csv = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");

  return csv;
};
