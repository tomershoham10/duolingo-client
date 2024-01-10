'use client';
import { usePathname, useRouter } from 'next/navigation';
import AdminSideBar from '../../components/Navigation/AdminSideBar/page';
import NavBar from '@/components/Navigation/NavBar/page';
import CreateNewUser from '../popups/CreateNewUser/page';
import CreateNewUnit from '@/app/popups/CreateNewUnit/page';
import AdminEditPopup from '../popups/AdminEditPopup/page';
import InfoBar from '@/components/InfoBar/page';
import useStore from '../store/useStore';
import { useUserStore, TypesOfUser } from '../store/stores/useUserStore';
import CreateNewCourse from '../popups/CreateNewCourse/page';

// import { notFound } from 'next/navigation';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const userRole = useStore(useUserStore, (state) => state.userRole);
  //   console.log("classroom layout - userRole",userRole);
  return (
    <div className='flex h-screen w-screen flex-row'>
      {userRole === TypesOfUser.ADMIN ? (
        <>
          {/* <Alert /> */}
          <CreateNewUser />
          <CreateNewCourse />
          <AdminEditPopup />
          <CreateNewUnit />
          <div className='flex h-screen w-full flex-col'>
            {pathname.includes('courses') ? <NavBar /> : null}
            <div className='flex h-full flex-row justify-between overflow-hidden'>
              <AdminSideBar />
              {children}
              <InfoBar />
            </div>
          </div>
        </>
      ) : (
        <>
          {userRole === TypesOfUser.LOGGEDOUT ? (
            router.push('/login')
          ) : (
            <h1>PERMISSION DENIED!</h1>
          )}
        </>
      )}
    </div>
  );
}
