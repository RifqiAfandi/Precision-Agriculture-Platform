import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  Activity,
  RefreshCw,
  Wifi,
  WifiOff,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';
import { realTimeDataStore, classifyNitrogen, getClassificationColor, NITROGEN_THRESHOLDS } from '@/services/dummyDataGenerator';

/**
 * Real-time monitoring component with line chart
 * Updates every minute with new data
 */
export function RealTimeMonitoring({ onDeviceSelect }) {
  const [currentData, setCurrentData] = useState([]);
  const [historicalData, setHistoricalData] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [chartDataType, setChartDataType] = useState('nitrogen'); // Toggle between 'nitrogen' and 'spad'

  // Start real-time data generation on mount
  useEffect(() => {
    // Start the data store if not already running
    realTimeDataStore.start(60000); // 1 minute interval
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
    }, 60000);

    return () => clearInterval(interval);
  }, []);

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
        .slice(-30); // Last 30 readings
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

  const handleRefresh = () => {
    setHistoricalData(realTimeDataStore.getHistoricalData(60));
    setLastUpdate(new Date());
  };

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
      <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
        <div className="flex items-center gap-3">
          {isConnected ? (
            <>
              <Wifi className="w-5 h-5 text-green-500" />
              <span className="text-sm text-green-600 font-medium">Data Real-time Aktif</span>
            </>
          ) : (
            <>
              <WifiOff className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-500">Offline</span>
            </>
          )}
          <Badge variant="outline" className="ml-2">
            {currentData.length} devices
          </Badge>
          {lastUpdate && (
            <span className="text-xs text-gray-400">
              Update: {lastUpdate.toLocaleTimeString('id-ID')}
            </span>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh}>
          <RefreshCw className="w-4 h-4 mr-1" />
          Refresh
        </Button>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3">
            <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">Rata-rata Nitrogen</p>
            <p className="text-xl font-bold text-blue-700 dark:text-blue-300">{stats.avgNitrogen.toFixed(3)}</p>
          </div>
          <div className="bg-red-50 dark:bg-red-900/30 rounded-lg p-3">
            <div className="flex items-center gap-1 text-sm text-red-600 dark:text-red-400 mb-1">
              <TrendingDown className="w-4 h-4" />
              <span>Min</span>
            </div>
            <p className="text-xl font-bold text-red-700 dark:text-red-300">{stats.minNitrogen.toFixed(3)}</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-3">
            <div className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400 mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>Max</span>
            </div>
            <p className="text-xl font-bold text-green-700 dark:text-green-300">{stats.maxNitrogen.toFixed(3)}</p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-3">
            <p className="text-sm text-purple-600 dark:text-purple-400 mb-1">Total Devices</p>
            <p className="text-xl font-bold text-purple-700 dark:text-purple-300">{stats.totalDevices}</p>
          </div>
        </div>
      )}

      {/* Classification Distribution */}
      {stats && (
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center p-2 rounded-lg" style={{ backgroundColor: `${NITROGEN_THRESHOLDS.deficient.color}20` }}>
            <p className="text-2xl font-bold" style={{ color: NITROGEN_THRESHOLDS.deficient.color }}>
              {stats.deficientCount}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Deficient</p>
          </div>
          <div className="text-center p-2 rounded-lg" style={{ backgroundColor: `${NITROGEN_THRESHOLDS.subnormal.color}20` }}>
            <p className="text-2xl font-bold" style={{ color: NITROGEN_THRESHOLDS.subnormal.color }}>
              {stats.subnormalCount}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Subnormal</p>
          </div>
          <div className="text-center p-2 rounded-lg" style={{ backgroundColor: `${NITROGEN_THRESHOLDS.normal.color}20` }}>
            <p className="text-2xl font-bold" style={{ color: NITROGEN_THRESHOLDS.normal.color }}>
              {stats.normalCount}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Normal</p>
          </div>
          <div className="text-center p-2 rounded-lg" style={{ backgroundColor: `${NITROGEN_THRESHOLDS.high.color}20` }}>
            <p className="text-2xl font-bold" style={{ color: NITROGEN_THRESHOLDS.high.color }}>
              {stats.highCount}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">High</p>
          </div>
        </div>
      )}

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
            <div className="flex gap-2">
              <Button 
                variant={chartDataType === 'nitrogen' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setChartDataType('nitrogen')}
              >
                Nitrogen (%)
              </Button>
              <Button 
                variant={chartDataType === 'spad' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setChartDataType('spad')}
              >
                SPAD
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="dark:stroke-gray-700" />
                  <XAxis dataKey="time" fontSize={12} className="dark:fill-gray-400" />
                  <YAxis fontSize={12} className="dark:fill-gray-400" />
                  <Tooltip
                    contentStyle={{ 
                      fontSize: 12,
                      backgroundColor: 'var(--background)',
                      borderColor: 'var(--border)',
                      color: 'var(--foreground)'
                    }}
                    formatter={(value) => [
                      value,
                      chartDataType === 'nitrogen' ? 'Nitrogen (%)' : 'SPAD',
                    ]}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey={chartDataType}
                    stroke={chartDataType === 'nitrogen' ? '#22c55e' : '#3b82f6'}
                    strokeWidth={2}
                    dot={false}
                    name={chartDataType === 'nitrogen' ? 'Nitrogen (%)' : 'SPAD'}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                <p>Memuat data...</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Device List */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Daftar Device</CardTitle>
          <CardDescription>Klik untuk melihat data spesifik device</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
            {currentData.map((device) => {
              const classification = classifyNitrogen(device.nitrogen);
              const color = getClassificationColor(classification);
              const isSelected = selectedDeviceId === device.device_id;

              return (
                <div
                  key={device.device_id}
                  className={`
                    p-3 rounded-lg border cursor-pointer transition-all
                    ${isSelected ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-gray-200 hover:bg-gray-50'}
                  `}
                  onClick={() => handleDeviceClick(device)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium truncate">{device.device_id}</span>
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                  </div>
                  <p className="text-lg font-bold" style={{ color }}>
                    {device.nitrogen.toFixed(3)}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">{classification}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    SPAD: {device.spad.toFixed(2)}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Selected Device Details */}
      {selectedDevice && (
        <Card className="border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              Detail Device: {selectedDevice.device_id}
              <Badge
                style={{
                  backgroundColor: getClassificationColor(classifyNitrogen(selectedDevice.nitrogen)),
                  color: 'white',
                }}
              >
                {classifyNitrogen(selectedDevice.nitrogen)}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-500 mb-1">Lokasi</p>
                <p className="text-sm font-medium">
                  {selectedDevice.lat.toFixed(6)}, {selectedDevice.lng.toFixed(6)}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-500 mb-1">Nitrogen</p>
                <p className="text-lg font-bold text-green-600">
                  {selectedDevice.nitrogen.toFixed(4)}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-500 mb-1">SPAD</p>
                <p className="text-lg font-bold text-purple-600">
                  {selectedDevice.spad.toFixed(2)}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-500 mb-1">Class</p>
                <p className="text-lg font-bold text-blue-600">
                  {selectedDevice.class_eq1}
                </p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-sm">
              <div className="bg-red-50 rounded p-2">
                <p className="font-medium text-red-500">R</p>
                <p>{selectedDevice.R.toFixed(1)}</p>
              </div>
              <div className="bg-green-50 rounded p-2">
                <p className="font-medium text-green-500">G</p>
                <p>{selectedDevice.G.toFixed(1)}</p>
              </div>
              <div className="bg-blue-50 rounded p-2">
                <p className="font-medium text-blue-500">B</p>
                <p>{selectedDevice.B.toFixed(1)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

RealTimeMonitoring.propTypes = {
  onDeviceSelect: PropTypes.func,
};

export default RealTimeMonitoring;
