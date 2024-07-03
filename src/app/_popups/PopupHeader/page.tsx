'use client';
import { ReactNode } from 'react';
import { useStore } from 'zustand';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { PopupsTypes, usePopupStore } from '@/app/store/stores/usePopupStore';
library.add(faXmark);

interface PopupHeaderProps {
  children: ReactNode;
  popupType: PopupsTypes;
  header: string;
}
const PopupHeader: React.FC<PopupHeaderProps> = (props) => {
  const selectedPopup = useStore(usePopupStore, (state) => state.selectedPopup);
  const updateSelectedPopup = usePopupStore.getState().updateSelectedPopup;
  return (
    <div
      className={
        selectedPopup === props.popupType
          ? 'fixed left-0 top-0 z-20 flex h-full w-screen items-center justify-center overflow-hidden bg-[rgb(0,0,0)] bg-[rgba(0,0,0,0.4)] transition duration-200 ease-out'
          : 'z-0 opacity-0 transition duration-200 ease-in'
      }
    >
      {selectedPopup === props.popupType ? (
        <div className='relative m-5 flex h-[35rem] w-[40rem] justify-center rounded-md bg-white p-5 dark:bg-duoGrayDark-darkest md:h-[35rem] xl:h-[35rem] xl:w-[55rem] 2xl:w-[57.5rem] 3xl:w-[70rem]'>
          <button
            onClick={() => {
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
              {props.header}
            </div>
            {props.children}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default PopupHeader;
