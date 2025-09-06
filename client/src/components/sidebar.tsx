import { Plus, Database, Code, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDatabases } from "@/hooks/use-database";
import { useQueries } from "@/hooks/use-queries";

export default function Sidebar() {
  const { data: databases = [] } = useDatabases();
  const { data: savedQueries = [] } = useQueries({ saved: true });
  const { data: recentQueries = [] } = useQueries({ recent: true, limit: 5 });

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col">
      {/* Database Connections */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">Connections</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-1 hover:bg-accent rounded text-muted-foreground hover:text-foreground"
            data-testid="button-add-connection"
          >
            <Plus size={12} />
          </Button>
        </div>
        <div className="space-y-2">
          {databases.map((db) => (
            <div 
              key={db.id} 
              className={`flex items-center space-x-2 p-2 rounded-md cursor-pointer ${
                db.isActive ? 'bg-accent' : 'hover:bg-accent'
              }`}
              data-testid={`connection-${db.name}`}
            >
              <div className={`w-2 h-2 rounded-full ${
                db.isActive ? 'bg-success' : 'bg-muted-foreground'
              }`} />
              <Database className="text-muted-foreground" size={12} />
              <span className={`text-sm ${
                db.isActive ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                {db.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Saved Queries */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">Saved Queries</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-1 hover:bg-accent rounded text-muted-foreground hover:text-foreground"
            data-testid="button-add-query"
          >
            <Plus size={12} />
          </Button>
        </div>
        <div className="space-y-1">
          {savedQueries.map((query) => (
            <div 
              key={query.id} 
              className="flex items-center space-x-2 p-2 hover:bg-accent rounded-md cursor-pointer"
              data-testid={`saved-query-${query.id}`}
            >
              <Code className="text-muted-foreground" size={12} />
              <span className="text-sm text-muted-foreground truncate">
                {query.name || query.naturalLanguage}
              </span>
            </div>
          ))}
          {savedQueries.length === 0 && (
            <p className="text-xs text-muted-foreground p-2">No saved queries</p>
          )}
        </div>
      </div>

      {/* Recent History */}
      <div className="p-4 flex-1">
        <h3 className="text-sm font-semibold text-foreground mb-3">Recent History</h3>
        <div className="space-y-1">
          {recentQueries.map((query) => (
            <div 
              key={query.id} 
              className="flex items-center space-x-2 p-2 hover:bg-accent rounded-md cursor-pointer"
              data-testid={`recent-query-${query.id}`}
            >
              <Clock className="text-muted-foreground" size={12} />
              <span className="text-xs text-muted-foreground truncate">
                {query.naturalLanguage || query.sqlQuery?.substring(0, 30) + "..."}
              </span>
            </div>
          ))}
          {recentQueries.length === 0 && (
            <p className="text-xs text-muted-foreground p-2">No recent queries</p>
          )}
        </div>
      </div>
    </aside>
  );
}
