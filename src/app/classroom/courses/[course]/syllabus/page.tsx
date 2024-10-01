'use client';
import { useEffect, useCallback, useReducer, lazy } from 'react';
import pRetry from 'p-retry';
import { TiPlus } from 'react-icons/ti';
import useStore from '@/app/store/useStore';
import AdminUnit from '@/components/UnitSection/AdminUnit/page';
import { useCourseStore } from '@/app/store/stores/useCourseStore';
import Button, { ButtonColors } from '@/components/(buttons)/Button/page';
import { createByCourse } from '@/app/API/classes-service/units/functions';
import { AlertSizes, useAlertStore } from '@/app/store/stores/useAlertStore';
import LodingAdminSection from '@/components/UnitSection/AdminUnit/(components)/LodingAdminSection/page';
import {
  CourseDataActionsList,
  courseDataReducer,
} from '@/reducers/courseDataReducer';
import useCourseData from '@/app/_utils/hooks/useCourseData';
import RoundButton from '@/components/RoundButton';

const EditUnit = lazy(() => import('@/app/(popups)/(syllabus)/EditUnit/page'));
const EditLevel = lazy(
  () => import('@/app/(popups)/(syllabus)/EditLevel/page')
);
const EditLesson = lazy(
  () => import('@/app/(popups)/(syllabus)/EditLesson/page')
);

const AddExercises = lazy(
  () => import('@/app/(popups)/(syllabus)/addExercises/page')
);

const Syllabus: React.FC = () => {
  const selectedCourse = useStore(
    useCourseStore,
    (state) => state.selectedCourse
  );

  const addAlert = useAlertStore.getState().addAlert;

  const initialCourseDataState = {
    courseId: null,
    units: null,
    suspendedUnitsIds: [],
    levels: [{ fatherId: null, data: [] }],
    // unsuspendedLevels: [{ fatherId: null, data: [] }],
    lessons: [{ fatherId: null, data: [] }],
    // unsuspendedLessons: [{ fatherId: null, data: [] }],
    exercises: [{ fatherId: null, data: [] }],
    // unsuspendedExercises: [{ fatherId: null, data: [] }],
    results: [],
  };

  const [courseDataState, courseDataDispatch] = useReducer(
    courseDataReducer,
    initialCourseDataState
  );

  useEffect(() => {
    if (selectedCourse && selectedCourse._id) {
      courseDataDispatch({
        type: CourseDataActionsList.SET_COURSE_ID,
        payload: selectedCourse._id,
      });
    }
  }, [selectedCourse]);

  const { fetchCourseData } = useCourseData(
    undefined,
    courseDataState,
    courseDataDispatch
  );

  const addUnit = useCallback(async () => {
    try {
      const status = await pRetry(
        () => createByCourse(courseDataState.courseId!),
        {
          retries: 5,
        }
      );

      if (status) {
        await fetchCourseData();
        addAlert('Unit added successfully', AlertSizes.small);
      } else {
        addAlert('Failed to add unit', AlertSizes.small);
      }
    } catch (error) {
      console.error('Error adding unit:', error);
      addAlert('Error adding unit', AlertSizes.small);
    }
  }, [addAlert, courseDataState.courseId, fetchCourseData]);

  return (
    <section className='h-full w-full overflow-y-auto'>
      <EditUnit />
      <EditLevel />
      <EditLesson />
      <AddExercises />
      {courseDataState.units ? (
        courseDataState.units.length > 0 ? (
          <section className='felx flex-col pt-6'>
            <AdminUnit
              courseDataState={courseDataState}
              courseDataDispatch={courseDataDispatch}
            />
            <RoundButton label='add unit' Icon={TiPlus} onClick={addUnit} />
          </section>
        ) : (
          <div className='flex h-full w-full flex-col justify-start'>
            <span className='flex-none text-2xl font-extrabold text-duoGray-darkest'>
              0 units
            </span>
            <Button
              label={'START COURSE'}
              color={ButtonColors.BLUE}
              onClick={addUnit}
              className='items-cetnter mx-auto mt-[] flex w-44 flex-none justify-center'
            />
          </div>
        )
      ) : (
        <LodingAdminSection />
      )}
    </section>
  );
};

export default Syllabus;
