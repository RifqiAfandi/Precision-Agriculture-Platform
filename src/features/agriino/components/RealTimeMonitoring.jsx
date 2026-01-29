import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Activity } from 'lucide-react';
import { REFRESH_INTERVALS } from '@/constants/config';

// Import shared dashboard components
import {
  ConnectionStatus,
  StatsOverview,
  ClassificationDistribution,
  DeviceGrid,
  ChartToggle,
  NitrogenLineChart,
  CHART_DATA_OPTIONS,
} from '@/components/common/dashboard';

import { 
  realTimeDataStore, 
  classifyNitrogen, 
  getClassificationColor 
} from '@/services/dummyDataGenerator';

/**
 * Selected Device Detail Card Component
 * Shows detailed information for a selected device
 */
function SelectedDeviceDetail({ device }) {
  if (!device) return null;

  const classification = classifyNitrogen(device.nitrogen);
  const color = getClassificationColor(classification);

  return (
    <Card className="border-blue-200 dark:border-blue-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          Detail Device: {device.device_id}
          <Badge style={{ backgroundColor: color, color: 'white' }}>
            {classification}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Lokasi</p>
            <p className="text-sm font-medium">
              {device.lat?.toFixed(6)}, {device.lng?.toFixed(6)}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Nitrogen</p>
            <p className="text-lg font-bold text-green-600">
              {device.nitrogen?.toFixed(4)}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">SPAD</p>
            <p className="text-lg font-bold text-purple-600">
              {device.spad?.toFixed(2)}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Class</p>
            <p className="text-lg font-bold text-blue-600">
              {device.class_eq1}
            </p>
          </div>
        </div>
        {device.R !== undefined && (
          <div className="mt-3 grid grid-cols-3 gap-2 text-center text-sm">
            <div className="bg-red-50 dark:bg-red-900/30 rounded p-2">
              <p className="font-medium text-red-500">R</p>
              <p>{device.R?.toFixed(1)}</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/30 rounded p-2">
              <p className="font-medium text-green-500">G</p>
              <p>{device.G?.toFixed(1)}</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/30 rounded p-2">
              <p className="font-medium text-blue-500">B</p>
              <p>{device.B?.toFixed(1)}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

SelectedDeviceDetail.propTypes = {
  device: PropTypes.shape({
    device_id: PropTypes.string,
    nitrogen: PropTypes.number,
    spad: PropTypes.number,
    lat: PropTypes.number,
    lng: PropTypes.number,
    class_eq1: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    R: PropTypes.number,
    G: PropTypes.number,
    B: PropTypes.number,
  }),
};

/**
 * Custom hook for real-time monitoring data
 * Manages subscription and data transformation
 */
function useRealTimeData() {
  const [currentData, setCurrentData] = useState([]);
  const [historicalData, setHistoricalData] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    // Start the data store if not already running
    realTimeDataStore.start(REFRESH_INTERVALS.SLOW); // 1 minute interval
    setIsConnected(true);

    // Subscribe to updates
    const unsubscribe = realTimeDataStore.subscribe((data) => {
      setCurrentData(data);
      setLastUpdate(new Date());
    });

    // Load initial historical data
    setHistoricalData(realTimeDataStore.getHistoricalData(60));

    return () => {
      unsubscribe();
    };
  }, []);

  // Update historical data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setHistoricalData(realTimeDataStore.getHistoricalData(60));
    }, REFRESH_INTERVALS.SLOW);

    return () => clearInterval(interval);
  }, []);

  const refresh = () => {
    setHistoricalData(realTimeDataStore.getHistoricalData(60));
    setLastUpdate(new Date());
  };

  return { currentData, historicalData, isConnected, lastUpdate, refresh };
}

/**
 * Real-time monitoring component with line chart
 * Updates every minute with new data
 */
export function RealTimeMonitoring({ onDeviceSelect }) {
  const { currentData, historicalData, isConnected, lastUpdate, refresh } = useRealTimeData();
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [chartDataType, setChartDataType] = useState('nitrogen');

  // Format chart data for the selected device or all devices average
  const chartData = useMemo(() => {
    if (historicalData.length === 0) return [];

    if (selectedDeviceId) {
      // Show data for specific device
      return historicalData
        .filter(d => d.device_id === selectedDeviceId)
        .map(d => ({
          time: new Date(d.timestamp).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          nitrogen: parseFloat(d.nitrogen.toFixed(3)),
          spad: parseFloat(d.spad.toFixed(2)),
          timestamp: d.timestamp,
        }))
        .slice(-30);
    } else {
      // Show average of all devices
      const groupedByTime = {};
      historicalData.forEach(d => {
        const timeKey = Math.floor(d.timestamp / 60000) * 60000;
        if (!groupedByTime[timeKey]) {
          groupedByTime[timeKey] = { nitrogen: [], spad: [], timestamp: timeKey };
        }
        groupedByTime[timeKey].nitrogen.push(d.nitrogen);
        groupedByTime[timeKey].spad.push(d.spad);
      });

      return Object.values(groupedByTime)
        .map(g => ({
          time: new Date(g.timestamp).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          nitrogen: parseFloat((g.nitrogen.reduce((a, b) => a + b, 0) / g.nitrogen.length).toFixed(3)),
          spad: parseFloat((g.spad.reduce((a, b) => a + b, 0) / g.spad.length).toFixed(2)),
          timestamp: g.timestamp,
        }))
        .sort((a, b) => a.timestamp - b.timestamp)
        .slice(-30);
    }
  }, [historicalData, selectedDeviceId]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (currentData.length === 0) return null;

    const nitrogenValues = currentData.map(d => d.nitrogen);
    const avgNitrogen = nitrogenValues.reduce((a, b) => a + b, 0) / nitrogenValues.length;
    const minNitrogen = Math.min(...nitrogenValues);
    const maxNitrogen = Math.max(...nitrogenValues);

    const deficientCount = currentData.filter(d => classifyNitrogen(d.nitrogen) === 'deficient').length;
    const subnormalCount = currentData.filter(d => classifyNitrogen(d.nitrogen) === 'subnormal').length;
    const normalCount = currentData.filter(d => classifyNitrogen(d.nitrogen) === 'normal').length;
    const highCount = currentData.filter(d => classifyNitrogen(d.nitrogen) === 'high').length;

    return {
      avgNitrogen,
      minNitrogen,
      maxNitrogen,
      deficientCount,
      subnormalCount,
      normalCount,
      highCount,
      totalDevices: currentData.length,
    };
  }, [currentData]);

  // Transform stats for StatsOverview component
  const statsItems = stats ? [
    { label: 'Rata-rata Nitrogen', value: stats.avgNitrogen.toFixed(3), variant: 'blue' },
    { label: 'Min', value: stats.minNitrogen.toFixed(3), variant: 'red', icon: 'down' },
    { label: 'Max', value: stats.maxNitrogen.toFixed(3), variant: 'green', icon: 'up' },
    { label: 'Total Devices', value: stats.totalDevices, variant: 'purple' },
  ] : [];

  // Classification counts for distribution component
  const classificationCounts = stats ? {
    deficient: stats.deficientCount,
    subnormal: stats.subnormalCount,
    normal: stats.normalCount,
    high: stats.highCount,
  } : { deficient: 0, subnormal: 0, normal: 0, high: 0 };

  const handleDeviceClick = (device) => {
    setSelectedDeviceId(selectedDeviceId === device.device_id ? null : device.device_id);
    if (onDeviceSelect) {
      onDeviceSelect(device);
    }
  };

  const selectedDevice = selectedDeviceId
    ? currentData.find(d => d.device_id === selectedDeviceId)
    : null;

  return (
    <div className="space-y-4">
      {/* Connection Status Header */}
      <ConnectionStatus
        connected={isConnected}
        deviceCount={currentData.length}
        onRefresh={refresh}
        lastUpdate={lastUpdate}
      />

      {/* Stats Overview */}
      {stats && <StatsOverview items={statsItems} />}

      {/* Classification Distribution */}
      {stats && <ClassificationDistribution counts={classificationCounts} />}

      {/* Real-time Chart */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-base">
                <Activity className="w-5 h-5 text-green-600" />
                Grafik Real-time
                {selectedDevice && (
                  <Badge variant="outline" className="ml-2">
                    {selectedDevice.device_id}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                {selectedDeviceId
                  ? `Data monitoring untuk ${selectedDeviceId}`
                  : 'Rata-rata semua device (1 menit interval)'}
              </CardDescription>
            </div>
            <ChartToggle
              options={CHART_DATA_OPTIONS}
              value={chartDataType}
              onChange={setChartDataType}
            />
          </div>
        </CardHeader>
        <CardContent>
          <NitrogenLineChart
            data={chartData}
            dataKey={chartDataType}
            height={256}
          />
        </CardContent>
      </Card>

      {/* Device List */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Daftar Device</CardTitle>
          <CardDescription>Klik untuk melihat data spesifik device</CardDescription>
        </CardHeader>
        <CardContent>
          <DeviceGrid
            devices={currentData}
            selectedDeviceId={selectedDeviceId}
            onDeviceClick={handleDeviceClick}
            showSpad={true}
          />
        </CardContent>
      </Card>

      {/* Selected Device Details */}
      <SelectedDeviceDetail device={selectedDevice} />
    </div>
  );
}

RealTimeMonitoring.propTypes = {
  onDeviceSelect: PropTypes.func,
};

export default RealTimeMonitoring;
