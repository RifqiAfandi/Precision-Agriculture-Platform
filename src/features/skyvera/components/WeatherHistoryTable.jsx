import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Download, Clock } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { getParameterStatus } from "../data/skyveraData";

export function WeatherHistoryTable({ stations, onExport }) {
  const allRecords = stations.flatMap((station) =>
    station.history.slice(-5).map((record) => ({
      ...record,
      stationName: station.name,
      stationId: station.id,
    }))
  );

  const sortedRecords = allRecords.sort((a, b) => {
    return b.time.localeCompare(a.time);
  });

  const getAQIBadge = (aqi) => {
    const status = getParameterStatus(aqi, "aqi");
    const colors = {
      good: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400",
      moderate: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400",
      unhealthy_sensitive: "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400",
      unhealthy: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400",
    };
    return colors[status.status] || "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300";
  };

  const getWindBadge = (wind) => {
    if (wind <= 20) return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400";
    if (wind <= 40) return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400";
    if (wind <= 60) return "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400";
    return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400";
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>Riwayat Data Cuaca</span>
            </CardTitle>
            <CardDescription>
              Histori data monitoring dari semua weather station
            </CardDescription>
          </div>
          <Button
            variant="outline"
            onClick={onExport}
            className="border-blue-200 dark:border-slate-600 hover:bg-blue-50 dark:hover:bg-slate-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Ekspor
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-md border dark:border-slate-700">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap">Waktu</TableHead>
                    <TableHead className="whitespace-nowrap">Station</TableHead>
                    <TableHead className="whitespace-nowrap">Suhu</TableHead>
                    <TableHead className="whitespace-nowrap">Kelembaban</TableHead>
                    <TableHead className="whitespace-nowrap">Angin</TableHead>
                    <TableHead className="whitespace-nowrap">Hujan</TableHead>
                    <TableHead className="whitespace-nowrap">AQI</TableHead>
                    <TableHead className="whitespace-nowrap">CO₂</TableHead>
                  </TableRow>
                </TableHeader>
            <TableBody>
              {sortedRecords.length > 0 ? (
                sortedRecords.map((record, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium">{record.time}</TableCell>
                    <TableCell>{record.stationName}</TableCell>
                    <TableCell>{record.temp}°C</TableCell>
                    <TableCell>{record.humidity}%</TableCell>
                    <TableCell>
                      <Badge className={getWindBadge(record.wind)} variant="outline">
                        {record.wind} km/h
                      </Badge>
                    </TableCell>
                    <TableCell>{record.rainfall} mm</TableCell>
                    <TableCell>
                      <Badge className={getAQIBadge(record.aqi)}>
                        {record.aqi}
                      </Badge>
                    </TableCell>
                    <TableCell>{record.co2} ppm</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500 dark:text-gray-400">
                    Belum ada data riwayat
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
