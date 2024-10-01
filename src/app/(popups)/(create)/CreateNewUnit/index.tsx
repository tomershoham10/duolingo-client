'use client';
import { useState } from 'react';

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { library } from '@fortawesome/fontawesome-svg-core';
// import { faXmark } from '@fortawesome/free-solid-svg-icons';

import { AlertSizes, useAlertStore } from '@/app/store/stores/useAlertStore';

// import useStore from '@/app/store/useStore';
import {
  PopupsTypes,
  //  usePopupStore
} from '@/app/store/stores/usePopupStore';
import PopupHeader from '../../PopupHeader/page';

// library.add(faXmark);

const CreateNewUnit: React.FC = () => {
  //   const selectedPopup = useStore(usePopupStore, (state) => state.selectedPopup);
  const addAlert = useAlertStore.getState().addAlert;
  //   const updateSelectedPopup = usePopupStore.getState().updateSelectedPopup;

  const [userName, setUserName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [tId, setTId] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [failedFeilds, setFailedFeilds] = useState<string[]>([]);

  const addFailedFeilds = (value: string) => {
    setFailedFeilds((pervFeilds: string[]) => [...pervFeilds, value]);
  };

  return (
    <PopupHeader popupType={PopupsTypes.NEW_UNIT} header='Create new user'>
      {/* <div className='ml-[5.5rem] mr-24 grid flex-none grid-cols-4 grid-rows-6 flex-col items-center justify-center'> */}
      <div className='grid w-full grid-cols-4 grid-rows-5 gap-y-4 px-4 py-4 3xl:gap-y-12'>
        {/* <p
          className=' col-span-4 flex flex-none items-center justify-center text-2xl 
                        font-extrabold text-duoGray-darkest'
        >
          CREATE NEW USER
        </p> */}

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
    </PopupHeader>
  );
};

export default CreateNewUnit;
