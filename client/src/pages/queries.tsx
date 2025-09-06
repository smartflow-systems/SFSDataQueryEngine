import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { useQueries } from "@/hooks/use-queries";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Code, Database } from "lucide-react";

export default function QueriesPage() {
  const { data: allQueries = [] } = useQueries();
  const { data: savedQueries = [] } = useQueries({ saved: true });
  
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-foreground mb-6">Query History</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Saved Queries */}
              <Card className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Code className="text-primary" size={20} />
                  <h2 className="text-lg font-semibold">Saved Queries</h2>
                  <Badge variant="secondary">{savedQueries.length}</Badge>
                </div>
                <div className="space-y-3">
                  {savedQueries.length > 0 ? (
                    savedQueries.map((query) => (
                      <div key={query.id} className="p-3 bg-muted/20 rounded-lg">
                        <div className="font-medium text-sm mb-1">
                          {query.name || 'Untitled Query'}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {query.naturalLanguage || query.sqlQuery?.substring(0, 60) + '...'}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-sm">No saved queries yet</p>
                  )}
                </div>
              </Card>

              {/* Recent Activity */}
              <Card className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Clock className="text-primary" size={20} />
                  <h2 className="text-lg font-semibold">Recent Activity</h2>
                  <Badge variant="secondary">{allQueries.length}</Badge>
                </div>
                <div className="space-y-3">
                  {allQueries.length > 0 ? (
                    allQueries.slice(0, 5).map((query) => (
                      <div key={query.id} className="p-3 bg-muted/20 rounded-lg">
                        <div className="text-xs text-muted-foreground mb-1">
                          {query.createdAt ? new Date(query.createdAt).toLocaleString() : 'Unknown time'}
                        </div>
                        <div className="text-sm">
                          {query.naturalLanguage || query.sqlQuery?.substring(0, 50) + '...'}
                        </div>
                        {query.rowCount !== null && (
                          <div className="text-xs text-success mt-1">
                            {query.rowCount} rows returned
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-sm">No queries executed yet</p>
                  )}
                </div>
              </Card>
            </div>

            {/* Quick Stats */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4 text-center">
                <Database className="mx-auto text-primary mb-2" size={24} />
                <div className="text-2xl font-bold">{allQueries.length}</div>
                <div className="text-sm text-muted-foreground">Total Queries</div>
              </Card>
              
              <Card className="p-4 text-center">
                <Code className="mx-auto text-primary mb-2" size={24} />
                <div className="text-2xl font-bold">{savedQueries.length}</div>
                <div className="text-sm text-muted-foreground">Saved Queries</div>
              </Card>
              
              <Card className="p-4 text-center">
                <Clock className="mx-auto text-primary mb-2" size={24} />
                <div className="text-2xl font-bold">
                  {allQueries.filter(q => q.executionTime && q.executionTime < 100).length}
                </div>
                <div className="text-sm text-muted-foreground">Fast Queries (&lt;100ms)</div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}