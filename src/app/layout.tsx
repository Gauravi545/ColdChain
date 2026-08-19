import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth/context';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: 'ColdChain — Blockchain-Enabled Cold Chain Provenance Platform',
  description:
    'Real-time monitoring, temperature tracking, chain-of-custody management, and blockchain verification for pharmaceutical and food cold-chain shipments.',
  keywords: ['cold chain', 'pharmaceutical logistics', 'IoT monitoring', 'blockchain', 'temperature tracking'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <Providers>
          <AuthProvider>{children}</AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
