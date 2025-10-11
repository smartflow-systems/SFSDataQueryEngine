interface GlassCardProps {
  title?: string;
  children: React.ReactNode;
  cta?: React.ReactNode;
  className?: string;
  header?: React.ReactNode;
  bodyClassName?: string;
  dataTestId?: string;
}

export default function GlassCard({
  title,
  children,
  cta,
  className = "",
  header,
  bodyClassName = "",
  dataTestId,
}: GlassCardProps) {
  const hasHeader = Boolean(header || title);
  const computedTestId = dataTestId ?? (title ? `glass-card-${title.toLowerCase().replace(/\s+/g, '-')}` : undefined);
  const overridesMargin = /(^|\s)mt-/.test(bodyClassName);
  const bodySpacing = hasHeader && !overridesMargin ? "mt-3" : "";

  return (
    <div className={`sfs-card sf-stars p-6 ${className}`} data-testid={computedTestId}>
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
  );
}