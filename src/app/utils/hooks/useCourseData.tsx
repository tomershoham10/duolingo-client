'use client';
import { useEffect } from 'react';
import {
  CourseDataActionTypes,
  courseDataAction,
  courseDataType,
} from '@/reducers/courseDataReducer';
import { useAlertStore } from '@/app/store/stores/useAlertStore';
import {
  getUnitsData,
  getUnsuspendedUnitsData,
} from '@/app/API/classes-service/courses/functions';
import {
  getLevelsData,
  getUnsuspendedLevelsData,
} from '@/app/API/classes-service/units/functions';
import {
  getLessonsData,
  getUnsuspendedLessonsData,
} from '@/app/API/classes-service/levels/functions';
import {
  getExercisesData,
  getUnsuspendedExercisesData,
} from '@/app/API/classes-service/lessons/functions';
import { getResultsByLessonAndUser } from '@/app/API/classes-service/results/functions';

const useCourseData = (
  userId: string | undefined,
  courseDataState: courseDataType,
  courseDataDispatch: (value: CourseDataActionTypes) => void
) => {
  const addAlert = useAlertStore.getState().addAlert;

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        if (!!courseDataState.courseId) {
          const response = await getUnitsData(courseDataState.courseId);
          if (response) {
            courseDataDispatch({
              type: courseDataAction.SET_UNITS,
              payload: response,
            });
          } else {
            addAlert('server error while fetching data', AlertSizes.small);
          }
        }
      } catch (error) {
        console.error('Error fetching units data:', error);
      }
    };

    const fetchUnspendedUnits = async () => {
      try {
        if (!!courseDataState.courseId) {
          const response = await getUnsuspendedUnitsData(
            courseDataState.courseId
          );
          if (response) {
            courseDataDispatch({
              type: courseDataAction.SET_UNSUSPENDED_UNITS,
              payload: response,
            });
          } else {
            addAlert('server error while fetching data', AlertSizes.small);
          }
        }
      } catch (error) {
        console.error('Error fetching units data:', error);
      }
    };
    fetchUnits();
    fetchUnspendedUnits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseDataState.courseId]);

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const promises = courseDataState.units.map(async (unit) => {
          try {
            const levelsData = await getLevelsData(unit._id);
            return { fatherId: unit._id, data: levelsData };
          } catch (error) {
            console.error('Error fetching levels for unit:', unit._id, error);
            return { fatherId: unit._id, data: [] };
          }
        });
        const result = await Promise.all(promises);
        courseDataDispatch({
          type: courseDataAction.SET_LEVELS,
          payload: result,
        });
      } catch (error) {
        console.error('Error fetching levels', error);
        return;
      }
    };

    const fetchUnsuspendedLevels = async () => {
      try {
        const promises = courseDataState.units.map(async (unit) => {
          try {
            const levelsData = await getUnsuspendedLevelsData(unit._id);
            return { fatherId: unit._id, data: levelsData };
          } catch (error) {
            console.error('Error fetching levels for unit:', unit._id, error);
            return { fatherId: unit._id, data: [] };
          }
        });
        const result = await Promise.all(promises);
        courseDataDispatch({
          type: courseDataAction.SET_UNSUSPENDED_LEVELS,
          payload: result,
        });
      } catch (error) {
        console.error('Error fetching levels', error);
        return;
      }
    };
    if (courseDataState.units !== undefined) {
      console.log('check', courseDataState.units);
      if (courseDataState.units.length > 0) {
        fetchLevels();
        fetchUnsuspendedLevels();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseDataState.units]);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const levelsIds = courseDataState.levels
          .flatMap((level) => level.data)
          .map((data) => data._id);
        console.log('levelsIds', levelsIds);
        const promises = levelsIds.map(async (levelId) => {
          try {
            console.log('getLessonsData - levelId', levelId);
            const lessonsData = await getLessonsData(levelId);
            return { fatherId: levelId, data: lessonsData };
          } catch (error) {
            console.error('Error fetching lessons for level:', levelId, error);
            return { fatherId: levelId, data: [] };
          }
        });

        const result = await Promise.all(promises);
        courseDataDispatch({
          type: courseDataAction.SET_LESSONS,
          payload: result,
        });
      } catch (error) {
        console.error('Error fetching lessons', error);
        return [];
      }
    };

    const fetchUnsuspendedLessons = async () => {
      try {
        const levelsIds = courseDataState.levels
          .flatMap((level) => level.data)
          .map((data) => data._id);
        console.log('levelsIds', levelsIds);
        const promises = levelsIds.map(async (levelId) => {
          try {
            console.log('getLessonsData - levelId', levelId);
            const lessonsData = await getUnsuspendedLessonsData(levelId);
            return { fatherId: levelId, data: lessonsData };
          } catch (error) {
            console.error('Error fetching lessons for level:', levelId, error);
            return { fatherId: levelId, data: [] };
          }
        });

        const result = await Promise.all(promises);
        courseDataDispatch({
          type: courseDataAction.SET_UNSUSPENDED_LESSONS,
          payload: result,
        });
      } catch (error) {
        console.error('Error fetching lessons', error);
        return [];
      }
    };

    if (
      !!courseDataState.levels &&
      courseDataState.levels.length > 0 &&
      !!courseDataState.levels[0].fatherId
    ) {
      fetchLessons();
      fetchUnsuspendedLessons();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseDataState.levels]);

  //Unsuspended
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const lessons = courseDataState.lessons.flatMap(
          (lesson) => lesson.data
        );
        console.log('fetchExercises', courseDataState.lessons, lessons);
        const promises = lessons.map(async (lesson) => {
          try {
            const exercisesData = await getExercisesData(lesson._id);
            return { fatherId: lesson._id, data: exercisesData };
          } catch (error) {
            console.error('Error fetching fsas for lesson:', lesson._id, error);
            return { fatherId: lesson._id, data: [] };
          }
        });

        const result = await Promise.all(promises);
        courseDataDispatch({
          type: courseDataAction.SET_EXERCISES,
          payload: result.flat(),
        });
      } catch (error) {
        console.error('Error fetching fsas', error);
        return [];
      }
    };

    const fetchUnsuspendedExercises = async () => {
      try {
        const lessons = courseDataState.lessons.flatMap(
          (lesson) => lesson.data
        );
        console.log(
          'fetchUnsuspendedExercises',
          courseDataState.lessons,
          lessons
        );
        const promises = lessons.map(async (lesson) => {
          try {
            const exercisesData = await getUnsuspendedExercisesData(lesson._id);
            return { fatherId: lesson._id, data: exercisesData };
          } catch (error) {
            console.error('Error fetching fsas for lesson:', lesson._id, error);
            return { fatherId: lesson._id, data: [] };
          }
        });

        const result = await Promise.all(promises);
        courseDataDispatch({
          type: courseDataAction.SET_EXERCISES,
          payload: result.flat(),
        });
      } catch (error) {
        console.error('Error fetching Unsuspended fsas', error);
        return [];
      }
    };

    const fetchResuls = async () => {
      try {
        if (!!userId) {
          const lessons = courseDataState.lessons.flatMap(
            (lesson) => lesson.data
          );
          console.log(
            'fetchUnsuspendedExercises',
            courseDataState.lessons,
            lessons
          );

          const promises = lessons.map(async (lesson) => {
            try {
              const resultsData = await getResultsByLessonAndUser(
                lesson._id,
                userId
              );
              return {
                lessonId: lesson._id,
                results: {
                  numOfExercises: lesson.exercises.length,
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
                  numOfExercises: lesson.exercises.length,
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
    };
    if (
      !!courseDataState.lessons &&
      courseDataState.lessons.length > 0 &&
      !!courseDataState.lessons[0].fatherId
    ) {
      fetchExercises();
      fetchUnsuspendedExercises();
      userId ? fetchResuls() : null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseDataState.lessons]);
};

export default useCourseData;