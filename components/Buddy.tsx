export default function Buddy({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 256 256" className={className} aria-hidden>
      <g fill="none" stroke="none">
        <ellipse cx="128" cy="210" rx="52" ry="14" fill="#000" opacity=".06"/>
        <g>
          <path fill="#E79A3A" d="M64 82c6-14 28-22 46-18 7 2 12 7 14 13 2-6 7-11 14-13 18-4 40 4 46 18 3 7 0 14-8 18-12 6-28 3-40-7-3-3-5-6-6-9-1 3-3 6-6 9-12 10-28 13-40 7-8-4-11-11-8-18z"/>
          <path fill="#E79A3A" d="M64 118c0-28 27-50 64-50s64 22 64 50-27 66-64 66-64-38-64-66z"/>
          <path fill="#D5832E" d="M92 178c0-7 16-10 36-10s36 3 36 10v12H92v-12z"/>
        </g>
        <g fill="#111">
          <circle cx="108" cy="116" r="7"/><circle cx="148" cy="116" r="7"/>
          <path d="M112 140c8 8 24 8 32 0 4-4 9 2 6 6-12 12-32 12-44 0-3-4 2-10 6-6z"/>
          <circle cx="128" cy="130" r="4" fill="#8B3A20"/>
        </g>
        <g fill="#D5832E">
          <path d="M84 94c-12-4-18-12-18-18 0-6 6-9 12-7 11 4 16 12 16 20-4 0-6 0-10-2z"/>
          <path d="M172 94c12-4 18-12 18-18 0-6-6-9-12-7-11 4-16 12-16 20 4 0 6 0 10-2z"/>
        </g>
        <path fill="#E79A3A" d="M76 196c-6 0-12 6-12 12v8h128v-8c0-6-6-12-12-12H76z"/>
      </g>
    </svg>
  );
}
