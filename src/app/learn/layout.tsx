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
      <div className='basis-1/5 2xl:basis-[15%] 3xl:basis-[10%]'>
        <StudentSideBar />
      </div>
      <div className='basis-3/5 overflow-x-hidden 2xl:basis-[67.5%] 3xl:basis-[77.5%]'>
        {children}
      </div>
      <div className='basis-1/5 2xl:basis-[17.5%] 3xl:basis-[12.5%]'>
        <InfoBar />
      </div>
    </div>
  );
}
