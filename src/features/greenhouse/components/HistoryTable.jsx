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

export function HistoryTable({ greenhouses, onExport }) {
  const actionTypeConfig = {
    auto: { color: "bg-blue-100 text-blue-800", label: "Otomatis" },
    manual: { color: "bg-purple-100 text-purple-800", label: "Manual" },
  };

  // Collect all history from all greenhouses
  const allHistory = greenhouses.flatMap((greenhouse) =>
    greenhouse.actionHistory.map((action) => ({
      ...action,
      greenhouseName: greenhouse.name,
    }))
  );

  // Sort by time (most recent first)
  const sortedHistory = allHistory.sort((a, b) => {
    return b.time.localeCompare(a.time);
  });

  return (
    <Card className="glass-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-green-600" />
              <span>Riwayat Aksi Kontrol</span>
            </CardTitle>
            <CardDescription>
              Histori aksi otomatis dan manual dari semua greenhouse
            </CardDescription>
          </div>
          <Button
            variant="outline"
            onClick={onExport}
            className="border-green-200 hover:bg-green-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Ekspor
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap">Waktu</TableHead>
                    <TableHead className="whitespace-nowrap">Greenhouse</TableHead>
                    <TableHead className="whitespace-nowrap">Aksi</TableHead>
                    <TableHead className="whitespace-nowrap">Status</TableHead>
                    <TableHead className="whitespace-nowrap">Alasan</TableHead>
                    <TableHead className="whitespace-nowrap">Tipe</TableHead>
                  </TableRow>
                </TableHeader>
            <TableBody>
              {sortedHistory.length > 0 ? (
                sortedHistory.map((record, idx) => {
                  const typeStyle = actionTypeConfig[record.type] || actionTypeConfig.auto;
                  return (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{record.time}</TableCell>
                      <TableCell>{record.greenhouseName}</TableCell>
                      <TableCell>{record.action}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{record.status}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {record.reason}
                      </TableCell>
                      <TableCell>
                        <Badge className={typeStyle.color}>
                          {typeStyle.label}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    Belum ada riwayat aksi
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
