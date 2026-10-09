import type { Metadata } from 'next';
import { Archivo, Geist_Mono } from 'next/font/google';
import './globals.css';

const archivo = Archivo({
  variable: '--font-archivo',
  subsets: ['latin'],
  axes: ['wdth'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: "MangaMode: anime themes that don't shout",
  description:
    'Eight VS Code and Cursor themes drawn from manga palettes and tuned for long sessions. Every text color passes WCAG AA.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang='en'
      className={`${archivo.variable} ${geistMono.variable} bg-paper text-ink antialiased motion-safe:scroll-smooth`}
    >
      <body className='font-sans'>{children}</body>
    </html>
  );
}
