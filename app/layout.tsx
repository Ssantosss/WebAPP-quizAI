import '../styles/globals.css';
import type { ReactNode } from 'react';
import TabBar from '../components/TabBar';

export const metadata = {
  title: 'Buddy',
  description: 'Quiz scanner mobile-first',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="it">
      <body style={{ paddingBottom:80 }}>
        {children}
        <TabBar />
      </body>
    </html>
  );
}
