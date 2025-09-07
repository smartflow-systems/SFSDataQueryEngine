import React from "react";

interface GlassCardProps {
  title: string;
  children: React.ReactNode;
  cta?: React.ReactNode;
  className?: string;
}

export default function GlassCard({ title, children, cta, className = "" }: GlassCardProps) {
  return (
    <div className={`sfs-card sf-stars p-6 ${className}`} data-testid={`glass-card-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <h3 className="gradient-gold-text text-2xl font-extrabold tracking-tight mb-3">
        {title}
      </h3>
      <div className="mt-3 text-[rgba(233,230,223,0.9)]">
        {children}
      </div>
      {cta && (
        <div className="mt-4">
          {cta}
        </div>
      )}
    </div>
  );
}