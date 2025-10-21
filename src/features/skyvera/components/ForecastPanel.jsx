import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const colorConfig = {
  blue: "bg-blue-100 text-blue-700 border-blue-200",
  green: "bg-green-100 text-green-700 border-green-200",
  yellow: "bg-yellow-100 text-yellow-700 border-yellow-200",
  orange: "bg-orange-100 text-orange-700 border-orange-200",
};
const ForecastPanel = ({ forecasts }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Prediksi Cuaca 24 Jam</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {forecasts.map((forecast, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-2 ${colorConfig[forecast.color] || colorConfig.blue}`}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold">{forecast.period}</h4>
                <Badge variant="outline">{forecast.tempRange}</Badge>
              </div>
              <p className="text-sm mb-2">{forecast.description}</p>
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>🌬️ {forecast.windRange}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ForecastPanel;
