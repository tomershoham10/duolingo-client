'use client';
import { ReactNode } from 'react';
import { useStore } from 'zustand';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { PopupsTypes, usePopupStore } from '@/app/store/stores/usePopupStore';
library.add(faXmark);

export enum PopupSizes {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
  EXTRA_LARGE = 'extraLarge',
}

interface PopupHeaderProps {
  children: ReactNode;
  popupType: PopupsTypes;
  header: string;
  size?: PopupSizes;
  onClose?: () => void;
}
const PopupHeader: React.FC<PopupHeaderProps> = (props) => {
  const { children, popupType, header, size, onClose } = props;
  const selectedPopup = useStore(usePopupStore, (state) => state.selectedPopup);
  //   console.log('PopupHeader selectedPopup', selectedPopup);
  const updateSelectedPopup = usePopupStore.getState().updateSelectedPopup;

  let widthClass: string;
  let heightClass: string;

  switch (size) {
    case PopupSizes.SMALL:
      widthClass = 'w-[40rem] xl:w-[55rem] 2xl:w-[57.5rem] 3xl:w-[70rem]';
      heightClass = 'min-h-[17.5rem] md:h-[17.5rem] xl:h-[20rem]';

      break;
    case PopupSizes.MEDIUM:
      widthClass = 'w-[40rem] xl:w-[55rem] 2xl:w-[57.5rem] 3xl:w-[70rem]';
      heightClass = 'h-[35rem] md:h-[35rem] xl:h-[35rem]';

      break;
    case PopupSizes.LARGE:
      widthClass = 'w-[40rem] xl:w-[55rem] 2xl:w-[57.5rem] 3xl:w-[80rem]';
      heightClass = 'h-[35rem] md:h-[35rem] xl:h-[35rem]';

      break;

    case PopupSizes.EXTRA_LARGE:
      widthClass = 'w-[50rem] xl:w-[75rem] 2xl:w-[110rem] 3xl:w-[120rem]';
      heightClass = 'h-[27rem] xl:h-[40rem] 2xl:h-[60rem] 3xl:h-[70rem]';

      break;
    default:
      widthClass = 'w-[40rem] xl:w-[55rem] 2xl:w-[57.5rem] 3xl:w-[70rem]';
      heightClass = 'h-[35rem] md:h-[35rem] xl:h-[35rem]';
      break;
  }

  return (
    <div
      className={
        selectedPopup === popupType
          ? 'fixed left-0 top-0 z-20 flex h-full w-screen items-center justify-center overflow-hidden bg-[rgb(0,0,0)] bg-[rgba(0,0,0,0.4)] transition duration-200 ease-out'
          : 'z-0 opacity-0 transition duration-200 ease-in'
      }
    >
      {selectedPopup === popupType ? (
        <div
          className={`relative m-5 flex justify-center rounded-md bg-white p-5 dark:bg-duoGrayDark-darkest ${widthClass} ${heightClass}`}
        >
          <button
            onClick={() => {
              onClose && onClose();
              updateSelectedPopup(PopupsTypes.CLOSED);
            }}
            className='z-50 h-fit w-fit flex-none rounded-md text-duoGray-dark'
          >
            <FontAwesomeIcon
              className='fa-lg fa-solid flex-none'
              icon={faXmark}
            />
          </button>
          <div className='w-full items-start justify-start'>
            <div className='absolute left-0 flex h-10 w-full justify-center border-b-2 text-xl font-extrabold dark:border-duoBlueDark-text 3xl:h-12 3xl:text-2xl'>
              {header}
            </div>
            <section className='mt-12 2xl:mt-20'>{children}</section>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default PopupHeader;
