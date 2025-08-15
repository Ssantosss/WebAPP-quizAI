export default function Buddy({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="32" cy="32" r="32" fill="#176d46" />
      <circle cx="24" cy="26" r="6" fill="#fff" />
      <circle cx="40" cy="26" r="6" fill="#fff" />
      <path
        d="M20 44c4 4 20 4 24 0"
        stroke="#fff"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
