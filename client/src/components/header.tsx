import { Bell, HelpCircle, User, ChartLine } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="bg-card border-b border-border px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <ChartLine className="text-primary-foreground text-sm" size={16} />
          </div>
          <h1 className="text-xl font-bold text-foreground">DataLens</h1>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <a 
            href="#" 
            className="text-foreground hover:text-primary transition-colors font-medium"
            data-testid="nav-dashboard"
          >
            Dashboard
          </a>
          <a 
            href="#" 
            className="text-muted-foreground hover:text-primary transition-colors"
            data-testid="nav-queries"
          >
            Queries
          </a>
          <a 
            href="#" 
            className="text-muted-foreground hover:text-primary transition-colors"
            data-testid="nav-reports"
          >
            Reports
          </a>
          <a 
            href="#" 
            className="text-muted-foreground hover:text-primary transition-colors"
            data-testid="nav-settings"
          >
            Settings
          </a>
        </nav>
      </div>
      <div className="flex items-center space-x-3">
        <Button 
          variant="ghost" 
          size="sm" 
          className="p-2 hover:bg-accent rounded-md transition-colors"
          data-testid="button-notifications"
        >
          <Bell className="text-muted-foreground" size={16} />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="p-2 hover:bg-accent rounded-md transition-colors"
          data-testid="button-help"
        >
          <HelpCircle className="text-muted-foreground" size={16} />
        </Button>
        <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
          <User className="text-secondary-foreground text-sm" size={16} />
        </div>
      </div>
    </header>
  );
}
