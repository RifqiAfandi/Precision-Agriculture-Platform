import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
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
import { historicalData } from "../data/agriinoData";
import { getChlorophyllColor, exportToCsv } from "../utils/agriinoHelpers";

/**
 * HistoryTable component displays historical plant data
 * Shows bar chart overview and detailed table with export functionality
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Array} props.plants - Array of plant objects to display in table
 * 
 * @example
 * <HistoryTable plants={allPlants} />
 */
export function HistoryTable({ plants }) {
  const handleExport = () => {
    const csv = exportToCsv(plants);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `agriino_data_${new Date().getTime()}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
        {/* Trend Chart */}
        <div className="mb-6">
          <h4 className="font-medium mb-3">
            Tren Rata-rata ({historicalData.length} Hari Terakhir)
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={historicalData}>
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

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Tanggal
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
                  Saran Pemupukan
                </th>
              </tr>
            </thead>
            <tbody>
              {plants.map((plant) => (
                <tr
                  key={plant.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4">02 Agu 2024</td>
                  <td className="py-3 px-4">{plant.location}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getChlorophyllColor(
                        plant.chlorophyll
                      )}`}
                    >
                      {plant.chlorophyll}
                    </span>
                  </td>
                  <td className="py-3 px-4">{plant.nitrogen} mg/L</td>
                  <td className="py-3 px-4 text-gray-600 max-w-xs truncate">
                    {plant.recommendation}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
