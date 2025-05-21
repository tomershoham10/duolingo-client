import { lazy } from 'react';
import AdminSideBar from '../../components/Navigation/AdminSideBar/page';
import InfoBar from '@/components/InfoBar/page';
const CreateNewUser = lazy(() => import('../(popups)/(create)/CreateNewUser'));
const CreateNewCourse = lazy(
  () => import('../(popups)/(create)/CreateNewCourse')
);
const CreateNewUnit = lazy(  () => import('@/app/(popups)/(create)/CreateNewUnit'));const CreateNewExercise = lazy(  () => import('@/app/(popups)/(create)/CreateNewExercise'));// import { notFound } from 'next/navigation';

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
