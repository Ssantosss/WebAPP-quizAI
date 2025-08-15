import '../styles/globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Buddy',
  description: 'Quiz scanner mobile-first',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
