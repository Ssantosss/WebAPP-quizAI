import { SVGProps } from 'react';

export function Buddy(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 64" {...props}>
      <circle cx="32" cy="32" r="32" fill="#176d46" />
      <circle cx="24" cy="26" r="6" fill="#fff" />
      <circle cx="40" cy="26" r="6" fill="#fff" />
      <path d="M20 44c4 4 20 4 24 0" stroke="#fff" strokeWidth="4" fill="none" />
    </svg>
  );
}

export function BuddyBook(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 64" {...props}>
      <rect x="8" y="12" width="48" height="40" rx="4" fill="#176d46" />
      <line x1="32" y1="12" x2="32" y2="52" stroke="#fff" strokeWidth="2" />
    </svg>
  );
}

export function BuddyThinking(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 64" {...props}>
      <circle cx="32" cy="32" r="32" fill="#176d46" />
      <circle cx="24" cy="26" r="6" fill="#fff" />
      <circle cx="40" cy="26" r="6" fill="#fff" />
      <path d="M20 44c12 -8 24 0 24 0" stroke="#fff" strokeWidth="4" fill="none" />
    </svg>
  );
}

export function BuddyAvatar(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 64" {...props}>
      <circle cx="32" cy="24" r="16" fill="#176d46" />
      <rect x="8" y="40" width="48" height="16" rx="8" fill="#176d46" />
    </svg>
  );
}
