'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import useStore from '../store/useStore';
import { useUserStore } from '../store/stores/useUserStore';
import Input, { InputTypes } from '@/components/Input/page';
import Button, { ButtonColors } from '@/components/Button/page';
import { handleAuth } from '../API/users-service/users/functions';

enum TypesOfUser {
  LOGGEDOUT = 'loggedOut',
  ADMIN = 'admin',
  SEARIDER = 'searider',
  SENIOR = 'senior',
  TEACHER = 'teacher',
  CREW = 'crew',
}

const Login: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const userStore = {
    updateUserName: useUserStore.getState().updateUserName,
    isLoggedIn: useStore(useUserStore, (state) => state.isLoggedIn),
    userRole: useStore(useUserStore, (state) => state.userRole),
  };
  useEffect(() => {
    if (userStore.isLoggedIn && userStore.userRole) {
      if (userStore.userRole === TypesOfUser.ADMIN) {
        router.push('/classroom');
      } else {
        router.push('/learn');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userStore.isLoggedIn, userStore.userRole]);

  const handleUser = (value: string) => {
    setUser(value);
    userStore.updateUserName(value);
  };

  const handlePassword = (value: string) => {
    setPassword(value);
  };

  return (
    <div
      className='mx-auto flex w-[350px] flex-col items-center justify-start space-y-3 pt-10'
      suppressHydrationWarning
    >
      {userStore.isLoggedIn ? null : (
        <>
          <label className='text-2xl font-extrabold'>Log in</label>
          <Input
            type={InputTypes.text}
            placeholder='Username'
            value={user}
            onChange={handleUser}
          />
          <Input
            type={InputTypes.password}
            placeholder='Password'
            value={password}
            onChange={handlePassword}
          />
          <Button
            label='LOG IN'
            color={ButtonColors.BLUE}
            onClick={() => handleAuth(user, password)}
            href={''}
          />
        </>
      )}
    </div>
  );
};

export default Login;
