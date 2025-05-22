'use client';
import { useCallback, useEffect, useReducer, useRef } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import { useUserStore } from '@/app/store/stores/useUserStore';
import { useStore } from 'zustand';
import LessonButton, { Status } from '../../LessonButton/page';
import { possitionByModularAddition } from '@/app/_utils/functions/possitionByModularAddition';
import Tooltip, { TooltipColors } from '../../Tooltip/page';
import { PopupsTypes, usePopupStore } from '@/app/store/stores/usePopupStore';
import StartLessonPopup from '@/app/(popups)/StartLessonPopup/page';
import {
  studentDashboardAction,
  studentDashboardReducer,
} from '@/reducers/studentView/studentDashboardReducer';
import {
  CourseDataActionsList,
  courseDataReducer,
} from '@/reducers/courseDataReducer';
import useCourseData from '@/app/_utils/hooks/useCourseData';

library.add(faBook);

const StudentUnitSection: React.FC = () => {
  const userId = useStore(useUserStore, (state) => state.userId);
  const nextLessonId = useStore(useUserStore, (state) => state.nextLessonId);
  const courseId = useStore(useUserStore, (state) => state.courseId);
  const updateSelectedPopup = usePopupStore.getState().updateSelectedPopup;

  const initialCourseDataState = {
    courseId: null,
    units: [],
    suspendedUnitsIds: [],
    levels: [{ fatherId: null, data: [] }],
    lessons: [{ fatherId: null, data: [] }],
    exercises: [{ fatherId: null, data: [] }],
    results: [],
  };

  const [courseDataState, courseDataDispatch] = useReducer(
    courseDataReducer,
    initialCourseDataState
  );

  useEffect(() => {
    if (courseId) {
      courseDataDispatch({
        type: CourseDataActionsList.SET_COURSE_ID,
        payload: courseId,
      });
    }
  }, [courseId]);

  useCourseData(userId, courseDataState, courseDataDispatch);

  useEffect(() => {
    console.log('courseDataState', courseDataState);
  }, [courseDataState]);

  const initialStudentDashboardState = {
    currentLevelId: undefined,
    currentUnitId: undefined,
    lockedLessons: [],
    lockedLevelsIds: [],
    finisedLevelsIds: [],
    numOfLessonsMade: 0,
    isNextLessonPopupVisible: false,
  };

  const [studentDashboardState, studentDashboardDispatch] = useReducer(
    studentDashboardReducer,
    initialStudentDashboardState
  );
  useEffect(() => {
    console.log('studentDashboardState', studentDashboardState);
  }, [studentDashboardState]);

  const startLessonRef = useRef<HTMLDivElement>(null);
  const levelButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (courseDataState.results && courseDataState.results.length > 0) {
      console.log('courseDataState.results', courseDataState.results);
      for (const result of courseDataState.results) {
        let numOfResultsInCurrentLesson = result.results.results.length;

        const numOfExercisesInCurrentLesson = result.results.numOfExercises;

        for (const res of result.results.results) {

          // res.score = -1 means that the user started the exercise but hasnt finished it yet
          // means he still needs to complete the lesson even though he started it
          if (res.score === -1) {
            numOfResultsInCurrentLesson = numOfResultsInCurrentLesson - 1;
          }
        }

        if (
          nextLessonId !== result.lessonId &&
          numOfExercisesInCurrentLesson > numOfResultsInCurrentLesson &&
          !studentDashboardState.lockedLessons.includes(
            result.lessonId
          )
        ) {
          console.log('ADD_LOCKED_LESSON', result.lessonId);
          studentDashboardDispatch({
            type: studentDashboardAction.ADD_LOCKED_LESSON,
            payload: result.lessonId,
          });
        }
      }
    }
  }, [
    courseDataState.results,
    nextLessonId,
    studentDashboardState.lockedLessons,
  ]);

  useEffect(() => {
    if (nextLessonId && courseDataState.lessons) {
      console.log('current level id 1', nextLessonId, courseDataState);
      for (const lesson of courseDataState.lessons) {
        const lessonsIds = lesson.data.map((lesson) => lesson._id);

        console.log(
          'current level id 2',
          courseDataState.lessons,
          lessonsIds,
          nextLessonId
        );
        if (lessonsIds.includes(nextLessonId)) {
          studentDashboardDispatch({
            type: studentDashboardAction.SET_CURRENT_LEVEL_ID,
            payload: lesson.fatherId || '',
          });
          return;
        }
      }
    }
  }, [nextLessonId, courseDataState.lessons, courseDataState]);

  useEffect(() => {
    console.log('studentDashboardState', studentDashboardState);
    if (studentDashboardState.currentLevelId && courseDataState.units) {
      for (const unit of courseDataState.units) {
        const levelsIds = unit.levelsIds;
        if (
          levelsIds &&
          levelsIds.includes(studentDashboardState.currentLevelId)
        ) {
          studentDashboardDispatch({
            type: studentDashboardAction.SET_CURRENT_UNIT_ID,
            payload: unit._id,
          });
          const finisedLevels = levelsIds.slice(
            0,
            levelsIds.indexOf(studentDashboardState.currentLevelId)
          );

          console.log('finisedLevels1', levelsIds, finisedLevels);

          for (const finishedLevelId of finisedLevels) {
            if (!studentDashboardState.finisedLevelsIds.includes(finishedLevelId)) {
              studentDashboardDispatch({
                type: studentDashboardAction.ADD_FINISHED_LEVEL_ID,
                payload: finishedLevelId,
              });
            }
          }

          let lockedLevels: string[];
          if (
            levelsIds.indexOf(studentDashboardState.currentLevelId) + 1 ===
            levelsIds.length
          ) {
            lockedLevels = [
              levelsIds[
              levelsIds.indexOf(studentDashboardState.currentLevelId) + 1
              ],
            ];
          } else {
            lockedLevels = levelsIds.slice(
              levelsIds.indexOf(studentDashboardState.currentLevelId) + 1
            );
          }
          console.log('lockedLevels1', lockedLevels);

          // add the current level to the locked levels
          for (const lockedLevel of lockedLevels) {
            if (!studentDashboardState.lockedLevelsIds.includes(lockedLevel)) {
              studentDashboardDispatch({
                type: studentDashboardAction.ADD_LOCKED_LEVEL,
                payload: lockedLevel,
              });
            }
          }
        }
      }
    }
  }, [
    studentDashboardState.currentLevelId,
    courseDataState.units,
  ]);

  useEffect(() => {
    if (studentDashboardState.currentUnitId && courseDataState.units) {
      const unitsIds = courseDataState.units.map((unit) => unit._id);
      const activeUnitIndex = unitsIds.indexOf(
        studentDashboardState.currentUnitId
      );
      const finisedUnits = unitsIds.slice(0, activeUnitIndex);
      const lockedUnits = unitsIds.slice(activeUnitIndex + 1);
      console.log('activeUnitIndex', activeUnitIndex);

      for (const fUnit of finisedUnits) {
        const finishedUnit = courseDataState.units.filter((unit) => unit._id === fUnit)[0];
        const finishedLevels = finishedUnit.levelsIds;
        if (finishedLevels) {
          for (const finishedLevel of finishedLevels) {
            if (!studentDashboardState.finisedLevelsIds.includes(finishedLevel)) {
              studentDashboardDispatch({
                type: studentDashboardAction.ADD_FINISHED_LEVEL_ID,
                payload: finishedLevel,
              });
            }
          }
        }
      }

      for (const lUnit of lockedUnits) {
        const lockedUnit = courseDataState.units.filter((unit) => unit._id === lUnit)[0];
        const lockedLevels = lockedUnit.levelsIds;
        if (lockedLevels) {
          for (const lockedLevel of lockedLevels) {
            if (!lockedLevels.includes(lockedLevel)) {
              studentDashboardDispatch({
                type: studentDashboardAction.ADD_LOCKED_LEVEL,
                payload: lockedLevel,
              });
            }
          }
        }
      }

    }
  }, [
    studentDashboardState.currentUnitId,
    courseDataState.units,
    studentDashboardState.finisedLevelsIds,
  ]);

  useEffect(() => {
    if (studentDashboardState.currentLevelId && nextLessonId) {
      const currentLevelLessons = courseDataState.lessons.find(
        (lessons) => lessons.fatherId === studentDashboardState.currentLevelId
      );
      if (currentLevelLessons !== undefined) {
        const lessonsIds = currentLevelLessons.data.map((lesson) => lesson._id);
        console.log('index', lessonsIds, nextLessonId);
        studentDashboardDispatch({
          type: studentDashboardAction.SET_NUM_OF_LESSONS_MADE,
          payload: lessonsIds.indexOf(nextLessonId),
        });
      }
    }
  }, [
    studentDashboardState.currentLevelId,
    nextLessonId,
    courseDataState.lessons,
  ]);

  useEffect(() => {
    console.log(
      'studentDashboardState.lockedLevelsIds',
      studentDashboardState.lockedLevelsIds
    );
  }, [studentDashboardState.lockedLevelsIds]);

  useEffect(() => {
    console.log('finisedLevelsIds', studentDashboardState.finisedLevelsIds);
  }, [studentDashboardState.finisedLevelsIds]);

  useEffect(() => {
    console.log('nextLessonId', nextLessonId);
  }, [nextLessonId]);

  const handleOutsideClick = useCallback(
    (event: MouseEvent) => {
      if (
        startLessonRef.current &&
        !startLessonRef.current.contains(event.target as Node) &&
        levelButtonRef.current &&
        !levelButtonRef.current.contains(event.target as Node)
      ) {
        // console.log("handleOutsideClick");
        studentDashboardDispatch({
          type: studentDashboardAction.SET_IS_NEXT_LESSON_POPUP_VISIBLE,
          payload: false,
        });
        updateSelectedPopup(PopupsTypes.CLOSED);
      }
    },
    [levelButtonRef, startLessonRef, updateSelectedPopup]
  );

  useEffect(() => {
    // console.log("isNextLessonPopupVisible", isNextLessonPopupVisible);
    if (studentDashboardState.isNextLessonPopupVisible) {
      document.addEventListener('mousedown', handleOutsideClick);
      updateSelectedPopup(PopupsTypes.START_LESSON);
    } else {
      // console.log("check1");
      document.removeEventListener('mousedown', handleOutsideClick);
      updateSelectedPopup(PopupsTypes.CLOSED);
    }
    return () => {
      // console.log("check2");
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [
    handleOutsideClick,
    studentDashboardState.isNextLessonPopupVisible,
    updateSelectedPopup,
  ]);

  return (
    <div className='flex h-full w-full flex-col items-center justify-center px-3 py-6'>
      <div className='relative mx-auto flex h-full w-[40rem] flex-wrap 2xl:w-[50rem]'>
        {courseDataState.units
          ? courseDataState.units.length > 0
            ? courseDataState.units.map((unit, unitIndex) => (
              <div
                key={unit._id}
                className='basis-full items-center justify-center'
              >
                <section
                  key={unit._id}
                  className='absolute inset-x-0 top-0 h-full'
                >
                  <div className='grid-col-3 mx-auto grid h-[7rem] w-[38rem] grid-flow-col grid-rows-2 rounded-xl bg-duoGreen-default text-white'>
                    <label className='col-span-2 flex items-center justify-start pl-4 pt-4 text-2xl font-extrabold'>
                      Unit {unitIndex + 1}
                    </label>
                    {unit.description ? (
                      <label className='col-span-2 flex items-center justify-start px-4 pb-3'>
                        {unit.description}
                      </label>
                    ) : null}
                    <div className='row-span-2 mr-4 flex cursor-pointer items-center justify-end'>
                      <button className='hover:border-duoGreen-borderHover flex w-40 flex-row items-center justify-start rounded-2xl border-[2.5px] border-b-[4px] border-duoGreen-darker bg-duoGreen-button p-3 text-sm font-bold hover:bg-duoGreen-default hover:text-duoGreen-textHover active:border-[2.5px]'>
                        <FontAwesomeIcon
                          className='ml-2 mr-2 h-6 w-6'
                          icon={faBook}
                        />
                        <label className='text-md cursor-pointer items-center justify-center text-center font-extrabold'>
                          GUIDEBOOK
                        </label>
                      </button>
                    </div>
                  </div>
                  <div className='h-full basis-full'>
                    {courseDataState.levels &&
                      courseDataState.levels.length > 0
                      ? courseDataState.levels.map(
                        (levelsObject, levelsObjectIndex) => (
                          <div key={levelsObjectIndex} className='h-full'>
                            {courseDataState.levels.length === 1 ||
                              (studentDashboardState.lockedLevelsIds.length >
                                0 &&
                                levelsObject.childId === unit._id) ? (
                              <div className='my-6 flex h-full flex-col items-center'>
                                {levelsObject.data.length > 0
                                  ? levelsObject.data.map(
                                    (level, levelIndex) => (
                                      <section key={level._id}>
                                        {level &&
                                          level.lessonsIds &&
                                          level.lessonsIds.length > 0 ? (
                                          studentDashboardState.lockedLevelsIds.includes(
                                            level._id
                                          ) ? (
                                            <div
                                              className={`relative flex ${possitionByModularAddition(
                                                levelIndex
                                              )} mt-2 h-fit w-fit`}
                                            >
                                              <LessonButton
                                                status={Status.LOCKED}
                                              />
                                            </div>
                                          ) : studentDashboardState.finisedLevelsIds.includes(
                                            level._id
                                          ) ? (
                                            <div
                                              className={`relative flex ${possitionByModularAddition(
                                                levelIndex
                                              )} mt-2 h-fit w-fit`}
                                            >
                                              <LessonButton
                                                status={Status.DONE}
                                              />
                                            </div>
                                          ) : nextLessonId !==
                                            undefined ? (
                                            <div
                                              className={`relative flex ${possitionByModularAddition(
                                                levelIndex
                                              )} ${levelIndex === 0
                                                ? 'mt-10'
                                                : ''
                                                } h-fit w-fit`}
                                            >
                                              <>
                                                <section className='absolute left-1/2 z-50'>
                                                  <Tooltip
                                                    isFloating={true}
                                                    color={
                                                      TooltipColors.GREEN
                                                    }
                                                  />
                                                </section>
                                                <LessonButton
                                                  status={Status.PROGRESS}
                                                  numberOfLessonsMade={
                                                    studentDashboardState.numOfLessonsMade
                                                  }
                                                  numberOfTotalLessons={
                                                    level.lessonsIds
                                                      .length
                                                  }
                                                  onClick={() =>
                                                    studentDashboardDispatch(
                                                      {
                                                        type: studentDashboardAction.TOGGLE_IS_NEXT_LESSON_POPUP_VISIBLE,
                                                      }
                                                    )
                                                  }
                                                  buttonRef={
                                                    levelButtonRef
                                                  }
                                                />
                                                <StartLessonPopup
                                                  numberOfLessonsMade={
                                                    studentDashboardState.numOfLessonsMade +
                                                    1
                                                  }
                                                  numberOfTotalLessons={
                                                    level.lessonsIds
                                                      .length
                                                  }
                                                  nextLessonId={
                                                    nextLessonId
                                                  }
                                                  startLessonRef={
                                                    startLessonRef
                                                  }
                                                />
                                              </>
                                            </div>
                                          ) : null
                                        ) : null}
                                      </section>
                                    )
                                  )
                                  : null}
                              </div>
                            ) : (
                              <p>unit finished</p>
                            )}
                          </div>
                        )
                      )
                      : null}
                  </div>
                </section>
              </div>
            ))
            : null
          : null}
      </div>
    </div>
  );
};

export default StudentUnitSection;
