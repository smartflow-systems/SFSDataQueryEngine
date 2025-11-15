import { useState, useEffect, useRef } from 'react';
import { Search, Command, ArrowRight, Sparkles, FileText, BarChart3, TrendingUp, Settings, Home } from 'lucide-react';
import { useLocation } from 'wouter';

interface Command {
  id: string;
  label: string;
  icon: any;
  action: () => void;
  category: string;
}

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [, setLocation] = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: Command[] = [
    { id: 'dashboard', label: 'Go to Dashboard', icon: Home, action: () => setLocation('/dashboard'), category: 'Navigation' },
    { id: 'queries', label: 'Go to Queries', icon: FileText, action: () => setLocation('/queries'), category: 'Navigation' },
    { id: 'reports', label: 'Go to Reports', icon: BarChart3, action: () => setLocation('/reports'), category: 'Navigation' },
    { id: 'social', label: 'Go to Social Analytics', icon: TrendingUp, action: () => setLocation('/social-analytics'), category: 'Navigation' },
    { id: 'settings', label: 'Go to Settings', icon: Settings, action: () => setLocation('/settings'), category: 'Navigation' },
    { id: 'new-query', label: 'Create New Query', icon: Sparkles, action: () => setLocation('/queries'), category: 'Actions' },
  ];

  const filteredCommands = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        setSearch('');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const executeCommand = (cmd: Command) => {
    cmd.action();
    setIsOpen(false);
    setSearch('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
        onClick={() => setIsOpen(false)}
      />

      {/* Command Palette */}
      <div className="relative w-full max-w-2xl bg-[rgba(13,13,13,0.95)] backdrop-blur-2xl rounded-2xl border-2 border-[rgba(255,215,0,0.3)] shadow-[0_0_80px_rgba(255,215,0,0.3)] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b-2 border-[rgba(255,215,0,0.2)]">
          <Search className="w-5 h-5 text-[#FFD700]" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-[#F5F5DC] placeholder-[rgba(245,245,220,0.5)] outline-none text-lg"
          />
          <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-[rgba(255,215,0,0.1)] border border-[rgba(255,215,0,0.3)]">
            <Command className="w-3 h-3 text-[#FFD700]" />
            <span className="text-xs text-[#FFD700] font-semibold">K</span>
          </div>
        </div>

        {/* Commands List */}
        <div className="max-h-96 overflow-y-auto p-3">
          {filteredCommands.length === 0 ? (
            <div className="text-center py-12">
              <Sparkles className="w-12 h-12 text-[rgba(255,215,0,0.3)] mx-auto mb-3" />
              <p className="text-[rgba(245,245,220,0.5)]">No commands found</p>
            </div>
          ) : (
            <>
              {['Navigation', 'Actions'].map(category => {
                const categoryCommands = filteredCommands.filter(cmd => cmd.category === category);
                if (categoryCommands.length === 0) return null;

                return (
                  <div key={category} className="mb-4">
                    <div className="px-3 py-2 text-xs font-semibold text-[rgba(255,215,0,0.7)] uppercase tracking-wider">
                      {category}
                    </div>
                    {categoryCommands.map((cmd) => (
                      <button
                        key={cmd.id}
                        onClick={() => executeCommand(cmd)}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[rgba(255,215,0,0.1)] transition-all duration-200 group"
                      >
                        <div className="p-2 rounded-lg bg-gradient-to-br from-[#FFD700] to-[#E6C200] group-hover:scale-110 transition-transform">
                          <cmd.icon className="w-4 h-4 text-[#0D0D0D]" />
                        </div>
                        <span className="flex-1 text-left text-[#F5F5DC] group-hover:text-[#FFD700] transition-colors">
                          {cmd.label}
                        </span>
                        <ArrowRight className="w-4 h-4 text-[rgba(255,215,0,0.5)] opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                      </button>
                    ))}
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t-2 border-[rgba(255,215,0,0.2)] text-xs text-[rgba(245,245,220,0.5)]">
          <div className="flex items-center gap-4">
            <span>Navigate with ↑↓</span>
            <span>Select with ↵</span>
          </div>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
}
