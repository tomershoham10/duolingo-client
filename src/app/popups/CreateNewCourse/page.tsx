'use client';
import { useEffect, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

import { AlertSizes, useAlertStore } from '@/app/store/stores/useAlertStore';

import Input, { Types } from '@/components/Input/page';
import Button, { Color } from '@/components/Button/page';
import useStore from '@/app/store/useStore';
import { PopupsTypes, usePopupStore } from '@/app/store/stores/usePopupStore';
import {
  createCourse,
  getCourses,
} from '@/app/API/classes-service/courses/functions';
import { useCourseStore } from '@/app/store/stores/useCourseStore';

library.add(faXmark);

const CreateNewCourse: React.FC = () => {
  const selectedPopup = useStore(usePopupStore, (state) => state.selectedPopup);
  const addAlert = useAlertStore.getState().addAlert;
  const updateSelectedPopup = usePopupStore.getState().updateSelectedPopup;
  const updateCoursesList = useCourseStore.getState().updateCoursesList;

  const [courseName, setCourseName] = useState<string>('');
  const [isFailed, setIsFailed] = useState<boolean>(false);

  useEffect(() => {
    if (isFailed) {
      courseName.length > 3 ? setIsFailed(false) : null;
    }
  }, [isFailed, courseName]);

  const createCourseHandle = async (courseName: string) => {
    try {
      console.log('create course:', courseName);
      {
        if (courseName.length < 3) {
          addAlert('Please enter a valid course name.', AlertSizes.small);
          setIsFailed(true);
          return;
        }
      }
      const response = await createCourse(courseName);
      console.log('create course - response:', response);
      if (response === 201) {
        addAlert('Course created successfully.', AlertSizes.small);
        await updateCourseStore();
      }
      if (response === 500 || response === null) {
        addAlert(
          'Error while creating the course! please try again',
          AlertSizes.small
        );
      }
      if (response === 403) {
        addAlert('Course already existed!', AlertSizes.small);
      }
    } catch (error) {
      addAlert(`error while creating course: ${error}`, AlertSizes.small);
      throw new Error(`error while creating course: ${error}`);
    }
  };

  const updateCourseStore = async () => {
    try {
      const response = await getCourses();
      response
        ? updateCoursesList(response)
        : addAlert('error while updating course store.', AlertSizes.small);
    } catch (error) {
      addAlert(`error while updating course store: ${error}`, AlertSizes.small);
      throw new Error(`error while updating course store: ${error}`);
    }
  };

  return (
    <div
      className={
        selectedPopup === PopupsTypes.NEWCOURSE
          ? 'fixed z-20 flex h-full w-full items-center justify-center overflow-auto bg-[rgb(0,0,0)] bg-[rgba(0,0,0,0.4)] transition duration-200 ease-out'
          : 'z-0 opacity-0 transition duration-200 ease-in'
      }
    >
      {selectedPopup === PopupsTypes.NEWCOURSE ? (
        <div className='flex h-[18rem] w-fit rounded-md bg-white px-5 py-5 dark:border-2 dark:border-duoGrayDark-light dark:bg-duoGrayDark-darkest'>
          <button
            onClick={() => {
              updateSelectedPopup(PopupsTypes.CLOSED);
            }}
            className='h-fit w-fit flex-none rounded-md text-duoGray-dark dark:text-duoBlueDark-text'
          >
            <FontAwesomeIcon
              className='fa-lg fa-solid flex-none'
              icon={faXmark}
            />
          </button>
          <div className='ml-[0.5rem] mr-6 grid w-[30rem] flex-none grid-cols-4 grid-rows-3 flex-col items-center justify-center'>
            <p className=' col-span-4 flex flex-none items-center justify-center text-2xl font-extrabold text-duoGray-darkest dark:text-duoGrayDark-lightest'>
              CREATE NEW COURSE
            </p>

            <p className='col-span-1 flex-none text-lg font-bold text-duoGray-darkest dark:text-duoGrayDark-lightest'>
              Course Name:
            </p>

            <div className='col-span-3 mx-4 flex flex-none flex-col items-center justify-center'>
              <Input
                type={Types.text}
                placeholder={'Course Name'}
                value={courseName}
                onChange={(value: string) => setCourseName(value)}
                failed={isFailed ? true : false}
              />
            </div>

            <div className='col-span-2 col-start-2 mt-2 flex-none justify-center'>
              <Button
                label={'CREATE'}
                color={Color.BLUE}
                onClick={() => createCourseHandle(courseName)}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default CreateNewCourse;
