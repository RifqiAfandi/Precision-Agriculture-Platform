import { optimalRanges } from "../data/greenhouseData";
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
export const getTemperatureStatus = (temperature) => {
  const { min, max } = optimalRanges.temperature;
  return getStatus(temperature, min, max);
};
export const getHumidityStatus = (humidity) => {
  const { min, max } = optimalRanges.humidity;
  return getStatus(humidity, min, max);
};
export const getCO2Status = (co2Level) => {
  const { min, max } = optimalRanges.co2;
  return getStatus(co2Level, min, max);
};
export const getSoilMoistureStatus = (moisture) => {
  const { min, max } = optimalRanges.soilMoisture;
  return getStatus(moisture, min, max);
};
export const formatTempDifference = (insideTemp, outsideTemp) => {
  const diff = Math.abs(outsideTemp - insideTemp).toFixed(1);
  const comparison = outsideTemp > insideTemp ? "lebih panas" : "lebih dingin";
  return `${diff}°C ${comparison}`;
};
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
export const formatControlAction = (controlLabel, newState) => {
  const action = newState ? "Dinyalakan" : "Dimatikan";
  return `${controlLabel} ${action}`;
};
export const getActionTypeBadgeVariant = (type) => {
  return type === "auto" ? "outline" : "destructive";
};
export const getActionStatusBadgeVariant = (status) => {
  return status.includes("Dinyalakan") ? "default" : "secondary";
};
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
export const formatTimestamp = (timestamp) => {
  if (!timestamp) return "-";
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
