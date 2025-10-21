export const greenhouses = [
  {
    id: "gh1",
    name: "Greenhouse #1",
    location: "Blok A - Baris 1",
    area: 200,
    type: "Hidroponik",
    currentTemp: 26.8,
    currentHumidity: 68,
    currentCO2: 420,
    soilMoisture: 65,
    lightIntensity: 42000,
    lastUpdate: "2024-08-02 14:35:00",
    status: "optimal",
    history: [
      { time: "00:00", temp: 24.5, humidity: 70, co2: 410 },
      { time: "02:00", temp: 24.2, humidity: 72, co2: 415 },
      { time: "04:00", temp: 24.0, humidity: 74, co2: 420 },
      { time: "06:00", temp: 24.5, humidity: 72, co2: 425 },
      { time: "08:00", temp: 25.8, humidity: 69, co2: 430 },
      { time: "10:00", temp: 26.5, humidity: 67, co2: 435 },
      { time: "12:00", temp: 27.2, humidity: 65, co2: 440 },
      { time: "14:00", temp: 26.8, humidity: 68, co2: 420 },
      { time: "16:00", temp: 26.3, humidity: 69, co2: 415 },
      { time: "18:00", temp: 25.9, humidity: 70, co2: 410 },
      { time: "20:00", temp: 25.5, humidity: 71, co2: 408 },
      { time: "22:00", temp: 25.0, humidity: 72, co2: 405 },
    ],
    actionHistory: [
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
    ],
    controls: {
      exhaustFan: true,
      roofVent: false,
      irrigationSystem: false,
      heatingSystem: false,
    },
  },
  {
    id: "gh2",
    name: "Greenhouse #2",
    location: "Blok A - Baris 2",
    area: 180,
    type: "Tanah Konvensional",
    currentTemp: 28.2,
    currentHumidity: 72,
    currentCO2: 445,
    soilMoisture: 58,
    lightIntensity: 38000,
    lastUpdate: "2024-08-02 14:35:00",
    status: "warning",
    history: [
      { time: "00:00", temp: 25.0, humidity: 73, co2: 420 },
      { time: "02:00", temp: 24.8, humidity: 75, co2: 425 },
      { time: "04:00", temp: 24.5, humidity: 76, co2: 430 },
      { time: "06:00", temp: 25.2, humidity: 74, co2: 435 },
      { time: "08:00", temp: 26.5, humidity: 72, co2: 440 },
      { time: "10:00", temp: 27.8, humidity: 71, co2: 445 },
      { time: "12:00", temp: 28.5, humidity: 70, co2: 450 },
      { time: "14:00", temp: 28.2, humidity: 72, co2: 445 },
      { time: "16:00", temp: 27.5, humidity: 73, co2: 440 },
      { time: "18:00", temp: 26.8, humidity: 74, co2: 435 },
      { time: "20:00", temp: 26.2, humidity: 75, co2: 430 },
      { time: "22:00", temp: 25.8, humidity: 76, co2: 425 },
    ],
    actionHistory: [
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
    ],
    controls: {
      exhaustFan: false,
      roofVent: true,
      irrigationSystem: true,
      heatingSystem: false,
    },
  },
  {
    id: "gh3",
    name: "Greenhouse #3",
    location: "Blok B - Baris 1",
    area: 220,
    type: "Aeroponik",
    currentTemp: 25.5,
    currentHumidity: 65,
    currentCO2: 395,
    soilMoisture: 70,
    lightIntensity: 45000,
    lastUpdate: "2024-08-02 14:35:00",
    status: "optimal",
    history: [
      { time: "00:00", temp: 24.0, humidity: 68, co2: 400 },
      { time: "02:00", temp: 23.8, humidity: 69, co2: 405 },
      { time: "04:00", temp: 23.5, humidity: 70, co2: 410 },
      { time: "06:00", temp: 24.0, humidity: 68, co2: 408 },
      { time: "08:00", temp: 24.8, humidity: 66, co2: 405 },
      { time: "10:00", temp: 25.2, humidity: 65, co2: 400 },
      { time: "12:00", temp: 25.8, humidity: 64, co2: 395 },
      { time: "14:00", temp: 25.5, humidity: 65, co2: 395 },
      { time: "16:00", temp: 25.0, humidity: 66, co2: 398 },
      { time: "18:00", temp: 24.5, humidity: 67, co2: 402 },
      { time: "20:00", temp: 24.2, humidity: 68, co2: 405 },
      { time: "22:00", temp: 24.0, humidity: 69, co2: 408 },
    ],
    actionHistory: [
      {
        time: "14:15",
        action: "Sistem Irigasi",
        status: "Dinyalakan",
        reason: "Kelembaban tanah turun ke 55%",
        type: "auto",
      },
      {
        time: "13:50",
        action: "Atap Ventilasi",
        status: "Dibuka",
        reason: "Ventilasi optimal",
        type: "auto",
      },
    ],
    controls: {
      exhaustFan: true,
      roofVent: true,
      irrigationSystem: false,
      heatingSystem: false,
    },
  },
];

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
  const totalGreenhouses = greenhouses.length;
  const avgTemp = (
    greenhouses.reduce((sum, gh) => sum + gh.currentTemp, 0) / totalGreenhouses
  ).toFixed(1);
  const avgHumidity = Math.round(
    greenhouses.reduce((sum, gh) => sum + gh.currentHumidity, 0) / totalGreenhouses
  );
  const avgCO2 = Math.round(
    greenhouses.reduce((sum, gh) => sum + gh.currentCO2, 0) / totalGreenhouses
  );
  const optimalCount = greenhouses.filter((gh) => gh.status === "optimal").length;

  return {
    totalGreenhouses,
    avgTemp,
    avgHumidity,
    avgCO2,
    optimalCount,
  };
};

export const getGreenhouseById = (id) => {
  return greenhouses.find((gh) => gh.id === id);
};
