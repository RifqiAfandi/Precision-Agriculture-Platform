import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FileDown, FileSpreadsheet, FileJson } from "lucide-react";
const ExportPanel = ({ onExportCSV, onExportPDF, onExportJSON }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1">Export Data Cuaca</h3>
            <p className="text-sm text-gray-600">
              Download data dalam berbagai format untuk analisis lebih lanjut
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onExportCSV}
              className="gap-2"
            >
              <FileSpreadsheet className="w-4 h-4" />
              CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onExportPDF}
              className="gap-2"
            >
              <FileDown className="w-4 h-4" />
              PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onExportJSON}
              className="gap-2"
            >
              <FileJson className="w-4 h-4" />
              JSON
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExportPanel;
