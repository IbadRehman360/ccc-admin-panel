import type { Metadata } from 'next';
import '@/styles/globals.css';
import { ReduxProvider } from '@/providers/ReduxProvider';

export const metadata: Metadata = {
  title: 'CCC Admin Panel',
  description: 'Admin panel for CCC platform management',
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
      { url: '/assets/ccc-icon.png', type: 'image/png' },
    ],
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
