import './globals.css';

export const metadata = {
  title: 'After Dark AI',
  description: 'An 18+ mature, playful AI companion.',
  manifest: '/manifest.webmanifest',
  themeColor: '#09090c',
  appleWebApp: { capable: true, title: 'After Dark AI', statusBarStyle: 'black-translucent' },
};

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
