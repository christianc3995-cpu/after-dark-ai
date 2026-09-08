import './globals.css';
import './real-avatars.css';

export const metadata = {
  title: 'After Dark AI — Your After-Hours Companion',
  description: 'An 18+ mature, playful AI companion for late-night conversation.',
  manifest: '/manifest.webmanifest',
  themeColor: '#09090c',
  appleWebApp: { capable: true, title: 'After Dark AI', statusBarStyle: 'black-translucent' },
};

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
