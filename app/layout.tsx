import '../styles/globals.css';
import type { ReactNode } from 'react';
import Tabbar from '../components/Tabbar';

export const metadata = {
  title: 'Buddy',
  openGraph: { title: 'Buddy' },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="it">
      <body>
        <main style={{ paddingBottom: 80 }}>{children}</main>
        <Tabbar />
      </body>
    </html>
  );
}
