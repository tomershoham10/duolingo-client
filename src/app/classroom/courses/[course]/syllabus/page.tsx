'use client';
import { useEffect, useCallback, useReducer, lazy, useRef } from 'react';
import pRetry from 'p-retry';
import { TiPlus } from 'react-icons/ti';
import useStore from '@/app/store/useStore';
import { useCourseStore } from '@/app/store/stores/useCourseStore';
import { usePopupStore, PopupsTypes } from '@/app/store/stores/usePopupStore';
import Button, { ButtonColors } from '@/components/(buttons)/Button/page';
import { createByCourse } from '@/app/API/classes-service/levels/functions';
import { AlertSizes, useAlertStore } from '@/app/store/stores/useAlertStore';
import LodingAdminSection from '@/components/UnitSection/AdminUnit/(components)/LodingAdminSection/page';
import {
  CourseDataActionsList,
  courseDataReducer,
  CourseDataType,
} from '@/reducers/courseDataReducer';
import useCourseData from '@/app/_utils/hooks/useCourseData';
import RoundButton from '@/components/RoundButton';
import AdminLevel from '@/components/LevelSection/AdminLevel/page';

const EditLevel = lazy(
  () => import('@/app/(popups)/(syllabus)/EditLevel/page')
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
  
  const selectedPopup = useStore(
    usePopupStore,
    (state) => state.selectedPopup
  );

  const addAlert = useAlertStore.getState().addAlert;

  const initialCourseDataState: CourseDataType = {
    courseId: null,
    levels: [{ childId: null, data: [] }],
    exercises: [{ childId: null, data: [] }],
    results: [],
  };

  const [courseDataState, courseDataDispatch] = useReducer(
    courseDataReducer,
    initialCourseDataState
  );
  
  // Use a ref to track if data has been fetched
  const dataFetchedRef = useRef(false);
  const previousPopupRef = useRef(selectedPopup);

  // Update course ID when selected course changes
  useEffect(() => {
    if (selectedCourse && selectedCourse._id) {
      courseDataDispatch({
        type: CourseDataActionsList.SET_COURSE_ID,
        payload: selectedCourse._id,
      });
    }
  }, [selectedCourse?._id]); // Only depend on the ID, not the entire object

  const { fetchCourseData } = useCourseData(
    undefined,
    courseDataState,
    courseDataDispatch
  );

  // Fetch data when course ID changes, but avoid unnecessary refetches
  useEffect(() => {
    if (courseDataState.courseId && !dataFetchedRef.current) {
      dataFetchedRef.current = true;
      fetchCourseData()
        .then(() => {
          console.log("Course data fetch complete");
        })
        .catch(err => {
          console.error("Error fetching course data:", err);
          dataFetchedRef.current = false; // Reset so we can try again
        });
    }
  }, [courseDataState.courseId, fetchCourseData]);

  // Log the state whenever it changes
  useEffect(() => {
    console.log("Current courseDataState:", courseDataState);
    if (courseDataState.levels && courseDataState.levels[0]) {
      console.log("Levels data:", courseDataState.levels[0].data);
      console.log("Number of levels:", courseDataState.levels[0].data.length);
    }
  }, [courseDataState]);

  // Refresh data when AddExercises popup closes
  useEffect(() => {
    // Check if the popup just closed (was ADD_EXERCISES, now is CLOSED)
    if (
      previousPopupRef.current === PopupsTypes.ADD_EXERCISES &&
      selectedPopup === PopupsTypes.CLOSED &&
      courseDataState.courseId
    ) {
      console.log('AddExercises popup closed, refreshing data...');
      fetchCourseData()
        .then(() => {
          console.log('Data refreshed after adding exercises');
        })
        .catch(err => {
          console.error('Error refreshing data after adding exercises:', err);
        });
    }
    
    // Update the previous popup ref
    previousPopupRef.current = selectedPopup;
  }, [selectedPopup, courseDataState.courseId, fetchCourseData]);

  const addLevel = useCallback(async () => {
    try {
      const status = await pRetry(
        () => createByCourse(courseDataState.courseId!),
        {
          retries: 5,
        }
      );

      if (status) {
        // Reset the dataFetchedRef to force a refresh
        dataFetchedRef.current = false;
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
    <section className='h-full w-full overflow-y-auto px-4 py-2'>
      <EditLevel />
      <AddExercises />
      <DeleteLevel />
      {courseDataState.levels ? (
        courseDataState.levels.length > 0 ? (
          <section className='flex flex-col pt-6 pb-4'>
            <AdminLevel
              courseDataState={courseDataState}
              courseDataDispatch={courseDataDispatch}
            />
            <RoundButton label='Add Level' Icon={TiPlus} onClick={addLevel} />
          </section>
        ) : (
          <div className='flex h-full w-full flex-col justify-start p-6'>
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
