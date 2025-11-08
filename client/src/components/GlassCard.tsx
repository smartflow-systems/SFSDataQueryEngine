interface GlassCardProps {
  title?: string;
  children: React.ReactNode;
  cta?: React.ReactNode;
  className?: string;
  header?: React.ReactNode;
  bodyClassName?: string;
  dataTestId?: string;
  enableCircuitFlow?: boolean;
}

export default function GlassCard({
  title,
  children,
  cta,
  className = "",
  header,
  bodyClassName = "",
  dataTestId,
  enableCircuitFlow = true,
}: GlassCardProps) {
  const hasHeader = Boolean(header || title);
  const computedTestId = dataTestId ?? (title ? `glass-card-${title.toLowerCase().replace(/\s+/g, '-')}` : undefined);
  const overridesMargin = /(^|\s)mt-/.test(bodyClassName);
  const bodySpacing = hasHeader && !overridesMargin ? "mt-3" : "";

  return (
    <div className={`sfs-card sf-stars ${enableCircuitFlow ? 'circuit-flow' : ''} p-6 ${className}`} data-testid={computedTestId}>
      {/* Circuit Flow Overlay */}
      {enableCircuitFlow && (
        <div className="circuit-overlay" aria-hidden="true">
          <svg className="circuit-svg" viewBox="0 0 400 300" preserveAspectRatio="none">
            {/* Horizontal circuit lines */}
            <line x1="0" y1="50" x2="400" y2="50" className="circuit-line circuit-line-1" />
            <line x1="0" y1="150" x2="400" y2="150" className="circuit-line circuit-line-2" />
            <line x1="0" y1="250" x2="400" y2="250" className="circuit-line circuit-line-3" />

            {/* Vertical circuit lines */}
            <line x1="100" y1="0" x2="100" y2="300" className="circuit-line circuit-line-4" />
            <line x1="300" y1="0" x2="300" y2="300" className="circuit-line circuit-line-5" />

            {/* Circuit nodes */}
            <circle cx="100" cy="50" r="3" className="circuit-node circuit-node-1" />
            <circle cx="300" cy="50" r="3" className="circuit-node circuit-node-2" />
            <circle cx="100" cy="150" r="3" className="circuit-node circuit-node-3" />
            <circle cx="300" cy="150" r="3" className="circuit-node circuit-node-4" />
            <circle cx="100" cy="250" r="3" className="circuit-node circuit-node-5" />
            <circle cx="300" cy="250" r="3" className="circuit-node circuit-node-6" />

            {/* Data flow pulses */}
            <circle cx="0" cy="50" r="2" className="data-pulse data-pulse-1" />
            <circle cx="0" cy="150" r="2" className="data-pulse data-pulse-2" />
            <circle cx="100" cy="0" r="2" className="data-pulse data-pulse-3" />
          </svg>
        </div>
      )}

      {/* Card Content */}
      <div className="card-content-wrapper">
        {header ? (
          header
        ) : title ? (
          <h3 className="gradient-gold-text text-2xl font-extrabold tracking-tight mb-3">
            {title}
          </h3>
        ) : null}
        <div className={`${bodySpacing} text-[rgba(233,230,223,0.9)] ${bodyClassName}`.trim()}>
          {children}
        </div>
        {cta && (
          <div className="mt-4">
            {cta}
          </div>
        )}
      </div>
    </div>
  );
}