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
  getActionTypeBadgeVariant,
  getActionStatusBadgeVariant,
  formatTimestamp,
} from "../utils/greenhouseHelpers";
export function ActionHistoryPanel({ history, onExport }) {
  const handleExport = () => {
    if (onExport) {
      onExport();
    } else {
      const csv = [
        ["Waktu", "Aksi", "Status", "Tipe", "Alasan"].join(","),
        ...history.map((action) =>
          [
            action.time,
            action.action,
            action.status,
            action.type === "auto" ? "Otomatis" : "Manual",
            action.reason,
          ]
            .map((field) => `"${field}"`)
            .join(",")
        ),
      ].join("\n");

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `greenhouse_history_${new Date().getTime()}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-green-600" />
            <span>Riwayat Aksi Sistem</span>
          </CardTitle>
          <CardDescription>Log aktivitas otomatis dan manual</CardDescription>
        </div>
        <Button
          variant="outline"
          className="flex items-center space-x-2"
          onClick={handleExport}
        >
          <Download className="w-4 h-4" />
          <span>Export</span>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {history.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Belum ada riwayat aksi</p>
            </div>
          ) : (
            history.map((action, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="text-sm font-medium text-gray-500 min-w-[60px]">
                  {formatTimestamp(action.time)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 flex-wrap gap-1">
                    <span className="font-medium">{action.action}</span>
                    <Badge
                      variant={getActionStatusBadgeVariant(action.status)}
                    >
                      {action.status}
                    </Badge>
                    <Badge variant={getActionTypeBadgeVariant(action.type)}>
                      {action.type === "auto" ? "Otomatis" : "Manual"}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{action.reason}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
