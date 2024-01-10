'use client';
import { useState, useEffect } from 'react';

import useStore from '@/app/store/useStore';
import { useAlertStore } from '@/app/store/stores/useAlertStore';
import { PopupsTypes, usePopupStore } from '@/app/store/stores/usePopupStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import Button, { Color } from '@/components/Button/page';

library.add(faXmark);

interface MetadataProps {
  prevData: any;
  onSave: (data: string) => void;
}

const MetadataPopup: React.FC<MetadataProps> = (props) => {
  const prevData = props.prevData;
  const selectedPopup = useStore(usePopupStore, (state) => state.selectedPopup);
  const updateSelectedPopup = usePopupStore.getState().updateSelectedPopup;

  return (
    <div
      className={
        selectedPopup === PopupsTypes.METADATA
          ? 'fixed left-0 top-0 z-20 flex h-screen w-screen items-center justify-center overflow-auto bg-[rgb(0,0,0)] bg-[rgba(0,0,0,0.4)] transition duration-200 ease-out'
          : 'z-0 opacity-0 transition duration-200 ease-in'
      }
    >
      {selectedPopup === PopupsTypes.METADATA ? (
        <div className='relative m-5 flex h-[30rem] w-[40rem] justify-center rounded-md bg-white p-5 dark:bg-duoGrayDark-darkest xl:h-[35rem] xl:w-[55rem] 2xl:h-[50rem] 2xl:w-[78.5rem] 3xl:h-[70rem] 3xl:w-[110rem]'>
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
              Add Metadata
            </div>
            <div className='mt-12 grid w-full grid-cols-4 grid-rows-6'>
            <span>is in italkia</span>
            <span>yes/no</span>
            <span>is in italkia</span>
            <span>yes/no</span>
            <span>transmition</span>



          </div>
          </div>
          
          <div className='absolute bottom-0 w-[33%]'>
            <Button
              label={'Save'}
              color={Color.BLUE}
              onClick={() => props.onSave('metadata')}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default MetadataPopup;
