export const DEFAULT_DEFICIENT_THRESHOLD = 1.80;
export const DEFAULT_SUBNORMAL_THRESHOLD = 2.71;
export const DEFAULT_NORMAL_THRESHOLD = 3.31;

export const DEFAULT_LOW_THRESHOLD = 1.80;
export const DEFAULT_HIGH_THRESHOLD = 3.31;

export const NITROGEN_THRESHOLDS = {
  deficient: {
    min: 0,
    max: DEFAULT_DEFICIENT_THRESHOLD,
    label: 'Deficient',
    labelId: 'Defisien',
    description: 'Needs immediate nitrogen supplementation',
  },
  subnormal: {
    min: DEFAULT_DEFICIENT_THRESHOLD,
    max: DEFAULT_SUBNORMAL_THRESHOLD,
    label: 'Subnormal',
    labelId: 'Subnormal',
    description: 'Below optimal, consider fertilization',
  },
  normal: {
    min: DEFAULT_SUBNORMAL_THRESHOLD,
    max: DEFAULT_NORMAL_THRESHOLD,
    label: 'Normal',
    labelId: 'Normal',
    description: 'Optimal nitrogen levels',
  },
  high: {
    min: DEFAULT_NORMAL_THRESHOLD,
    max: Infinity,
    label: 'High',
    labelId: 'Tinggi',
    description: 'Above optimal, reduce fertilization',
  },
};

export const DEFAULT_INFLUENCE_RADIUS_KM = 0.2;

export const DEFAULT_GRID_RESOLUTION = 120;

export const DEFAULT_MAX_NEIGHBORS = 8;
export const DEFAULT_MIN_NEIGHBORS = 3;

export const VARIOGRAM_MODELS = ['spherical', 'exponential', 'gaussian', 'linear'];

export function classifyNitrogenValue(value) {
  if (typeof value !== 'number' || isNaN(value)) {
    return 'unknown';
  }
  
  if (value < DEFAULT_DEFICIENT_THRESHOLD) {
    return 'deficient';
  } else if (value < DEFAULT_SUBNORMAL_THRESHOLD) {
    return 'subnormal';
  } else if (value < DEFAULT_NORMAL_THRESHOLD) {
    return 'normal';
  } else {
    return 'high';
  }
}

export function getClassificationLabelId(classification) {
  const threshold = NITROGEN_THRESHOLDS[classification];
  return threshold?.labelId || 'Unknown';
}

export function getThresholdInfo(classification) {
  return NITROGEN_THRESHOLDS[classification] || null;
}
