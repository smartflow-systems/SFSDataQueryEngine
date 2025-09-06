import { Bell, HelpCircle, User, ChartLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";

export default function Header() {
  const [location] = useLocation();
  
  return (
    <header className="bg-[#1a1a1a]/90 backdrop-filter saturate-[140%] backdrop-blur-[10px] border-b-[3px] border-[#d4af37] px-8 py-5 flex items-center justify-between sticky top-0 z-50 smooth-transition shadow-[0_2px_10px_rgba(212,175,55,0.2)]">
      <div className="flex items-center space-x-8">
        <Link href="/">
          <div className="flex items-center space-x-3 cursor-pointer group">
            <div className="w-11 h-11 gradient-gold rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-[0_8px_25px_rgba(212,175,55,0.4)] smooth-transition group-hover:scale-110 group-hover:-translate-y-1">
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
                ? 'text-[#f4e4bc] bg-[rgba(212,175,55,0.15)] shadow-[0_0_8px_rgba(212,175,55,0.5)]' 
                : 'text-[#d4af37] hover:text-[#f4e4bc] hover:bg-[rgba(212,175,55,0.1)]'
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
                ? 'text-[#f4e4bc] bg-[rgba(212,175,55,0.15)] shadow-[0_0_8px_rgba(212,175,55,0.5)]' 
                : 'text-[#d4af37] hover:text-[#f4e4bc] hover:bg-[rgba(212,175,55,0.1)]'
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
                ? 'text-[#f4e4bc] bg-[rgba(212,175,55,0.15)] shadow-[0_0_8px_rgba(212,175,55,0.5)]' 
                : 'text-[#d4af37] hover:text-[#f4e4bc] hover:bg-[rgba(212,175,55,0.1)]'
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
                ? 'text-[#f4e4bc] bg-[rgba(212,175,55,0.15)] shadow-[0_0_8px_rgba(212,175,55,0.5)]' 
                : 'text-[#d4af37] hover:text-[#f4e4bc] hover:bg-[rgba(212,175,55,0.1)]'
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
          <Bell className="text-[#d4af37] hover:text-[#f4e4bc]" size={18} />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="p-2.5 hover:bg-[rgba(212,175,55,0.1)] rounded-lg smooth-transition hover:scale-110"
          data-testid="button-help"
        >
          <HelpCircle className="text-[#d4af37] hover:text-[#f4e4bc]" size={18} />
        </Button>
        <div className="w-10 h-10 gradient-gold rounded-full flex items-center justify-center border-2 border-[#d4af37] hover:border-[#f4e4bc] smooth-transition hover:scale-110 cursor-pointer gold-glow-hover">
          <User className="text-[#0b0b0b]" size={18} />
        </div>
      </div>
    </header>
  );
}
