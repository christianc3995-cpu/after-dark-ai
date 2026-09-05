import './globals.css';

export const metadata = {
  title: 'After Dark AI',
  description: 'An 18+ mature, playful AI companion.',
  manifest: '/manifest.webmanifest',
};

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
