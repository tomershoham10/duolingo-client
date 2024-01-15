import { useEffect, useState } from 'react';
import useStore from '@/app/store/useStore';
import {
  useCourseStore,
} from '@/app/store/stores/useCourseStore';
import {
  CoursesType,
  getCourseByType,
  getUnitsData,
} from '@/app/API/classes-service/courses/functions';
import {
  UnitType,
  getLevelsData,
} from '@/app/API/classes-service/units/functions';
import {
  LevelType,
  getLessonsData,
} from '@/app/API/classes-service/levels/functions';
import {
  LessonType,
  getExercisesData,
} from '@/app/API/classes-service/lessons/functions';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faBook,
  faChevronDown,
  faPenToSquare,
  faStar,
} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import Button, { Color } from '../../Button/page';
import {
  fieldToEditType,
  useInfoBarStore,
} from '@/app/store/stores/useInfoBarStore';
import { usePathname } from 'next/navigation';
import { FSAType } from '@/app/API/classes-service/exercises/FSA/functions';

library.add(faBook, faChevronDown, faPenToSquare, faStar);

const AdminUnit: React.FC = () => {
  const pathname = usePathname();

  const [course, setCourse] = useState<CoursesType | undefined>();

  const updateFieldToEdit = useInfoBarStore.getState().updateFieldToEdit;
  const updateFieldId = useInfoBarStore.getState().updateFieldId;

  const [units, setUnits] = useState<UnitType[]>([]);
  const [levels, setLevels] = useState<
    { unitId: string; levels: LevelType[] }[]
  >([]);
  const [lessons, setLessons] = useState<
    { levelId: string; lessons: LessonType[] }[]
  >([]);
  const [exercises, setExercises] = useState<
    { lessonId: string; exercises: FSAType[] }[]
  >([]);
  const [exerciseAccordion, setExerciseAccordion] = useState<string[]>([]);

  useEffect(() => {
    if (pathname.includes('searider')) {
      courseType = TypesOfCourses.SEARIDER;
    } else if (pathname.includes('senior')) {
      courseType = TypesOfCourses.SENIOR;
    }
    const fetchData = async () => {
      const response = await getCourseByName(courseType);
      if (response) {
        setCourse(response);
      }
    };
    fetchData();
  }, [pathname]);

  useEffect(() => {
    const fetchData = async () => {
      if (course?._id) {
        const response = await getUnitsData(course?._id);
        if (response) {
          // console.log("getUnitsData", response);
          setUnits(response);
        }
      }
    };
    fetchData();
  }, [course]);

  useEffect(() => {
    const fetchData = async () => {
      if (course) {
        const response = await getUnitsData(course._id);
        setUnits(response);
      }
    };
    fetchData();
  }, [course]);

  useEffect(() => {
    const fetchLevels = async () => {
      const promises = units.map(async (unit) => {
        // await getLevelsData(unit._id, setLevels);
        const levelsData = await getLevelsData(unit._id);
        return { unitId: unit._id, levels: levelsData };
      });
      const result = await Promise.all(promises);
      setLevels(result);
    };
    if (units.length > 0) {
      fetchLevels();
    }
  }, [units]);

  useEffect(() => {
    const fetchLessons = async () => {
      const allLevels: { levelId: string; lessons: LessonType[] }[] = [];
      levels.forEach((levelObject) => {
        levelObject.levels.forEach((level) => {
          allLevels.push({ levelId: level._id, lessons: [] });
        });
      });
      const promises = allLevels.map(async (level) => {
        const lessonsData = await getLessonsData(level.levelId);
        lessonsData ? (level.lessons = lessonsData) : (level.lessons = []);
        return level;
      });

      const result = await Promise.all(promises);
      setLessons(result);
    };

    if (levels.length > 0) {
      fetchLessons();
    }
  }, [levels]);

  useEffect(() => {
    const fetchExercises = async () => {
      const allLessons = lessons.reduce(
        (acc, cur) => acc.concat(cur.lessons),
        [] as LessonType[]
      );

      const promises = allLessons.map(async (lesson) => {
        const exercisesData = await getExercisesData(lesson._id);
        return { lessonId: lesson._id, exercises: exercisesData || [] };
        // Use exercisesData || [] to handle null case and ensure exercises is always an array
      });

      const result = await Promise.all(promises);
      setExercises(result);
    };

    if (lessons.length > 0) {
      fetchExercises();
    }
  }, [lessons]);

  useEffect(() => {
    console.log('units', units);
  }, [units]);

  useEffect(() => {
    console.log('levels', levels);
  }, [levels]);

  useEffect(() => {
    console.log('lessons', lessons);
  }, [lessons]);

  useEffect(() => {
    console.log('exercises', exercises);
  }, [exercises]);

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
        {units && units.length > 0 ? (
          units.map((unit, unitIndex) => (
            <div key={unitIndex} className='flex-none py-[2rem]'>
              <div className='flex-col'>
                <div className='grid-col-3 dark:bg-duoGrayDark-dark grid h-[6.5rem] max-h-[6.5rem] min-h-[6.5rem] w-full grid-flow-col grid-rows-2 items-center justify-between rounded-t-lg bg-duoGreen-default py-3 pl-4 text-white sm:h-fit'>
                  <button
                    className='col-span-1 flex-none cursor-pointer items-center justify-start text-xl font-extrabold'
                    onClick={() => {
                      updateFieldToEdit(fieldToEditType.UNIT);
                      updateFieldId(unit._id);
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
                          color={Color.WHITE}
                        />
                      </div>
                    )}
                  </div>
                  {/* <button className="top-0 right-0 mx-3 h-fit">
                                        <FontAwesomeIcon icon={faPenToSquare} />
                                    </button> */}
                </div>
                <div className='flex flex-col'>
                  {levels && levels.length > 0
                    ? levels.map((levelsObject, levelsObjectIndex) => (
                        <div key={levelsObjectIndex} className='flex-none'>
                          {levelsObject.unitId === unit._id ? (
                            <div className='flex flex-col'>
                              {levelsObject.levels.length > 0
                                ? levelsObject.levels.map(
                                    (level, levelIndex) => (
                                      <div
                                        key={levelIndex}
                                        className={
                                          levelIndex === levels.length
                                            ? 'dark:border-duoGrayDark-dark flex h-fit flex-col rounded-b-lg border-2 border-t-0 border-duoGray-light px-6 py-3'
                                            : 'dark:border-duoGrayDark-dark flex h-fit flex-col border-2 border-t-0 border-duoGray-light px-6 py-3'
                                        }
                                      >
                                        <div className='w-full'>
                                          {lessons && lessons.length > 0
                                            ? lessons.map(
                                                (
                                                  lessonsObject,
                                                  lessonsObjectIndex
                                                ) => (
                                                  <div key={lessonsObjectIndex}>
                                                    {lessonsObject.levelId ===
                                                    level._id ? (
                                                      <div className='divide-y-2 divide-duoGray-hover'>
                                                        {lessonsObject.lessons
                                                          .length > 0
                                                          ? lessonsObject.lessons.map(
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
                                                                    <span className='dark:text-duoGrayDark-lightest w-full font-extrabold text-duoGray-dark'>
                                                                      LESSON
                                                                      {' - '}
                                                                      {
                                                                        lesson.name
                                                                      }
                                                                    </span>
                                                                    <div className='flex w-full flex-col'>
                                                                      {exercises &&
                                                                      exercises.length >
                                                                        0
                                                                        ? exercises.map(
                                                                            (
                                                                              exerciseObject,
                                                                              exerciseObjectIndex
                                                                            ) => (
                                                                              <div
                                                                                key={
                                                                                  exerciseObjectIndex
                                                                                }
                                                                                className='dark:divide-duoGrayDark-light w-full divide-y-2'
                                                                              >
                                                                                {exerciseObject.lessonId ===
                                                                                lesson._id
                                                                                  ? exerciseObject
                                                                                      .exercises
                                                                                      .length >
                                                                                    0
                                                                                    ? exerciseObject.exercises.map(
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
                                                                                                    {
                                                                                                      exercise.difficultyLevel
                                                                                                    }
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
                                                                                                  {/* <span className='font-bold'>
                                                                                                    firstTimeBuffer
                                                                                                  </span>
                                                                                                  <span>
                                                                                                    {
                                                                                                      exercise.firstTimeBuffer
                                                                                                    }{' '}
                                                                                                    minutes
                                                                                                  </span>
                                                                                                </div>
                                                                                                <div className='flex flex-col'>
                                                                                                  <span className='font-bold'>
                                                                                                    secondTimeBuffer
                                                                                                  </span>
                                                                                                  <span>
                                                                                                    {
                                                                                                      exercise.secondTimeBuffer
                                                                                                    }{' '}
                                                                                                    minutes
                                                                                                  </span> */}
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
                      ))
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
