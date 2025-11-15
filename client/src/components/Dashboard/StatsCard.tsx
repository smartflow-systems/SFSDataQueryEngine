import { useState, useEffect } from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number;
  subtitle?: string;
  delay?: number;
}

export default function StatsCard({ title, value, icon: Icon, trend, subtitle, delay = 0 }: StatsCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (isVisible && typeof value === 'number') {
      let start = 0;
      const end = value;
      const duration = 1500;
      const increment = end / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setDisplayValue(end);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [isVisible, value]);

  return (
    <div
      className={`
        group relative overflow-hidden rounded-2xl
        bg-[rgba(13,13,13,0.6)] backdrop-blur-xl
        border-2 border-[rgba(255,215,0,0.2)]
        hover:border-[rgba(255,215,0,0.5)]
        shadow-[0_8px_32px_rgba(0,0,0,0.4)]
        hover:shadow-[0_8px_32px_rgba(255,215,0,0.3)]
        transition-all duration-500
        hover:scale-105 hover:-translate-y-2
        cursor-pointer
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[rgba(255,215,0,0.05)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Animated Border Glow */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 rounded-2xl animate-pulse bg-gradient-to-r from-[#FFD700] via-[#E6C200] to-[#FFD700] blur-xl opacity-30" />
      </div>

      <div className="relative p-6">
        {/* Icon */}
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-[#FFD700] to-[#E6C200] shadow-lg shadow-[rgba(255,215,0,0.3)] group-hover:shadow-[rgba(255,215,0,0.5)] transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
            <Icon className="w-6 h-6 text-[#0D0D0D]" />
          </div>

          {/* Trend Indicator */}
          {trend !== undefined && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold ${
              trend > 0
                ? 'bg-green-500/20 text-green-400'
                : trend < 0
                ? 'bg-red-500/20 text-red-400'
                : 'bg-gray-500/20 text-gray-400'
            }`}>
              {trend > 0 ? '↑' : trend < 0 ? '↓' : '→'} {Math.abs(trend)}%
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-sm font-medium text-[rgba(245,245,220,0.7)] mb-2 group-hover:text-[#FFD700] transition-colors">
          {title}
        </h3>

        {/* Value */}
        <p className="text-3xl font-bold bg-gradient-to-r from-[#FFD700] via-[#E6C200] to-[#FFD700] bg-clip-text text-transparent mb-1">
          {typeof value === 'number' ? displayValue.toLocaleString() : value}
        </p>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-xs text-[rgba(245,245,220,0.5)]">
            {subtitle}
          </p>
        )}

        {/* Sparkle Effect */}
        <div className="absolute top-4 right-4 w-2 h-2 bg-[#FFD700] rounded-full opacity-0 group-hover:opacity-100 animate-ping" />
      </div>
    </div>
  );
}
