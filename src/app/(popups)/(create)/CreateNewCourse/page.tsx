'use client';
import { useCallback, useEffect, useState } from 'react';

import { AlertSizes, useAlertStore } from '@/app/store/stores/useAlertStore';

import Input, { InputTypes } from '@/components/Input/page';
import Button, { ButtonColors } from '@/components/Button/page';
import { PopupsTypes, usePopupStore } from '@/app/store/stores/usePopupStore';
import {
  createCourse,
  getCourses,
} from '@/app/API/classes-service/courses/functions';
import { useCourseStore } from '@/app/store/stores/useCourseStore';
import pRetry from 'p-retry';
import PopupHeader, { PopupSizes } from '../../PopupHeader/page';

const CreateNewCourse: React.FC = () => {
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

  const updateCourseStore = useCallback(async () => {
    try {
      //   const response = await getCourses();
      const response = await pRetry(getCourses, {
        retries: 5,
      });
      if (response) {
        updateCoursesList(response);
        updateSelectedPopup(PopupsTypes.CLOSED);
      } else {
        addAlert('error while updating course store.', AlertSizes.small);
      }
    } catch (error) {
      addAlert(`error while updating course store: ${error}`, AlertSizes.small);
      throw new Error(`error while updating course store: ${error}`);
    }
  }, [addAlert, updateCoursesList, updateSelectedPopup]);

  const createCourseHandle = useCallback(
    async (formData: FormData) => {
      try {
        const courseName = formData.get('courseName');
        console.log('create course:', courseName);

        if (
          typeof courseName === 'string' &&
          (!!!courseName || courseName.length < 3)
        ) {
          addAlert('Please enter a valid course name.', AlertSizes.small);
          setIsFailed(true);
          return;
        }

        const response = await pRetry(
          () => (courseName ? createCourse(courseName.toString()) : null),
          {
            retries: 5,
          }
        );
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
    },
    [addAlert, updateCourseStore]
  );

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await createCourseHandle(formData);
  };

  return (
    <PopupHeader
      popupType={PopupsTypes.NEWCOURSE}
      header='Create new course'
      size={PopupSizes.SMALL}
    >
      <form
        className='mt-12 grid w-full grid-cols-4 grid-rows-3 gap-y-4 px-4 py-4 3xl:gap-y-12'
        onSubmit={handleFormSubmit}
      >
        <p className='col-span-1 flex-none text-lg font-bold text-duoGray-darkest dark:text-duoGrayDark-lightest'>
          Course Name:
        </p>

        <div className='col-span-3 mx-4 flex flex-none flex-col items-center justify-center'>
          <Input
            type={InputTypes.TEXT}
            placeholder={'Course Name'}
            name={'courseName'}
            value={courseName}
            onChange={(value: string) => setCourseName(value)}
          />
        </div>

        <div className='col-span-2 col-start-2 mt-2 flex-none justify-center'>
          <Button
            label={'CREATE'}
            color={ButtonColors.BLUE}
            // onClick={async () => await handleFormSubmit(courseName)}
          />
        </div>
      </form>
    </PopupHeader>
  );
};

export default CreateNewCourse;
