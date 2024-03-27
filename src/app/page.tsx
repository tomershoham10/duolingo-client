'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useStore from './store/useStore';
import { PermissionsTypes, useUserStore } from './store/stores/useUserStore';
import { useThemeStore } from './store/stores/useThemeStore';
// import { getTargetsList } from "./API/classes-service/targets/functions";

const Home: React.FC = () => {
  const permission = useStore(useUserStore, (state) => state.permission);
  const isLoggedIn = useStore(useUserStore, (state) => state.isLoggedIn);
  const router = useRouter();

  const theme = useStore(useThemeStore, (state) => state.theme);

  useEffect(() => {
    console.log('theme check');
    if (typeof window !== 'undefined' && localStorage) {
      const localThemeString = localStorage.getItem('ThemeStore');
      if (localThemeString) {
        const localTheme = JSON.parse(localThemeString);
        document.documentElement.setAttribute(
          'data-mode',
          localTheme.state.theme
        );
        document.documentElement.className = localTheme.state.theme;
      } else {
        console.log('no theme');
      }
    }
  }, [theme]);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    }
    if (permission === PermissionsTypes.ADMIN) {
      router.push('/classroom');
    } else if (permission && permission !== PermissionsTypes.LOGGEDOUT) {
      router.push('/learn');
    }
  }, [isLoggedIn, router, permission]);

  return null;
};

export default Home;
