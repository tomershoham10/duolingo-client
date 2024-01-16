'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { useRouter } from 'next/navigation';

const Button: React.FC<ButtonProps> = (props: ButtonProps) => {
  const router = useRouter();

  let addedStyle: string = props.style ? props.style : 'w-full';

  let buttonColor: string = '';
  let buttonBorderColor: string = '';
  let buttonHoverColor: string = '';
  let textColor: string = '';

  switch (props.color) {
    case 'Blue':
      buttonColor =
        'bg-duoBlue-button group-active:translate-y-[4px] group-active:border-0';
      buttonBorderColor = 'bg-duoBlue-buttonBorder group-active:bg-transparent';
      buttonHoverColor = 'hover:bg-duoBlue-buttonHover';
      textColor = 'text-white dark:text-duoBlueDark-darkest';
      break;

    case 'Green':
      buttonColor =
        'bg-duoGreen-button group-active:translate-y-[4px] group-active:border-0';
      buttonBorderColor =
        'bg-duoGreen-buttonBorder group-active:bg-transparent';
      buttonHoverColor = 'hover:bg-duoGreen-buttonHover';
      textColor = 'text-white';
      break;

    case 'Gray':
      buttonColor =
        'bg-white border-t-2 border-l-2 border-r-2 border-duoGray-default hover:border-duoGray-light group-active:translate-y-[2px] group-active:border-0';
      buttonBorderColor =
        'bg-duoGray-default hover:bg-duoGray-light group-active:bg-transparent';
      buttonHoverColor = 'hover:bg-duoGray-lighter';
      textColor = 'text-duoGray-darker hover:text-duoGray-midDark';
      break;

    case 'White':
      buttonColor =
        'bg-white dark:border-t-2 dark:border-l-2 dark:border-r-2 dark:bg-duoGrayDark-darkest dark:border-duoGrayDark-light dark:hover:bg-duoGrayDark-darkestHover group-active:translate-y-[2px] group-active:border-2';
      buttonBorderColor =
        'bg-duoGreen-lightest dark:bg-duoGrayDark-light group-active:bg-transparent';
      buttonHoverColor =
        'hover:text-duoGreen-buttonHover dark:hover:text-duoBlueDark-textHover dark:bg-text-duoBlueDark-darker';
      textColor = 'text-duoGreen-default dark:text-duoBlueDark-text';
      break;
 
      case 'Purple':
      buttonColor =
        'bg-duoPurple-default group-active:translate-y-[4px] group-active:border-0';
      buttonBorderColor = 'bg-duoPurple-darker group-active:bg-transparent';
      buttonHoverColor = 'hover:bg-duoPurple-light';
      textColor = 'text-white';
      break;
  
      case 'Red':
      buttonColor =
        'bg-duoRed-button group-active:translate-y-[4px] group-active:border-0';
      buttonBorderColor = 'bg-duoRed-buttonBorder group-active:bg-transparent';
      buttonHoverColor = 'hover:bg-duoRed-buttonHover';
      textColor = 'text-white';
      break;
   
      case 'Yellow':
      buttonColor =
        'bg-duoYellow-button group-active:translate-y-[4px] group-active:border-0';
      buttonBorderColor =
        'bg-duoYellow-buttonBorder group-active:bg-transparent';
      buttonHoverColor = 'hover:bg-duoYellow-buttonHover';
      textColor = 'text-white';
      break;
  
      case 'Error':
      buttonColor =
        'bg-white border-2 border-duoRed-button group-active:translate-y-[4px] group-active:border-0';
      buttonBorderColor = 'bg-duoRed-button group-active:bg-transparent';
      buttonHoverColor = 'hover:bg-duoRed-lighter';
      textColor = 'text-duoRed-default';
  }

  return (
    <div className='group relative'>
      <div
        className={`${buttonBorderColor} ${textColor} flex flex-col justify-end ${addedStyle} text-md cursor-pointer rounded-2xl border-b-[4px] border-transparent font-extrabold`}
      >
        <button
          className={`flex flex-row items-center justify-center gap-2 text-center ${buttonColor} w-full rounded-2xl px-3 py-2 ${buttonHoverColor}`}
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
          <p className='flex items-center justify-center'>{props.label}</p>
        </button>
      </div>
    </div>
  );
};

export default Button;
