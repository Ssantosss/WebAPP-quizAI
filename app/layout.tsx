// Premium UI: ensure global styles are loaded from /styles.
import '../styles/globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Buddy',
  description: 'Quiz scanner mobile-first',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="it">
      <body className="container">
        {children}
        <nav className="tabbar">
          <a href="/">Home</a>
          <a href="/dashboard">Progressi</a>
          <a href="/account">Account</a>
        </nav>
      </body>
    </html>
  );
}
