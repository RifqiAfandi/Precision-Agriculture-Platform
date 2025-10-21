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
export function DBHHistoryTable({ trees, onExport }) {
  return (
    <Card className="glass-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-green-600" />
            <span>Riwayat Pengukuran DBH</span>
          </CardTitle>
          <CardDescription>Data historis semua pohon</CardDescription>
        </div>
        <Button
          variant="outline"
          className="flex items-center space-x-2"
          onClick={onExport}
        >
          <Download className="w-4 h-4" />
          <span>Export Data</span>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <h4 className="font-medium mb-3">Rata-rata Pertumbuhan DBH</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="dbh" fill="#22c55e" name="DBH (cm)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Tanggal
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Pohon
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  DBH (cm)
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Pertumbuhan
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Volume (m³)
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {trees.map((tree) => (
                <tr
                  key={tree.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4">
                    {tree.lastMeasurement.split(" ")[0]}
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium">{tree.name}</p>
                      <p className="text-xs text-gray-500">{tree.location}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium">{tree.currentDBH}</span>
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
                  <td className="py-3 px-4">{tree.estimatedVolume}</td>
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
