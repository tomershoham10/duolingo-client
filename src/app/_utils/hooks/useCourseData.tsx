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
import { getResultsByLessonAndUser } from '@/app/API/classes-service/results/functions';
import { AlertSizes } from '@/app/store/stores/useAlertStore';

const useCourseData = (
  userId: string | undefined,
  courseDataState: CourseDataType,
  courseDataDispatch: Dispatch<CourseDataAction>
) => {
  const addAlert = useAlertStore((state) => state.addAlert);

  const fetchCourseData = useCallback(async () => {
    if (!courseDataState.courseId) return;

    try {
      const courseData = await pRetry(
        () => getCourseDataById(courseDataState.courseId!),
        {
          retries: 5,
        }
      );

      if (!courseData) {
        addAlert('Server error while fetching data', AlertSizes.small);
        return;
      }

      // Process and dispatch units
      const units = courseData.units;
      courseDataDispatch({
        type: CourseDataActionsList.SET_UNITS,
        payload: units,
      });
      courseDataDispatch({
        type: CourseDataActionsList.SET_SUSPENDED_UNITS_IDS,
        payload: courseData.suspendedUnitsIds,
      });

      // Process and dispatch levels
      const levels = courseData.units.flatMap((unit) => ({
        fatherId: unit._id,
        data: unit.levels.map(({ _id, lessonsIds, suspendedLessonsIds }) => ({
          _id,
          lessonsIds,
          suspendedLessonsIds,
        })),
      }));
      courseDataDispatch({
        type: CourseDataActionsList.SET_LEVELS,
        payload: levels,
      });

      // Process and dispatch lessons
      const lessons = courseData.units.flatMap((unit) =>
        unit.levels.flatMap((level) => ({
          fatherId: level._id,
          data: level.lessons.map(
            ({ _id, name, exercisesIds, suspendedExercisesIds }) => ({
              _id,
              name,
              exercisesIds,
              suspendedExercisesIds,
            })
          ),
        }))
      );
      courseDataDispatch({
        type: CourseDataActionsList.SET_LESSONS,
        payload: lessons,
      });

      // Process and dispatch exercises
      const exercises = courseData.units.flatMap((unit) =>
        unit.levels.flatMap((level) =>
          level.lessons.map((lesson) => ({
            fatherId: lesson._id,
            data: lesson.exercises,
          }))
        )
      );
      courseDataDispatch({
        type: CourseDataActionsList.SET_EXERCISES,
        payload: exercises,
      });
    } catch (error) {
      console.error('Error fetching course data:', error);
      addAlert('Error fetching course data', AlertSizes.small);
    }
  }, [courseDataState.courseId, courseDataDispatch, addAlert]);

  const fetchResults = useCallback(async () => {
    if (!userId || courseDataState.lessons.length === 0) return;

    try {
      const lessons = courseDataState.lessons.flatMap((lesson) => lesson.data);
      const resultsPromises = lessons.map(async (lesson) => {
        try {
          const resultsData = await pRetry(
            () => getResultsByLessonAndUser(lesson._id, userId),
            { retries: 5 }
          );
          return {
            lessonId: lesson._id,
            results: {
              numOfExercises: lesson.exercisesIds.length,
              results: resultsData || [],
            },
          };
        } catch (error) {
          console.error(
            `Error fetching results for lesson: ${lesson._id}`,
            error
          );
          return {
            lessonId: lesson._id,
            results: {
              numOfExercises: lesson.exercisesIds.length,
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
  }, [userId, courseDataState.lessons, courseDataDispatch, addAlert]);

  const shouldFetchCourseData = useMemo(
    () => !!courseDataState.courseId,
    [courseDataState.courseId]
  );
  const shouldFetchResults = useMemo(
    () =>
      !!userId &&
      courseDataState.lessons.length > 0 &&
      !!courseDataState.lessons[0].fatherId,
    [userId, courseDataState.lessons]
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
