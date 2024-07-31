'use client';
import { useEffect, useState } from 'react';

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { library } from '@fortawesome/fontawesome-svg-core';
// import { faXmark } from '@fortawesome/free-solid-svg-icons';

import { AlertSizes, useAlertStore } from '@/app/store/stores/useAlertStore';

import Input, { InputTypes } from '@/components/Input/page';
import Button, { ButtonColors } from '@/components/Button/page';
// import useStore from '@/app/store/useStore';
import { PopupsTypes, usePopupStore } from '@/app/store/stores/usePopupStore';
import {
  createCourse,
  getCourses,
} from '@/app/API/classes-service/courses/functions';
import { useCourseStore } from '@/app/store/stores/useCourseStore';
import pRetry from 'p-retry';
import PopupHeader from '../../PopupHeader/page';

// library.add(faXmark);

const CreateNewCourse: React.FC = () => {
  //   const selectedPopup = useStore(usePopupStore, (state) => state.selectedPopup);
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

  const createCourseHandle = async (formData: FormData) => {
    try {
      const courseName = formData.get('courseName');
      console.log('create course:', courseName);

      if (!!!courseName || courseName.length < 3) {
        addAlert('Please enter a valid course name.', AlertSizes.small);
        setIsFailed(true);
        return;
      }

      //   const response = await createCourse(courseName.toString());
      const response = await pRetry(() => createCourse(courseName.toString()), {
        retries: 5,
      });
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
  };

  return (
    <PopupHeader popupType={PopupsTypes.NEWCOURSE} header='Create new course'>
      {/* <div className='grid-rows-6 mt-12 grid w-full grid-cols-4 gap-y-4 px-4 py-4 3xl:gap-y-12'> */}
      <form
        // ml-[0.5rem] mr-6 grid w-[30rem] flex-none grid-cols-4 grid-rows-3 flex-col items-center justify-center
        className='mt-12 grid w-full grid-cols-4 grid-rows-3 gap-y-4 px-4 py-4 3xl:gap-y-12'
        action={createCourseHandle}
      >
        {/* <p className=' col-span-4 flex flex-none items-center justify-center text-2xl font-extrabold text-duoGray-darkest dark:text-duoGrayDark-lightest'>
          CREATE NEW COURSE
        </p> */}

        <p className='col-span-1 flex-none text-lg font-bold text-duoGray-darkest dark:text-duoGrayDark-lightest'>
          Course Name:
        </p>

        <div className='col-span-3 mx-4 flex flex-none flex-col items-center justify-center'>
          <Input
            type={InputTypes.text}
            placeholder={'Course Name'}
            name={'courseName'}
            value={courseName}
            // onChange={(value: string) => setCourseName(value)}
            // failed={isFailed ? true : false}
          />
        </div>

        <div className='col-span-2 col-start-2 mt-2 flex-none justify-center'>
          <Button
            label={'CREATE'}
            color={ButtonColors.BLUE}
            // onClick={async () => await createCourseHandle(courseName)}
          />
        </div>
      </form>
    </PopupHeader>
  );
};

export default CreateNewCourse;
