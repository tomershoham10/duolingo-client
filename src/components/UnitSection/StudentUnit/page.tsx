'use client';
import { useEffect, useReducer, useRef } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import { useUserStore } from '@/app/store/stores/useUserStore';
import { useStore } from 'zustand';
import LessonButton, { Status } from '../../LessonButton/page';
import { possitionByModularAddition } from '@/app/utils/functions/possitionByModularAddition';
import Tooltip, { TooltipColors } from '../../Tooltip/page';
import { PopupsTypes, usePopupStore } from '@/app/store/stores/usePopupStore';
import StartLessonPopup from '@/app/_popups/StartLessonPopup/page';
import {
  studentDashboardAction,
  studentDashboardReducer,
} from '@/reducers/studentView/studentDashboardReducer';
import { courseDataReducer } from '@/reducers/courseDataReducer';
import useCourseData from '@/app/utils/hooks/useCourseData';
library.add(faBook);

const StudentUnitSection: React.FC = () => {
  const userStore = {
    userId: useStore(useUserStore, (state) => state.userId),
    nextLessonId: useStore(useUserStore, (state) => state.nextLessonId),
    courseId: useStore(useUserStore, (state) => state.courseId),
  };
  const updateSelectedPopup = usePopupStore.getState().updateSelectedPopup;

  const initialCourseDataState = {
    courseId: userStore.courseId,
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

  useCourseData(userStore.courseId, courseDataState, courseDataDispatch);

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
      for (let r: number = 0; r < courseDataState.results.length; r++) {
        let numOfResultsInCurrentLesson =
          courseDataState.results[r].results.results.length;

        const numOfExercisesInCurrentLesson =
          courseDataState.results[r].results.numOfExercises;

        for (
          let t: number = 0;
          t < courseDataState.results[r].results.results.length;
          t++
        ) {
          const res = courseDataState.results[r].results.results[t];

          // res.score = -1 means that the user started the exercise but hasnt finished it yet
          // means he still needs to complete the lesson even though he started it

          if (res.score === -1) {
            numOfResultsInCurrentLesson = numOfResultsInCurrentLesson - 1;
          }
        }
        if (
          userStore.nextLessonId !== courseDataState.results[r].lessonId &&
          numOfExercisesInCurrentLesson > numOfResultsInCurrentLesson &&
          !studentDashboardState.lockedLessons.includes(
            courseDataState.results[r].lessonId
          )
        ) {
          console.log('ADD_LOCKED_LESSON', courseDataState.results[r].lessonId);
          studentDashboardDispatch({
            type: studentDashboardAction.ADD_LOCKED_LESSON,
            payload: courseDataState.results[r].lessonId,
          });
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseDataState.results]);

  useEffect(() => {
    if (userStore.nextLessonId && courseDataState.lessons) {
      console.log('current level id 1');
      for (let i: number = 0; i < courseDataState.lessons.length; i++) {
        const lessonsIds = courseDataState.lessons[i].data.map(
          (lesson) => lesson._id
        );
        console.log('current level id 2', lessonsIds, userStore.nextLessonId);
        if (lessonsIds.includes(userStore.nextLessonId)) {
          console.log('current level id 3');
          studentDashboardDispatch({
            type: studentDashboardAction.SET_CURRENT_LEVEL_ID,
            payload: courseDataState.lessons[i].fatherId || '',
          });
          return;
        }
      }
    }
  }, [userStore.nextLessonId, courseDataState.lessons]);

  useEffect(() => {
    if (studentDashboardState.currentLevelId && courseDataState.units) {
      for (let i: number = 0; i < courseDataState.units.length; i++) {
        const levelsIds = courseDataState.units[i].levels;
        if (
          levelsIds &&
          levelsIds.includes(studentDashboardState.currentLevelId)
        ) {
          studentDashboardDispatch({
            type: studentDashboardAction.SET_CURRENT_UNIT_ID,
            payload: courseDataState.units[i]._id,
          });
          const finisedLevels = levelsIds.slice(
            0,
            levelsIds.indexOf(studentDashboardState.currentLevelId)
          );

          console.log('finisedLevels1', levelsIds, finisedLevels);
          for (let f: number = 0; f < finisedLevels.length; f++) {
            if (
              !studentDashboardState.finisedLevelsIds.includes(finisedLevels[f])
            ) {
              studentDashboardDispatch({
                type: studentDashboardAction.ADD_FINISHED_LEVEL_ID,
                payload: finisedLevels[f],
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

          for (let l: number = 0; l < lockedLevels.length; l++) {
            if (
              !studentDashboardState.lockedLevelsIds.includes(lockedLevels[l])
            ) {
              studentDashboardDispatch({
                type: studentDashboardAction.ADD_LOCKED_LEVEL,
                payload: lockedLevels[l],
              });
            }
          }
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentDashboardState.currentLevelId, courseDataState.units]);

  useEffect(() => {
    if (studentDashboardState.currentUnitId && courseDataState.units) {
      const unitsIds = courseDataState.units.map((unit) => unit._id);
      const activeUnitIndex = unitsIds.indexOf(
        studentDashboardState.currentUnitId
      );
      const finisedUnits = unitsIds.slice(0, activeUnitIndex);
      const lockedUnits = unitsIds.slice(activeUnitIndex + 1);
      console.log('activeUnitIndex', activeUnitIndex);

      for (let f: number = 0; f < finisedUnits.length; f++) {
        const finishedUnit = courseDataState.units.filter(
          (unit) => unit._id === finisedUnits[f]
        )[0];
        const finishedLevels = finishedUnit.levels;
        if (finishedLevels) {
          for (let fl: number = 0; fl < finishedLevels.length; fl++) {
            const finishedLevel = finishedLevels[fl];
            if (
              !studentDashboardState.finisedLevelsIds.includes(finishedLevel)
            ) {
              studentDashboardDispatch({
                type: studentDashboardAction.ADD_FINISHED_LEVEL_ID,
                payload: finishedLevel,
              });
            }
          }
        }
      }
      for (let l: number = 0; l < lockedUnits.length; l++) {
        const lockedUnit = courseDataState.units.filter(
          (unit) => unit._id === lockedUnits[l]
        )[0];
        const lockedLevels = lockedUnit.levels;
        if (lockedLevels) {
          for (let ll: number = 0; ll < lockedLevels.length; ll++) {
            const lockedLevel = lockedLevels[ll];
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentDashboardState.currentUnitId, courseDataState.units]);

  useEffect(() => {
    if (studentDashboardState.currentLevelId && userStore.nextLessonId) {
      //   const currentLevel = courseDataState.lessons.filter(
      //     (lessonObject) =>
      //       lessonObject.fatherId === studentDashboardState.currentLevelId
      //   )[0];
      const lessonsIds = courseDataState.lessons.flatMap((lesson) =>
        lesson.data.map((ls) => ls._id)
      );
      console.log(
        'index',
        lessonsIds,
        userStore.nextLessonId,
        lessonsIds.indexOf(userStore.nextLessonId)
      );
      studentDashboardDispatch({
        type: studentDashboardAction.SET_NUM_OF_LESSONS_MADE,
        payload: lessonsIds.indexOf(userStore.nextLessonId),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentDashboardState.currentLevelId, userStore.nextLessonId]);

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
    console.log('nextLessonId', userStore.nextLessonId);
  }, [userStore.nextLessonId]);

  const handleOutsideClick = (event: MouseEvent) => {
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
  };

  useEffect(() => {
    // console.log("isNextLessonPopupVisible", isNextLessonPopupVisible);
    if (studentDashboardState.isNextLessonPopupVisible) {
      document.addEventListener('mousedown', handleOutsideClick);
      updateSelectedPopup(PopupsTypes.STARTLESSON);
    } else {
      // console.log("check1");
      document.removeEventListener('mousedown', handleOutsideClick);
      updateSelectedPopup(PopupsTypes.CLOSED);
    }
    return () => {
      // console.log("check2");
      document.removeEventListener('mousedown', handleOutsideClick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentDashboardState.isNextLessonPopupVisible]);

  return (
    <div className='flex h-full w-full flex-col items-center justify-center px-3 py-6'>
      <div className='relative mx-auto  flex h-full w-[40rem] flex-wrap 2xl:w-[50rem]'>
        {courseDataState.units
          ? courseDataState.units.length > 0
            ? courseDataState.units.map((unit, unitIndex) => (
                <div
                  key={unit._id}
                  className='basis-full items-center justify-center'
                >
                  <section
                    key={unit._id}
                    className='absolute inset-x-0  top-0 h-full'
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
                              <div
                                key={levelsObject.fatherId}
                                className='h-full'
                              >
                                {courseDataState.levels.length === 1 ||
                                (studentDashboardState.lockedLevelsIds.length >
                                  0 &&
                                  levelsObject.fatherId === unit._id) ? (
                                  <div className='my-6 flex h-full flex-col items-center'>
                                    {levelsObject.data.length > 0
                                      ? levelsObject.data.map(
                                          (level, levelIndex) => (
                                            <section key={level._id}>
                                              {level &&
                                              level.lessons &&
                                              level.lessons?.length > 0 ? (
                                                studentDashboardState.lockedLevelsIds.includes(
                                                  level._id
                                                ) ? (
                                                  <div
                                                    className={`relative flex ${possitionByModularAddition(
                                                      levelIndex
                                                    )} mt-2 h-fit w-fit`}
                                                  >
                                                    <>
                                                      <LessonButton
                                                        status={Status.LOCKED}
                                                      />
                                                    </>
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
                                                ) : userStore.nextLessonId !==
                                                  undefined ? (
                                                  <div
                                                    className={`relative flex ${possitionByModularAddition(
                                                      levelIndex
                                                    )} ${
                                                      levelIndex === 0
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
                                                          level.lessons.length
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
                                                          level.lessons.length
                                                        }
                                                        nextLessonId={
                                                          userStore.nextLessonId
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
