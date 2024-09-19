'use client';
import { useState } from 'react';

const SwitchButton: React.FC<SwitchButtonProps> = (props) => {
  const [isChecked, setIsChecked] = useState<boolean>(false);

  return (
    <label
      htmlFor='switch-button-input'
      id='switch-button-label'
      className='relative inline-flex h-[24px] w-[57px] shrink-0 cursor-pointer items-center rounded-xl dark:bg-duoBlueDark-text'
    >
      <input
        type='checkbox'
        id='switch-button-input'
        checked={isChecked}
        onChange={() => {
          setIsChecked(!isChecked);
          props.onSwitch(isChecked);
        }}
        className='h-[20px] w-[20px]'
      />
      <div
        id='switch-button'
        className={`absolute h-[34px] w-[32px] rounded-[10px] border-2 border-b-4 dark:border-duoBlueDark-text dark:bg-duoGrayDark-darkest ${
          isChecked ? 'switched' : ''
        }`}
      ></div>
    </label>
  );
};

export default SwitchButton;
