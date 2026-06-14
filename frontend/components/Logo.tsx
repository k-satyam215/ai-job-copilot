/**
 * AI Job Copilot — Premium SVG Logo Component
 * Use <LogoIcon size={36} /> for icon only
 * Use <LogoFull size={36} /> for icon + wordmark
 */

export function LogoIcon({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="AI Job Copilot">
      <defs>
        <linearGradient id="lg1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4f8aff"/>
          <stop offset="100%" stopColor="#7c5cfc"/>
        </linearGradient>
        <linearGradient id="lg2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95"/>
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.7"/>
        </linearGradient>
      </defs>
      {/* Background rounded square */}
      <rect width="100" height="100" rx="22" fill="url(#lg1)"/>
      {/* Inner highlight */}
      <ellipse cx="38" cy="32" rx="22" ry="14" fill="white" fillOpacity="0.1"/>
      {/* Central node */}
      <circle cx="50" cy="50" r="9" fill="white" fillOpacity="0.95"/>
      {/* Orbit nodes */}
      <circle cx="50" cy="24" r="5.5" fill="white" fillOpacity="0.85"/>
      <circle cx="72" cy="37" r="4.5" fill="white" fillOpacity="0.75"/>
      <circle cx="72" cy="63" r="4.5" fill="white" fillOpacity="0.75"/>
      <circle cx="50" cy="76" r="5.5" fill="white" fillOpacity="0.85"/>
      <circle cx="28" cy="63" r="4.5" fill="white" fillOpacity="0.75"/>
      <circle cx="28" cy="37" r="4.5" fill="white" fillOpacity="0.75"/>
      {/* Connection lines */}
      <line x1="50" y1="41" x2="50" y2="29.5" stroke="white" strokeWidth="1.8" strokeOpacity="0.55"/>
      <line x1="57.8" y1="44.5" x2="68.2" y2="40.2" stroke="white" strokeWidth="1.8" strokeOpacity="0.55"/>
      <line x1="57.8" y1="55.5" x2="68.2" y2="59.8" stroke="white" strokeWidth="1.8" strokeOpacity="0.55"/>
      <line x1="50" y1="59" x2="50" y2="70.5" stroke="white" strokeWidth="1.8" strokeOpacity="0.55"/>
      <line x1="42.2" y1="55.5" x2="31.8" y2="59.8" stroke="white" strokeWidth="1.8" strokeOpacity="0.55"/>
      <line x1="42.2" y1="44.5" x2="31.8" y2="40.2" stroke="white" strokeWidth="1.8" strokeOpacity="0.55"/>
      {/* Career arrow (up-right) */}
      <path d="M58 34 L66 34 L66 42" stroke="white" strokeWidth="2" strokeOpacity="0.7" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <line x1="56" y1="44" x2="65" y2="35" stroke="white" strokeWidth="2" strokeOpacity="0.7" strokeLinecap="round"/>
    </svg>
  );
}

export function LogoFull({ size = 36 }: { size?: number }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
      <LogoIcon size={size} />
      <span style={{
        fontFamily: "'Cabinet Grotesk', 'Plus Jakarta Sans', sans-serif",
        fontSize: size * 0.42,
        fontWeight: 900,
        letterSpacing: "-0.01em",
        background: "linear-gradient(135deg, #4f8aff, #7c5cfc)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        lineHeight: 1,
      }}>
        AI Job Copilot
      </span>
    </span>
  );
}

export default LogoIcon;
