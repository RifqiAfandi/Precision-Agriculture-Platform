import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@/components/ui/Button';

/**
 * Chart Toggle Component
 * 
 * Toggle buttons for switching between chart data types (e.g., Nitrogen vs SPAD)
 * Used in chart headers for data visualization control
 * 
 * @example
 * <ChartToggle
 *   options={[
 *     { value: 'nitrogen', label: 'Nitrogen (%)' },
 *     { value: 'spad', label: 'SPAD' }
 *   ]}
 *   value="nitrogen"
 *   onChange={setChartDataType}
 * />
 */
export function ChartToggle({
  options,
  value,
  onChange,
  size = 'sm',
  className = '',
}) {
  return (
    <div className={`flex gap-2 ${className}`}>
      {options.map((option) => (
        <Button
          key={option.value}
          variant={value === option.value ? 'default' : 'outline'}
          size={size}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}

ChartToggle.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  size: PropTypes.oneOf(['sm', 'default', 'lg']),
  className: PropTypes.string,
};

// Common toggle options preset
export const CHART_DATA_OPTIONS = [
  { value: 'nitrogen', label: 'Nitrogen (%)' },
  { value: 'spad', label: 'SPAD' },
];

export default ChartToggle;
