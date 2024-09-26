'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const useResetStoreOnRouteChange = (resetStore: () => void) => {
  const pathname = usePathname();

  useEffect(() => {
    return () => {
      resetStore();
    };
  }, [pathname, resetStore]);
};

export default useResetStoreOnRouteChange;
