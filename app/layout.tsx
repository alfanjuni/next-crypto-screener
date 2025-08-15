import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Crypto Technical Screener',
  description: 'Advanced cryptocurrency screening with Stochastic and RSI indicators',
  keywords: 'crypto, screener, technical analysis, stochastic, RSI, trading, binance',
  authors: [{ name: 'Crypto Screener' }],
  openGraph: {
    title: 'Crypto Technical Screener',
    description: 'Advanced cryptocurrency screening with technical indicators',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <main className="min-h-screen bg-background text-foreground">
          {children}
        </main>
      </body>
    </html>
  );
}