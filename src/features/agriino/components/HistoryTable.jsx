import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Calendar, Download } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getChlorophyllColor, exportToCsv } from "../utils/agriinoHelpers";

export function HistoryTable({ plants }) {
  const handleExport = () => {
    const csv = exportToCsv(plants);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `agriino_data_${new Date().toISOString().split('T')[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Aggregate recent readings data for chart
  const chartData = React.useMemo(() => {
    if (!plants || plants.length === 0) return [];
    
    // Get all recent readings and group by date
    const readingsByDate = {};
    plants.forEach(plant => {
      if (plant.recent_readings && plant.recent_readings.length > 0) {
        plant.recent_readings.forEach(reading => {
          const date = reading.date;
          if (!readingsByDate[date]) {
            readingsByDate[date] = { date, chlorophyll: [], nitrogen: [] };
          }
          readingsByDate[date].chlorophyll.push(reading.chlorophyll);
          readingsByDate[date].nitrogen.push(reading.nitrogen);
        });
      }
    });

    // Calculate averages
    return Object.values(readingsByDate).map(item => ({
      date: item.date,
      chlorophyll: (item.chlorophyll.reduce((a, b) => a + b, 0) / item.chlorophyll.length).toFixed(1),
      nitrogen: (item.nitrogen.reduce((a, b) => a + b, 0) / item.nitrogen.length).toFixed(1),
    })).reverse(); // Show oldest first
  }, [plants]);

  return (
    <Card className="glass-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-green-600" />
            <span>Riwayat Pengukuran</span>
          </CardTitle>
          <CardDescription>Data historis semua tanaman</CardDescription>
        </div>
        <Button
          variant="outline"
          className="flex items-center space-x-2"
          onClick={handleExport}
        >
          <Download className="w-4 h-4" />
          <span>Export Data</span>
        </Button>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 && (
          <div className="mb-6">
            <h4 className="font-medium mb-3">
              Tren Rata-rata ({chartData.length} Hari Terakhir)
            </h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="chlorophyll" fill="#22c55e" name="Klorofil" />
                  <Bar dataKey="nitrogen" fill="#3b82f6" name="Nitrogen" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Tanaman
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Lokasi
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Indeks Klorofil
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Kadar Nitrogen
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Saran
                </th>
              </tr>
            </thead>
            <tbody>
              {plants && plants.length > 0 ? (
                plants.map((plant) => (
                  <tr
                    key={plant.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 font-medium">{plant.name}</td>
                    <td className="py-3 px-4">{plant.location}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getChlorophyllColor(
                          plant.current_chlorophyll
                        )}`}
                      >
                        {plant.current_chlorophyll != null ? plant.current_chlorophyll.toFixed(1) : '-'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {plant.current_nitrogen != null ? plant.current_nitrogen.toFixed(1) : '-'} mg/L
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        plant.status === 'excellent' ? 'bg-green-100 text-green-800' :
                        plant.status === 'good' ? 'bg-blue-100 text-blue-800' :
                        plant.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {plant.status === 'excellent' ? 'Sempurna' :
                         plant.status === 'good' ? 'Baik' :
                         plant.status === 'warning' ? 'Perlu Perhatian' :
                         'Kritis'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600 max-w-xs truncate">
                      {plant.recommendation || '-'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-500">
                    Belum ada data tanaman
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
