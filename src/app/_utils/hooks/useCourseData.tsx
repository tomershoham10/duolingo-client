'use client';
import { useCallback, useEffect } from 'react';
import pRetry from 'p-retry';
import {
  CourseDataActionTypes,
  courseDataAction,
  courseDataType,
} from '@/reducers/courseDataReducer';
import { useAlertStore } from '@/app/store/stores/useAlertStore';
import { getCourseDataById } from '@/app/API/classes-service/courses/functions';

import { getResultsByLessonAndUser } from '@/app/API/classes-service/results/functions';

const useCourseData = (
  userId: string | undefined,
  courseDataState: courseDataType,
  courseDataDispatch: (value: CourseDataActionTypes) => void
) => {
  const addAlert = useAlertStore.getState().addAlert;

  const fetchCourseData = useCallback(async () => {
    try {
      console.log('fetchCourseData courseDataState', courseDataState);

      const courseData = await pRetry(
        () =>
          !!courseDataState.courseId
            ? getCourseDataById(courseDataState.courseId)
            : null,
        {
          retries: 5,
        }
      );
      if (!!courseData) {
        console.log('fetchCourseData courseData', courseData);
        const units = courseData.units.map((unit) => {
          return {
            _id: unit._id,
            levelsIds: unit.levelsIds,
            suspendedLevelsIds: unit.suspendedLevelsIds,
            guidebookId: unit.guidebookId,
            description: unit.description,
          };
        });

        courseDataDispatch({
          type: courseDataAction.SET_UNITS,
          payload: units,
        });

        courseDataDispatch({
          type: courseDataAction.SET_SUSPENDED_UNITS_IDS,
          payload: courseData.suspendedUnitsIds,
        });

        const levelsData = courseData.units.flatMap((unit) => {
          return { fatherId: unit._id, levels: unit.levels };
        });

        if (levelsData.length > 0) {
          const levels = levelsData.map((level) => {
            const fatherId = level.fatherId;
            const levelsObjs = level.levels.map((levelObj) => {
              return {
                _id: levelObj._id,
                lessonsIds: levelObj.lessonsIds,
                suspendedLessonsIds: levelObj.suspendedLessonsIds,
              };
            });
            return {
              fatherId: fatherId,
              data: levelsObjs,
            };
          });
          courseDataDispatch({
            type: courseDataAction.SET_LEVELS,
            payload: levels,
          });

          const lessonsData = courseData.units.flatMap((unit) => {
            return unit.levels.flatMap((level) => {
              return { fatherId: level._id, lessons: level.lessons };
            });
          });

          if (lessonsData.length > 0) {
            const lessons = lessonsData.map((lesson) => {
              const fatherId = lesson.fatherId;
              const lessonsObjs = lesson.lessons.map((lessonObj) => {
                return {
                  _id: lessonObj._id,
                  name: lessonObj.name,
                  exercisesIds: lessonObj.exercisesIds,
                  suspendedExercisesIds: lessonObj.suspendedExercisesIds,
                };
              });
              return {
                fatherId: fatherId,
                data: lessonsObjs,
              };
            });

            courseDataDispatch({
              type: courseDataAction.SET_LESSONS,
              payload: lessons,
            });
          }

          const exercisesData = courseData.units.flatMap((unit) => {
            return unit.levels.flatMap((level) => {
              return level.lessons.flatMap((lesson) => {
                return {
                  fatherId: lesson._id,
                  data: lesson.exercises,
                };
              });
            });
          });
          if (exercisesData.length > 0) {
            courseDataDispatch({
              type: courseDataAction.SET_EXERCISES,
              payload: exercisesData,
            });
          }
        }
      } else {
        addAlert('server error while fetching data', AlertSizes.small);
      }
    } catch (error) {
      console.error('Error fetching units data:', error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseDataDispatch, courseDataState.courseId]);

  useEffect(() => {
    if (courseDataState.courseId) {
      console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
      fetchCourseData();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }
  }, [courseDataState.courseId]);

  const fetchResuls = useCallback(async () => {
    try {
      if (!!userId) {
        const lessons = courseDataState.lessons.flatMap(
          (lesson) => lesson.data
        );
        // console.log(
        //   'fetchUnsuspendedExercises',
        //   courseDataState.lessons,
        //   lessons
        // );

        const promises = lessons.map(async (lesson) => {
          try {
            const resultsData = await pRetry(
              () => getResultsByLessonAndUser(lesson._id, userId),
              {
                retries: 5,
              }
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
              'Error fetching results for lesson:',
              lesson._id,
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

        const result = await Promise.all(promises);
        courseDataDispatch({
          type: courseDataAction.SET_RESULTS,
          payload: result.flat(),
        });
      }
    } catch (error) {
      console.error('Error fetching units data:', error);
    }
  }, [courseDataDispatch, courseDataState.lessons, userId]);

  useEffect(() => {
    if (
      !!courseDataState.lessons &&
      courseDataState.lessons.length > 0 &&
      !!courseDataState.lessons[0].fatherId
    ) {
      userId ? fetchResuls() : null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseDataState.lessons]);
};

export default useCourseData;
