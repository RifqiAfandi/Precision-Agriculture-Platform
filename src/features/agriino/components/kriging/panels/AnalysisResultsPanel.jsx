import React from 'react';
import PropTypes from 'prop-types';
import {
  Loader2,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';
import { NITROGEN_THRESHOLDS } from '@/constants';

/**
 * Classification colors for the analysis results
 */
const CLASSIFICATION_COLORS = {
  deficient: { bg: 'rgba(229, 57, 53, 0.2)', text: '#E53935' },
  subnormal: { bg: 'rgba(251, 140, 0, 0.2)', text: '#FB8C00' },
  normal: { bg: 'rgba(253, 216, 53, 0.2)', text: '#F9A825', dot: '#FDD835' },
  high: { bg: 'rgba(67, 160, 71, 0.2)', text: '#43A047' },
};

/**
 * Zoning Statistics Table Component
 */
function ZoningStatisticsTable({ statistics }) {
  const rows = [
    { key: 'deficient', label: 'Defisien', count: statistics.deficient_count, range: '< 1.80', bgClass: 'bg-red-50 dark:bg-red-900/20' },
    { key: 'subnormal', label: 'Subnormal', count: statistics.subnormal_count, range: '1.80-2.71', bgClass: 'bg-orange-50 dark:bg-orange-900/20' },
    { key: 'normal', label: 'Normal', count: statistics.normal_count, range: '2.71-3.31', bgClass: 'bg-yellow-50 dark:bg-yellow-900/20' },
    { key: 'high', label: 'Tinggi', count: statistics.high_count, range: '> 3.31', bgClass: 'bg-green-50 dark:bg-green-900/20' },
  ];

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Zoning Statistic</p>
      <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="w-full text-xs">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-2 py-1.5 text-left font-medium text-gray-600 dark:text-gray-400">Header</th>
              <th className="px-2 py-1.5 text-right font-medium text-gray-600 dark:text-gray-400">Amount</th>
              <th className="px-2 py-1.5 text-right font-medium text-gray-600 dark:text-gray-400">AVG N (%)</th>
              <th className="px-2 py-1.5 text-right font-medium text-gray-600 dark:text-gray-400">Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {rows.map(({ key, label, count, range, bgClass }) => count > 0 && (
              <tr key={key} className={bgClass}>
                <td className="px-2 py-1.5 flex items-center gap-1">
                  <span 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: CLASSIFICATION_COLORS[key]?.text }} 
                  />
                  <span style={{ color: CLASSIFICATION_COLORS[key]?.text }}>{label}</span>
                </td>
                <td className="px-2 py-1.5 text-right text-gray-700 dark:text-gray-300">{count}</td>
                <td className="px-2 py-1.5 text-right text-gray-700 dark:text-gray-300">{range}</td>
                <td className="px-2 py-1.5 text-right text-gray-700 dark:text-gray-300">
                  {((count / statistics.total_points) * 100).toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <td className="px-2 py-1.5 font-medium text-gray-700 dark:text-gray-300">TOTAL</td>
              <td className="px-2 py-1.5 text-right font-medium text-gray-700 dark:text-gray-300">
                {statistics.data_points || statistics.total_points}
              </td>
              <td className="px-2 py-1.5 text-right font-medium text-gray-700 dark:text-gray-300">
                {statistics.mean_value?.toFixed(2)}
              </td>
              <td className="px-2 py-1.5 text-right font-medium text-gray-700 dark:text-gray-300">100%</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

ZoningStatisticsTable.propTypes = {
  statistics: PropTypes.object.isRequired,
};

/**
 * Classification Distribution Component
 */
function ClassificationDistribution({ statistics }) {
  const items = [
    { key: 'deficient', label: 'Defisien', count: statistics.deficient_count },
    { key: 'subnormal', label: 'Subnormal', count: statistics.subnormal_count },
    { key: 'normal', label: 'Normal', count: statistics.normal_count },
    { key: 'high', label: 'Tinggi', count: statistics.high_count },
  ];

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Distribusi Klasifikasi</p>
      <div className="grid grid-cols-5 gap-1">
        {items.map(({ key, label, count }) => (
          <div 
            key={key}
            className="rounded-lg p-2 text-center" 
            style={{ backgroundColor: CLASSIFICATION_COLORS[key]?.bg }}
          >
            <p className="text-lg font-bold" style={{ color: CLASSIFICATION_COLORS[key]?.text }}>
              {count || 0}
            </p>
            <p className="text-xs" style={{ color: CLASSIFICATION_COLORS[key]?.text }}>{label}</p>
          </div>
        ))}
        <div className="bg-gray-100 dark:bg-gray-700/30 rounded-lg p-2 text-center">
          <p className="text-lg font-bold text-gray-500 dark:text-gray-400">{statistics.no_data_count || 0}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">No Data</p>
        </div>
      </div>
    </div>
  );
}

ClassificationDistribution.propTypes = {
  statistics: PropTypes.object.isRequired,
};

/**
 * Variogram Parameters Component
 */
function VariogramParams({ params }) {
  if (!params) return null;

  return (
    <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-3 text-sm">
      <p className="font-medium text-gray-700 dark:text-gray-300 mb-2">Parameter Variogram</p>
      <div className="grid grid-cols-2 gap-2 text-gray-600 dark:text-gray-400">
        <p>
          Model: <strong className="text-gray-900 dark:text-gray-100">{params.model}</strong>
        </p>
        <p>
          Range: <strong className="text-gray-900 dark:text-gray-100">{params.range?.toFixed(4)}</strong>
        </p>
        <p>
          Nugget: <strong className="text-gray-900 dark:text-gray-100">{params.nugget?.toFixed(4)}</strong>
        </p>
        <p>
          Sill: <strong className="text-gray-900 dark:text-gray-100">{params.sill?.toFixed(4)}</strong>
        </p>
        <p className="col-span-2">
          Influence Radius: <strong className="text-gray-900 dark:text-gray-100">
            {((params.influence_radius || 0.05) * 1000).toFixed(0)}m
          </strong>
        </p>
      </div>
    </div>
  );
}

VariogramParams.propTypes = {
  params: PropTypes.object,
};

/**
 * Analysis Results Panel Component
 * Displays Kriging analysis results with statistics and variogram parameters
 */
export function AnalysisResultsPanel({ analysisResult, isAnalyzing }) {
  if (isAnalyzing) {
    return (
      <div className="text-center py-8">
        <Loader2 className="w-8 h-8 mx-auto mb-2 animate-spin text-blue-500" />
        <p className="text-gray-500 dark:text-gray-400">Sedang melakukan analisis Kriging...</p>
      </div>
    );
  }

  if (!analysisResult) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-8">
        <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p>Pilih area di peta dan klik "Mulai Analisis"</p>
        <p className="text-sm mt-2">untuk menjalankan interpolasi Kriging</p>
      </div>
    );
  }

  const { statistics, thresholds, variogram_params } = analysisResult;

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3">
          <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">Rata-rata Nitrogen</p>
          <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {statistics.mean_value?.toFixed(4)}
          </p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-3">
          <p className="text-sm text-purple-600 dark:text-purple-400 mb-1">Std Deviasi</p>
          <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {statistics.std_value?.toFixed(4)}
          </p>
        </div>
      </div>

      {/* Min/Max */}
      <div className="flex items-center justify-between bg-gray-50 dark:bg-slate-700 rounded-lg p-3">
        <div className="flex items-center gap-2">
          <TrendingDown className="w-4 h-4 text-red-500" />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Min: {statistics.min_value?.toFixed(4)}
          </span>
        </div>
        <Minus className="w-4 h-4 text-gray-400" />
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-green-500" />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Max: {statistics.max_value?.toFixed(4)}
          </span>
        </div>
      </div>

      {/* Classification Distribution */}
      <ClassificationDistribution statistics={statistics} />

      {/* Zoning Statistics Table */}
      <ZoningStatisticsTable statistics={statistics} />

      {/* Variogram Parameters */}
      <VariogramParams params={variogram_params} />

      {/* Thresholds */}
      <div className="text-xs text-gray-400 dark:text-gray-500">
        Threshold: Defisien &lt; {thresholds?.deficient || NITROGEN_THRESHOLDS.deficient.max} | 
        Subnormal {thresholds?.deficient || NITROGEN_THRESHOLDS.deficient.max} - {thresholds?.subnormal || NITROGEN_THRESHOLDS.subnormal.max} | 
        Normal {thresholds?.subnormal || NITROGEN_THRESHOLDS.subnormal.max} - {thresholds?.normal || NITROGEN_THRESHOLDS.normal.max} | 
        Tinggi &gt; {thresholds?.normal || NITROGEN_THRESHOLDS.normal.max}
      </div>
    </div>
  );
}

AnalysisResultsPanel.propTypes = {
  analysisResult: PropTypes.object,
  isAnalyzing: PropTypes.bool,
};

export default AnalysisResultsPanel;
