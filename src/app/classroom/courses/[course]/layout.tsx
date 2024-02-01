import NavBar from '@/components/Navigation/NavBar/page';
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex h-full w-full flex-col overflow-hidden'>
      <NavBar />
      {children}
    </div>
  );
}
