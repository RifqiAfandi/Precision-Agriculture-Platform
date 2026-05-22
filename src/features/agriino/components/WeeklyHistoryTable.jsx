import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Calendar, Download } from 'lucide-react';

// Import shared dashboard components
import {
  StatsOverview,
  ChartToggle,
  DeviceGrid,
  NitrogenBarChart,
  NitrogenLegend,
  CHART_DATA_OPTIONS,
} from '@/components/common/dashboard';

import { 
  realTimeDataStore, 
  getClassificationColor 
} from '@/services/dummyDataGenerator';

const NITROGEN_ONLY_OPTIONS = CHART_DATA_OPTIONS.filter(
  (option) => option.value === 'nitrogen'
);

/**
 * Export data to CSV file
 * @param {Array} weeklyData - Array of weekly data to export
 */
function exportToCSV(weeklyData) {
  const headers = ['Tanggal', 'Rata-rata Nitrogen', 'Klasifikasi', 'Jumlah Data'];
  const rows = weeklyData.map(day => [
    day.date,
    day.avgNitrogen.toFixed(4),
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
}

/**
 * Weekly Data Table Component
 * Renders the data table with clickable rows
 */
function WeeklyDataTable({ weeklyData, selectedDay, onSelectDay }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Tanggal</th>
            <th className="text-right py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Rata-rata Nitrogen</th>
            <th className="text-center py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Klasifikasi</th>
            <th className="text-right py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Jumlah Data</th>
          </tr>
        </thead>
        <tbody>
          {weeklyData.map((day) => {
            const color = getClassificationColor(day.classification);
            return (
              <tr
                key={day.date}
                className={`border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer ${
                  selectedDay === day.date ? 'bg-blue-50 dark:bg-blue-900/30' : ''
                }`}
                onClick={() => onSelectDay(selectedDay === day.date ? null : day.date)}
              >
                <td className="py-3 px-4 font-medium">{day.dateLabel}</td>
                <td className="py-3 px-4 text-right font-mono">
                  <span style={{ color }}>{day.avgNitrogen.toFixed(4)}</span>
                </td>
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
  );
}

/**
 * Selected Day Device Details Component
 */
function SelectedDayDetails({ dayData }) {
  if (!dayData) return null;

  return (
    <div className="mt-4">
      <h4 className="font-medium mb-3">
        Detail Device - {dayData.dateLabel}
      </h4>
      <DeviceGrid
        devices={dayData.devices || []}
        showSpad={false}
        columns={5}
      />
    </div>
  );
}

/**
 * Weekly history table component
 * Shows daily averages for the past 7 days
 */
export function WeeklyHistoryTable() {
  const [weeklyData, setWeeklyData] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [chartDataType, setChartDataType] = useState('nitrogen');

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

  // Transform stats for StatsOverview component
  const statsItems = overallStats ? [
    { label: 'Rata-rata Mingguan', value: overallStats.avgNitrogen.toFixed(3), variant: 'blue' },
    { label: 'Nilai Minimum', value: overallStats.minNitrogen.toFixed(3), variant: 'red' },
    { label: 'Nilai Maximum', value: overallStats.maxNitrogen.toFixed(3), variant: 'green' },
    { 
      label: 'Tren', 
      value: overallStats.trend === 'up' ? 'Naik' : overallStats.trend === 'down' ? 'Turun' : 'Stabil',
      variant: 'purple',
      icon: overallStats.trend,
    },
  ] : [];

  // Chart data for bar chart
  const chartData = useMemo(() => {
    return weeklyData.map(day => ({
      name: day.dateLabel,
      nitrogen: parseFloat(day.avgNitrogen.toFixed(3)),
      date: day.date,
    }));
  }, [weeklyData]);

  // Get selected day data
  const selectedDayData = selectedDay 
    ? weeklyData.find(d => d.date === selectedDay) 
    : null;

  return (
    <Card className="glass-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-green-600" />
            <span>Riwayat Monitoring Mingguan</span>
          </CardTitle>
          <CardDescription>
            Data rata-rata harian dari {weeklyData.length} hari terakhir (masing-masing 1440 data/hari)
          </CardDescription>
        </div>
        <Button 
          variant="outline" 
          className="flex items-center space-x-2" 
          onClick={() => exportToCSV(weeklyData)}
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Statistics */}
        {overallStats && <StatsOverview items={statsItems} />}

        {/* Bar Chart with Toggle */}
        {chartData.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">Tren Harian</h4>
              <ChartToggle
                options={NITROGEN_ONLY_OPTIONS}
                value={chartDataType}
                onChange={setChartDataType}
              />
            </div>
            <NitrogenBarChart
              data={chartData}
              dataKey={chartDataType}
              xAxisKey="name"
              height={256}
            />
          </div>
        )}

        {/* Data Table */}
        <WeeklyDataTable
          weeklyData={weeklyData}
          selectedDay={selectedDay}
          onSelectDay={setSelectedDay}
        />

        {/* Selected Day Details */}
        <SelectedDayDetails dayData={selectedDayData} />
      </CardContent>
    </Card>
  );
}

export default WeeklyHistoryTable;
