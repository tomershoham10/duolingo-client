import './globals.css';
import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';

const nunito = Nunito({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Train App',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang='en'
      className={`${nunito.className} dark`}
      suppressHydrationWarning
    >
      <body
        className='dark:bg-duoGrayDark-darkest dark:text-duoGrayDark-lightest mx-auto flex'
        suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
  );
}
