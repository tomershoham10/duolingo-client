'use client';
import { useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

import { AlertSizes, useAlertStore } from '@/app/store/stores/useAlertStore';

import Input, { Types } from '@/app/components/Input/page';
import Button, { Color } from '@/app/components/Button/page';
import Dropdown, { DropdownSizes } from '@/app/components/Dropdown/page';
import useStore from '@/app/store/useStore';
import { PopupsTypes, usePopupStore } from '@/app/store/stores/usePopupStore';

library.add(faXmark);

const CreateNewUser: React.FC = () => {
  const selectedPopup = useStore(usePopupStore, (state) => state.selectedPopup);
  const addAlert = useAlertStore.getState().addAlert;
  const updateSelectedPopup = usePopupStore.getState().updateSelectedPopup;

  const [userName, setUserName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [tId, setTId] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [failedFeilds, setFailedFeilds] = useState<string[]>([]);
  // const [alertId, setAlertId] = useState<number>();

  // useEffect(() => {
  //     if (alerts) {
  //         if (alerts.length > 0) {
  //             setAlertId(Math.random());
  //         }
  //     }
  // }, [alerts]);

  const handleUserName = (value: string) => {
    setUserName(value);
  };

  const handlePassword = (value: string) => {
    setPassword(value);
  };

  const handleTId = (value: string) => {
    setTId(value);
  };

  const handleRole = (value: string) => {
    setRole(value);
  };

  const addFailedFeilds = (value: string) => {
    setFailedFeilds((pervFeilds: string[]) => [...pervFeilds, value]);
  };

  const createUser = async (
    userName: string,
    tId: string,
    password: string,
    role: string
  ) => {
    console.log('create user:', userName, tId, password, role);
    setFailedFeilds([]);
    if (
      userName.length < 3 ||
      (0 < tId.length && tId.length < 9) ||
      (!tId.includes('t') && tId.length === 9) ||
      password.length < 8 ||
      role === ''
    ) {
      if (userName.length < 3) {
        addAlert('Please enter a valid user name.', AlertSizes.small);
        addFailedFeilds('userName');
      }

      if (
        (0 < tId.length && tId.length < 9) ||
        (!tId.includes('t') && tId.length === 9)
      ) {
        addAlert('Please enter a valid T-Id.', AlertSizes.small);
        addFailedFeilds('tId');
      }

      if (password.length < 8) {
        addAlert('Password too short.', AlertSizes.small);
        addFailedFeilds('password');
      }

      if (role === '') {
        addAlert('Please select a role.', AlertSizes.small);
        addFailedFeilds('role');
      }
      return;
    }

    const response = await fetch(`http://localhost:4001/api/users/`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userName: userName,
        tId: tId,
        password: password,
        permission: role,
      }),
    });
    console.log(response);
    if (response.status === 200) {
      const resFromServer = await response.json();
      console.log(resFromServer);
      addAlert('User created successfully.', AlertSizes.small);
    }

    if (response.status === 409) {
      addAlert('User already existed!', AlertSizes.small);
    }
  };

  return (
    <div
      className={
        selectedPopup === PopupsTypes.NEWUSER
          ? 'fixed z-20 flex h-full w-full items-center justify-center overflow-auto bg-[rgb(0,0,0)] bg-[rgba(0,0,0,0.4)] transition duration-200 ease-out'
          : 'z-0 opacity-0 transition duration-200 ease-in'
      }
    >
      {selectedPopup === PopupsTypes.NEWUSER ? (
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
              <Input
                type={Types.text}
                placeholder={'User Name'}
                value={userName}
                onChange={handleUserName}
                failed={failedFeilds.includes('userName') ? true : false}
              />
            </div>

            <p className='col-span-1 flex-none text-lg font-bold text-duoGray-darkest'>
              T-ID:
            </p>

            <div className='col-span-3 mx-4 flex flex-none flex-col items-center justify-center'>
              <Input
                type={Types.text}
                placeholder={'T-ID (optional)'}
                value={tId}
                onChange={handleTId}
                failed={failedFeilds.includes('tId') ? true : false}
              />
            </div>

            <p className='col-span-1 flex-none text-lg font-bold text-duoGray-darkest'>
              Password:
            </p>

            <div className='col-span-3 mx-4 flex flex-none flex-col items-center justify-center'>
              <Input
                type={Types.password}
                placeholder={'Password'}
                value={password}
                onChange={handlePassword}
                failed={failedFeilds.includes('password') ? true : false}
              />
            </div>
            <p className='col-span-1 flex-none text-lg font-bold text-duoGray-darkest'>
              Role:
            </p>
            <div className='col-span-3 mx-4 flex flex-none flex-col items-center justify-center'>
              <Dropdown
                items={['searider', 'senior', 'crew', 'teacher', 'admin']}
                placeholder='role'
                value={role}
                onChange={handleRole}
                isFailed={failedFeilds.includes('role') ? true : false}
                size={DropdownSizes.DEFAULT}
              />
            </div>

            <div className='col-span-2 col-start-2 mt-2 flex-none justify-center'>
              <Button
                label={'CREATE'}
                color={Color.BLUE}
                onClick={() => createUser(userName, tId, password, role)}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default CreateNewUser;
