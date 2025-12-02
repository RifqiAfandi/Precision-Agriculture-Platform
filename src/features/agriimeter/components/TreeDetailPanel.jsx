import React from "react";
import { Button } from "@/components/ui/Button";
import { BarChart3, Target, Ruler } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  getStatusLabel,
  calculateTimeToTarget,
  getGrowthRecommendation,
} from "../utils/agriimeterHelpers";
import { growthData } from "../data/agriimeterData";
export function TreeDetailPanel({ tree, onMeasure }) {
  if (!tree) {
    return (
      <div className="text-center py-12 text-gray-500">
        <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>Pilih pohon dari daftar untuk melihat detail pertumbuhan DBH</p>
      </div>
    );
  }

  const monthsToTarget = calculateTimeToTarget(tree.currentDBH, 20, tree.growthRate);
  const recommendation = getGrowthRecommendation(tree.growthRate);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <p className="text-sm text-green-600 dark:text-green-400 mb-1">DBH Saat Ini</p>
          <p className="text-2xl font-bold text-green-800 dark:text-green-300">
            {tree.currentDBH} cm
          </p>
          <p className="text-xs text-green-600 dark:text-green-400 mt-1">
            +{(tree.currentDBH - tree.previousDBH).toFixed(1)} cm dari bulan
            lalu
          </p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">Estimasi Volume</p>
          <p className="text-2xl font-bold text-blue-800 dark:text-blue-300">
            {tree.estimatedVolume} m³
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Biomassa kayu</p>
        </div>
      </div>
      <div>
        <h4 className="font-medium mb-3 flex items-center space-x-2">
          <BarChart3 className="w-4 h-4" />
          <span>Tren Pertumbuhan 8 Bulan</span>
        </h4>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="dbh"
                stroke="#22c55e"
                strokeWidth={2}
                name="DBH (cm)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg">
        <h4 className="font-medium text-purple-900 dark:text-purple-300 mb-2 flex items-center space-x-2">
          <Target className="w-4 h-4" />
          <span>Analisis Pertumbuhan AI</span>
        </h4>
        <div className="space-y-2 text-sm">
          <p className="text-purple-800 dark:text-purple-300">
            <strong>Status:</strong> {getStatusLabel(tree.status)} dengan laju
            pertumbuhan {tree.growthRate} cm/bulan
          </p>
          <p className="text-purple-800 dark:text-purple-300">
            <strong>Prediksi:</strong> Mencapai diameter 20 cm dalam{" "}
            {monthsToTarget === Infinity ? "∞" : monthsToTarget} bulan
          </p>
          <p className="text-purple-800 dark:text-purple-300">
            <strong>Rekomendasi:</strong> {recommendation}
          </p>
        </div>
      </div>
      <Button
        onClick={() => onMeasure(tree.id)}
        className="w-full bg-blue-600 hover:bg-blue-700"
      >
        <Ruler className="w-4 h-4 mr-2" />
        Simulasi Pengukuran DBH
      </Button>
    </div>
  );
}
