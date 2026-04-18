export function PhilosopherIllustration({ symbol }: { symbol: string }) {
  if (symbol === '∅') {
    return (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="opacity-20">
        <ellipse cx="32" cy="16" rx="14" ry="5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M18 16 Q14 36 16 50 Q20 56 32 56 Q44 56 48 50 Q50 36 46 16" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M16 28 Q10 30 10 36 Q10 40 16 40" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M48 28 Q54 30 54 36 Q54 40 48 40" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M20 32 Q32 36 44 32" stroke="currentColor" strokeWidth="1" opacity="0.6" />
        <path d="M19 42 Q32 46 45 42" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      </svg>
    )
  }
  if (symbol === '✦') {
    return (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="opacity-20">
        <line x1="8" y1="32" x2="56" y2="32" stroke="currentColor" strokeWidth="1.5" />
        <line x1="32" y1="8" x2="32" y2="56" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="32" cy="32" r="14" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="32" cy="32" r="6" stroke="currentColor" strokeWidth="1" opacity="0.6" />
        <line x1="52" y1="28" x2="56" y2="32" stroke="currentColor" strokeWidth="1.5" />
        <line x1="52" y1="36" x2="56" y2="32" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    )
  }
  if (symbol === '⚖') {
    return (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="opacity-20">
        <line x1="32" y1="10" x2="32" y2="54" stroke="currentColor" strokeWidth="1.5" />
        <line x1="14" y1="22" x2="50" y2="22" stroke="currentColor" strokeWidth="1.5" />
        <path d="M14 22 L10 34 Q14 40 18 34 L14 22" stroke="currentColor" strokeWidth="1.2" fill="none" />
        <path d="M50 22 L46 34 Q50 40 54 34 L50 22" stroke="currentColor" strokeWidth="1.2" fill="none" />
        <circle cx="32" cy="10" r="3" stroke="currentColor" strokeWidth="1.2" />
        <line x1="28" y1="54" x2="36" y2="54" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    )
  }
  if (symbol === '◈') {
    return (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="opacity-20">
        <rect x="20" y="20" width="24" height="24" stroke="currentColor" strokeWidth="1.5" transform="rotate(45 32 32)" />
        <rect x="26" y="26" width="12" height="12" stroke="currentColor" strokeWidth="1" transform="rotate(45 32 32)" opacity="0.6" />
        <circle cx="32" cy="32" r="3" fill="currentColor" opacity="0.4" />
        <line x1="32" y1="4" x2="32" y2="14" stroke="currentColor" strokeWidth="1" opacity="0.4" />
        <line x1="32" y1="50" x2="32" y2="60" stroke="currentColor" strokeWidth="1" opacity="0.4" />
        <line x1="4" y1="32" x2="14" y2="32" stroke="currentColor" strokeWidth="1" opacity="0.4" />
        <line x1="50" y1="32" x2="60" y2="32" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      </svg>
    )
  }
  if (symbol === '⚡') {
    return (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="opacity-20">
        <path d="M36 8 L20 36 H30 L28 56 L44 28 H34 Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </svg>
    )
  }
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="opacity-20">
      <path d="M32 16 Q20 12 10 16 L10 50 Q20 46 32 50 Q44 46 54 50 L54 16 Q44 12 32 16 Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <line x1="32" y1="16" x2="32" y2="50" stroke="currentColor" strokeWidth="1.5" />
      <line x1="16" y1="24" x2="28" y2="22" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <line x1="16" y1="30" x2="28" y2="28" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <line x1="16" y1="36" x2="28" y2="34" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <line x1="36" y1="22" x2="48" y2="24" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <line x1="36" y1="28" x2="48" y2="30" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <line x1="36" y1="34" x2="48" y2="36" stroke="currentColor" strokeWidth="1" opacity="0.5" />
    </svg>
  )
}
