import type { Metadata } from 'next';
import '@/styles/globals.css';
import { ReduxProvider } from '@/providers/ReduxProvider';

export const metadata: Metadata = {
  title: 'CCC Admin Panel',
  description: 'Admin panel for CCC platform management',
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
