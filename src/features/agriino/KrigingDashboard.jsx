import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { StatCard } from '@/components/common/StatCard';
import { KrigingMap } from './components/KrigingMap';
import { toast } from 'sonner';
import { 
  MapPin, 
  Target, 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  Wifi,
  WifiOff,
  Activity,
  Leaf,
  AlertCircle,
  Loader2,
  FileText,
  Calendar
} from 'lucide-react';
import api from '@/services/api';
import useFirebaseDevices from '@/hooks/useFirebaseDevices';
import useKrigingAnalysis from '@/hooks/useKrigingAnalysis';

/**
 * Analysis History Component
 */
const AnalysisHistory = ({ onSelectAnalysis }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const data = await api.getAnalysisResults();
      setHistory(data);
    } catch (error) {
      console.error('Error fetching history:', error);
      // Demo data
      setHistory([
        { 
          id: 1, 
          analysis_type: 'nitrogen', 
          status: 'completed', 
          variogram_model: 'spherical',
          mean_value: 1.95, 
          min_value: 1.32, 
          max_value: 2.78,
          created_at: new Date().toISOString() 
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-green-600" />
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
        <p>Belum ada riwayat analisis</p>
        <p className="text-sm">Lakukan analisis Kriging untuk melihat riwayat</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {history.map((item) => (
        <div
          key={item.id}
          className="p-3 border dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer transition-colors"
          onClick={() => onSelectAnalysis && onSelectAnalysis(item.id)}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="font-medium text-gray-900 dark:text-gray-100">Analisis #{item.id}</span>
            </div>
            <Badge variant={item.status === 'completed' ? 'default' : 'secondary'}>
              {item.status === 'completed' ? 'Selesai' : item.status}
            </Badge>
          </div>
          <div className="grid grid-cols-3 gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
            <div>
              <span className="text-gray-400 dark:text-gray-500">Min:</span> {item.min_value?.toFixed(3)}
            </div>
            <div>
              <span className="text-gray-400 dark:text-gray-500">Avg:</span> {item.mean_value?.toFixed(3)}
            </div>
            <div>
              <span className="text-gray-400 dark:text-gray-500">Max:</span> {item.max_value?.toFixed(3)}
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
            <Calendar className="w-3 h-3" />
            {new Date(item.created_at).toLocaleString('id-ID')}
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Main Kriging Dashboard Page
 */
export function KrigingDashboard() {
  const [activeTab, setActiveTab] = useState('map');
  
  // Firebase devices hook
  const { 
    devices, 
    loading: devicesLoading, 
    connected, 
    statistics: deviceStats,
    refresh: refreshDevices 
  } = useFirebaseDevices('devices', {
    realtime: true,
    thresholds: { low: 1.80, high: 3.31 },
  });

  // Kriging analysis hook
  const {
    result: analysisResult,
    loading: analysisLoading,
    analyze,
    statistics: analysisStats,
  } = useKrigingAnalysis({
    gridResolution: 15,
    variogramModel: 'spherical',
    thresholds: { 
      low: 1.80, 
      high: 3.31,
      deficient: 1.80,
      subnormal: 2.71,
      normal: 3.31 
    },
    influenceRadius: 0.05, // 50 meters
  });

  // Handle analysis
  const handleAnalyze = async () => {
    if (devices.length < 1) {
      toast.error('Minimal 1 device diperlukan untuk analisis');
      return;
    }

    try {
      await analyze(devices);
      toast.success('Analisis Kriging berhasil!');
    } catch (error) {
      toast.error(`Analisis gagal: ${error.message}`);
    }
  };

  // Handle view analysis history
  const handleSelectAnalysis = async (analysisId) => {
    try {
      const result = await api.getAnalysisResult(analysisId);
      toast.info(`Memuat hasil analisis #${analysisId}`);
      // Could update state to show this result
    } catch (error) {
      toast.error('Gagal memuat hasil analisis');
    }
  };

  return (
    <div className="space-y-4 p-4 md:p-6">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          icon={MapPin}
          iconColor="text-blue-600"
          label="Total Device"
          value={deviceStats.count}
        />
        <StatCard
          icon={Target}
          iconColor="text-green-600"
          label="Avg Nitrogen"
          value={deviceStats.avgNitrogen.toFixed(3)}
        />
        <StatCard
          icon={TrendingDown}
          iconColor="text-red-600"
          label="Level Rendah"
          value={deviceStats.lowCount}
        />
        <StatCard
          icon={TrendingUp}
          iconColor="text-emerald-600"
          label="Level Tinggi"
          value={deviceStats.highCount}
        />
      </div>

      {/* Connection Status */}
      <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
        <div className="flex items-center gap-3">
          {connected ? (
            <>
              <Wifi className="w-5 h-5 text-green-500" />
              <span className="text-sm text-green-600 font-medium">Firebase Connected</span>
            </>
          ) : (
            <>
              <WifiOff className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-500">Offline Mode</span>
            </>
          )}
          <Badge variant="outline" className="ml-2">
            {devices.length} devices
          </Badge>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={refreshDevices}
          disabled={devicesLoading}
        >
          {devicesLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            'Refresh'
          )}
        </Button>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="map" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span className="hidden sm:inline">Peta Kriging</span>
            <span className="sm:hidden">Peta</span>
          </TabsTrigger>
          <TabsTrigger value="devices" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            <span className="hidden sm:inline">Data Device</span>
            <span className="sm:hidden">Device</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Riwayat</span>
            <span className="sm:hidden">Riwayat</span>
          </TabsTrigger>
        </TabsList>

        {/* Map Tab */}
        <TabsContent value="map" className="mt-4">
          <KrigingMap />
        </TabsContent>

        {/* Devices Tab */}
        <TabsContent value="devices" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-600" />
                Data Device dari Firebase
              </CardTitle>
              <CardDescription>
                Real-time data dari sensor nitrogen
              </CardDescription>
            </CardHeader>
            <CardContent>
              {devicesLoading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="w-8 h-8 animate-spin text-green-600" />
                </div>
              ) : devices.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Tidak ada data device</p>
                  <p className="text-sm">Pastikan Firebase terhubung dengan benar</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2 text-sm font-medium text-gray-600">Device ID</th>
                        <th className="text-left p-2 text-sm font-medium text-gray-600">Lokasi</th>
                        <th className="text-right p-2 text-sm font-medium text-gray-600">Nitrogen</th>
                        <th className="text-right p-2 text-sm font-medium text-gray-600">SPAD</th>
                        <th className="text-center p-2 text-sm font-medium text-gray-600">Status</th>
                        <th className="text-center p-2 text-sm font-medium text-gray-600">Class</th>
                      </tr>
                    </thead>
                    <tbody>
                      {devices.map((device) => {
                        const classification = device.classification || 'unknown';
                        const statusColors = {
                          deficient: 'bg-red-100 text-red-700',
                          subnormal: 'bg-orange-100 text-orange-700',
                          normal: 'bg-yellow-100 text-yellow-700',
                          high: 'bg-green-100 text-green-700',
                          low: 'bg-red-100 text-red-700',
                          unknown: 'bg-gray-100 text-gray-700',
                        };
                        const statusLabels = {
                          deficient: 'Defisien',
                          subnormal: 'Subnormal',
                          normal: 'Normal',
                          high: 'Tinggi',
                          low: 'Rendah',
                          unknown: 'Unknown',
                        };
                        
                        return (
                          <tr key={device.device_id} className="border-b hover:bg-gray-50">
                            <td className="p-2 font-medium">{device.device_id}</td>
                            <td className="p-2 text-sm text-gray-600">
                              {device.lat?.toFixed(6)}, {device.lng?.toFixed(6)}
                            </td>
                            <td className="p-2 text-right font-mono">
                              {device.nitrogen?.toFixed(4) || 'N/A'}
                            </td>
                            <td className="p-2 text-right font-mono">
                              {device.spad?.toFixed(2) || 'N/A'}
                            </td>
                            <td className="p-2 text-center">
                              <Badge className={statusColors[classification]}>
                                {statusLabels[classification]}
                              </Badge>
                            </td>
                            <td className="p-2 text-center text-sm text-gray-600">
                              {device.class_eq1 || '-'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-green-600" />
                Riwayat Analisis
              </CardTitle>
              <CardDescription>
                Hasil analisis Kriging sebelumnya
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AnalysisHistory onSelectAnalysis={handleSelectAnalysis} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Analysis Summary Card (shows when analysis is done) */}
      {analysisResult && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-green-700 flex items-center gap-2">
              <Leaf className="w-5 h-5" />
              Hasil Analisis Kriging Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">Rata-rata</p>
                <p className="text-xl font-bold text-green-700">
                  {analysisStats?.mean_value?.toFixed(4)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Minimum</p>
                <p className="text-xl font-bold text-red-600">
                  {analysisStats?.min_value?.toFixed(4)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Maximum</p>
                <p className="text-xl font-bold text-emerald-600">
                  {analysisStats?.max_value?.toFixed(4)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Grid Points</p>
                <p className="text-xl font-bold text-blue-600">
                  {analysisStats?.total_points}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default KrigingDashboard;
