'use client';
import { useEffect, useCallback, useReducer, lazy } from 'react';
import pRetry from 'p-retry';
import { TiPlus } from 'react-icons/ti';
import useStore from '@/app/store/useStore';
import { useCourseStore } from '@/app/store/stores/useCourseStore';
import Button, { ButtonColors } from '@/components/(buttons)/Button/page';
import { createByCourse } from '@/app/API/classes-service/levels/functions';
import { AlertSizes, useAlertStore } from '@/app/store/stores/useAlertStore';
import LodingAdminSection from '@/components/UnitSection/AdminUnit/(components)/LodingAdminSection/page';
import {
  CourseDataActionsList,
  courseDataReducer,
} from '@/reducers/courseDataReducer';
import useCourseData from '@/app/_utils/hooks/useCourseData';
import RoundButton from '@/components/RoundButton';
import AdminLevel from '@/components/LevelSection/AdminLevel/page';

const EditLevel = lazy(
  () => import('@/app/(popups)/(syllabus)/EditLevel/page')
);
const EditLesson = lazy(
  () => import('@/app/(popups)/(syllabus)/EditLesson/page')
);
const AddExercises = lazy(
  () => import('@/app/(popups)/(syllabus)/addExercises/page')
);
const DeleteLevel = lazy(
  () => import('@/app/(popups)/(delete)/DeleteLevel')
);

const Syllabus: React.FC = () => {
  const selectedCourse = useStore(
    useCourseStore,
    (state) => state.selectedCourse
  );

  const addAlert = useAlertStore.getState().addAlert;

  const initialCourseDataState = {
    courseId: null,
    levels: [{ fatherId: null, data: [] }],
    lessons: [{ fatherId: null, data: [] }],
    exercises: [{ fatherId: null, data: [] }],
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

  const addLevel = useCallback(async () => {
    try {
      const status = await pRetry(
        () => createByCourse(courseDataState.courseId!),
        {
          retries: 5,
        }
      );

      if (status) {
        await fetchCourseData();
        addAlert('Level added successfully', AlertSizes.small);
      } else {
        addAlert('Failed to add level', AlertSizes.small);
      }
    } catch (error) {
      console.error('Error adding level:', error);
      addAlert('Error adding level', AlertSizes.small);
    }
  }, [addAlert, courseDataState.courseId, fetchCourseData]);

  return (
    <section className='h-full w-full overflow-y-auto'>
      <EditLevel />
      <EditLesson />
      <AddExercises />
      <DeleteLevel />
      {courseDataState.levels ? (
        courseDataState.levels.length > 0 ? (
          <section className='felx flex-col pt-6'>
            <AdminLevel
              courseDataState={courseDataState}
              courseDataDispatch={courseDataDispatch}
            />
            <RoundButton label='Add Level' Icon={TiPlus} onClick={addLevel} />
          </section>
        ) : (
          <div className='flex h-full w-full flex-col justify-start'>
            <span className='flex-none text-2xl font-extrabold text-duoGray-darkest'>
              0 levels
            </span>
            <Button
              label={'START COURSE'}
              color={ButtonColors.BLUE}
              onClick={addLevel}
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
