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
  ERROR = 'Error',
}

export enum ButtonTypes {
  SUBMIT = 'submit',
  BUTTON = 'button',
}

interface ButtonProps {
  label: string;
  icon?: IconDefinition;
  color: Color;
  onClick?: () => void;
  href?: string;
  style?: string;
  isDisabled?: boolean;
  buttonType?: ButtonTypes;
}

const Button: React.FC<ButtonProps> = (props: ButtonProps) => {
  const router = useRouter();

  let addedStyle: string = props.style ? props.style : 'w-full';

  let buttonColor: string = '';
  let buttonBorderColor: string = '';
  let buttonHoverColor: string = '';
  let textColor: string = '';

  switch (props.color) {
    case 'Blue':
      buttonColor = 'bg-duoBlue-button';
      buttonBorderColor = 'bg-duoBlue-buttonBorder';
      buttonHoverColor = 'hover:bg-duoBlue-buttonHover';
      textColor = 'text-white dark:text-duoBlueDark-darkest';
      break;
    case 'Green':
      buttonColor = 'bg-duoGreen-button';
      buttonBorderColor = 'bg-duoGreen-buttonBorder';
      buttonHoverColor = 'hover:bg-duoGreen-buttonHover';
      textColor = 'text-white';
      break;

    case 'Gray':
      buttonColor =
        'bg-white border-t-2 border-l-2 border-r-2 active:border-2 border-duoGray-default hover:border-duoGray-light';
      buttonBorderColor = 'bg-duoGray-default hover:bg-duoGray-light';
      buttonHoverColor = 'hover:bg-duoGray-lighter';
      textColor = 'text-duoGray-darker hover:text-duoGray-midDark';
      break;
    case 'White':
      buttonColor =
        'bg-white dark:border-t-2 dark:border-l-2 dark:border-r-2 dark:active:border-2 dark:bg-duoGrayDark-darkest dark:border-duoGrayDark-light dark:hover:bg-duoGrayDark-darkestHover';
      buttonBorderColor = 'bg-duoGreen-lightest dark:bg-duoGrayDark-light';
      buttonHoverColor =
        'hover:text-duoGreen-buttonHover dark:hover:text-duoBlueDark-textHover dark:bg-text-duoBlueDark-darker';
      textColor =
        'text-duoGreen-default dark:text-duoBlueDark-text';
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
    case 'Error':
      buttonColor = 'bg-white border-2 border-duoRed-button';
      buttonBorderColor = 'bg-duoRed-button';
      buttonHoverColor = 'hover:bg-duoRed-lighter';
      textColor = 'text-duoRed-default';
  }

  return (
    <div className='relative'>
      <div
        className={`${buttonBorderColor} ${textColor} flex flex-col justify-end ${addedStyle} text-md cursor-pointer rounded-2xl border-b-[4px] border-transparent font-extrabold active:translate-y-[2px] active:border-0`}
      >
        <button
          className={`flex flex-row gap-2 items-center justify-center text-center ${buttonColor} w-full rounded-2xl py-2 px-3 ${buttonHoverColor}`}
          disabled={props.isDisabled}
          onClick={() => {
            if (props.onClick) {
              props.onClick();
            }
            if (props.href) {
              router.push(props.href);
            }
          }}
          type={props.buttonType}
        >
          {props.icon && (
            <FontAwesomeIcon className='text-lg' icon={props.icon} />
          )}
          <p className='flex justify-center items-center'>{props.label}</p>
        </button>
      </div>
    </div>
  );
};

export default Button;
