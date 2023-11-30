'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { useRouter } from 'next/navigation';

export enum Color {
  BLUE = 'Blue',
  GREEN = 'Green',
  GRAY = 'Gray',
  WHITE = 'White',
  PURPLE = 'Purple',
  RED = 'Red',
  YELLOW = 'Yellow',
}

interface ButtonProps {
  label: string;
  icon?: IconDefinition;
  color: Color;
  onClick?: () => void;
  href?: string;
  style?: string;
}

const Button: React.FC<ButtonProps> = ({
  label,
  icon,
  color,
  onClick,
  href,
  style,
}) => {
  const router = useRouter();

  let buttonColor: string = '';
  let buttonBorderColor: string = '';
  let buttonHoverColor: string = '';
  let textColor: string = '';

  switch (color) {
    case 'Blue':
      buttonColor = 'bg-duoBlue-button';
      buttonBorderColor = 'bg-duoBlue-buttonBorder';
      buttonHoverColor = 'hover:bg-duoBlue-buttonHover';
      textColor = 'text-white';
      break;
    case 'Green':
      buttonColor = 'bg-duoGreen-button';
      buttonBorderColor = 'bg-duoGreen-buttonBorder';
      buttonHoverColor = 'hover:bg-duoGreen-buttonHover';
      textColor = 'text-white';
      break;

    case 'Gray':
      buttonColor = 'bg-duoGray-button-default';
      buttonBorderColor = 'bg-duoGray-buttonBorder';
      buttonHoverColor = 'hover:bg-duoGray-buttonHover';
      textColor = 'text-white';
      break;
    case 'White':
      buttonColor = 'bg-white';
      buttonBorderColor = 'bg-duoGreen-lightest';
      buttonHoverColor = 'hover:text-duoGreen-buttonHover';
      textColor = 'text-duoGreen-default';
      break;
    case 'Purple':
      buttonColor = 'bg-duoPurple-default';
      buttonBorderColor = 'bg-duoPurple-darker';
      buttonHoverColor = 'hover:bg-duoPurple-light';
      textColor = 'text-white';
      break;
    case 'Red':
      buttonColor = 'bg-duoRed-button';
      buttonBorderColor = 'bg-duoRed-buttonBorder';
      buttonHoverColor = 'hover:bg-duoRed-buttonHover';
      textColor = 'text-white';
      break;
    case 'Yellow':
      buttonColor = 'bg-duoYellow-button';
      buttonBorderColor = 'bg-duoYellow-buttonBorder';
      buttonHoverColor = 'hover:bg-duoYellow-buttonHover';
      textColor = 'text-white';
      break;
  }
  if (!style) {
    style = 'w-full';
  }

  return (
    <div className='relative'>
      <div
        className={`${buttonBorderColor} ${textColor} flex flex-col justify-end ${style} text-md mb-2
    mt-2 cursor-pointer rounded-2xl border-b-[4px] border-transparent font-extrabold active:translate-y-[4px] active:border-0`}
      >
        <button
          className={`group flex flex-col items-center justify-start ${buttonColor} w-full rounded-2xl pb-2 pl-3 pr-3 pt-2 ${buttonHoverColor}`}
          onClick={() => {
            if (onClick) {
              onClick();
            }
            if (href) {
              router.push(href);
            }
          }}
        >
          {icon && (
            <FontAwesomeIcon className='ml-2 mr-4 h-6 w-6' icon={icon} />
          )}
          {label}
        </button>
      </div>
    </div>
  );
};

export default Button;
