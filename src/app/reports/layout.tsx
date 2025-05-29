'use client';
import AdminSideBar from '@/components/Navigation/AdminSideBar/page';

export default function ReportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex h-screen w-screen flex-row'>
    <div className='flex h-full w-full flex-row'>
      <div className='basis-1/5 2xl:basis-[15%] 3xl:basis-[10%]'>
        <AdminSideBar />
      </div>
      <div className='basis-4/5 overflow-x-hidden 2xl:basis-[67.5%] 3xl:basis-[77.5%]'>
        {children}
      </div>
    </div>
  </div>
  );
} 