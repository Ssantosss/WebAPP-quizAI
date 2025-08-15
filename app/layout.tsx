import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Buddy — Quiz AI',
  viewport: { width: 'device-width', initialScale: 1, viewportFit: 'cover' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
