/**
 * SkyVera Weather Station Helper Functions
 * Utility functions for weather calculations, unit conversions, and data export
 */

/**
 * Convert Celsius to Fahrenheit
 * @param {number} celsius - Temperature in Celsius
 * @returns {number} Temperature in Fahrenheit
 */
export const celsiusToFahrenheit = (celsius) => {
  return (celsius * 9) / 5 + 32;
};

/**
 * Convert km/h to m/s
 * @param {number} kmh - Speed in km/h
 * @returns {number} Speed in m/s
 */
export const kmhToMs = (kmh) => {
  return kmh / 3.6;
};

/**
 * Calculate heat index from temperature and humidity
 * @param {number} temp - Temperature in Celsius
 * @param {number} humidity - Relative humidity percentage
 * @returns {number} Heat index in Celsius
 */
export const calculateHeatIndex = (temp, humidity) => {
  const tempF = celsiusToFahrenheit(temp);
  const hi =
    -42.379 +
    2.04901523 * tempF +
    10.14333127 * humidity -
    0.22475541 * tempF * humidity -
    6.83783e-3 * tempF ** 2 -
    5.481717e-2 * humidity ** 2 +
    1.22874e-3 * tempF ** 2 * humidity +
    8.5282e-4 * tempF * humidity ** 2 -
    1.99e-6 * tempF ** 2 * humidity ** 2;

  return ((hi - 32) * 5) / 9;
};

/**
 * Calculate dew point from temperature and humidity
 * @param {number} temp - Temperature in Celsius
 * @param {number} humidity - Relative humidity percentage
 * @returns {number} Dew point in Celsius
 */
export const calculateDewPoint = (temp, humidity) => {
  const a = 17.27;
  const b = 237.7;
  const alpha = ((a * temp) / (b + temp)) + Math.log(humidity / 100);
  return (b * alpha) / (a - alpha);
};

/**
 * Get wind direction from degrees
 * @param {number} degrees - Wind direction in degrees
 * @returns {string} Wind direction (N, NE, E, SE, S, SW, W, NW)
 */
export const getWindDirection = (degrees) => {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const index = Math.round(((degrees % 360) / 45)) % 8;
  return directions[index];
};

/**
 * Get AQI level description
 * @param {number} aqi - Air Quality Index value
 * @returns {Object} AQI level info
 */
export const getAQILevel = (aqi) => {
  if (aqi <= 50) return { level: "Baik", color: "green", description: "Kualitas udara baik" };
  if (aqi <= 100) return { level: "Sedang", color: "yellow", description: "Kualitas udara dapat diterima" };
  if (aqi <= 150) return { level: "Tidak Sehat (Sensitif)", color: "orange", description: "Kelompok sensitif mungkin terdampak" };
  if (aqi <= 200) return { level: "Tidak Sehat", color: "red", description: "Semua orang mulai terdampak" };
  if (aqi <= 300) return { level: "Sangat Tidak Sehat", color: "purple", description: "Peringatan kesehatan serius" };
  return { level: "Berbahaya", color: "maroon", description: "Darurat kesehatan" };
};

/**
 * Get UV index level description
 * @param {number} uvIndex - UV index value
 * @returns {Object} UV level info
 */
export const getUVLevel = (uvIndex) => {
  if (uvIndex <= 2) return { level: "Rendah", color: "green", protection: "Tidak perlu proteksi" };
  if (uvIndex <= 5) return { level: "Sedang", color: "yellow", protection: "Gunakan sunscreen" };
  if (uvIndex <= 7) return { level: "Tinggi", color: "orange", protection: "Hindari sinar matahari langsung" };
  if (uvIndex <= 10) return { level: "Sangat Tinggi", color: "red", protection: "Proteksi ekstra diperlukan" };
  return { level: "Ekstrem", color: "purple", protection: "Hindari aktivitas outdoor" };
};

/**
 * Calculate trend from data array
 * @param {Array} data - Array of numeric values
 * @returns {Object} Trend info (direction and percentage)
 */
export const calculateTrend = (data) => {
  if (!data || data.length < 2) return { direction: "stable", percentage: 0 };

  const recent = data.slice(-3);
  const older = data.slice(-6, -3);

  const recentAvg = recent.reduce((sum, val) => sum + val, 0) / recent.length;
  const olderAvg = older.reduce((sum, val) => sum + val, 0) / older.length;

  const change = ((recentAvg - olderAvg) / olderAvg) * 100;

  if (Math.abs(change) < 2) return { direction: "stable", percentage: 0 };
  if (change > 0) return { direction: "up", percentage: Math.abs(change).toFixed(1) };
  return { direction: "down", percentage: Math.abs(change).toFixed(1) };
};

/**
 * Format timestamp to readable format
 * @param {string} timestamp - ISO timestamp or date string
 * @param {boolean} includeTime - Include time in output
 * @returns {string} Formatted date string
 */
export const formatTimestamp = (timestamp, includeTime = true) => {
  const date = new Date(timestamp);
  const dateStr = date.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  if (!includeTime) return dateStr;

  const timeStr = date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${dateStr} ${timeStr}`;
};

/**
 * Export weather data to CSV format
 * @param {Array} data - Weather data array
 * @param {string} filename - Output filename
 */
export const exportToCSV = (data, filename = "skyvera_weather_data.csv") => {
  if (!data || data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      headers.map((header) => {
        const value = row[header];
        return typeof value === "string" && value.includes(",") ? `"${value}"` : value;
      }).join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};

/**
 * Export weather data to JSON format
 * @param {Object} data - Weather data object
 * @param {string} filename - Output filename
 */
export const exportToJSON = (data, filename = "skyvera_weather_data.json") => {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};

/**
 * Generate weather report for PDF export
 * @param {Object} currentData - Current weather data
 * @param {Array} historicalData - Historical weather data
 * @returns {Object} Formatted report data
 */
export const generateWeatherReport = (currentData, historicalData) => {
  const stats = {
    current: currentData,
    averages: {
      temperature: (historicalData.reduce((sum, d) => sum + d.temp, 0) / historicalData.length).toFixed(1),
      humidity: (historicalData.reduce((sum, d) => sum + d.humidity, 0) / historicalData.length).toFixed(0),
      aqi: (historicalData.reduce((sum, d) => sum + d.aqi, 0) / historicalData.length).toFixed(0),
      windSpeed: (historicalData.reduce((sum, d) => sum + d.wind, 0) / historicalData.length).toFixed(1),
    },
    extremes: {
      maxTemp: Math.max(...historicalData.map(d => d.temp)),
      minTemp: Math.min(...historicalData.map(d => d.temp)),
      maxWind: Math.max(...historicalData.map(d => d.wind)),
      totalRainfall: historicalData.reduce((sum, d) => sum + d.rainfall, 0).toFixed(1),
    },
    reportDate: new Date().toISOString(),
  };

  return stats;
};

/**
 * Validate weather parameter ranges
 * @param {string} parameter - Parameter name
 * @param {number} value - Parameter value
 * @returns {Object} Validation result
 */
export const validateWeatherParameter = (parameter, value) => {
  const ranges = {
    temperature: { min: -50, max: 60, unit: "°C" },
    humidity: { min: 0, max: 100, unit: "%" },
    co2: { min: 300, max: 5000, unit: "ppm" },
    aqi: { min: 0, max: 500, unit: "" },
    windSpeed: { min: 0, max: 200, unit: "km/h" },
    tvoc: { min: 0, max: 10, unit: "mg/m³" },
    pressure: { min: 900, max: 1100, unit: "hPa" },
    uvIndex: { min: 0, max: 15, unit: "" },
  };

  const range = ranges[parameter];
  if (!range) return { valid: false, message: "Parameter tidak dikenali" };

  const valid = value >= range.min && value <= range.max;
  const message = valid
    ? "Valid"
    : `Nilai harus antara ${range.min}-${range.max} ${range.unit}`;

  return { valid, message, range };
};
