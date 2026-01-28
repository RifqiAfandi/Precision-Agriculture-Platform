import React from 'react';
import PropTypes from 'prop-types';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';

/**
 * Stats Overview Grid Component
 * 
 * Displays a grid of statistics cards with consistent styling
 * Used in monitoring dashboards for showing aggregate data
 * 
 * @example
 * <StatsOverview
 *   items={[
 *     { label: 'Average', value: '0.123', variant: 'blue' },
 *     { label: 'Min', value: '0.050', variant: 'red', icon: 'down' },
 *     { label: 'Max', value: '0.200', variant: 'green', icon: 'up' },
 *   ]}
 * />
 */

const VARIANT_STYLES = {
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-900/30',
    text: 'text-blue-600 dark:text-blue-400',
    value: 'text-blue-700 dark:text-blue-300',
  },
  red: {
    bg: 'bg-red-50 dark:bg-red-900/30',
    text: 'text-red-600 dark:text-red-400',
    value: 'text-red-700 dark:text-red-300',
  },
  green: {
    bg: 'bg-green-50 dark:bg-green-900/30',
    text: 'text-green-600 dark:text-green-400',
    value: 'text-green-700 dark:text-green-300',
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-900/30',
    text: 'text-purple-600 dark:text-purple-400',
    value: 'text-purple-700 dark:text-purple-300',
  },
  orange: {
    bg: 'bg-orange-50 dark:bg-orange-900/30',
    text: 'text-orange-600 dark:text-orange-400',
    value: 'text-orange-700 dark:text-orange-300',
  },
  gray: {
    bg: 'bg-gray-50 dark:bg-gray-800/50',
    text: 'text-gray-600 dark:text-gray-400',
    value: 'text-gray-700 dark:text-gray-300',
  },
};

const TREND_ICONS = {
  up: TrendingUp,
  down: TrendingDown,
  stable: Minus,
};

function StatsItem({ label, value, variant = 'gray', icon, className = '' }) {
  const styles = VARIANT_STYLES[variant] || VARIANT_STYLES.gray;
  const IconComponent = icon ? TREND_ICONS[icon] : null;

  return (
    <div className={`${styles.bg} rounded-lg p-3 ${className}`}>
      <div className={`flex items-center gap-1 text-sm ${styles.text} mb-1`}>
        {IconComponent && <IconComponent className="w-4 h-4" />}
        <span>{label}</span>
      </div>
      <p className={`text-xl font-bold ${styles.value}`}>{value}</p>
    </div>
  );
}

StatsItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  variant: PropTypes.oneOf(['blue', 'red', 'green', 'purple', 'orange', 'gray']),
  icon: PropTypes.oneOf(['up', 'down', 'stable']),
  className: PropTypes.string,
};

export function StatsOverview({ 
  items, 
  columns = 4, 
  className = '' 
}) {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
    5: 'grid-cols-2 md:grid-cols-5',
  };

  return (
    <div className={`grid ${gridCols[columns] || gridCols[4]} gap-3 ${className}`}>
      {items.map((item, index) => (
        <StatsItem
          key={item.label || index}
          label={item.label}
          value={item.value}
          variant={item.variant}
          icon={item.icon}
          className={item.className}
        />
      ))}
    </div>
  );
}

StatsOverview.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      variant: PropTypes.string,
      icon: PropTypes.string,
      className: PropTypes.string,
    })
  ).isRequired,
  columns: PropTypes.oneOf([2, 3, 4, 5]),
  className: PropTypes.string,
};

export default StatsOverview;
