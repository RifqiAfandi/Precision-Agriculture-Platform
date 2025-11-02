import {
  chlorophyllRanges,
  nitrogenRanges,
} from "../data/agriinoData";
export const getStatusColor = (status) => {
  const colors = {
    excellent: "bg-green-100 text-green-700",
    good: "bg-blue-100 text-blue-700",
    warning: "bg-orange-100 text-orange-700",
    critical: "bg-red-100 text-red-700",
  };
  return colors[status] || "bg-gray-100 text-gray-700";
};
export const getStatusLabel = (status) => {
  const labels = {
    excellent: "Sangat Baik",
    good: "Baik",
    warning: "Perlu Perhatian",
    critical: "Kritis",
  };
  return labels[status] || "Normal";
};
export const calculatePlantStatus = (chlorophyll, nitrogen) => {
  if (chlorophyll >= chlorophyllRanges.excellent.min) {
    if (nitrogen >= nitrogenRanges.optimal.min) {
      return "excellent";
    }
    return "good";
  }

  if (chlorophyll >= chlorophyllRanges.good.min) {
    if (nitrogen >= nitrogenRanges.moderate.min) {
      return "good";
    }
    return "warning";
  }
  return "warning";
};
export const getChlorophyllColor = (chlorophyll) => {
  if (chlorophyll > 45) {
    return "bg-green-100 text-green-700";
  }
  if (chlorophyll > 40) {
    return "bg-yellow-100 text-yellow-700";
  }
  return "bg-red-100 text-red-700";
};
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
export const calculateHealthScore = (chlorophyll, nitrogen) => {
  const chlorophyllScore = Math.min((chlorophyll / 50) * 100, 100);
  const nitrogenScore = Math.min((nitrogen / 3.5) * 100, 100);
  const healthScore = chlorophyllScore * 0.6 + nitrogenScore * 0.4;

  return Math.round(healthScore);
};
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
export const exportToCsv = (plants) => {
  const headers = [
    "Nama Tanaman",
    "Lokasi",
    "Deskripsi",
    "Indeks Klorofil",
    "Nitrogen (mg/L)",
    "Status",
    "Trend",
    "Rekomendasi",
    "Pengukuran Terakhir",
  ];

  const rows = plants.map((plant) => [
    plant.name || '-',
    plant.location || '-',
    plant.description || '-',
    plant.current_chlorophyll != null ? plant.current_chlorophyll.toFixed(1) : '-',
    plant.current_nitrogen != null ? plant.current_nitrogen.toFixed(1) : '-',
    getStatusLabel(plant.status),
    plant.trend === 'up' ? 'Naik' : plant.trend === 'down' ? 'Turun' : 'Stabil',
    plant.recommendation || '-',
    plant.last_measurement || '-',
  ]);

  const csv = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");

  return csv;
};
