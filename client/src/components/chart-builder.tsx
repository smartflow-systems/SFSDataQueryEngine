import { useState } from "react";
import { BarChart, LineChart as LineChartIcon, PieChart as PieChartIcon, AreaChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface ChartBuilderProps {
  data: any[];
  columns: string[];
}

type ChartType = 'line' | 'bar' | 'pie' | 'area';

export default function ChartBuilder({ data, columns }: ChartBuilderProps) {
  const [chartType, setChartType] = useState<ChartType>('line');
  const [xAxis, setXAxis] = useState(columns[0] || '');
  const [yAxis, setYAxis] = useState(columns[1] || '');
  const [colorScheme, setColorScheme] = useState('primary');

  const colorSchemes = {
    primary: 'hsl(217, 91%, 60%)',
    success: 'hsl(142, 71%, 45%)',
    warning: 'hsl(38, 92%, 50%)',
    destructive: 'hsl(0, 62%, 30%)',
  };

  const chartTypes = [
    { id: 'line', icon: LineChartIcon, label: 'Line' },
    { id: 'bar', icon: BarChart, label: 'Bar' },
    { id: 'pie', icon: PieChartIcon, label: 'Pie' },
    { id: 'area', icon: AreaChart, label: 'Area' },
  ];

  const getChartData = () => {
    if (!data || data.length === 0) return null;

    const labels = data.map(row => row[xAxis]);
    const values = data.map(row => {
      const value = row[yAxis];
      return typeof value === 'number' ? value : parseFloat(value) || 0;
    });

    if (chartType === 'pie') {
      return {
        labels,
        datasets: [{
          data: values,
          backgroundColor: [
            colorSchemes.primary,
            colorSchemes.success,
            colorSchemes.warning,
            colorSchemes.destructive,
            'hsl(268, 83%, 58%)',
          ],
          borderWidth: 0,
        }],
      };
    }

    return {
      labels,
      datasets: [{
        label: yAxis,
        data: values,
        borderColor: colorSchemes[colorScheme as keyof typeof colorSchemes],
        backgroundColor: chartType === 'area' 
          ? colorSchemes[colorScheme as keyof typeof colorSchemes] + '20'
          : colorSchemes[colorScheme as keyof typeof colorSchemes],
        fill: chartType === 'area',
        tension: chartType === 'line' ? 0.4 : 0,
      }],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'hsl(210, 40%, 98%)',
        },
      },
      title: {
        display: true,
        text: `${yAxis} by ${xAxis}`,
        color: 'hsl(210, 40%, 98%)',
      },
    },
    scales: chartType !== 'pie' ? {
      x: {
        grid: {
          color: 'hsl(217, 32%, 17%)',
        },
        ticks: {
          color: 'hsl(215, 20%, 65%)',
        },
      },
      y: {
        grid: {
          color: 'hsl(217, 32%, 17%)',
        },
        ticks: {
          color: 'hsl(215, 20%, 65%)',
        },
      },
    } : undefined,
  };

  const chartData = getChartData();

  const renderChart = () => {
    if (!chartData) return null;

    switch (chartType) {
      case 'line':
      case 'area':
        return <Line data={chartData} options={chartOptions} />;
      case 'bar':
        return <Bar data={chartData} options={chartOptions} />;
      case 'pie':
        return <Pie data={chartData} options={chartOptions} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <BarChart className="text-muted-foreground" size={16} />
          <span className="font-medium text-foreground">Dashboard Builder</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="secondary"
            size="sm"
            className="px-3 py-1 bg-secondary text-secondary-foreground rounded text-sm hover:bg-secondary/80 transition-colors"
            data-testid="button-save-chart"
          >
            Save
          </Button>
          <Button
            variant="default"
            size="sm"
            className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90 transition-colors"
            data-testid="button-share-chart"
          >
            Share
          </Button>
        </div>
      </div>

      {/* Chart Types Selector */}
      <div className="p-4 border-b border-border">
        <p className="text-sm text-muted-foreground mb-3">Choose visualization type:</p>
        <div className="flex space-x-2">
          {chartTypes.map((type) => {
            const IconComponent = type.icon;
            return (
              <Button
                key={type.id}
                variant={chartType === type.id ? "default" : "secondary"}
                size="sm"
                onClick={() => setChartType(type.id as ChartType)}
                className={`p-3 rounded-lg transition-colors ${
                  chartType === type.id 
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
                data-testid={`button-chart-${type.id}`}
              >
                <div className="flex flex-col items-center">
                  <IconComponent size={16} />
                  <span className="text-xs mt-1">{type.label}</span>
                </div>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Chart Preview */}
      <div className="p-6">
        <div className="bg-muted/20 rounded-lg p-6 min-h-96 relative">
          {chartData ? (
            renderChart()
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No data available for visualization</p>
            </div>
          )}
        </div>
        
        {/* Chart Configuration */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">X-Axis</label>
            <Select value={xAxis} onValueChange={setXAxis}>
              <SelectTrigger data-testid="select-x-axis">
                <SelectValue placeholder="Select X-axis column" />
              </SelectTrigger>
              <SelectContent>
                {columns.map((column) => (
                  <SelectItem key={column} value={column}>
                    {column}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Y-Axis</label>
            <Select value={yAxis} onValueChange={setYAxis}>
              <SelectTrigger data-testid="select-y-axis">
                <SelectValue placeholder="Select Y-axis column" />
              </SelectTrigger>
              <SelectContent>
                {columns.map((column) => (
                  <SelectItem key={column} value={column}>
                    {column}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Color</label>
            <div className="flex space-x-2">
              {Object.entries(colorSchemes).map(([key, color]) => (
                <button
                  key={key}
                  onClick={() => setColorScheme(key)}
                  className={`w-8 h-8 rounded border-2 transition-all ${
                    colorScheme === key ? 'border-ring scale-110' : 'border-border'
                  }`}
                  style={{ backgroundColor: color }}
                  data-testid={`color-${key}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
