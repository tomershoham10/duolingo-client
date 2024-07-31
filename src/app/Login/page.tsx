'use client';
import Input, { InputTypes } from '@/components/Input/page';
import Button, { ButtonColors, ButtonTypes } from '@/components/Button/page';
import { handleAuth } from '../API/users-service/users/functions';
import { useKeyDown } from '../_utils/hooks/useKeyDown';
import { useCallback } from 'react';
import pRetry from 'p-retry';

const Login: React.FC = () => {
  const handleLogin = useCallback(async (formData: FormData) => {
    const userName = formData.get('userName')?.toString();
    const password = formData.get('password')?.toString();
    // if (userName && password) {
    //   const res = await handleAuth(userName, password);
    const res = await pRetry(
      () => (userName && password ? handleAuth(userName, password) : null),
      {
        retries: 5,
      }
    );
    if (res === 200) {
      location.reload();
    }
    // }
  }, []);

  const onSubmitCallback = useCallback(() => {
    const form = document.querySelector('form');
    if (form instanceof HTMLFormElement) {
      const formData = new FormData(form);
      handleLogin(formData);
    }
  }, [handleLogin]);

  useKeyDown(onSubmitCallback, ['Enter']);

  return (
    <form
      className='mx-auto flex w-[350px] flex-col items-center justify-start space-y-3 pt-10'
      suppressHydrationWarning
      action={handleLogin}
    >
      <label className='text-2xl font-extrabold'>Log in</label>
      <Input
        type={InputTypes.text}
        placeholder={'Username'}
        name={'userName'}
      />
      <Input
        type={InputTypes.password}
        placeholder={'Password'}
        name={'password'}
      />
      <Button
        label='LOG IN'
        color={ButtonColors.BLUE}
        buttonType={ButtonTypes.SUBMIT}
      />
    </form>
  );
};

export default Login;
