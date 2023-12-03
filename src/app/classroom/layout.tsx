'use client';
import { useRouter } from 'next/navigation';
import AdminSideBar from '../components/Navigation/AdminSideBar/page';
import NavBar from '@/app/components/Navigation/NavBar/page';
import CreateNewUser from '../popups/CreateNewUser/page';
import CreateNewUnit from '@/app/popups/CreateNewUnit/page';
import AdminEditPopup from '../popups/AdminEditPopup/page';
import Alert from '../components/Alert/page';
import InfoBar from '../components/InfoBar/page';
import useStore from '../store/useStore';
import { useUserStore, TypesOfUser } from '../store/stores/useUserStore';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const userRole = useStore(useUserStore, (state) => state.userRole);
  console.log(userRole);
  return (
    <div className='flex h-screen w-full flex-row'>
      {userRole === TypesOfUser.ADMIN ? (
        <>
          <Alert />
          <AdminSideBar />
          <CreateNewUser />
          <AdminEditPopup />
          <CreateNewUnit />
          <div className='flex h-screen w-full flex-col'>
            <NavBar />
            <div className='flex h-full w-full flex-row justify-between overflow-hidden'>
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
