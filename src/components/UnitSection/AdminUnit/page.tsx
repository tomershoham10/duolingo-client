import { useEffect, useReducer, useState } from 'react';
import useStore from '@/app/store/useStore';

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
import {
  fieldToEditType,
  useInfoBarStore,
} from '@/app/store/stores/useInfoBarStore';
import {
  DataWithFatherId,
  courseDataAction,
  courseDataReducer,
} from '@/reducers/courseDataReducer';
import { AlertSizes, useAlertStore } from '@/app/store/stores/useAlertStore';
import useCourseData from '@/app/utils/hooks/useCourseData';
import { useTargetStore } from '@/app/store/stores/useTargetStore';
import LodingAdminSection from './LodingAdminSection/page';

library.add(faBook, faChevronDown, faPenToSquare, faStar);

interface AdminUnitProps {
  courseId: string;
}

const AdminUnit: React.FC<AdminUnitProps> = (props) => {
  const propsCourseId = props.courseId;

  const addAlert = useAlertStore.getState().addAlert;
  const targetsList = useStore(useTargetStore, (state) => state.targets);

  const infoBarStore = {
    fieldId: useInfoBarStore.getState().syllabusFieldId,

    updateFieldType: useInfoBarStore.getState().updatesyllabusFieldType,
    updateFieldId: useInfoBarStore.getState().updateSyllabusFieldId,
    updateFieldIndex: useInfoBarStore.getState().updateSyllabusFieldIndex,
    updateFieldSubIdsList:
      useInfoBarStore.getState().updateSyllabusSubIdsListField,
    updateFieldFatherIndex:
      useInfoBarStore.getState().updateSyllabusFieldFatherIndex,
    updateIsFieldSuspended:
      useInfoBarStore.getState().updateSyllabusIsFieldSuspended,
  };

  useEffect(() => {
    console.log('infoBarStore.fieldId', infoBarStore.fieldId);
  }, [infoBarStore.fieldId]);

  const initialCourseDataState = {
    courseId: propsCourseId,
    units: [],
    unsuspendedUnits: [],
    levels: [{ fatherId: undefined, data: [] }],
    unsuspendedLevels: [{ fatherId: undefined, data: [] }],
    lessons: [{ fatherId: undefined, data: [] }],
    unsuspendedLessons: [{ fatherId: undefined, data: [] }],
    exercises: [{ fatherId: undefined, data: [] }],
    unsuspendedExercises: [{ fatherId: undefined, data: [] }],
    results: [],
  };

  const [courseDataState, courseDataDispatch] = useReducer(
    courseDataReducer,
    initialCourseDataState
  );

  useCourseData(undefined, courseDataState, courseDataDispatch);

  const [exerciseAccordion, setExerciseAccordion] = useState<string[]>([]);

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

  const isIdInDataWithFatherIdObj = (
    id: string,
    obj: DataWithFatherId<LevelType | LessonType | FSAType>[]
  ): boolean => {
    return obj.some((levelData) => {
      return levelData.data.some((doc) => doc._id === id);
    });
  };

  const updateInfobarData = (
    filedType: fieldToEditType,
    fieldId: string,
    fieldIndex: number,
    fatherId: string,
    isSuspended: boolean
  ) => {
    infoBarStore.updateFieldType(filedType);
    infoBarStore.updateFieldId(fieldId);
    infoBarStore.updateFieldIndex(fieldIndex);
    infoBarStore.updateFieldFatherIndex(fatherId);
    infoBarStore.updateIsFieldSuspended(isSuspended);
  };

  return (
    <div className='flex w-full'>
      <div className='mx-24 h-full w-full text-black'>
        {courseDataState.units && courseDataState.units.length > 0 ? (
          courseDataState.units.map((unit, unitIndex) => (
            <div
              key={unit._id}
              className={`flex-none py-[2rem] ${
                !courseDataState.unsuspendedUnits
                  .map((unit) => unit._id)
                  .includes(unit._id)
                  ? 'opacity-60'
                  : ''
              } `}
            >
              <div className='flex-col'>
                <div className='grid-col-3 grid h-[6.5rem] max-h-[6.5rem] min-h-[6.5rem] w-full grid-flow-col grid-rows-2 items-center justify-between rounded-t-lg bg-duoGreen-default py-3 pl-4 text-white dark:bg-duoGrayDark-dark sm:h-fit'>
                  <button
                    className='col-span-1 flex-none cursor-pointer items-center justify-start text-xl font-extrabold'
                    onClick={() => {
                      const isSuspended = !courseDataState.unsuspendedUnits
                        .map((unit) => unit._id)
                        .includes(unit._id);
                      updateInfobarData(
                        fieldToEditType.UNIT,
                        unit._id,
                        unitIndex,
                        propsCourseId,
                        isSuspended
                      );
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
                                          key={level._id}
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
                                                                      lesson._id
                                                                    }
                                                                    className='flex w-full flex-row pt-4 text-base font-medium'
                                                                  >
                                                                    <div
                                                                      className='h-12 w-12 flex-none cursor-pointer rounded-full bg-duoGreen-default font-extrabold text-white'
                                                                      onClick={() => {
                                                                        const isSuspended =
                                                                          !isIdInDataWithFatherIdObj(
                                                                            level._id,
                                                                            courseDataState.unsuspendedLevels
                                                                          );
                                                                        updateInfobarData(
                                                                          fieldToEditType.LEVEL,
                                                                          level._id,
                                                                          levelIndex,
                                                                          unit._id,
                                                                          isSuspended
                                                                        );
                                                                      }}
                                                                    >
                                                                      <div className='mx-auto my-auto flex h-full flex-col items-center justify-center'>
                                                                        <div className='mt-1 flex h-full flex-col items-center justify-center '>
                                                                          <FontAwesomeIcon
                                                                            icon={
                                                                              faStar
                                                                            }
                                                                            size='lg'
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
                                                                      <button
                                                                        className='text-conter flex w-full items-center justify-start font-extrabold text-duoGray-dark dark:text-duoGrayDark-lightest'
                                                                        onClick={() => {
                                                                          const isSuspended =
                                                                            !isIdInDataWithFatherIdObj(
                                                                              lesson._id,
                                                                              courseDataState.unsuspendedLessons
                                                                            );
                                                                          updateInfobarData(
                                                                            fieldToEditType.LESSON,
                                                                            lesson._id,
                                                                            lessonIndex,
                                                                            level._id,
                                                                            isSuspended
                                                                          );
                                                                        }}
                                                                      >
                                                                        <span>
                                                                          LESSON
                                                                          {
                                                                            ' - '
                                                                          }
                                                                          {
                                                                            lesson.name
                                                                          }
                                                                        </span>
                                                                      </button>
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
                                                                                                exercise._id
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
                                                                                                <div className='dark:text-duoGrayDark-lightest'>
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
                                                                                                      get
                                                                                                      from
                                                                                                      record
                                                                                                    </span>
                                                                                                  </div>
                                                                                                  {targetsList &&
                                                                                                  exercise.relevant !==
                                                                                                    undefined &&
                                                                                                  exercise
                                                                                                    .relevant
                                                                                                    .length >
                                                                                                    0 ? (
                                                                                                    <div className='flex flex-col'>
                                                                                                      <span className='text-lg font-extrabold'>
                                                                                                        relevant
                                                                                                      </span>
                                                                                                      <span>
                                                                                                        {
                                                                                                          targetsList.filter(
                                                                                                            (
                                                                                                              target
                                                                                                            ) =>
                                                                                                              exercise.relevant
                                                                                                                ? target._id ===
                                                                                                                  exercise
                                                                                                                    .relevant[0]
                                                                                                                : null
                                                                                                          )[0]
                                                                                                            .name
                                                                                                        }
                                                                                                      </span>
                                                                                                    </div>
                                                                                                  ) : null}
                                                                                                  {/* <div className='flex flex-col'>
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
                                                                                                  </div> */}
                                                                                                </div>
                                                                                              ) : (
                                                                                                <div className='my-1 flex h-fit w-full cursor-pointer items-center justify-between p-2 text-duoGray-darkest hover:rounded-md hover:bg-duoGray-lighter dark:text-duoGrayDark-lightest dark:hover:bg-duoGrayDark-dark'>
                                                                                                  <label className='cursor-pointer'>
                                                                                                    exercise
                                                                                                    #
                                                                                                    {exerciseIndex +
                                                                                                      1}
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
          <LodingAdminSection />
        )}
      </div>
    </div>
  );
};

export default AdminUnit;
