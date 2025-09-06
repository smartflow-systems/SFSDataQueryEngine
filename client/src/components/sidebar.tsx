import { Plus, Database, Code, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDatabases } from "@/hooks/use-database";
import { useQueries } from "@/hooks/use-queries";

export default function Sidebar() {
  const { data: databases = [] } = useDatabases();
  const { data: savedQueries = [] } = useQueries({ saved: true });
  const { data: recentQueries = [] } = useQueries({ recent: true, limit: 5 });

  return (
    <aside className="w-72 bg-card/50 backdrop-blur-sm border-r border-border flex flex-col smooth-transition">
      {/* Database Connections */}
      <div className="p-5 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
            <Database className="text-primary" size={16} />
            Connections
          </h3>
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-1.5 hover:bg-primary/10 rounded-lg text-muted-foreground hover:text-primary smooth-transition hover:scale-110"
            data-testid="button-add-connection"
          >
            <Plus size={14} />
          </Button>
        </div>
        <div className="space-y-2">
          {databases.map((db) => (
            <div 
              key={db.id} 
              className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer smooth-transition group ${
                db.isActive ? 'bg-primary/10 border border-primary/20' : 'hover:bg-accent border border-transparent'
              }`}
              data-testid={`connection-${db.name}`}
            >
              <div className={`w-2 h-2 rounded-full animate-pulse ${
                db.isActive ? 'bg-success shadow-lg shadow-success/50' : 'bg-muted-foreground'
              }`} />
              <Database className={`${db.isActive ? 'text-primary' : 'text-muted-foreground'} group-hover:text-primary smooth-transition`} size={14} />
              <span className={`text-sm font-medium ${
                db.isActive ? 'text-foreground' : 'text-muted-foreground'
              } group-hover:text-foreground smooth-transition`}>
                {db.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Saved Queries */}
      <div className="p-5 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
            <Code className="text-primary" size={16} />
            Saved Queries
          </h3>
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-1.5 hover:bg-primary/10 rounded-lg text-muted-foreground hover:text-primary smooth-transition hover:scale-110"
            data-testid="button-add-query"
          >
            <Plus size={14} />
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
      <div className="p-5 flex-1">
        <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
          <Clock className="text-primary" size={16} />
          Recent History
        </h3>
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
