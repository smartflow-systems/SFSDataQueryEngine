import { Table, Download, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface QueryResultsProps {
  results: any;
  query: any;
}

export default function QueryResults({ results, query }: QueryResultsProps) {
  const { result, validation } = results;
  
  const handleExport = () => {
    // Create CSV content
    const headers = result.columns.join(',');
    const rows = result.rows.map((row: any) => 
      result.columns.map((col: string) => {
        const value = row[col];
        // Escape quotes and wrap in quotes if contains comma
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    ).join('\n');
    
    const csv = `${headers}\n${rows}`;
    
    // Create download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `query-results-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const getPerformanceBadgeVariant = (performance: string) => {
    switch (performance) {
      case 'excellent': return 'default';
      case 'good': return 'secondary';
      case 'fair': return 'outline';
      case 'poor': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Query Results Table */}
      <div className="bg-card rounded-lg border border-border">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-2">
            <Table className="text-muted-foreground" size={16} />
            <span className="font-medium text-foreground">Query Results</span>
            <Badge variant="secondary" className="bg-success/20 text-success">
              {result.rowCount} rows
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleExport}
              className="px-3 py-1 bg-secondary text-secondary-foreground rounded text-sm hover:bg-secondary/80 transition-colors"
              data-testid="button-export-results"
            >
              <Download className="mr-1" size={12} />
              Export
            </Button>
            <Button
              variant="default"
              size="sm"
              className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90 transition-colors"
              data-testid="button-visualize-results"
            >
              <BarChart className="mr-1" size={12} />
              Visualize
            </Button>
          </div>
        </div>
        
        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full" data-testid="table-query-results">
            <thead className="bg-muted/50">
              <tr>
                {result.columns.map((column: string) => (
                  <th 
                    key={column} 
                    className="text-left p-3 text-sm font-medium text-muted-foreground"
                    data-testid={`header-${column}`}
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {result.rows.map((row: any, index: number) => (
                <tr 
                  key={index} 
                  className="border-b border-border hover:bg-muted/20"
                  data-testid={`row-${index}`}
                >
                  {result.columns.map((column: string) => (
                    <td 
                      key={column} 
                      className="p-3 text-sm text-foreground"
                      data-testid={`cell-${index}-${column}`}
                    >
                      {row[column]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Performance and Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center space-x-2 mb-3">
            <BarChart className="text-muted-foreground" size={16} />
            <span className="font-medium text-foreground">Query Performance</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Execution Time</span>
              <span className="text-sm text-success">{result.executionTime}ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Rows Returned</span>
              <span className="text-sm text-foreground">{result.rowCount}</span>
            </div>
            {validation?.estimatedPerformance && (
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Performance</span>
                <Badge variant={getPerformanceBadgeVariant(validation.estimatedPerformance)}>
                  {validation.estimatedPerformance}
                </Badge>
              </div>
            )}
          </div>
        </div>

        {validation?.optimizations && validation.optimizations.length > 0 && (
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-4 h-4 bg-warning rounded-full" />
              <span className="font-medium text-foreground">Optimization Tips</span>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {validation.optimizations.map((tip: string, index: number) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="w-1 h-1 bg-warning rounded-full mt-2 flex-shrink-0" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
