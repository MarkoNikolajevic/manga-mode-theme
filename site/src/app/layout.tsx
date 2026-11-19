import type { Metadata } from 'next';
import { Archivo, Dela_Gothic_One, Geist_Mono } from 'next/font/google';
import { MotionProvider } from '@/components/motion';
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

// Only sets the two Japanese sound effects, so it loads on demand.
const delaGothic = Dela_Gothic_One({
  variable: '--font-dela-gothic',
  weight: '400',
  subsets: ['latin'],
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.mangamode.dev'),
  title: "MangaMode: anime themes that don't shout",
  description:
    'Ten manga-inspired themes for VS Code, Cursor and Zed. Dark, light, and high-contrast palettes, with text contrast checked against WCAG AA.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang='en'
      className={`${archivo.variable} ${geistMono.variable} ${delaGothic.variable} bg-paper text-ink antialiased motion-safe:scroll-smooth`}
    >
      <body className='font-sans'>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
