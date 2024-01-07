'use client';
// import Alert from "@/components/Alert/page";
import InfoBar from '@/components/InfoBar/page';
import StudentSideBar from '../../components/Navigation/StudentSideBar/page';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex h-screen w-full flex-row'>
      {/* <Alert /> */}
      <StudentSideBar />
      <div className='flex h-screen w-full flex-col'>
        <div className='flex h-full w-full flex-row justify-between overflow-hidden'>
          {children}
          <InfoBar />
        </div>
      </div>
    </div>
  );
}
