'use client';
import { Dispatch, useCallback, useEffect, useMemo } from 'react';
import pRetry from 'p-retry';
import {
  CourseDataAction,
  CourseDataActionsList,
  CourseDataType,
} from '@/reducers/courseDataReducer';
import { useAlertStore } from '@/app/store/stores/useAlertStore';
import { getCourseDataById } from '@/app/API/classes-service/courses/functions';
import { getResultsByLevelAndUser } from '@/app/API/classes-service/results/functions';
import { AlertSizes } from '@/app/store/stores/useAlertStore';

const useCourseData = (
  userId: string | undefined,
  courseDataState: CourseDataType,
  courseDataDispatch: Dispatch<CourseDataAction>
) => {
  const addAlert = useAlertStore((state) => state.addAlert);

  const fetchCourseData = useCallback(async () => {
    if (!courseDataState.courseId) {
      console.log("No course ID provided for data fetch");
      return;
    }

    try {
      console.log(`Fetching course data for ID: ${courseDataState.courseId}`);
      const courseData = await pRetry(
        () => getCourseDataById(courseDataState.courseId!),
        {
          retries: 2,
        }
      );

      if (!courseData) {
        console.error('No course data returned from server');
        addAlert('Server error while fetching data', AlertSizes.small);
        return;
      }

      console.log('RAW COURSE DATA:', courseData);
      
      // Ensure levels array exists
      if (!courseData.levels) {
        console.error('Course data missing levels array');
        courseData.levels = [];
      }
      
      console.log('COURSE DATA LEVELS:', courseData.levels);
      console.log('LEVELS IDS FROM COURSE:', courseData.levelsIds);

      // Check if courseData.levels contains all levels or just one
      if (courseData.levels && courseData.levelsIds && 
          courseData.levels.length !== courseData.levelsIds.length) {
        console.error('WARNING: Number of level objects does not match levelsIds length!');
        console.error('Levels count:', courseData.levels.length);
        console.error('LevelsIds count:', courseData.levelsIds.length);
      }

      // Process and dispatch levels - make sure we handle missing data
      const levels = [{
        fatherId: courseDataState.courseId,
        data: (courseData.levels || []).map(({ _id, name, exercisesIds, suspendedExercisesIds }) => ({
          _id,
          name: name || 'Unnamed Level',
          exercisesIds: exercisesIds || [],
          suspendedExercisesIds: suspendedExercisesIds || [],
        })),
      }];
      
      console.log('PROCESSED LEVELS:', levels);
      console.log('Level count in data array:', levels[0].data.length);
      
      // If we have level IDs but no actual level data, create placeholder levels
      if (courseData.levelsIds?.length > 0 && (!courseData.levels || courseData.levels.length === 0)) {
        console.log('Creating placeholder levels from levelIds');
        
        // Create basic placeholder levels from the IDs
        levels[0].data = courseData.levelsIds.map((levelId, index) => ({
          _id: levelId,
          name: `Level ${index + 1}`,
          exercisesIds: [],
          suspendedExercisesIds: [],
        }));
        
        console.log('Created', levels[0].data.length, 'placeholder levels');
      }
      
      // Dispatch all data at once to minimize render cycles
      courseDataDispatch({
        type: CourseDataActionsList.SET_ALL_DATA,
        payload: {
          levels,
          exercises: (courseData.levels || []).map((level) => ({
            fatherId: level._id,
            data: level.exercises || [],
          }))
        }
      });
    } catch (error) {
      console.error('Error fetching course data:', error);
      addAlert('Error fetching course data', AlertSizes.small);
    }
  }, [courseDataState.courseId, courseDataDispatch, addAlert]);

  const fetchResults = useCallback(async () => {
    if (!userId || courseDataState.levels.length === 0) return;

    try {
      const levels = courseDataState.levels.flatMap((level) => level.data);
      const resultsPromises = levels.map(async (level) => {
        try {
          const resultsData = await pRetry(
            () => getResultsByLevelAndUser(level._id, userId),
            { retries: 5 }
          );
          return {
            levelId: level._id,
            results: {
              numOfExercises: level.exercisesIds.length,
              results: resultsData || [],
            },
          };
        } catch (error) {
          console.error(
            `Error fetching results for level: ${level._id}`,
            error
          );
          return {
            levelId: level._id,
            results: {
              numOfExercises: level.exercisesIds.length,
              results: [],
            },
          };
        }
      });

      const results = await Promise.all(resultsPromises);
      courseDataDispatch({
        type: CourseDataActionsList.SET_RESULTS,
        payload: results,
      });
    } catch (error) {
      console.error('Error fetching results:', error);
      addAlert('Error fetching results', AlertSizes.small);
    }
  }, [userId, courseDataState.levels, courseDataDispatch, addAlert]);

  const shouldFetchCourseData = useMemo(
    () => !!courseDataState.courseId,
    [courseDataState.courseId]
  );
  const shouldFetchResults = useMemo(
    () =>
      !!userId &&
      courseDataState.levels.length > 0 &&
      !!courseDataState.levels[0].childId,
    [userId, courseDataState.levels]
  );

  useEffect(() => {
    if (shouldFetchCourseData) {
      fetchCourseData();
    }
  }, [shouldFetchCourseData, fetchCourseData]);

  useEffect(() => {
    if (shouldFetchResults) {
      fetchResults();
    }
  }, [shouldFetchResults, fetchResults]);

  return { fetchCourseData, fetchResults };
};

export default useCourseData;
