import { useState, useEffect } from 'react';
import { X, Menu, Home, FileText, BarChart3, TrendingUp, Settings as SettingsIcon, Sparkles } from 'lucide-react';
import { Link, useLocation } from 'wouter';

export default function GitHubSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  // Close on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const menuItems = [
    { label: 'Dashboard', href: '/dashboard', icon: Home },
    { label: 'Queries', href: '/queries', icon: FileText },
    { label: 'Reports', href: '/reports', icon: BarChart3 },
    { label: 'Social Analytics', href: '/social-analytics', icon: TrendingUp },
    { label: 'Settings', href: '/settings', icon: SettingsIcon },
  ];

  return (
    <>
      {/* Hamburger Button - Enhanced with SFS styling */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-5 left-5 z-50 p-3 bg-[rgba(13,13,13,0.95)] backdrop-blur-md rounded-lg border border-[rgba(255,215,0,0.2)] hover:border-[#FFD700] hover:bg-[rgba(59,47,47,0.95)] transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:scale-110"
        aria-label="Toggle Menu"
      >
        <Menu className="w-5 h-5 text-[#FFD700]" />
      </button>

      {/* Overlay - Enhanced with backdrop blur */}
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      />

      {/* Sidebar - Enhanced with glassmorphism */}
      <nav
        className={`fixed top-0 left-0 h-screen w-[320px] bg-[rgba(13,13,13,0.98)] backdrop-blur-xl text-[#F5F5DC] z-50 flex flex-col overflow-y-auto border-r-2 border-[rgba(255,215,0,0.25)] shadow-[0_0_50px_rgba(255,215,0,0.15)] transition-all duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Close Button - Enhanced */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-5 right-5 p-2 text-[#FFD700] hover:text-[#E6C200] hover:bg-[rgba(255,215,0,0.1)] rounded-lg transition-all duration-200 hover:rotate-90 hover:scale-110"
          aria-label="Close Menu"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header - Enhanced with gradient and icon */}
        <div className="pt-16 px-6 pb-6 border-b-2 border-[rgba(255,215,0,0.2)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#FFD700] to-[#E6C200] flex items-center justify-center shadow-lg shadow-[rgba(255,215,0,0.3)]">
              <Sparkles className="w-5 h-5 text-[#0D0D0D]" />
            </div>
            <div>
              <h2 className="text-[#FFD700] text-xl font-bold bg-gradient-to-r from-[#FFD700] to-[#E6C200] bg-clip-text text-transparent">
                SmartFlow
              </h2>
              <p className="text-[#F5F5DC] text-xs opacity-80">DataLens Analytics</p>
            </div>
          </div>
        </div>

        {/* Menu Items - Enhanced with icons and active states */}
        <ul className="flex-grow py-6 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            return (
              <li key={item.label} className="mb-1">
                <Link
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center gap-3 py-3.5 px-4 rounded-lg
                    border-l-[3px] transition-all duration-300 cursor-pointer group
                    ${
                      isActive
                        ? 'bg-[rgba(255,215,0,0.15)] border-[#FFD700] text-[#FFD700] shadow-[0_0_15px_rgba(255,215,0,0.2)]'
                        : 'border-transparent text-[#F5F5DC] hover:bg-[rgba(59,47,47,0.8)] hover:border-[#FFD700] hover:text-[#FFD700] hover:pl-6'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'text-[#FFD700]' : 'text-[#F5F5DC] group-hover:text-[#FFD700] group-hover:scale-110'}`} />
                  <span className={`font-medium ${isActive ? 'font-semibold' : ''}`}>
                    {item.label}
                  </span>
                  {isActive && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-[#FFD700] animate-pulse shadow-[0_0_8px_rgba(255,215,0,0.8)]"></span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Footer CTA - Enhanced with gradient and glow */}
        <div className="p-5 border-t-2 border-[rgba(255,215,0,0.2)]">
          <Link
            href="/queries"
            onClick={() => setIsOpen(false)}
            className="block w-full py-3.5 px-5 bg-gradient-to-r from-[#FFD700] to-[#E6C200] text-[#0D0D0D] text-center font-bold rounded-lg hover:shadow-[0_0_25px_rgba(255,215,0,0.5)] transition-all duration-300 hover:scale-105 cursor-pointer"
          >
            <span className="flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              New Query
            </span>
          </Link>
          <p className="text-center text-xs text-[#F5F5DC] opacity-60 mt-3">
            Version 2.0 • SFS DataLens
          </p>
        </div>
      </nav>
    </>
  );
}
