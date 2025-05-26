'use client';
import { useCallback, useState } from 'react';

import { AlertSizes, useAlertStore } from '@/app/store/stores/useAlertStore';

import Input, { InputTypes } from '@/components/Input/page';
import Button, { ButtonColors } from '@/components/(buttons)/Button/page';
import Dropdown, { DropdownSizes } from '@/components/Dropdown';
import useStore from '@/app/store/useStore';
import { PopupsTypes, usePopupStore } from '@/app/store/stores/usePopupStore';
import { registerUser } from '@/app/API/users-service/users/functions';
import { useCourseStore } from '@/app/store/stores/useCourseStore';
import pRetry from 'p-retry';
import PopupHeader from '../../PopupHeader/page';

const updateSelectedPopup = usePopupStore.getState().updateSelectedPopup;

const CreateNewUser: React.FC = () => {
  const addAlert = useAlertStore.getState().addAlert;

  const [userName, setUserName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [role, setRole] = useState<string>('student'); // Default to student
  const [failedFeilds, setFailedFeilds] = useState<string[]>([]);

  const handleUserName = (value: string) => {
    setUserName(value);
  };

  const handlePassword = (value: string) => {
    setPassword(value);
  };

  const handleRole = (value: string) => {
    setRole(value);
  };

  const addFailedFields = (value: string) => {
    setFailedFeilds((pervFeilds: string[]) => [...pervFeilds, value]);
  };

  const createUser = useCallback(
    async (
      userName: string,
      password: string,
      role: string
    ) => {
      try {
        console.log('create user:', userName, password, role);
        setFailedFeilds([]);
        
        // Validation according to Hebrew specs
        if (
          userName.length === 0 ||
          userName.length > 20 ||
          password.length === 0 ||
          password.length > 20 ||
          role === ''
        ) {
          if (userName.length === 0) {
            addAlert('Please enter a user name.', AlertSizes.small);
            addFailedFields('userName');
          } else if (userName.length > 20) {
            addAlert('User name must be 20 characters or less.', AlertSizes.small);
            addFailedFields('userName');
          }

          if (password.length === 0) {
            addAlert('Please enter a password.', AlertSizes.small);
            addFailedFields('password');
          } else if (password.length > 20) {
            addAlert('Password must be 20 characters or less.', AlertSizes.small);
            addFailedFields('password');
          }

          if (role === '') {
            addAlert('Please select a role.', AlertSizes.small);
            addFailedFields('role');
          }
          return;
        }
        
        const response = await pRetry(
          () => registerUser(userName, '', password, role, undefined), // Empty tId and undefined courseId
          {
            retries: 5,
          }
        );
        console.log(response);
        if (response === 201) {
          updateSelectedPopup(PopupsTypes.CLOSED);
          addAlert('User created successfully.', AlertSizes.small);
        }
        if (response === 500 || response === 404 || response === 400) {
          addAlert(
            'Error while creating user! please try again',
            AlertSizes.small
          );
        }
        if (response === 403) {
          addAlert('User already existed!', AlertSizes.small);
        }
      } catch (err) {
        console.error('createUser error:', err);
      }
    },
    [addAlert]
  );

  return (
    <PopupHeader
      popupType={PopupsTypes.NEW_USER}
      header='Create new user'
      onClose={() => {}}
    >
      <div className='mt-12 grid w-full grid-cols-4 grid-rows-4 gap-y-4 px-4 py-4 3xl:gap-y-12'>
        <p className='col-span-1 flex-none text-lg font-bold text-duoGray-darkest dark:text-duoGrayDark-lightest'>
          User Name:
        </p>
        <div className='col-span-3 mx-4 flex flex-none flex-col items-center justify-center'>
          <Input
            type={InputTypes.TEXT}
            placeholder={'Username'}
            value={userName}
            onChange={handleUserName}
            failed={failedFeilds.includes('userName') ? true : false}
          />
        </div>

        <p className='col-span-1 flex-none text-lg font-bold text-duoGray-darkest dark:text-duoGrayDark-lightest'>
          Password:
        </p>
        <div className='col-span-3 mx-4 flex flex-none flex-col items-center justify-center'>
          <Input
            type={InputTypes.PASSWORD}
            placeholder={'Password'}
            value={password}
            onChange={handlePassword}
            failed={failedFeilds.includes('password') ? true : false}
          />
        </div>

        <p className='col-span-1 flex-none text-lg font-bold text-duoGray-darkest dark:text-duoGrayDark-lightest'>
          User Type:
        </p>
        <div className='col-span-3 mx-4 flex flex-none flex-col items-center justify-center'>
          <Dropdown
            isSearchable={false}
            items={['admin', 'teacher', 'student']}
            placeholder='Select user type'
            value={role}
            onChange={handleRole}
            isFailed={failedFeilds.includes('role') ? true : false}
            size={DropdownSizes.DEFAULT}
          />
        </div>

        <div className='relative col-span-2 col-start-2 mt-2 flex h-full w-full flex-none items-center justify-center py-5'>
          <div className='absolute inset-x-0'>
            <Button
              label={'CREATE'}
              color={ButtonColors.BLUE}
              onClick={() => createUser(userName, password, role)}
            />
          </div>
        </div>
      </div>
    </PopupHeader>
  );
};

export default CreateNewUser;
