'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useStore from '../store/useStore';
import { usePopupStore } from '../store/stores/usePopupStore';
import { useUserStore } from '../store/stores/useUserStore';
import UserUnitSection from '../../components/UnitSection/StudentUnit/page';

const Dashboard: React.FC = () => {
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage) {
      console.log('localStorage');
      const userData = localStorage.getItem('userData');
      console.log('localStorage', userData);

      if (userData) {
        const parsedUserData = JSON.parse(userData);
        // router.push("/login");
        if (!parsedUserData.userId) {
          router.push('/login');
        }
      } else {
        router.push('/login');
      }
    } else {
      router.push('/login');
    }
  });
  const selectedPopup = useStore(usePopupStore, (state) => state.selectedPopup);

  return (
    <div
      className='flex w-full flex-col items-center justify-start'
      // bg-gradient-to-b from-duoBlue-lightest to-duoBlue-darkest overflow-auto
    >
      <UserUnitSection />
    </div>
  );
};

export default Dashboard;
