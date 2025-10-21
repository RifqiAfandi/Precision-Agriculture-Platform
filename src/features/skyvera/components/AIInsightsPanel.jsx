import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { AlertTriangle, Droplets, Sun, Lightbulb } from "lucide-react";

const priorityConfig = {
  high: {
    color: "text-red-600",
    bg: "bg-red-100",
    label: "Prioritas Tinggi",
    icon: AlertTriangle,
  },
  medium: {
    color: "text-orange-600",
    bg: "bg-orange-100",
    label: "Prioritas Sedang",
    icon: Lightbulb,
  },
  low: {
    color: "text-blue-600",
    bg: "bg-blue-100",
    label: "Informasi",
    icon: Sun,
  },
};
const AIInsightsPanel = ({ insights }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Insights & Rekomendasi</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight, index) => {
          const config = priorityConfig[insight.priority] || priorityConfig.low;
          const Icon = config.icon;

          return (
            <div
              key={index}
              className="p-4 border rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 ${config.bg} rounded-lg`}>
                  <Icon className={`w-5 h-5 ${config.color}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                    <Badge className={`${config.bg} ${config.color}`}>
                      {config.label}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
                  <div className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                    <p className="text-sm font-medium text-blue-900">
                      💡 Rekomendasi: {insight.recommendation}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default AIInsightsPanel;
