export const plants = [
  {
    id: "1",
    name: "Tomat Hidroponik A",
    description: "Varietas Cherry, umur 45 hari",
    location: "Blok A - Lahan 1",
    coordinates: { lat: -6.2088, lng: 106.8456 },
    lastMeasurement: "2024-08-02 14:30",
    chlorophyll: 42.5,
    nitrogen: 2.6,
    recommendation: "Perlu penambahan pupuk nitrogen dalam 3 hari",
    status: "good",
    trend: "up",
  },
  {
    id: "2",
    name: "Cabai Merah B",
    description: "Varietas Keriting, umur 60 hari",
    location: "Blok B - Lahan 2",
    coordinates: { lat: -6.209, lng: 106.846 },
    lastMeasurement: "2024-08-02 14:25",
    chlorophyll: 38.2,
    nitrogen: 1.9,
    recommendation: "Kadar nitrogen rendah, segera lakukan pemupukan",
    status: "warning",
    trend: "down",
  },
  {
    id: "3",
    name: "Selada Green C",
    description: "Varietas Romaine, umur 30 hari",
    location: "Blok C - Lahan 3",
    coordinates: { lat: -6.2085, lng: 106.8465 },
    lastMeasurement: "2024-08-02 14:35",
    chlorophyll: 48.8,
    nitrogen: 3.2,
    recommendation: "Kondisi optimal, pertahankan rutinitas pemeliharaan",
    status: "excellent",
    trend: "up",
  },
];
export const historicalData = [
  { date: "25 Jul", chlorophyll: 45, nitrogen: 2.8 },
  { date: "26 Jul", chlorophyll: 44, nitrogen: 2.7 },
  { date: "27 Jul", chlorophyll: 43, nitrogen: 2.6 },
  { date: "28 Jul", chlorophyll: 42, nitrogen: 2.5 },
  { date: "29 Jul", chlorophyll: 41, nitrogen: 2.4 },
  { date: "30 Jul", chlorophyll: 40, nitrogen: 2.3 },
  { date: "31 Jul", chlorophyll: 39, nitrogen: 2.2 },
  { date: "01 Agu", chlorophyll: 38, nitrogen: 1.9 },
  { date: "02 Agu", chlorophyll: 42.5, nitrogen: 2.6 },
];
export const chlorophyllRanges = {
  excellent: { min: 45, max: Infinity },
  good: { min: 40, max: 45 },
  warning: { min: 0, max: 40 },
};
export const nitrogenRanges = {
  high: { min: 3.0, max: Infinity },
  optimal: { min: 2.5, max: 3.0 },
  moderate: { min: 2.0, max: 2.5 },
  low: { min: 0, max: 2.0 },
};
export const getAgriinoStats = () => {
  const totalPlants = plants.length;
  const avgChlorophyll =
    plants.reduce((sum, p) => sum + p.chlorophyll, 0) / totalPlants;
  const avgNitrogen =
    plants.reduce((sum, p) => sum + p.nitrogen, 0) / totalPlants;
  const needsAttention = plants.filter((p) => p.status === "warning").length;
  const excellentCount = plants.filter((p) => p.status === "excellent").length;
  const goodCount = plants.filter((p) => p.status === "good").length;

  return {
    totalPlants,
    avgChlorophyll: avgChlorophyll.toFixed(1),
    avgNitrogen: avgNitrogen.toFixed(1),
    needsAttention,
    excellentCount,
    goodCount,
    healthScore: Math.round((excellentCount / totalPlants) * 100),
  };
};
export const getPlantById = (id) => {
  return plants.find((p) => p.id === id) || null;
};
export const getRecentHistory = (days = 7) => {
  return historicalData.slice(-days);
};
