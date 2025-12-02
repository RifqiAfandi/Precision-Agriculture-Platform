export const getStatusColor = (status) => {
  switch (status) {
    case "optimal":
      return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400";
    case "growing":
      return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400";
    case "slow":
      return "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400";
    case "stagnant":
      return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400";
    default:
      return "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300";
  }
};
export const getStatusLabel = (status) => {
  switch (status) {
    case "optimal":
      return "Optimal";
    case "growing":
      return "Berkembang Baik";
    case "slow":
      return "Pertumbuhan Lambat";
    case "stagnant":
      return "Stagnan";
    default:
      return "Normal";
  }
};
export const calculateTimeToTarget = (currentDBH, targetDBH, growthRate) => {
  if (growthRate <= 0) return Infinity;
  return Math.ceil((targetDBH - currentDBH) / growthRate);
};
export const getGrowthRecommendation = (growthRate) => {
  if (growthRate > 0.5) {
    return "Pertumbuhan optimal, lanjutkan perawatan rutin";
  } else if (growthRate > 0.2) {
    return "Pertimbangkan pemupukan untuk mempercepat pertumbuhan";
  } else {
    return "Periksa kondisi tanah dan sistem irigasi";
  }
};
export const getGrowthRateColor = (growthRate) => {
  if (growthRate > 0.5) {
    return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400";
  } else if (growthRate > 0.2) {
    return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400";
  } else {
    return "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400";
  }
};
export const validateTreeForm = (treeData) => {
  const errors = [];

  if (!treeData.name || treeData.name.trim() === "") {
    errors.push("Nama pohon harus diisi");
  }

  if (!treeData.species || treeData.species === "") {
    errors.push("Jenis tanaman harus dipilih");
  }

  if (!treeData.location || treeData.location.trim() === "") {
    errors.push("Lokasi pohon harus diisi");
  }

  if (treeData.age && (isNaN(treeData.age) || treeData.age < 0)) {
    errors.push("Umur pohon harus berupa angka positif");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
