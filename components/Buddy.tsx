export default function Buddy({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 128 128" className={className} aria-hidden>
      <defs>
        <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopOpacity="1" />
          <stop offset="1" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <g fill="#E58E2F">
        <ellipse cx="64" cy="110" rx="26" ry="8" fill="#000" opacity="0.08"/>
        <path d="M28 35c4-8 16-12 26-10 3 1 5 3 6 6 1-3 3-5 6-6 10-2 22 2 26 10 2 4 0 8-4 10-6 3-14 2-20-2-2-1-3-3-4-5-1 2-2 4-4 5-6 4-14 5-20 2-4-2-6-6-4-10z"/>
        <path d="M34 62c0-16 13-28 30-28s30 12 30 28-13 30-30 30S34 78 34 62z"/>
        <path d="M48 98c0-4 7-6 16-6s16 2 16 6v6H48v-6z" fill="#D9781F"/>
      </g>
      <g fill="#000">
        <circle cx="54" cy="58" r="4"/><circle cx="74" cy="58" r="4"/>
        <path d="M56 72c4 4 12 4 16 0 2-2 5 1 3 3-6 6-16 6-22 0-2-2 1-5 3-3z"/>
        <circle cx="64" cy="66" r="3" fill="#8B2B15"/>
      </g>
      <path d="M40 44c-6-2-10-6-10-10 0-3 3-5 6-4 6 2 9 7 9 12-2 0-3 0-5-1zM88 44c6-2 10-6 10-10 0-3-3-5-6-4-6 2-9 7-9 12 2 0 3 0 5-1z" fill="#CC7A26"/>
    </svg>
  );
}
