import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Calendar, Download, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { realTimeDataStore, classifyNitrogen, getClassificationColor, NITROGEN_THRESHOLDS } from '@/services/dummyDataGenerator';

/**
 * Weekly history table component
 * Shows daily averages for the past 7 days
 */
export function WeeklyHistoryTable() {
  const [weeklyData, setWeeklyData] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [chartDataType, setChartDataType] = useState('nitrogen'); // Toggle between 'nitrogen' and 'spad'

  useEffect(() => {
    // Load weekly data from the store
    const data = realTimeDataStore.getWeeklyData();
    setWeeklyData(data);
  }, []);

  // Calculate overall statistics
  const overallStats = useMemo(() => {
    if (weeklyData.length === 0) return null;

    const avgNitrogen = weeklyData.reduce((sum, d) => sum + d.avgNitrogen, 0) / weeklyData.length;
    const minNitrogen = Math.min(...weeklyData.map(d => d.avgNitrogen));
    const maxNitrogen = Math.max(...weeklyData.map(d => d.avgNitrogen));
    
    // Calculate trend
    const firstHalf = weeklyData.slice(0, 3);
    const secondHalf = weeklyData.slice(-3);
    const firstAvg = firstHalf.reduce((sum, d) => sum + d.avgNitrogen, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, d) => sum + d.avgNitrogen, 0) / secondHalf.length;
    const trend = secondAvg > firstAvg ? 'up' : secondAvg < firstAvg ? 'down' : 'stable';

    return {
      avgNitrogen,
      minNitrogen,
      maxNitrogen,
      trend,
      totalReadings: weeklyData.reduce((sum, d) => sum + d.readingsCount, 0),
    };
  }, [weeklyData]);

  // Chart data for bar chart
  const chartData = useMemo(() => {
    return weeklyData.map(day => ({
      name: day.dateLabel,
      nitrogen: parseFloat(day.avgNitrogen.toFixed(3)),
      spad: parseFloat(day.avgSpad.toFixed(2)),
      date: day.date,
    }));
  }, [weeklyData]);

  // Export data to CSV
  const handleExport = () => {
    const headers = ['Tanggal', 'Rata-rata Nitrogen', 'Rata-rata SPAD', 'Klasifikasi', 'Jumlah Data'];
    const rows = weeklyData.map(day => [
      day.date,
      day.avgNitrogen.toFixed(4),
      day.avgSpad.toFixed(2),
      day.classification,
      day.readingsCount,
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `agriino_weekly_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const TrendIcon = overallStats?.trend === 'up' 
    ? TrendingUp 
    : overallStats?.trend === 'down' 
      ? TrendingDown 
      : Minus;

  const trendColor = overallStats?.trend === 'up' 
    ? 'text-green-500' 
    : overallStats?.trend === 'down' 
      ? 'text-red-500' 
      : 'text-gray-500';

  return (
    <Card className="glass-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-green-600" />
            <span>Riwayat Data Mingguan</span>
          </CardTitle>
          <CardDescription>
            Data rata-rata harian dari {weeklyData.length} hari terakhir (masing-masing 1440 data/hari)
          </CardDescription>
        </div>
        <Button variant="outline" className="flex items-center space-x-2" onClick={handleExport}>
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Statistics */}
        {overallStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4">
              <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">Rata-rata Mingguan</p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                {overallStats.avgNitrogen.toFixed(3)}
              </p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/30 rounded-lg p-4">
              <p className="text-sm text-red-600 dark:text-red-400 mb-1">Nilai Minimum</p>
              <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                {overallStats.minNitrogen.toFixed(3)}
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-4">
              <p className="text-sm text-green-600 dark:text-green-400 mb-1">Nilai Maximum</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                {overallStats.maxNitrogen.toFixed(3)}
              </p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-4">
              <div className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400 mb-1">
                <TrendIcon className={`w-4 h-4 ${trendColor}`} />
                <span>Tren</span>
              </div>
              <p className={`text-2xl font-bold capitalize ${trendColor}`}>
                {overallStats.trend === 'up' ? 'Naik' : overallStats.trend === 'down' ? 'Turun' : 'Stabil'}
              </p>
            </div>
          </div>
        )}

        {/* Bar Chart with Toggle */}
        {chartData.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">Tren Harian</h4>
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
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="dark:stroke-gray-700" />
                  <XAxis dataKey="name" fontSize={12} className="dark:fill-gray-400" />
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
                  <Bar 
                    dataKey={chartDataType} 
                    fill={chartDataType === 'nitrogen' ? '#22c55e' : '#3b82f6'} 
                    name={chartDataType === 'nitrogen' ? 'Nitrogen (%)' : 'SPAD'} 
                    radius={[4, 4, 0, 0]} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Tanggal</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Rata-rata Nitrogen</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Rata-rata SPAD</th>
                <th className="text-center py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Klasifikasi</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Jumlah Data</th>
              </tr>
            </thead>
            <tbody>
              {weeklyData.map((day, index) => {
                const color = getClassificationColor(day.classification);
                return (
                  <tr
                    key={day.date}
                    className={`border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer ${
                      selectedDay === day.date ? 'bg-blue-50 dark:bg-blue-900/30' : ''
                    }`}
                    onClick={() => setSelectedDay(selectedDay === day.date ? null : day.date)}
                  >
                    <td className="py-3 px-4 font-medium">{day.dateLabel}</td>
                    <td className="py-3 px-4 text-right font-mono">
                      <span style={{ color }}>{day.avgNitrogen.toFixed(4)}</span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono">{day.avgSpad.toFixed(2)}</td>
                    <td className="py-3 px-4 text-center">
                      <Badge
                        style={{ backgroundColor: color, color: 'white' }}
                        className="capitalize"
                      >
                        {day.classification}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-400">
                      {day.readingsCount.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Selected Day Details */}
        {selectedDay && (
          <div className="mt-4">
            <h4 className="font-medium mb-3">
              Detail Device - {weeklyData.find(d => d.date === selectedDay)?.dateLabel}
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              {weeklyData
                .find(d => d.date === selectedDay)
                ?.devices.map((device) => {
                  const color = getClassificationColor(device.classification);
                  return (
                    <div
                      key={device.device_id}
                      className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{device.device_id}</span>
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                      </div>
                      <p className="text-lg font-bold" style={{ color }}>
                        {device.nitrogen.toFixed(3)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{device.classification}</p>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 border-t dark:border-gray-700 pt-4">
          <span className="font-medium">Klasifikasi Nitrogen:</span>
          {Object.entries(NITROGEN_THRESHOLDS).map(([key, value]) => (
            <div key={key} className="flex items-center gap-1">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: value.color }}
              />
              <span className="capitalize">
                {value.label} ({key === 'deficient' ? `<${value.max}` : key === 'high' ? `>${value.min}` : `${value.min}-${value.max}`})
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default WeeklyHistoryTable;
