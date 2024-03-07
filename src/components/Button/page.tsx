'use client';
import { useRouter } from 'next/navigation';
import { useFormStatus } from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export enum ButtonColors {
  BLUE = 'Blue',
  GREEN = 'Green',
  GRAY = 'Gray',
  GRAYBLUE = 'grayBlue',
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

const Button: React.FC<ButtonProps> = (props: ButtonProps) => {
  const router = useRouter();
  const status = useFormStatus();
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
        'dark:bg-duoBlueDark-darkestHover dark:border-duoGrayDark-light bg-white border-t-2 border-l-2 border-r-2 border-duoGray-default hover:border-duoGray-light group-active:translate-y-[2px] group-active:border-2';
      buttonBorderColor =
        'dark:bg-duoGrayDark-light bg-duoGray-default hover:bg-duoGray-light group-active:bg-transparent';
      buttonHoverColor = 'hover:bg-duoGray-lighter';
      textColor =
        'dark:text-duoGrayDark-light text-duoGray-darker hover:text-duoGray-midDark';
      break;

    case 'grayBlue':
      buttonColor =
        'bg-white border-t-2 border-l-2 border-r-2 border-duoGray-default hover:border-duoGray-light group-active:translate-y-[2px] group-active:border-2';
      buttonBorderColor =
        'bg-duoGray-default hover:bg-duoGray-light group-active:bg-transparent';
      buttonHoverColor = 'hover:bg-duoGray-lighter';
      textColor = 'text-duoBlue-default hover:text-duoBlue-text';
      break;

    case 'White':
      buttonColor =
        'dark:bg-duoGrayDark-darkest dark:border-duoGrayDark-light dark:hover:bg-duoGrayDark-darkestHover bg-white dark:border-t-2 dark:border-l-2 dark:border-r-2 group-active:translate-y-[2px] group-active:border-2';
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
        className={`${buttonBorderColor} ${textColor} flex flex-col justify-end ${addedStyle} text-md rounded-2xl border-b-[4px] border-transparent font-extrabold ${
          props.isDisabled ? 'cursor-default' : 'cursor-pointer'
        }`}
      >
        <button
          className={`flex flex-row items-center justify-center text-center ${buttonColor} w-full rounded-2xl px-3 py-2 ${buttonHoverColor} ${
            status.pending || props.isLoading ? 'h-10' : 'gap-2'
          }`}
          disabled={status.pending || props.isLoading ? true : props.isDisabled}
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
          {status.pending || props.isLoading ? (
            <>
              <svg
                className={`${
                  props.loadingLabel ? '-ml-1 mr-3' : ''
                } h-5 w-5 animate-spin text-white dark:text-duoBlueDark-darkest`}
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
              >
                <circle
                  className='opacity-25'
                  cx='12'
                  cy='12'
                  r='10'
                  stroke='currentColor'
                  strokeWidth='4'
                ></circle>
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                ></path>
              </svg>
              {props.loadingLabel ? (
                <p className='tracking-wide dark:text-duoBlueDark-darkest'>
                  {props.loadingLabel}
                </p>
              ) : null}
            </>
          ) : (
            <>
              {props.icon && (
                <FontAwesomeIcon className='text-lg' icon={props.icon} />
              )}
              <p className='flex items-center justify-center'>{props.label}</p>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Button;
