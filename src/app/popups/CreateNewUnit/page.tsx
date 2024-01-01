'use client';
import { useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

import { AlertSizes, useAlertStore } from '@/app/store/stores/useAlertStore';

import Input, { Types } from '@/components/Input/page';
import Button, { Color } from '@/components/Button/page';
import Dropdown from '@/components/Dropdown/page';
import useStore from '@/app/store/useStore';
import { PopupsTypes, usePopupStore } from '@/app/store/stores/usePopupStore';

library.add(faXmark);

const CreateNewUnit: React.FC = () => {
  const selectedPopup = useStore(usePopupStore, (state) => state.selectedPopup);
  const addAlert = useAlertStore.getState().addAlert;
  const updateSelectedPopup = usePopupStore.getState().updateSelectedPopup;

  const [userName, setUserName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [tId, setTId] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [failedFeilds, setFailedFeilds] = useState<string[]>([]);

  const addFailedFeilds = (value: string) => {
    setFailedFeilds((pervFeilds: string[]) => [...pervFeilds, value]);
  };

  return (
    <div
      className={
        selectedPopup === PopupsTypes.NEWUNIT
          ? 'fixed z-20 flex h-full w-full items-center justify-center overflow-auto bg-[rgb(0,0,0)] bg-[rgba(0,0,0,0.4)] transition duration-200 ease-out'
          : 'z-0 opacity-0 transition duration-200 ease-in'
      }
    >
      {selectedPopup === PopupsTypes.NEWUNIT ? (
        <div className='m-5 flex h-[30rem] w-[40rem] rounded-md bg-white p-5'>
          <button
            onClick={() => {
              updateSelectedPopup(PopupsTypes.CLOSED);
            }}
            className='h-fit w-fit flex-none rounded-md text-duoGray-dark'
          >
            <FontAwesomeIcon
              className='fa-lg fa-solid flex-none'
              icon={faXmark}
            />
          </button>
          <div
            className='ml-[5.5rem] mr-24 grid flex-none grid-cols-4 grid-rows-6 
                    flex-col items-center justify-center'
          >
            <p
              className=' col-span-4 flex flex-none items-center justify-center text-2xl 
                        font-extrabold text-duoGray-darkest'
            >
              CREATE NEW USER
            </p>

            <p className='col-span-1 flex-none text-lg font-bold text-duoGray-darkest'>
              User Name:
            </p>

            <div className='col-span-3 mx-4 flex flex-none flex-col items-center justify-center '>
              a
            </div>

            <p className='col-span-1 flex-none text-lg font-bold text-duoGray-darkest'>
              T-ID:
            </p>

            <div className='col-span-3 mx-4 flex flex-none flex-col items-center justify-center'>
              a
            </div>

            <p className='col-span-1 flex-none text-lg font-bold text-duoGray-darkest'>
              Password:
            </p>

            <div className='col-span-3 mx-4 flex flex-none flex-col items-center justify-center'>
              a
            </div>
            <p className='col-span-1 flex-none text-lg font-bold text-duoGray-darkest'>
              Role:
            </p>
            <div className='col-span-3 mx-4 flex flex-none flex-col items-center justify-center'>
              a
            </div>

            <div className='col-span-2 col-start-2 mt-2 flex-none justify-center'>
              a
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default CreateNewUnit;
