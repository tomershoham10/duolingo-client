'use client';
import { usePathname, useRouter } from 'next/navigation';
import AdminSideBar from '../../components/Navigation/AdminSideBar/page';
import CreateNewUser from '../popups/CreateNewUser/page';
import CreateNewUnit from '@/app/popups/CreateNewUnit/page';
import AdminEditPopup from '../popups/AdminEditPopup/page';
import InfoBar from '@/components/InfoBar/page';
import useStore from '../store/useStore';
import { useUserStore, PermissionsTypes } from '../store/stores/useUserStore';
import CreateNewCourse from '../popups/CreateNewCourse/page';

// import { notFound } from 'next/navigation';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const permission = useStore(useUserStore, (state) => state.permission);
  //   console.log("classroom layout - permission",permission);
  return (
    <div className='flex h-screen w-screen flex-row'>
      {permission === PermissionsTypes.ADMIN ? (
        <>
          {/* <Alert /> */}
          <CreateNewUser />
          <CreateNewCourse />
          <AdminEditPopup />
          <CreateNewUnit />
          <div className='flex h-full w-full flex-row'>
            <div className='basis-1/5 2xl:basis-[15%] 3xl:basis-[10%]'>
              <AdminSideBar />
            </div>
            <div className='basis-3/5 2xl:basis-[67.5%] 3xl:basis-[77.5%] overflow-x-hidden'>{children}</div>
            <div className='basis-1/5 2xl:basis-[17.5%] 3xl:basis-[12.5%]'>
              <InfoBar />
            </div>
          </div>
        </>
      ) : (
        <>
          {permission === PermissionsTypes.LOGGEDOUT ? (
            router.push('/login')
          ) : (
            <h1>loading...</h1>
          )}
        </>
      )}
    </div>
  );
}
