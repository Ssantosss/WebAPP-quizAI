'use client';

type Mood = 'welcome' | 'thinking' | 'celebrate';

const faces: Record<Mood, JSX.Element> = {
  welcome: (
    <svg viewBox="0 0 64 64" width="64" height="64">
      <circle cx="32" cy="32" r="30" fill="#FEE" stroke="#333" />
      <circle cx="22" cy="26" r="4" fill="#333" />
      <circle cx="42" cy="26" r="4" fill="#333" />
      <path d="M22 42 q10 10 20 0" stroke="#333" strokeWidth="4" fill="none" />
    </svg>
  ),
  thinking: (
    <svg viewBox="0 0 64 64" width="64" height="64">
      <circle cx="32" cy="32" r="30" fill="#FEE" stroke="#333" />
      <circle cx="22" cy="26" r="4" fill="#333" />
      <circle cx="42" cy="26" r="4" fill="#333" />
      <path d="M20 44 q12 -8 24 0" stroke="#333" strokeWidth="4" fill="none" />
    </svg>
  ),
  celebrate: (
    <svg viewBox="0 0 64 64" width="64" height="64">
      <circle cx="32" cy="32" r="30" fill="#FEE" stroke="#333" />
      <circle cx="22" cy="26" r="4" fill="#333" />
      <circle cx="42" cy="26" r="4" fill="#333" />
      <path d="M22 42 q10 10 20 0" stroke="#333" strokeWidth="4" fill="none" />
      <polygon points="32,2 24,18 40,18" fill="#f90" />
    </svg>
  ),
};

export default function BuddyMascot({ mood = 'welcome' }: { mood?: Mood }) {
  return faces[mood];
}
