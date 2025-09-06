import { Bell, HelpCircle, User, ChartLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";

export default function Header() {
  const [location] = useLocation();
  
  return (
    <header className="bg-card border-b border-border px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Link href="/">
          <div className="flex items-center space-x-2 cursor-pointer">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <ChartLine className="text-primary-foreground text-sm" size={16} />
            </div>
            <h1 className="text-xl font-bold text-foreground">DataLens</h1>
          </div>
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            href="/"
            className={`transition-colors font-medium ${
              location === '/' ? 'text-primary' : 'text-muted-foreground hover:text-primary'
            }`}
            data-testid="nav-dashboard"
          >
            Dashboard
          </Link>
          <Link 
            href="/queries"
            className={`transition-colors ${
              location === '/queries' ? 'text-primary' : 'text-muted-foreground hover:text-primary'
            }`}
            data-testid="nav-queries"
          >
            Queries
          </Link>
          <Link 
            href="/reports"
            className={`transition-colors ${
              location === '/reports' ? 'text-primary' : 'text-muted-foreground hover:text-primary'
            }`}
            data-testid="nav-reports"
          >
            Reports
          </Link>
          <Link 
            href="/settings"
            className={`transition-colors ${
              location === '/settings' ? 'text-primary' : 'text-muted-foreground hover:text-primary'
            }`}
            data-testid="nav-settings"
          >
            Settings
          </Link>
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
