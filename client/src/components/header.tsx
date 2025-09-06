import { Bell, HelpCircle, User, ChartLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";

export default function Header() {
  const [location] = useLocation();
  
  return (
    <header className="bg-card/80 backdrop-blur-lg border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-50 smooth-transition">
      <div className="flex items-center space-x-6">
        <Link href="/">
          <div className="flex items-center space-x-3 cursor-pointer group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-primary/50 smooth-transition group-hover:scale-110">
              <ChartLine className="text-white" size={20} />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">DataLens</h1>
          </div>
        </Link>
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            href="/"
            className={`relative px-3 py-2 rounded-lg font-medium smooth-transition ${
              location === '/' 
                ? 'text-primary bg-primary/10' 
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            }`}
            data-testid="nav-dashboard"
          >
            Dashboard
            {location === '/' && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
            )}
          </Link>
          <Link 
            href="/queries"
            className={`relative px-3 py-2 rounded-lg font-medium smooth-transition ${
              location === '/queries' 
                ? 'text-primary bg-primary/10' 
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            }`}
            data-testid="nav-queries"
          >
            Queries
            {location === '/queries' && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
            )}
          </Link>
          <Link 
            href="/reports"
            className={`relative px-3 py-2 rounded-lg font-medium smooth-transition ${
              location === '/reports' 
                ? 'text-primary bg-primary/10' 
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            }`}
            data-testid="nav-reports"
          >
            Reports
            {location === '/reports' && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
            )}
          </Link>
          <Link 
            href="/settings"
            className={`relative px-3 py-2 rounded-lg font-medium smooth-transition ${
              location === '/settings' 
                ? 'text-primary bg-primary/10' 
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            }`}
            data-testid="nav-settings"
          >
            Settings
            {location === '/settings' && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
            )}
          </Link>
        </nav>
      </div>
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          size="sm" 
          className="p-2.5 hover:bg-accent rounded-lg smooth-transition hover:scale-110"
          data-testid="button-notifications"
        >
          <Bell className="text-muted-foreground hover:text-foreground" size={18} />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="p-2.5 hover:bg-accent rounded-lg smooth-transition hover:scale-110"
          data-testid="button-help"
        >
          <HelpCircle className="text-muted-foreground hover:text-foreground" size={18} />
        </Button>
        <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-full flex items-center justify-center border-2 border-primary/30 hover:border-primary smooth-transition hover:scale-110 cursor-pointer">
          <User className="text-primary" size={18} />
        </div>
      </div>
    </header>
  );
}
