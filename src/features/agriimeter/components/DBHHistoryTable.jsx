import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
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
import {
  getStatusColor,
  getStatusLabel,
  getGrowthRateColor,
} from "../utils/agriimeterHelpers";
import { growthData } from "../data/agriimeterData";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-3 shadow-lg">
        <p className="text-gray-600 dark:text-slate-300 text-sm mb-1">{label}</p>
        <p className="text-green-600 dark:text-green-400 font-medium">
          {payload[0].name}: {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

export function DBHHistoryTable({ trees, onExport }) {
  return (
    <Card className="glass-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span>Riwayat Pengukuran DBH</span>
          </CardTitle>
          <CardDescription>Data historis semua pohon</CardDescription>
        </div>
        <Button
          variant="outline"
          className="flex items-center space-x-2 border-green-200 dark:border-slate-600 hover:bg-green-50 dark:hover:bg-slate-700"
          onClick={onExport}
        >
          <Download className="w-4 h-4" />
          <span>Export Data</span>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <h4 className="font-medium mb-3 text-gray-900 dark:text-gray-100">Rata-rata Pertumbuhan DBH</h4>
          <div className="h-64 bg-white dark:bg-slate-800 rounded-lg p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" className="dark:stroke-slate-600" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="month" 
                  stroke="#6b7280"
                  className="dark:stroke-slate-400"
                />
                <YAxis 
                  stroke="#6b7280"
                  className="dark:stroke-slate-400"
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="dbh" fill="#22c55e" name="DBH (cm)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-slate-700">
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  Tanggal
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  Pohon
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  DBH (cm)
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  Pertumbuhan
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  Volume (m³)
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {trees.map((tree) => (
                <tr
                  key={tree.id}
                  className="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <td className="py-3 px-4 text-gray-900 dark:text-gray-100">
                    {tree.lastMeasurement.split(" ")[0]}
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{tree.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{tree.location}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-gray-900 dark:text-gray-100">{tree.currentDBH}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getGrowthRateColor(
                        tree.growthRate
                      )}`}
                    >
                      +{tree.growthRate}/bulan
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-900 dark:text-gray-100">{tree.estimatedVolume}</td>
                  <td className="py-3 px-4">
                    <Badge className={getStatusColor(tree.status)}>
                      {getStatusLabel(tree.status)}
                    </Badge>
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
