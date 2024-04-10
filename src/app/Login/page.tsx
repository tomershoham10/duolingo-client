'use client';
import Input, { InputTypes } from '@/components/Input/page';
import Button, { ButtonColors, ButtonTypes } from '@/components/Button/page';
import { handleAuth } from '../API/users-service/users/functions';

const Login: React.FC = () => {
  const handleLogin = async (formData: FormData) => {
    const userName = formData.get('userName')?.toString();
    const password = formData.get('password')?.toString();
    if (userName && password) {
      const res = await handleAuth(userName, password);
      res === 200 ? location.reload() : null;
    }
  };

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
