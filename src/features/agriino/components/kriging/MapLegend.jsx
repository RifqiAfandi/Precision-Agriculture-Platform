import React from 'react';
import PropTypes from 'prop-types';
import { KRIGING_GRID_COLORS } from '@/constants';

/**
 * Legend items configuration
 */
const LEGEND_ITEMS = [
  { key: 'deficient', label: 'Deficient', range: '<1.80 %' },
  { key: 'subnormal', label: 'Subnormal', range: '1.80-2.71 %' },
  { key: 'normal', label: 'Normal', range: '2.71-3.31 %' },
  { key: 'high', label: 'High', range: '>3.31 %' },
];

/**
 * Map Legend Component
 * Displays the nitrogen status color legend for the Kriging map
 */
export function MapLegend({ className = '' }) {
  return (
    <div className={`p-3 bg-white/90 dark:bg-slate-800/90 rounded-lg border border-gray-200 dark:border-slate-700 ${className}`}>
      <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
        Leaf Nitrogen Status
      </p>
      <div className="flex flex-wrap gap-3 text-xs">
        {LEGEND_ITEMS.map(({ key, label, range }) => (
          <div key={key} className="flex items-center gap-1">
            <div 
              className="w-3 h-3 rounded-sm" 
              style={{ backgroundColor: KRIGING_GRID_COLORS[key] }} 
            />
            <span className="text-gray-600 dark:text-gray-400">
              {label} ({range})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

MapLegend.propTypes = {
  className: PropTypes.string,
};

export default MapLegend;
