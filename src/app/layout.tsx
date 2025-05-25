import Alert from '@/components/Alert/page';
import './globals.css';
import type { Metadata } from 'next';
// import { Nunito } from 'next/font/google';
import ContextMenu from '@/components/ContextMenu/page';
import EditUserPage from './(popups)/(edit)/EditUser/page';
import CreateNewUser from './(popups)/(create)/CreateNewUser';

// const nunito = Nunito({ subsets: ['latin'] });

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
      className={`dark`}
      suppressHydrationWarning
    >
      <body
        className='mx-auto flex dark:bg-duoGrayDark-darkest  dark:text-duoGrayDark-lightest'
        suppressHydrationWarning={true}
      >
        <Alert />
        <ContextMenu />
        <EditUserPage />
        <CreateNewUser />
        {children}
      </body>
    </html>
  );
}
