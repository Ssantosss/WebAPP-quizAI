type Variant = 'happy'|'thinking'|'medal'|'tablet'|'book';

export default function Buddy({ className = '', variant = 'happy' }: { className?: string; variant?: Variant }) {
  // Semplice switch su occhi/bocca e piccoli accessori per rispettare i mock
  const eyes = variant === 'thinking' ? { cy: 118, r: 3 } : { cy: 116, r: 7 };
  return (
    <svg viewBox="0 0 256 256" className={className} aria-hidden>
      <ellipse cx="128" cy="210" rx="52" ry="14" fill="#000" opacity=".06"/>
      <g fill="#E79A3A">
        <path d="M64 82c6-14 28-22 46-18 7 2 12 7 14 13 2-6 7-11 14-13 18-4 40 4 46 18 3 7 0 14-8 18-12 6-28 3-40-7-3-3-5-6-6-9-1 3-3 6-6 9-12 10-28 13-40 7-8-4-11-11-8-18z"/>
        <path d="M64 118c0-28 27-50 64-50s64 22 64 50-27 66-64 66-64-38-64-66z"/>
        <path d="M92 178c0-7 16-10 36-10s36 3 36 10v12H92v-12z" fill="#D5832E"/>
      </g>
      {/* eyes + nose + mouth */}
      <g fill="#111">
        <circle cx="108" cy={eyes.cy} r={eyes.r}/><circle cx="148" cy={eyes.cy} r={eyes.r}/>
        {variant === 'thinking'
          ? <rect x="112" y="136" width="32" height="4" rx="2"/>
          : <path d="M112 140c8 8 24 8 32 0 4-4 9 2 6 6-12 12-32 12-44 0-3-4 2-10 6-6z"/>}
        <circle cx="128" cy="130" r="4" fill="#8B3A20"/>
      </g>

      {/* accessories */}
      {variant === 'medal' && (
        <>
          <circle cx="128" cy="168" r="18" fill="#F6C32C" stroke="#D4A81F" />
          <text x="128" y="174" textAnchor="middle" fontSize="14" fontWeight="700" fill="#8B3A20">1</text>
          <path d="M120 150l-12-10h40l-12 10" fill="#C0392B" opacity=".8"/>
        </>
      )}
      {variant === 'tablet' && <rect x="100" y="150" width="56" height="42" rx="6" fill="#2B2B2B" />}
      {variant === 'book' && (
        <g>
          <path d="M96 148h64v30a6 6 0 0 1-6 6H102a6 6 0 0 1-6-6v-30z" fill="#E35D2A"/>
          <path d="M128 148v36" stroke="#fff" strokeWidth="2"/>
        </g>
      )}
    </svg>
  );
}
