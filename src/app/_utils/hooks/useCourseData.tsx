'use client';
import { useCallback, useEffect } from 'react';
import pRetry from 'p-retry';
import {
  CourseDataActionTypes,
  courseDataAction,
  courseDataType,
} from '@/reducers/courseDataReducer';
import { useAlertStore } from '@/app/store/stores/useAlertStore';
import {
  getCourseDataById,
  //   getUnsuspendedUnitsData,
} from '@/app/API/classes-service/courses/functions';
// import {
//   getLevelsData,
//   getUnsuspendedLevelsData,
// } from '@/app/API/classes-service/units/functions';
// import {
//   getLessonsData,
//   getUnsuspendedLessonsData,
// } from '@/app/API/classes-service/levels/functions';
// import {
//   getExercisesData,
//   getUnsuspendedExercisesData,
// } from '@/app/API/classes-service/lessons/functions';
import { getResultsByLessonAndUser } from '@/app/API/classes-service/results/functions';

const useCourseData = (
  userId: string | undefined,
  courseDataState: courseDataType,
  courseDataDispatch: (value: CourseDataActionTypes) => void
) => {
  const addAlert = useAlertStore.getState().addAlert;

  const fetchCourseData = useCallback(async () => {
    try {
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
        console.log('courseData', courseData);
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

  //   const fetchUnspendedUnits = useCallback(async () => {
  //     try {
  //       const response = await pRetry(
  //         () =>
  //           !!courseDataState.courseId
  //             ? getUnsuspendedUnitsData(courseDataState.courseId)
  //             : null,
  //         {
  //           retries: 5,
  //         }
  //       );
  //       if (response) {
  //         courseDataDispatch({
  //           type: courseDataAction.SET_UNSUSPENDED_UNITS,
  //           payload: response,
  //         });
  //       } else {
  //         addAlert('server error while fetching data', AlertSizes.small);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching units data:', error);
  //     }
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, [courseDataDispatch, courseDataState.courseId]);

  useEffect(() => {
    fetchCourseData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseDataState.courseId]);

  //   useEffect(() => {
  //     fetchUnspendedUnits();
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, [courseDataState.courseId]);

  //   const fetchLevels = useCallback(async () => {
  //     try {
  //       const promises = courseDataState.units.map(async (unit) => {
  //         try {
  //           const levelsData = await pRetry(() => getLevelsData(unit._id), {
  //             retries: 5,
  //           });
  //           console.log('fetchLevels - levelsData', levelsData);
  //           return { fatherId: unit._id, data: levelsData };
  //         } catch (error) {
  //           console.error('Error fetching levels for unit:', unit._id, error);
  //           return { fatherId: unit._id, data: [] };
  //         }
  //       });
  //       const result = await Promise.all(promises);
  //       console.log('fetchLevels', result);
  //       courseDataDispatch({
  //         type: courseDataAction.SET_LEVELS,
  //         payload: result,
  //       });
  //     } catch (error) {
  //       console.error('Error fetching levels', error);
  //       return;
  //     }
  //   }, [courseDataDispatch, courseDataState.units]);

  //   const fetchUnsuspendedLevels = useCallback(async () => {
  //     try {
  //       const promises = courseDataState.units.map(async (unit) => {
  //         try {
  //           const levelsData = await pRetry(
  //             () => getUnsuspendedLevelsData(unit._id),
  //             {
  //               retries: 5,
  //             }
  //           );
  //           return { fatherId: unit._id, data: levelsData };
  //         } catch (error) {
  //           console.error('Error fetching levels for unit:', unit._id, error);
  //           return { fatherId: unit._id, data: [] };
  //         }
  //       });
  //       const result = await Promise.all(promises);
  //       courseDataDispatch({
  //         type: courseDataAction.SET_UNSUSPENDED_LEVELS,
  //         payload: result,
  //       });
  //     } catch (error) {
  //       console.error('Error fetching levels', error);
  //       return;
  //     }
  //   }, [courseDataDispatch, courseDataState.units]);

  //   useEffect(() => {
  //     if (courseDataState.units !== undefined) {
  //       //   console.log('check', courseDataState.units);
  //       if (courseDataState.units.length > 0) {
  //         fetchLevels();
  //       }
  //     }
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, [courseDataState.units]);

  //   useEffect(() => {
  //     if (courseDataState.units !== undefined) {
  //       //   console.log('check', courseDataState.units);
  //       if (courseDataState.units.length > 0) {
  //         fetchUnsuspendedLevels();
  //       }
  //     }
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, [courseDataState.units]);

  //   const fetchLessons = useCallback(async () => {
  //     try {
  //       const levelsIds = courseDataState.levels
  //         .flatMap((level) => level.data)
  //         .map((data) => data._id);
  //       const promises = levelsIds.map(async (levelId) => {
  //         try {
  //           const lessonsData = await pRetry(() => getLessonsData(levelId), {
  //             retries: 5,
  //           });
  //           return { fatherId: levelId, data: lessonsData };
  //         } catch (error) {
  //           console.error('Error fetching lessons for level:', levelId, error);
  //           return { fatherId: levelId, data: [] };
  //         }
  //       });

  //       const result = await Promise.all(promises);
  //       courseDataDispatch({
  //         type: courseDataAction.SET_LESSONS,
  //         payload: result,
  //       });
  //     } catch (error) {
  //       console.error('Error fetching lessons', error);
  //       return [];
  //     }
  //   }, [courseDataDispatch, courseDataState.levels]);

  //   const fetchUnsuspendedLessons = useCallback(async () => {
  //     try {
  //       const levelsIds = courseDataState.levels
  //         .flatMap((level) => level.data)
  //         .map((data) => data._id);
  //       const promises = levelsIds.map(async (levelId) => {
  //         try {
  //           const lessonsData = await pRetry(
  //             () => getUnsuspendedLessonsData(levelId),
  //             {
  //               retries: 5,
  //             }
  //           );
  //           return { fatherId: levelId, data: lessonsData };
  //         } catch (error) {
  //           console.error('Error fetching lessons for level:', levelId, error);
  //           return { fatherId: levelId, data: [] };
  //         }
  //       });

  //       const result = await Promise.all(promises);
  //       courseDataDispatch({
  //         type: courseDataAction.SET_UNSUSPENDED_LESSONS,
  //         payload: result,
  //       });
  //     } catch (error) {
  //       console.error('Error fetching lessons', error);
  //       return [];
  //     }
  //   }, [courseDataDispatch, courseDataState.levels]);

  //   useEffect(() => {
  //     if (
  //       !!courseDataState.levels &&
  //       courseDataState.levels.length > 0 &&
  //       !!courseDataState.levels[0].fatherId
  //     ) {
  //       fetchLessons();
  //     }
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, [courseDataState.levels]);

  //   useEffect(() => {
  //     if (
  //       !!courseDataState.levels &&
  //       courseDataState.levels.length > 0 &&
  //       !!courseDataState.levels[0].fatherId
  //     ) {
  //       fetchUnsuspendedLessons();
  //     }
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, [courseDataState.levels]);

  //   const fetchExercises = useCallback(async () => {
  //     try {
  //       const lessons = courseDataState.lessons.flatMap((lesson) => lesson.data);
  //       console.log('fetchExercises', courseDataState.lessons, lessons);
  //       const promises = lessons.map(async (lesson) => {
  //         try {
  //           const exercisesData = await pRetry(
  //             () => getExercisesData(lesson._id),
  //             {
  //               retries: 5,
  //             }
  //           );
  //           return { fatherId: lesson._id, data: exercisesData };
  //         } catch (error) {
  //           console.error(
  //             'Error fetching exercises for lesson:',
  //             lesson._id,
  //             error
  //           );
  //           return { fatherId: lesson._id, data: [] };
  //         }
  //       });

  //       const result = await Promise.all(promises);
  //       courseDataDispatch({
  //         type: courseDataAction.SET_EXERCISES,
  //         payload: result.flat(),
  //       });
  //     } catch (error) {
  //       console.error('Error fetching exercises', error);
  //       return [];
  //     }
  //   }, [courseDataDispatch, courseDataState.lessons]);

  //   const fetchUnsuspendedExercises = useCallback(async () => {
  //     try {
  //       const lessons = courseDataState.lessons.flatMap((lesson) => lesson.data);

  //       const promises = lessons.map(async (lesson) => {
  //         try {
  //           const exercisesData = await pRetry(
  //             () => getUnsuspendedExercisesData(lesson._id),
  //             {
  //               retries: 5,
  //             }
  //           );
  //           return { fatherId: lesson._id, data: exercisesData };
  //         } catch (error) {
  //           console.error(
  //             'Error fetching exercises for lesson:',
  //             lesson._id,
  //             error
  //           );
  //           return { fatherId: lesson._id, data: [] };
  //         }
  //       });

  //       const result = await Promise.all(promises);
  //       courseDataDispatch({
  //         type: courseDataAction.SET_EXERCISES,
  //         payload: result.flat(),
  //       });
  //     } catch (error) {
  //       console.error('Error fetching Unsuspended exercises', error);
  //       return [];
  //     }
  //   }, [courseDataDispatch, courseDataState.lessons]);

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

  //   useEffect(() => {
  //     if (
  //       !!courseDataState.lessons &&
  //       courseDataState.lessons.length > 0 &&
  //       !!courseDataState.lessons[0].fatherId
  //     ) {
  //       fetchExercises();
  //     }
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, [courseDataState.lessons]);

  //   useEffect(() => {
  //     if (
  //       !!courseDataState.lessons &&
  //       courseDataState.lessons.length > 0 &&
  //       !!courseDataState.lessons[0].fatherId
  //     ) {
  //       fetchUnsuspendedExercises();
  //     }
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, [courseDataState.lessons]);

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
