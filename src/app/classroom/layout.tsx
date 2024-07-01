// 'use client';
import { lazy } from 'react';
// import { usePathname, useRouter } from 'next/navigation';
import AdminSideBar from '../../components/Navigation/AdminSideBar/page';
import InfoBar from '@/components/InfoBar/page';
// import useStore from '../store/useStore';
// import { useUserStore, PermissionsTypes } from '../store/stores/useUserStore';
const AdminEditPopup = lazy(() => import('../_popups/AdminEditPopup/page'));
const CreateNewUser = lazy(() => import('../_popups/CreateNewUser/page'));
const CreateNewCourse = lazy(() => import('../_popups/CreateNewCourse/page'));
const CreateNewUnit = lazy(() => import('@/app/_popups/CreateNewUnit/page'));

// import { notFound } from 'next/navigation';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex h-screen w-screen flex-row'>
      {/* <Alert /> */}
      <CreateNewUser />
      <CreateNewCourse />
      <AdminEditPopup />
      <CreateNewUnit />
      <div className='flex h-full w-full flex-row'>
        <div className='basis-1/5 2xl:basis-[15%] 3xl:basis-[10%]'>
          <AdminSideBar />
        </div>
        <div className='basis-3/5 overflow-x-hidden 2xl:basis-[67.5%] 3xl:basis-[77.5%]'>
          {children}
        </div>
        <div className='basis-1/5 2xl:basis-[17.5%] 3xl:basis-[12.5%]'>
          <InfoBar />
        </div>
      </div>
    </div>
  );
}
