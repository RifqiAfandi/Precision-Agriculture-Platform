export const currentData = {
  insideTemp: 26.8,
  outsideTemp: 28.5,
  insideHumidity: 68,
  outsideHumidity: 72,
  co2Level: 420,
  soilMoisture: 65,
  lightIntensity: 42000,
  lastUpdate: "2024-08-02 14:35:00",
};
export const hourlyData = [
  { time: "00:00", insideTemp: 24.5, humidity: 70, co2: 410 },
  { time: "02:00", insideTemp: 24.2, humidity: 72, co2: 415 },
  { time: "04:00", insideTemp: 24.0, humidity: 74, co2: 420 },
  { time: "06:00", insideTemp: 24.5, humidity: 72, co2: 425 },
  { time: "08:00", insideTemp: 25.8, humidity: 69, co2: 430 },
  { time: "10:00", insideTemp: 26.5, humidity: 67, co2: 435 },
  { time: "12:00", insideTemp: 27.2, humidity: 65, co2: 440 },
  { time: "14:00", insideTemp: 26.8, humidity: 68, co2: 420 },
  { time: "16:00", insideTemp: 26.3, humidity: 69, co2: 415 },
  { time: "18:00", insideTemp: 25.9, humidity: 70, co2: 410 },
  { time: "20:00", insideTemp: 25.5, humidity: 71, co2: 408 },
  { time: "22:00", insideTemp: 25.0, humidity: 72, co2: 405 },
];
export const actionHistory = [
  {
    time: "14:30",
    action: "Exhaust Fan",
    status: "Dinyalakan",
    reason: "Suhu dalam mencapai 27.5°C",
    type: "auto",
  },
  {
    time: "14:25",
    action: "Atap Ventilasi",
    status: "Ditutup",
    reason: "Manual oleh pengguna",
    type: "manual",
  },
  {
    time: "14:20",
    action: "Sistem Irigasi",
    status: "Dimatikan",
    reason: "Kelembaban tanah optimal (65%)",
    type: "auto",
  },
  {
    time: "14:10",
    action: "CO₂ Enrichment",
    status: "Diaktifkan",
    reason: "Level CO₂ turun ke 380 ppm",
    type: "auto",
  },
  {
    time: "14:00",
    action: "Sistem Pemanas",
    status: "Dimatikan",
    reason: "Suhu optimal tercapai (26.5°C)",
    type: "auto",
  },
  {
    time: "13:45",
    action: "Exhaust Fan",
    status: "Dimatikan",
    reason: "Manual oleh pengguna",
    type: "manual",
  },
];
export const controlDevices = [
  {
    key: "exhaustFan",
    label: "Exhaust Fan",
    description: "Ventilasi udara keluar",
  },
  {
    key: "roofVent",
    label: "Atap Ventilasi",
    description: "Bukaan atap otomatis",
  },
  {
    key: "irrigationSystem",
    label: "Sistem Irigasi",
    description: "Penyiraman otomatis",
  },
  {
    key: "heatingSystem",
    label: "Sistem Pemanas",
    description: "Kontrol suhu minimum",
  },
];
export const optimalRanges = {
  temperature: { min: 24, max: 28, unit: "°C" },
  humidity: { min: 60, max: 75, unit: "%" },
  co2: { min: 380, max: 450, unit: "ppm" },
  soilMoisture: { min: 50, max: 70, unit: "%" },
};
export const getGreenhouseStats = () => {
  return {
    tempDifference: (currentData.outsideTemp - currentData.insideTemp).toFixed(1),
    humidityDifference: (currentData.outsideHumidity - currentData.insideHumidity).toFixed(1),
    avgTemp: (hourlyData.reduce((sum, d) => sum + d.insideTemp, 0) / hourlyData.length).toFixed(1),
    avgHumidity: (hourlyData.reduce((sum, d) => sum + d.humidity, 0) / hourlyData.length).toFixed(1),
    avgCO2: Math.round(hourlyData.reduce((sum, d) => sum + d.co2, 0) / hourlyData.length),
  };
};
