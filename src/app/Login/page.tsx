'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import useStore from '../store/useStore';
import { PermissionsTypes, useUserStore } from '../store/stores/useUserStore';
import Input, { InputTypes } from '@/components/Input/page';
import Button, { ButtonColors } from '@/components/Button/page';
import { handleAuth } from '../API/users-service/users/functions';

const Login: React.FC = () => {
  const router = useRouter();
  const [userName, setUserName] = useState<string | undefined>(undefined);
  const [password, setPassword] = useState<string | undefined>(undefined);

  const userStore = {
    updateUserName: useUserStore.getState().updateUserName,
    isLoggedIn: useStore(useUserStore, (state) => state.isLoggedIn),
    permission: useStore(useUserStore, (state) => state.permission),
  };
  useEffect(() => {
    if (userStore.isLoggedIn && userStore.permission) {
      if (userStore.permission === PermissionsTypes.ADMIN) {
        router.push('/classroom');
      } else {
        router.push('/learn');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userStore.isLoggedIn, userStore.permission]);

  const handleUser = (value: string) => {
    setUserName(value);
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
            value={userName}
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
            onClick={() =>
              userName && password ? handleAuth(userName, password) : null
            }
          />
        </>
      )}
    </div>
  );
};

export default Login;
