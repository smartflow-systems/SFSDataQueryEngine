import { Bell, HelpCircle, User, ChartLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";

export default function Header() {
  const [location] = useLocation();
  
  return (
    <header className="sfs-card border-b-[3px] border-[rgba(212,175,55,0.35)] px-6 py-3 flex items-center justify-between sticky top-0 z-50 smooth-transition">
      <div className="flex items-center space-x-6">
        <Link href="/">
          <div className="flex items-center space-x-2 cursor-pointer group">
            <div className="w-9 h-9 sfs-button rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-[0_8px_25px_rgba(212,175,55,0.4)] smooth-transition group-hover:scale-110 group-hover:-translate-y-1">
              <ChartLine className="text-[#0b0b0b] font-bold" size={18} />
            </div>
            <h1 className="text-2xl font-bold gradient-gold-text drop-shadow-[0_4px_8px_rgba(212,175,55,0.3)]">DataLens</h1>
          </div>
        </Link>
        <nav className="hidden md:flex items-center space-x-4">
          <Link 
            href="/"
            className={`relative px-3 py-1.5 rounded-lg font-semibold text-sm smooth-transition ${
              location === '/' 
                ? 'gradient-gold-text bg-[rgba(212,175,55,0.15)] shadow-[0_0_8px_rgba(212,175,55,0.5)]' 
                : 'text-[#d4af37] hover:text-[#ffdd00] hover:bg-[rgba(212,175,55,0.1)]'
            }`}
            data-testid="nav-dashboard"
          >
            Dashboard
            {location === '/' && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-10 h-0.5 gradient-gold rounded-full animate-pulse-gold" />
            )}
          </Link>
          <Link 
            href="/queries"
            className={`relative px-3 py-1.5 rounded-lg font-semibold text-sm smooth-transition ${
              location === '/queries' 
                ? 'gradient-gold-text bg-[rgba(212,175,55,0.15)] shadow-[0_0_8px_rgba(212,175,55,0.5)]' 
                : 'text-[#d4af37] hover:text-[#ffdd00] hover:bg-[rgba(212,175,55,0.1)]'
            }`}
            data-testid="nav-queries"
          >
            Queries
            {location === '/queries' && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-10 h-0.5 gradient-gold rounded-full animate-pulse-gold" />
            )}
          </Link>
          <Link 
            href="/reports"
            className={`relative px-3 py-1.5 rounded-lg font-semibold text-sm smooth-transition ${
              location === '/reports' 
                ? 'gradient-gold-text bg-[rgba(212,175,55,0.15)] shadow-[0_0_8px_rgba(212,175,55,0.5)]' 
                : 'text-[#d4af37] hover:text-[#ffdd00] hover:bg-[rgba(212,175,55,0.1)]'
            }`}
            data-testid="nav-reports"
          >
            Reports
            {location === '/reports' && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-10 h-0.5 gradient-gold rounded-full animate-pulse-gold" />
            )}
          </Link>
          <Link 
            href="/settings"
            className={`relative px-3 py-1.5 rounded-lg font-semibold text-sm smooth-transition ${
              location === '/settings' 
                ? 'gradient-gold-text bg-[rgba(212,175,55,0.15)] shadow-[0_0_8px_rgba(212,175,55,0.5)]' 
                : 'text-[#d4af37] hover:text-[#ffdd00] hover:bg-[rgba(212,175,55,0.1)]'
            }`}
            data-testid="nav-settings"
          >
            Settings
            {location === '/settings' && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-10 h-0.5 gradient-gold rounded-full animate-pulse-gold" />
            )}
          </Link>
        </nav>
      </div>
      <div className="flex items-center space-x-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="p-2 hover:bg-[rgba(212,175,55,0.1)] rounded-lg smooth-transition hover:scale-110"
          data-testid="button-notifications"
        >
          <Bell className="text-[#d4af37] hover:text-[#ffdd00]" size={16} />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="p-2 hover:bg-[rgba(212,175,55,0.1)] rounded-lg smooth-transition hover:scale-110"
          data-testid="button-help"
        >
          <HelpCircle className="text-[#d4af37] hover:text-[#ffdd00]" size={16} />
        </Button>
        <div className="w-8 h-8 sfs-button rounded-full flex items-center justify-center border-2 border-[#d4af37] hover:border-[#ffdd00] smooth-transition hover:scale-110 cursor-pointer">
          <User className="text-[#0b0b0b]" size={16} />
        </div>
      </div>
    </header>
  );
}
