import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { classifyNitrogen } from '@/services/dummyDataGenerator';
import { MARKER_COLORS } from '@/constants';

/**
 * Get classification label in Indonesian
 */
const getClassificationLabel = (classification) => {
  const labels = {
    deficient: 'Defisien',
    subnormal: 'Subnormal',
    normal: 'Normal',
    high: 'Tinggi',
    unknown: 'Unknown',
  };
  return labels[classification] || 'Unknown';
};

/**
 * Device List Item Component
 */
function DeviceListItem({ device, isSelected, onClick }) {
  const classification = classifyNitrogen(device.nitrogen);
  const colors = MARKER_COLORS[classification] || MARKER_COLORS.unknown;

  return (
    <div
      className={`
        p-2 rounded-lg border cursor-pointer transition-all
        ${isSelected 
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' 
          : 'border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700'}
      `}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium truncate text-gray-900 dark:text-gray-100">
          {device.device_id}
        </span>
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: colors.fill }}
        />
      </div>
      <p className="text-lg font-bold" style={{ color: colors.fill }}>
        {device.nitrogen?.toFixed(3) || 'N/A'}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        {getClassificationLabel(classification)}
      </p>
    </div>
  );
}

DeviceListItem.propTypes = {
  device: PropTypes.object.isRequired,
  isSelected: PropTypes.bool,
  onClick: PropTypes.func,
};

/**
 * Device List Card Component
 * Displays a grid of devices with nitrogen values and classification
 */
export function DeviceListCard({ devices, selectedDevice, onDeviceSelect }) {
  if (!devices || devices.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Daftar Device</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          {devices.map((device) => (
            <DeviceListItem
              key={device.device_id}
              device={device}
              isSelected={selectedDevice?.device_id === device.device_id}
              onClick={() => onDeviceSelect?.(device)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

DeviceListCard.propTypes = {
  devices: PropTypes.array.isRequired,
  selectedDevice: PropTypes.object,
  onDeviceSelect: PropTypes.func,
};

export default DeviceListCard;
