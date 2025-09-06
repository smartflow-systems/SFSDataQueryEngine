import { Bell, HelpCircle, User, ChartLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";

export default function Header() {
  const [location] = useLocation();
  
  return (
    <header className="sfs-card border-b-[3px] border-[rgba(212,175,55,0.35)] px-8 py-5 flex items-center justify-between sticky top-0 z-50 smooth-transition">
      <div className="flex items-center space-x-8">
        <Link href="/">
          <div className="flex items-center space-x-3 cursor-pointer group">
            <div className="w-11 h-11 sfs-button rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-[0_8px_25px_rgba(212,175,55,0.4)] smooth-transition group-hover:scale-110 group-hover:-translate-y-1">
              <ChartLine className="text-[#0b0b0b] font-bold" size={22} />
            </div>
            <h1 className="text-3xl font-bold gradient-gold-text drop-shadow-[0_4px_8px_rgba(212,175,55,0.3)]">DataLens</h1>
          </div>
        </Link>
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            href="/"
            className={`relative px-4 py-2 rounded-lg font-semibold text-[1.1rem] smooth-transition ${
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
            className={`relative px-4 py-2 rounded-lg font-semibold text-[1.1rem] smooth-transition ${
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
            className={`relative px-4 py-2 rounded-lg font-semibold text-[1.1rem] smooth-transition ${
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
            className={`relative px-4 py-2 rounded-lg font-semibold text-[1.1rem] smooth-transition ${
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
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          size="sm" 
          className="p-2.5 hover:bg-[rgba(212,175,55,0.1)] rounded-lg smooth-transition hover:scale-110"
          data-testid="button-notifications"
        >
          <Bell className="text-[#d4af37] hover:text-[#ffdd00]" size={18} />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="p-2.5 hover:bg-[rgba(212,175,55,0.1)] rounded-lg smooth-transition hover:scale-110"
          data-testid="button-help"
        >
          <HelpCircle className="text-[#d4af37] hover:text-[#ffdd00]" size={18} />
        </Button>
        <div className="w-10 h-10 sfs-button rounded-full flex items-center justify-center border-2 border-[#d4af37] hover:border-[#ffdd00] smooth-transition hover:scale-110 cursor-pointer">
          <User className="text-[#0b0b0b]" size={18} />
        </div>
      </div>
    </header>
  );
}
