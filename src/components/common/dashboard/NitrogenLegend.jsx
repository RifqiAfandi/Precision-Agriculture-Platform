import React from 'react';
import PropTypes from 'prop-types';
import { NITROGEN_THRESHOLDS } from '@/services/dummyDataGenerator';

/**
 * Nitrogen Legend Component
 * 
 * Displays nitrogen classification legend with colors and threshold ranges
 * Used in dashboard footers and charts for reference
 * 
 * @example
 * <NitrogenLegend layout="horizontal" showRanges={true} />
 */
export function NitrogenLegend({
  layout = 'horizontal',
  showRanges = true,
  showLabel = true,
  className = '',
}) {
  const formatRange = (key, threshold) => {
    if (!showRanges) return '';
    
    if (key === 'deficient') return `(<${threshold.max})`;
    if (key === 'high') return `(>${threshold.min})`;
    return `(${threshold.min}-${threshold.max})`;
  };

  const containerClass = layout === 'horizontal'
    ? 'flex flex-wrap gap-4'
    : 'flex flex-col gap-2';

  return (
    <div className={`text-sm text-gray-600 dark:text-gray-400 ${className}`}>
      {showLabel && (
        <span className="font-medium mr-2">Klasifikasi Nitrogen:</span>
      )}
      <div className={containerClass}>
        {Object.entries(NITROGEN_THRESHOLDS).map(([key, value]) => (
          <div key={key} className="flex items-center gap-1">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: value.color }}
            />
            <span className="capitalize">
              {value.label} {formatRange(key, value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

NitrogenLegend.propTypes = {
  layout: PropTypes.oneOf(['horizontal', 'vertical']),
  showRanges: PropTypes.bool,
  showLabel: PropTypes.bool,
  className: PropTypes.string,
};

export default NitrogenLegend;
