import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import QueryInput from "@/components/query-input";
import QueryResults from "@/components/query-results";
import ChartBuilder from "@/components/chart-builder";
import { useState, useEffect } from "react";
import { Activity, BarChart2, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  const [currentQuery, setCurrentQuery] = useState<any>(null);
  const [queryResults, setQueryResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">Loading DataLens</h2>
          <p className="text-muted-foreground">Preparing your analytics workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 flex flex-col overflow-hidden">
          <QueryInput 
            onQueryExecuted={(query, results) => {
              setCurrentQuery(query);
              setQueryResults(results);
            }}
          />
          
          <div className="flex-1 p-6 overflow-auto bg-gradient-to-br from-background via-background to-primary/5">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Welcome Section */}
              {!queryResults && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <Card className="border-primary/20 bg-card/50 backdrop-blur-sm hover:border-primary/40 smooth-transition hover:shadow-lg hover:shadow-primary/10">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Activity className="text-primary" size={18} />
                        Quick Start
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">Ask questions in natural language and get SQL queries instantly</p>
                    </CardContent>
                  </Card>
                  <Card className="border-primary/20 bg-card/50 backdrop-blur-sm hover:border-primary/40 smooth-transition hover:shadow-lg hover:shadow-primary/10">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <BarChart2 className="text-primary" size={18} />
                        Visualize Data
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">Create beautiful charts from your query results</p>
                    </CardContent>
                  </Card>
                  <Card className="border-primary/20 bg-card/50 backdrop-blur-sm hover:border-primary/40 smooth-transition hover:shadow-lg hover:shadow-primary/10">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <TrendingUp className="text-primary" size={18} />
                        Track Insights
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">Save queries and build custom dashboards</p>
                    </CardContent>
                  </Card>
                </div>
              )}
              {queryResults && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <QueryResults 
                    results={queryResults}
                    query={currentQuery}
                  />
                </div>
              )}
              
              {queryResults && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
                  <ChartBuilder 
                    data={queryResults.result?.rows || []}
                    columns={queryResults.result?.columns || []}
                  />
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
