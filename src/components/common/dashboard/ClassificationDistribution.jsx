import React from 'react';
import PropTypes from 'prop-types';
import { NITROGEN_THRESHOLDS } from '@/services/dummyDataGenerator';

/**
 * Classification Distribution Component
 * 
 * Displays nitrogen classification counts with color-coded boxes
 * Used to show distribution of device readings across classification levels
 * 
 * @example
 * <ClassificationDistribution
 *   counts={{
 *     deficient: 2,
 *     subnormal: 3,
 *     normal: 10,
 *     high: 5
 *   }}
 * />
 */
export function ClassificationDistribution({ 
  counts, 
  className = '',
  showLabels = true 
}) {
  const classifications = ['deficient', 'subnormal', 'normal', 'high'];

  return (
    <div className={`grid grid-cols-4 gap-2 ${className}`}>
      {classifications.map((classification) => {
        const threshold = NITROGEN_THRESHOLDS[classification];
        const count = counts[classification] || 0;

        return (
          <div
            key={classification}
            className="text-center p-2 rounded-lg"
            style={{ backgroundColor: `${threshold.color}20` }}
          >
            <p
              className="text-2xl font-bold"
              style={{ color: threshold.color }}
            >
              {count}
            </p>
            {showLabels && (
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {threshold.label}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

ClassificationDistribution.propTypes = {
  counts: PropTypes.shape({
    deficient: PropTypes.number,
    subnormal: PropTypes.number,
    normal: PropTypes.number,
    high: PropTypes.number,
  }).isRequired,
  className: PropTypes.string,
  showLabels: PropTypes.bool,
};

export default ClassificationDistribution;
