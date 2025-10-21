import React from "react";
import { BarChart3, AlertCircle } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getRecentHistory } from "../data/agriinoData";
export function PlantDetailPanel({ plant }) {
  if (!plant) {
    return (
      <div className="text-center py-12 text-gray-500">
        <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>Pilih tanaman dari daftar untuk melihat detail monitoring</p>
      </div>
    );
  }

  const trendData = getRecentHistory(7);

  return (
    <div className="space-y-6">
      {}
      <div>
        <h4 className="font-medium mb-3 flex items-center space-x-2">
          <BarChart3 className="w-4 h-4" />
          <span>Tren 7 Hari Terakhir</span>
        </h4>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="chlorophyll"
                stroke="#22c55e"
                strokeWidth={2}
                name="Klorofil"
              />
              <Line
                type="monotone"
                dataKey="nitrogen"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Nitrogen"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-green-600 mb-1">Indeks Klorofil</p>
          <p className="text-2xl font-bold text-green-800">
            {plant.chlorophyll}
          </p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-600 mb-1">Nitrogen (mg/L)</p>
          <p className="text-2xl font-bold text-blue-800">{plant.nitrogen}</p>
        </div>
      </div>

      {}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
        <h4 className="font-medium text-purple-900 mb-2 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4" />
          <span>Rekomendasi AI</span>
        </h4>
        <p className="text-purple-800">{plant.recommendation}</p>
      </div>
    </div>
  );
}
