'use client';
import { useCallback, useState } from 'react';

import { AlertSizes, useAlertStore } from '@/app/store/stores/useAlertStore';

import Input, { InputTypes } from '@/components/Input/page';
import Button, { ButtonColors } from '@/components/(buttons)/Button/page';
import Dropdown, { DropdownSizes } from '@/components/Dropdown';
import useStore from '@/app/store/useStore';
import { PopupsTypes } from '@/app/store/stores/usePopupStore';
import { registerUser } from '@/app/API/users-service/users/functions';
import { useCourseStore } from '@/app/store/stores/useCourseStore';
import pRetry from 'p-retry';
import PopupHeader from '../../PopupHeader/page';

const CreateNewUser: React.FC = () => {
  const coursesList = useStore(useCourseStore, (state) => state.coursesList);
  const addAlert = useAlertStore.getState().addAlert;

  const [userName, setUserName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [tId, setTId] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [courseId, setCourseId] = useState<string | null>(null);
  const [failedFeilds, setFailedFeilds] = useState<string[]>([]);

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

  const handleCourseId = (courseName: string) => {
    if (coursesList && coursesList.length > 0) {
      const selectedCourse = coursesList.find(
        (course) => course.name === courseName
      );
      console.log('handleCourseId', selectedCourse);
      selectedCourse && setCourseId(selectedCourse._id);
    }
  };

  const addFailedFields = (value: string) => {
    setFailedFeilds((pervFeilds: string[]) => [...pervFeilds, value]);
  };

  const createUser = useCallback(
    async (
      userName: string,
      tId: string,
      password: string,
      role: string,
      courseId?: string
    ) => {
      try {
        console.log('create user:', userName, tId, password, role, courseId);
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
            addFailedFields('userName');
          }

          if (
            (0 < tId.length && tId.length < 9) ||
            (!tId.includes('t') && tId.length === 9)
          ) {
            addAlert('Please enter a valid T-Id.', AlertSizes.small);
            addFailedFields('tId');
          }

          if (password.length < 8) {
            addAlert('Password too short.', AlertSizes.small);
            addFailedFields('password');
          }

          if (role === '') {
            addAlert('Please select a role.', AlertSizes.small);
            addFailedFields('role');
          }
          return;
        }
        const response = await pRetry(
          () => registerUser(userName, tId, password, role, courseId),
          {
            retries: 5,
          }
        );
        console.log(response);
        if (response === 201) {
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
      {/* <div className='grid-rows-7 ml-[5.5rem] mr-24 grid w-[30rem] px-4 py-4 flex-none grid-cols-4 flex-col items-center justify-center'> */}
      <div className='mt-12 grid w-full grid-cols-4 grid-rows-6 gap-y-4 px-4 py-4 3xl:gap-y-12'>
        <p className='col-span-1 flex-none text-lg font-bold text-duoGray-darkest dark:text-duoGrayDark-lightest'>
          User Name:
        </p>

        <div className='col-span-3 mx-4 flex flex-none flex-col items-center justify-center'>
          <Input
            type={InputTypes.TEXT}
            placeholder={'User Name'}
            value={userName}
            onChange={handleUserName}
            failed={failedFeilds.includes('userName') ? true : false}
          />
        </div>

        <p className='col-span-1 flex-none text-lg font-bold text-duoGray-darkest dark:text-duoGrayDark-lightest'>
          T-ID:
        </p>

        <div className='col-span-3 mx-4 flex flex-none flex-col items-center justify-center opacity-90'>
          <Input
            type={InputTypes.TEXT}
            placeholder={'T-ID (optional)'}
            value={tId}
            onChange={handleTId}
            failed={failedFeilds.includes('tId') ? true : false}
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
          Role:
        </p>
        <div className='col-span-3 mx-4 flex flex-none flex-col items-center justify-center'>
          <Dropdown
            isSearchable={false}
            items={['admin', 'teacher', 'crew', 'student']}
            placeholder='role'
            value={role}
            onChange={handleRole}
            isFailed={failedFeilds.includes('role') ? true : false}
            size={DropdownSizes.DEFAULT}
          />
        </div>
        <p
          className={`col-span-1 flex-none text-lg font-bold text-duoGray-darkest dark:text-duoGrayDark-lightest ${
            role !== 'student' ? 'opacity-50' : ''
          }`}
        >
          Course:
        </p>
        <div className='col-span-3 mx-4 flex flex-none flex-col items-center justify-center'>
          <Dropdown
            isSearchable={false}
            isDisabled={role !== 'student'}
            items={
              coursesList
                ? coursesList.map((course) => (course.name ? course.name : ''))
                : ['']
            }
            placeholder='Course'
            // value={}
            onChange={(e) => handleCourseId(e)}
            isFailed={failedFeilds.includes('course') ? true : false}
            size={DropdownSizes.DEFAULT}
          />
        </div>

        <div className='relative col-span-2 col-start-2 mt-2 flex h-full w-full flex-none items-center justify-center py-5'>
          <div className='absolute inset-x-0'>
            <Button
              label={'CREATE'}
              color={ButtonColors.BLUE}
              onClick={() =>
                role === 'student'
                  ? courseId !== null
                    ? createUser(userName, tId, password, role, courseId)
                    : addAlert('Please select a course.', AlertSizes.small)
                  : createUser(userName, tId, password, role)
              }
            />
          </div>
        </div>
      </div>
    </PopupHeader>
  );
};

export default CreateNewUser;
