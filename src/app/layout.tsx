import './globals.css';

export const metadata = {
  title: 'Vedic Matrix | aigaane.in',
  description: '51-subsystem Body-Mind-Vedic resonance engine',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
