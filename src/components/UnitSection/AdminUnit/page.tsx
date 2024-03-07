import { useEffect, useReducer, useState } from 'react';
import { usePathname } from 'next/navigation';
import useStore from '@/app/store/useStore';
import { useCourseStore } from '@/app/store/stores/useCourseStore';
import { getUnitsData } from '@/app/API/classes-service/courses/functions';
import { getLevelsData } from '@/app/API/classes-service/units/functions';
import { getLessonsData } from '@/app/API/classes-service/levels/functions';
import { getExercisesData } from '@/app/API/classes-service/lessons/functions';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faBook,
  faChevronDown,
  faPenToSquare,
  faStar,
} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import Button, { ButtonColors } from '../../Button/page';
import { useInfoBarStore } from '@/app/store/stores/useInfoBarStore';
import {
  courseDataAction,
  courseDataReducer,
} from '@/reducers/courseDataReducer';
import { AlertSizes, useAlertStore } from '@/app/store/stores/useAlertStore';

library.add(faBook, faChevronDown, faPenToSquare, faStar);

interface AdminUnitProps {
  courseId: string;
}

const AdminUnit: React.FC<AdminUnitProps> = (props) => {
  const propsCourseId = props.courseId;

  const addAlert = useAlertStore.getState().addAlert;

  const infoBarStore = {
    updateSyllabusFieldToEdit:
      useInfoBarStore.getState().updateSyllabusFieldToEdit,
    updateSyllabusFieldId: useInfoBarStore.getState().updateSyllabusFieldId,
  };

  const initialCourseDataState = {
    courseId: propsCourseId,
    units: [],
    levels: [{ fatherId: undefined, data: [] }],
    lessons: [{ fatherId: undefined, data: [] }],
    exercises: [{ fatherId: undefined, data: [] }],
  };

  const [courseDataState, courseDataDispatch] = useReducer(
    courseDataReducer,
    initialCourseDataState
  );

  const [exerciseAccordion, setExerciseAccordion] = useState<string[]>([]);

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
    fetchUnits();
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

    if (courseDataState.units.length > 0) {
      fetchLevels();
    }
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

    if (
      courseDataState.levels.length > 0 &&
      !!courseDataState.levels[0].fatherId
    ) {
      fetchLessons();
    }
  }, [courseDataState.levels]);

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
        console.error('Error fetching lessons', error);
        return [];
      }
    };

    if (
      courseDataState.lessons.length > 0 &&
      !!courseDataState.lessons[0].fatherId
    ) {
      fetchExercises();
    }
  }, [courseDataState.lessons]);

  useEffect(() => {
    console.log('courseDataState.units', courseDataState.units);
  }, [courseDataState.units]);

  useEffect(() => {
    console.log('courseDataState.levels', courseDataState.levels);
  }, [courseDataState.levels]);

  useEffect(() => {
    console.log('courseDataState.lessons', courseDataState.lessons);
  }, [courseDataState.lessons]);

  useEffect(() => {
    console.log('courseDataState.exercises', courseDataState.exercises);
  }, [courseDataState.exercises]);

  useEffect(
    () => console.log('exerciseAccordion', exerciseAccordion),
    [exerciseAccordion]
  );

  const toggleAccordion = (exerciseId: string) => {
    exerciseAccordion.includes(exerciseId)
      ? setExerciseAccordion((pervExercises) =>
          pervExercises.filter((id) => {
            return id !== exerciseId;
          })
        )
      : setExerciseAccordion((pervExercises) => [...pervExercises, exerciseId]);
  };

  return (
    <div className='flex w-full'>
      <div className='mx-24 h-full w-full text-black'>
        {courseDataState.units && courseDataState.units.length > 0 ? (
          courseDataState.units.map((unit, unitIndex) => (
            <div key={unitIndex} className='flex-none py-[2rem]'>
              <div className='flex-col'>
                <div className='grid-col-3 grid h-[6.5rem] max-h-[6.5rem] min-h-[6.5rem] w-full grid-flow-col grid-rows-2 items-center justify-between rounded-t-lg bg-duoGreen-default py-3 pl-4 text-white dark:bg-duoGrayDark-dark sm:h-fit'>
                  <button
                    className='col-span-1 flex-none cursor-pointer items-center justify-start text-xl font-extrabold'
                    onClick={() => {
                      infoBarStore.updateSyllabusFieldToEdit(
                        fieldToEditType.UNIT
                      );
                      infoBarStore.updateSyllabusFieldId(unit._id);
                    }}
                  >
                    <label className='cursor-pointer'>
                      Unit {unitIndex + 1}
                    </label>
                  </button>
                  <label className='col-span-2 w-[90%] items-center justify-center font-semibold'>
                    {unit.description}
                  </label>
                  <div className='row-span-2 mr-5 flex items-start justify-end'>
                    {unit.guidebook ? (
                      <button className='flex w-40 cursor-pointer flex-row items-center justify-start rounded-2xl border-[2.5px] border-b-[4px] border-duoGreen-darker bg-duoGreen-button p-3 text-sm font-bold hover:border-duoGreen-dark hover:bg-duoGreen-default hover:text-duoGreen-textHover active:border-[2.5px]'>
                        <FontAwesomeIcon
                          className='ml-2 mr-2 h-6 w-6'
                          icon={faBook}
                        />
                        <Link href={''}>
                          <label className='cursor-pointer items-center justify-center text-center'>
                            GUIDEBOOK
                          </label>
                        </Link>
                      </button>
                    ) : (
                      <div className=''>
                        <Button
                          label={'CREATE GUIDEBOOK'}
                          color={ButtonColors.WHITE}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className='flex flex-col'>
                  {courseDataState.levels && courseDataState.levels.length > 0
                    ? courseDataState.levels.map(
                        (levelsObject, levelsObjectIndex) => (
                          <div key={levelsObjectIndex} className='flex-none'>
                            {levelsObject.fatherId === unit._id ? (
                              <div className='flex flex-col'>
                                {levelsObject.data.length > 0
                                  ? levelsObject.data.map(
                                      (level, levelIndex) => (
                                        <div
                                          key={levelIndex}
                                          className={
                                            levelIndex ===
                                            courseDataState.levels.length
                                              ? 'flex h-fit flex-col rounded-b-lg border-2 border-t-0 border-duoGray-light px-6 py-3 dark:border-duoGrayDark-dark'
                                              : 'flex h-fit flex-col border-2 border-t-0 border-duoGray-light px-6 py-3 dark:border-duoGrayDark-dark'
                                          }
                                        >
                                          <div className='w-full'>
                                            {courseDataState.lessons &&
                                            courseDataState.lessons.length > 0
                                              ? courseDataState.lessons.map(
                                                  (
                                                    lessonsObject,
                                                    lessonsObjectIndex
                                                  ) => (
                                                    <div
                                                      key={lessonsObjectIndex}
                                                    >
                                                      {lessonsObject.fatherId ===
                                                      level._id ? (
                                                        <div className='divide-y-2 divide-duoGray-hover'>
                                                          {lessonsObject.data
                                                            .length > 0
                                                            ? lessonsObject.data.map(
                                                                (
                                                                  lesson,
                                                                  lessonIndex
                                                                ) => (
                                                                  <div
                                                                    key={
                                                                      lessonIndex
                                                                    }
                                                                    className='2xl:1920px flex w-full flex-row pt-4 text-base font-medium'
                                                                  >
                                                                    <div className='h-12 w-12 flex-none rounded-full bg-duoGreen-default font-extrabold text-white'>
                                                                      <div className='mx-auto my-auto flex h-full flex-col items-center justify-center '>
                                                                        <div className='mt-1 flex h-full flex-col items-center justify-center'>
                                                                          <FontAwesomeIcon
                                                                            icon={
                                                                              faStar
                                                                            }
                                                                            size='lg'
                                                                            className=''
                                                                          />
                                                                          <span className='h-fit text-[11px]'>
                                                                            {levelIndex +
                                                                              1}
                                                                            -
                                                                            {lessonIndex +
                                                                              1}
                                                                          </span>
                                                                        </div>
                                                                      </div>
                                                                    </div>
                                                                    <div className='mx-6 w-full'>
                                                                      <span className='w-full font-extrabold text-duoGray-dark dark:text-duoGrayDark-lightest'>
                                                                        LESSON
                                                                        {' - '}
                                                                        {
                                                                          lesson.name
                                                                        }
                                                                      </span>
                                                                      <div className='flex w-full flex-col'>
                                                                        {courseDataState.exercises &&
                                                                        courseDataState
                                                                          .exercises
                                                                          .length >
                                                                          0
                                                                          ? courseDataState.exercises.map(
                                                                              (
                                                                                exerciseObject,
                                                                                exerciseObjectIndex
                                                                              ) => (
                                                                                <div
                                                                                  key={
                                                                                    exerciseObjectIndex
                                                                                  }
                                                                                  className='w-full divide-y-2 dark:divide-duoGrayDark-light'
                                                                                >
                                                                                  {exerciseObject.fatherId ===
                                                                                  lesson._id
                                                                                    ? exerciseObject
                                                                                        .data
                                                                                        .length >
                                                                                      0
                                                                                      ? exerciseObject.data.map(
                                                                                          (
                                                                                            exercise,
                                                                                            exerciseIndex
                                                                                          ) => (
                                                                                            <div
                                                                                              key={
                                                                                                exerciseIndex
                                                                                              }
                                                                                              className={`accordion-item flex w-full flex-col
                                                                                             ${
                                                                                               exerciseAccordion.includes(
                                                                                                 exercise._id
                                                                                               )
                                                                                                 ? 'open'
                                                                                                 : ''
                                                                                             }`}
                                                                                              onClick={() => {
                                                                                                toggleAccordion(
                                                                                                  exercise._id
                                                                                                );
                                                                                              }}
                                                                                            >
                                                                                              {exerciseAccordion.includes(
                                                                                                exercise._id
                                                                                              ) ? (
                                                                                                <div className=''>
                                                                                                  <span>
                                                                                                    EXERCISE
                                                                                                    ID
                                                                                                    :
                                                                                                    {
                                                                                                      exercise._id
                                                                                                    }
                                                                                                  </span>
                                                                                                  <div className='flex flex-col'>
                                                                                                    <span className='font-bold'>
                                                                                                      description
                                                                                                    </span>
                                                                                                    <span>
                                                                                                      {
                                                                                                        exercise.description
                                                                                                      }
                                                                                                    </span>
                                                                                                  </div>
                                                                                                  <div className='flex flex-col'>
                                                                                                    <span className='font-bold'>
                                                                                                      difficulty
                                                                                                      Level
                                                                                                    </span>
                                                                                                    <span>
                                                                                                      {/* {
                                                                                                        exercise.difficultyLevel
                                                                                                      } */}
                                                                                                      get from record
                                                                                                    </span>
                                                                                                  </div>
                                                                                                  <div className='flex flex-col'>
                                                                                                    <span className='font-bold'>
                                                                                                      relevant
                                                                                                    </span>
                                                                                                    <span>
                                                                                                      {
                                                                                                        exercise.relevant
                                                                                                      }
                                                                                                    </span>
                                                                                                  </div>
                                                                                                  <div className='flex flex-col'>
                                                                                                    {exercise.timeBuffers.map(
                                                                                                      (
                                                                                                        timeBuffer,
                                                                                                        timeBufferIndex
                                                                                                      ) => (
                                                                                                        <div
                                                                                                          key={
                                                                                                            timeBufferIndex
                                                                                                          }
                                                                                                        >
                                                                                                          {
                                                                                                            timeBuffer.timeBuffer
                                                                                                          }
                                                                                                        </div>
                                                                                                      )
                                                                                                    )}
                                                                                                  </div>
                                                                                                </div>
                                                                                              ) : (
                                                                                                <div className='my-1 flex h-fit w-full items-center justify-between p-2 text-duoGray-darkest hover:rounded-md hover:bg-duoGray-lighter'>
                                                                                                  <label>
                                                                                                    {
                                                                                                      exercise._id
                                                                                                    }
                                                                                                  </label>
                                                                                                  <FontAwesomeIcon
                                                                                                    icon={
                                                                                                      faChevronDown
                                                                                                    }
                                                                                                  />
                                                                                                </div>
                                                                                              )}
                                                                                            </div>
                                                                                          )
                                                                                        )
                                                                                      : null
                                                                                    : null}
                                                                                </div>
                                                                              )
                                                                            )
                                                                          : null}
                                                                      </div>
                                                                    </div>
                                                                  </div>
                                                                )
                                                              )
                                                            : null}
                                                        </div>
                                                      ) : null}
                                                    </div>
                                                  )
                                                )
                                              : null}
                                          </div>
                                        </div>
                                      )
                                    )
                                  : null}
                              </div>
                            ) : null}
                          </div>
                        )
                      )
                    : null}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>loading</div>
        )}
      </div>
    </div>
  );
};

export default AdminUnit;
