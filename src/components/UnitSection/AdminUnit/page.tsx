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
import useCourseData from '@/app/_utils/hooks/useCourseData';
import { useTargetStore } from '@/app/store/stores/useTargetStore';
import LodingAdminSection from './LodingAdminSection/page';
import AdminUnitHeader from './AdminUnitHeader/page';
import AdminUnitAccourdion from './AdminUnitAccourdion/page';

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
    suspendedUnitsIds: [],
    levels: [{ fatherId: null, data: [] }],
    // unsuspendedLevels: [{ fatherId: null, data: [] }],
    lessons: [{ fatherId: null, data: [] }],
    // unsuspendedLessons: [{ fatherId: null, data: [] }],
    exercises: [{ fatherId: null, data: [] }],
    // unsuspendedExercises: [{ fatherId: null, data: [] }],
    results: [],
  };

  const [courseDataState, courseDataDispatch] = useReducer(
    courseDataReducer,
    initialCourseDataState
  );

  useCourseData(undefined, courseDataState, courseDataDispatch);

  const [exerciseAccordion, setExerciseAccordion] = useState<string[]>([]);

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
    obj: DataWithFatherId<LevelType | LessonType | ExerciseType>[]
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
                courseDataState.suspendedUnitsIds.includes(unit._id)
                  ? 'opacity-60'
                  : ''
              } `}
            >
              <div className='flex-col'>
                <AdminUnitHeader
                  unit={unit}
                  unitIndex={unitIndex}
                  courseId={propsCourseId}
                  isSuspended={courseDataState.suspendedUnitsIds.includes(
                    unit._id
                  )}
                  updateInfobarData={updateInfobarData}
                />

                <div className='flex flex-col'>
                  {courseDataState.levels &&
                    courseDataState.levels.length > 0 &&
                    courseDataState.levels.map(
                      (levelsObject, levelsObjectIndex) => (
                        <div key={levelsObjectIndex} className='flex-none'>
                          {levelsObject.fatherId === unit._id && (
                            <div className='flex flex-col'>
                              {levelsObject.data.length > 0 &&
                                levelsObject.data.map((level, levelIndex) => (
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
                                        courseDataState.lessons.length > 0 &&
                                        courseDataState.lessons.map(
                                          (
                                            lessonsObject,
                                            lessonsObjectIndex
                                          ) => (
                                            <div key={lessonsObjectIndex}>
                                              {lessonsObject.fatherId ===
                                                level._id && (
                                                <div className='divide-y-2 divide-duoGray-hover'>
                                                  {lessonsObject.data.length >
                                                    0 &&
                                                    lessonsObject.data.map(
                                                      (lesson, lessonIndex) => (
                                                        <div
                                                          key={lesson._id}
                                                          className='flex w-full flex-row pt-4 text-base font-medium'
                                                        >
                                                          <div
                                                            className='h-12 w-12 flex-none cursor-pointer rounded-full bg-duoGreen-default font-extrabold text-white'
                                                            onClick={() => {
                                                              const isSuspended =
                                                                unit.suspendedLevelsIds.includes(
                                                                  level._id
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
                                                              <div className='mt-1 flex h-full flex-col items-center justify-center'>
                                                                <FontAwesomeIcon
                                                                  icon={faStar}
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
                                                                  level.suspendedLessonsIds.includes(
                                                                    lesson._id
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
                                                                {' - '}
                                                                {lesson.name}
                                                              </span>
                                                            </button>
                                                            <div className='flex w-full flex-col'>
                                                              {courseDataState.exercises &&
                                                                courseDataState
                                                                  .exercises
                                                                  .length > 0 &&
                                                                courseDataState.exercises.map(
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
                                                                        lesson._id &&
                                                                        exerciseObject
                                                                          .data
                                                                          .length >
                                                                          0 &&
                                                                        exerciseObject.data.map(
                                                                          (
                                                                            exercise,
                                                                            exerciseIndex
                                                                          ) => (
                                                                            <section
                                                                              key={
                                                                                exerciseIndex
                                                                              }
                                                                            >
                                                                              <AdminUnitAccourdion
                                                                                exercise={
                                                                                  exercise
                                                                                }
                                                                                exerciseIndex={
                                                                                  exerciseIndex
                                                                                }
                                                                                isOpen={exerciseAccordion.includes(
                                                                                  exercise._id
                                                                                )}
                                                                                targetsList={
                                                                                  targetsList
                                                                                }
                                                                                toggleAccordion={
                                                                                  toggleAccordion
                                                                                }
                                                                              />
                                                                            </section>
                                                                          )
                                                                        )}
                                                                    </div>
                                                                  )
                                                                )}
                                                            </div>
                                                          </div>
                                                        </div>
                                                      )
                                                    )}
                                                </div>
                                              )}
                                            </div>
                                          )
                                        )}
                                    </div>
                                  </div>
                                ))}
                            </div>
                          )}
                        </div>
                      )
                    )}
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
