import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

/**
 * Weather Parameter Card Component
 * Displays individual weather parameter with status, trend, and unit
 * 
 * @param {Object} props
 * @param {string} props.title - Parameter name
 * @param {number|string} props.value - Current value
 * @param {string} props.unit - Unit of measurement
 * @param {Object} props.icon - Lucide icon component
 * @param {Object} props.status - Status object with status, color, bg
 * @param {Object} props.trend - Trend object with direction and percentage
 */
const WeatherOverviewCard = ({ title, value, status, icon: Icon }) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Icon className="w-6 h-6 text-blue-600" />
          </div>
          <Badge className={`${status.bg} ${status.color}`}>
            {status.label}
          </Badge>
        </div>
        <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </CardContent>
    </Card>
  );
};

export default WeatherOverviewCard;
