export const currentWeatherData = {
  windSpeed: 12.3,
  rainfall: 4.8,
  temperature: 29.1,
  humidity: 78,
  co2: 415,
  tvoc: 0.36,
  aqi: 57,
  pressure: 1013.2,
  uvIndex: 7,
  visibility: 8.5,
  lastUpdate: "2024-08-02 14:35:00",
};
export const hourlyWeatherData = [
  { time: "00:00", temp: 26.5, humidity: 85, co2: 390, aqi: 45, wind: 8.2, rainfall: 0 },
  { time: "02:00", temp: 26.1, humidity: 87, co2: 388, aqi: 43, wind: 7.8, rainfall: 0 },
  { time: "04:00", temp: 25.8, humidity: 89, co2: 385, aqi: 41, wind: 6.5, rainfall: 0.2 },
  { time: "06:00", temp: 26.2, humidity: 86, co2: 392, aqi: 44, wind: 9.1, rainfall: 1.2 },
  { time: "08:00", temp: 27.5, humidity: 82, co2: 405, aqi: 48, wind: 11.3, rainfall: 2.1 },
  { time: "10:00", temp: 28.8, humidity: 79, co2: 412, aqi: 52, wind: 13.5, rainfall: 3.4 },
  { time: "12:00", temp: 30.2, humidity: 75, co2: 420, aqi: 58, wind: 15.2, rainfall: 4.8 },
  { time: "14:00", temp: 29.1, humidity: 78, co2: 415, aqi: 57, wind: 12.3, rainfall: 4.8 },
  { time: "16:00", temp: 28.5, humidity: 80, co2: 408, aqi: 54, wind: 10.8, rainfall: 3.9 },
  { time: "18:00", temp: 27.8, humidity: 83, co2: 398, aqi: 49, wind: 9.7, rainfall: 2.5 },
  { time: "20:00", temp: 27.2, humidity: 85, co2: 394, aqi: 47, wind: 8.9, rainfall: 1.1 },
  { time: "22:00", temp: 26.8, humidity: 87, co2: 391, aqi: 45, wind: 8.1, rainfall: 0.3 },
];
export const dailyWeatherData = [
  { day: "Sen", avgTemp: 27.2, totalRain: 12.5, maxWind: 18.2, avgAQI: 48, humidity: 82, co2: 405 },
  { day: "Sel", avgTemp: 28.1, totalRain: 8.3, maxWind: 15.7, avgAQI: 52, humidity: 78, co2: 412 },
  { day: "Rab", avgTemp: 26.8, totalRain: 25.2, maxWind: 22.1, avgAQI: 45, humidity: 88, co2: 395 },
  { day: "Kam", avgTemp: 29.5, totalRain: 5.1, maxWind: 14.3, avgAQI: 55, humidity: 75, co2: 418 },
  { day: "Jum", avgTemp: 30.2, totalRain: 2.8, maxWind: 16.8, avgAQI: 62, humidity: 72, co2: 425 },
  { day: "Sab", avgTemp: 29.8, totalRain: 7.4, maxWind: 13.9, avgAQI: 58, humidity: 76, co2: 415 },
  { day: "Min", avgTemp: 28.9, totalRain: 15.6, maxWind: 17.5, avgAQI: 51, humidity: 81, co2: 408 },
];
export const weatherInsights = [
  {
    priority: "high",
    title: "Peningkatan AQI Terdeteksi",
    description: "AQI meningkat dari 45 ke 57 dalam 6 jam terakhir. Disarankan membatasi aktivitas outdoor.",
    recommendation: "Hindari penyemprotan pestisida hingga AQI turun di bawah 50",
    icon: "AlertTriangle",
    category: "air_quality",
  },
  {
    priority: "medium",
    title: "Kondisi Optimal untuk Irigasi",
    description: "Kelembaban udara 78% dengan angin sedang 12.3 km/h. Waktu yang baik untuk penyiraman.",
    recommendation: "Lakukan irigasi dalam 2 jam ke depan sebelum angin menguat",
    icon: "Droplets",
    category: "irrigation",
  },
  {
    priority: "low",
    title: "Prediksi Cuaca Stabil",
    description: "Suhu akan stabil di range 28-30°C dalam 24 jam ke depan dengan hujan ringan.",
    recommendation: "Kondisi mendukung untuk aplikasi pupuk cair",
    icon: "Sun",
    category: "forecast",
  },
];
export const weatherForecast = [
  {
    period: "Sore Ini",
    description: "Hujan ringan akan berlanjut dengan intensitas menurun",
    tempRange: "27-29°C",
    windRange: "10-15 km/h",
    color: "blue",
  },
  {
    period: "Malam Ini",
    description: "Cuaca akan membaik, angin mereda",
    tempRange: "25-27°C",
    windRange: "5-10 km/h",
    color: "green",
  },
  {
    period: "Besok Pagi",
    description: "Cerah berawan, kondisi optimal untuk aktivitas",
    tempRange: "26-30°C",
    windRange: "8-12 km/h",
    color: "yellow",
  },
];
export const getParameterStatus = (value, parameter) => {
  switch (parameter) {
    case "temperature":
      if (value >= 25 && value <= 32)
        return { status: "optimal", color: "text-green-600", bg: "bg-green-100" };
      if (value >= 20 && value <= 38)
        return { status: "normal", color: "text-blue-600", bg: "bg-blue-100" };
      return { status: "warning", color: "text-red-600", bg: "bg-red-100" };

    case "humidity":
      if (value >= 60 && value <= 80)
        return { status: "optimal", color: "text-green-600", bg: "bg-green-100" };
      if (value >= 40 && value <= 90)
        return { status: "normal", color: "text-blue-600", bg: "bg-blue-100" };
      return { status: "warning", color: "text-orange-600", bg: "bg-orange-100" };

    case "co2":
      if (value <= 400)
        return { status: "excellent", color: "text-green-600", bg: "bg-green-100" };
      if (value <= 500)
        return { status: "good", color: "text-blue-600", bg: "bg-blue-100" };
      if (value <= 600)
        return { status: "moderate", color: "text-orange-600", bg: "bg-orange-100" };
      return { status: "poor", color: "text-red-600", bg: "bg-red-100" };

    case "aqi":
      if (value <= 50)
        return { status: "good", color: "text-green-600", bg: "bg-green-100" };
      if (value <= 100)
        return { status: "moderate", color: "text-yellow-600", bg: "bg-yellow-100" };
      if (value <= 150)
        return { status: "unhealthy_sensitive", color: "text-orange-600", bg: "bg-orange-100" };
      return { status: "unhealthy", color: "text-red-600", bg: "bg-red-100" };

    case "windSpeed":
      if (value <= 20)
        return { status: "calm", color: "text-green-600", bg: "bg-green-100" };
      if (value <= 40)
        return { status: "moderate", color: "text-blue-600", bg: "bg-blue-100" };
      if (value <= 60)
        return { status: "strong", color: "text-orange-600", bg: "bg-orange-100" };
      return { status: "severe", color: "text-red-600", bg: "bg-red-100" };

    case "tvoc":
      if (value <= 0.3)
        return { status: "excellent", color: "text-green-600", bg: "bg-green-100" };
      if (value <= 1.0)
        return { status: "good", color: "text-blue-600", bg: "bg-blue-100" };
      if (value <= 3.0)
        return { status: "moderate", color: "text-orange-600", bg: "bg-orange-100" };
      return { status: "poor", color: "text-red-600", bg: "bg-red-100" };

    default:
      return { status: "normal", color: "text-gray-600", bg: "bg-gray-100" };
  }
};
export const getStatusLabel = (status) => {
  const labels = {
    excellent: "Sangat Baik",
    optimal: "Optimal",
    good: "Baik",
    normal: "Normal",
    moderate: "Sedang",
    calm: "Tenang",
    strong: "Kuat",
    warning: "Peringatan",
    unhealthy_sensitive: "Tidak Sehat (Sensitif)",
    unhealthy: "Tidak Sehat",
    poor: "Buruk",
    severe: "Berbahaya",
  };
  return labels[status] || "Normal";
};
export const getWeatherStats = () => {
  const avgTemp = hourlyData.reduce((sum, d) => sum + d.temp, 0) / hourlyData.length;
  const avgHumidity = hourlyData.reduce((sum, d) => sum + d.humidity, 0) / hourlyData.length;
  const totalRainfall = hourlyData.reduce((sum, d) => sum + d.rainfall, 0);
  const maxWind = Math.max(...hourlyData.map(d => d.wind));
  
  return {
    avgTemp: avgTemp.toFixed(1),
    avgHumidity: avgHumidity.toFixed(0),
    totalRainfall: totalRainfall.toFixed(1),
    maxWind: maxWind.toFixed(1),
  };
};
