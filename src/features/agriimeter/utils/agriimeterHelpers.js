// Helper functions untuk Agriimeter Dashboard

/**
 * Get status badge color based on tree status
 * @param {string} status - Tree status (optimal, growing, slow, stagnant)
 * @returns {string} Tailwind classes for badge styling
 */
export const getStatusColor = (status) => {
  switch (status) {
    case "optimal":
      return "bg-green-100 text-green-700";
    case "growing":
      return "bg-blue-100 text-blue-700";
    case "slow":
      return "bg-orange-100 text-orange-700";
    case "stagnant":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

/**
 * Get human-readable status label
 * @param {string} status - Tree status
 * @returns {string} Label in Indonesian
 */
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

/**
 * Calculate estimated time to reach target DBH
 * @param {number} currentDBH - Current diameter
 * @param {number} targetDBH - Target diameter
 * @param {number} growthRate - Growth rate per month
 * @returns {number} Months to reach target
 */
export const calculateTimeToTarget = (currentDBH, targetDBH, growthRate) => {
  if (growthRate <= 0) return Infinity;
  return Math.ceil((targetDBH - currentDBH) / growthRate);
};

/**
 * Get AI recommendation based on growth rate
 * @param {number} growthRate - Monthly growth rate in cm
 * @returns {string} Recommendation text
 */
export const getGrowthRecommendation = (growthRate) => {
  if (growthRate > 0.5) {
    return "Pertumbuhan optimal, lanjutkan perawatan rutin";
  } else if (growthRate > 0.2) {
    return "Pertimbangkan pemupukan untuk mempercepat pertumbuhan";
  } else {
    return "Periksa kondisi tanah dan sistem irigasi";
  }
};

/**
 * Get growth rate badge color based on value
 * @param {number} growthRate - Monthly growth rate
 * @returns {string} Tailwind classes
 */
export const getGrowthRateColor = (growthRate) => {
  if (growthRate > 0.5) {
    return "bg-green-100 text-green-700";
  } else if (growthRate > 0.2) {
    return "bg-blue-100 text-blue-700";
  } else {
    return "bg-orange-100 text-orange-700";
  }
};

/**
 * Validate tree form data
 * @param {Object} treeData - Form data object
 * @returns {Object} { isValid: boolean, errors: string[] }
 */
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
