import React from 'react';
import PropTypes from 'prop-types';
import { classifyNitrogen, getClassificationColor } from '@/services/dummyDataGenerator';

/**
 * Device Card Component
 * 
 * Displays a single device card with nitrogen reading and classification
 * Used in device grids throughout the dashboard
 * 
 * @example
 * <DeviceCard
 *   device={{
 *     device_id: 'AGRI-001',
 *     nitrogen: 0.123,
 *     spad: 45.2,
 *     lat: -6.8,
 *     lng: 110.4
 *   }}
 *   isSelected={false}
 *   onClick={handleClick}
 *   showSpad={true}
 * />
 */
export function DeviceCard({
  device,
  isSelected = false,
  onClick,
  showSpad = true,
  className = '',
}) {
  const classification = classifyNitrogen(device.nitrogen);
  const color = getClassificationColor(classification);

  return (
    <div
      className={`
        p-3 rounded-lg border cursor-pointer transition-all
        ${isSelected 
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 shadow-md' 
          : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'}
        ${className}
      `}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium truncate">{device.device_id}</span>
        <div
          className="w-3 h-3 rounded-full flex-shrink-0"
          style={{ backgroundColor: color }}
        />
      </div>
      <p className="text-lg font-bold" style={{ color }}>
        {device.nitrogen?.toFixed(3) || 'N/A'}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
        {classification}
      </p>
      {showSpad && device.spad !== undefined && (
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          SPAD: {device.spad?.toFixed(2) || 'N/A'}
        </p>
      )}
    </div>
  );
}

DeviceCard.propTypes = {
  device: PropTypes.shape({
    device_id: PropTypes.string.isRequired,
    nitrogen: PropTypes.number,
    spad: PropTypes.number,
    lat: PropTypes.number,
    lng: PropTypes.number,
  }).isRequired,
  isSelected: PropTypes.bool,
  onClick: PropTypes.func,
  showSpad: PropTypes.bool,
  className: PropTypes.string,
};

/**
 * Device Grid Component
 * 
 * Displays a grid of device cards
 * Used in monitoring dashboards to show all devices
 * 
 * @example
 * <DeviceGrid
 *   devices={deviceList}
 *   selectedDeviceId="AGRI-001"
 *   onDeviceClick={handleDeviceClick}
 * />
 */
export function DeviceGrid({
  devices,
  selectedDeviceId = null,
  onDeviceClick,
  showSpad = true,
  columns = 5,
  className = '',
}) {
  const gridCols = {
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
    5: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
    6: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
  };

  return (
    <div className={`grid ${gridCols[columns] || gridCols[5]} gap-2 ${className}`}>
      {devices.map((device) => (
        <DeviceCard
          key={device.device_id}
          device={device}
          isSelected={selectedDeviceId === device.device_id}
          onClick={() => onDeviceClick?.(device)}
          showSpad={showSpad}
        />
      ))}
    </div>
  );
}

DeviceGrid.propTypes = {
  devices: PropTypes.arrayOf(
    PropTypes.shape({
      device_id: PropTypes.string.isRequired,
      nitrogen: PropTypes.number,
      spad: PropTypes.number,
    })
  ).isRequired,
  selectedDeviceId: PropTypes.string,
  onDeviceClick: PropTypes.func,
  showSpad: PropTypes.bool,
  columns: PropTypes.oneOf([3, 4, 5, 6]),
  className: PropTypes.string,
};

export default DeviceGrid;
