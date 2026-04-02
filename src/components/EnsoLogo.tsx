interface EnsoLogoProps {
  size?: number;
  animate?: boolean;
  className?: string;
}

export default function EnsoLogo({ size = 48, animate = false, className = "" }: EnsoLogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className} aria-label="ENSO TASK logo">
      <circle cx="50" cy="50" r="32" stroke="currentColor" strokeWidth="5" fill="none" opacity="0.9" />
      <polyline points="38,50 46,58 62,40" stroke="currentColor" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {animate && (
          <animate attributeName="opacity" values="0;1;1;0" dur="2.5s" repeatCount="indefinite" />
        )}
      </polyline>
    </svg>
  );
}
