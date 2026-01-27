import React from 'react';
import PropTypes from 'prop-types';
import { Badge } from '@/components/ui/Badge';
import {
  Target,
  Layers,
  Info,
  CheckCircle,
  AlertTriangle,
  XCircle,
} from 'lucide-react';
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
 * Device Details Panel Component
 * Displays detailed information about a selected device
 */
export function DeviceDetailsPanel({ device }) {
  if (!device) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-8">
        <Info className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p>Pilih device untuk melihat detail</p>
      </div>
    );
  }

  const classification = classifyNitrogen(device.nitrogen);
  const colors = MARKER_COLORS[classification] || MARKER_COLORS.unknown;

  const StatusIcon =
    classification === 'deficient'
      ? XCircle
      : classification === 'high'
      ? CheckCircle
      : AlertTriangle;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-gray-100">{device.device_id}</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {device.lat?.toFixed(6)}, {device.lng?.toFixed(6)}
          </p>
        </div>
        <Badge style={{ backgroundColor: colors.fill, color: 'white' }}>
          {getClassificationLabel(classification)}
        </Badge>
      </div>

      {/* Main metrics */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-3">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mb-1">
            <Target className="w-4 h-4" />
            <span>Nitrogen</span>
          </div>
          <p className="text-xl font-bold" style={{ color: colors.fill }}>
            {device.nitrogen?.toFixed(4) || 'N/A'}
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-3">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mb-1">
            <Layers className="w-4 h-4" />
            <span>SPAD</span>
          </div>
          <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
            {device.spad?.toFixed(2) || 'N/A'}
          </p>
        </div>
      </div>

      {/* RGB Values */}
      <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-3">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">RGB Values</p>
        <div className="grid grid-cols-3 gap-2 text-center text-sm">
          <div>
            <p className="font-medium text-red-500">R</p>
            <p className="text-gray-900 dark:text-gray-100">{device.R?.toFixed(1) || 'N/A'}</p>
          </div>
          <div>
            <p className="font-medium text-green-500">G</p>
            <p className="text-gray-900 dark:text-gray-100">{device.G?.toFixed(1) || 'N/A'}</p>
          </div>
          <div>
            <p className="font-medium text-blue-500">B</p>
            <p className="text-gray-900 dark:text-gray-100">{device.B?.toFixed(1) || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Classification Info */}
      <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
        <StatusIcon className="w-4 h-4" style={{ color: colors.fill }} />
        <span>
          Klasifikasi EQ1: <strong>{device.class_eq1 || 'N/A'}</strong>
        </span>
      </div>

      {/* Timestamp */}
      {device.timestamp && (
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Update: {new Date(device.timestamp).toLocaleString('id-ID')}
        </p>
      )}
    </div>
  );
}

DeviceDetailsPanel.propTypes = {
  device: PropTypes.object,
};

export default DeviceDetailsPanel;
