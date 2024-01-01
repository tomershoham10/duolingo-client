'use client';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import { useUserStore } from '@/app/store/stores/useUserStore';
import { useStore } from 'zustand';
import { useCourseStore } from '@/app/store/stores/useCourseStore';
import { useEffect, useRef, useState } from 'react';
import { getUnitsData } from '@/app/API/classes-service/courses/functions';
import {
  UnitType,
  getLevelsData,
} from '@/app/API/classes-service/units/functions';
import {
  LevelType,
  getLessonsData,
} from '@/app/API/classes-service/levels/functions';
import LessonButton, { Status } from '../../LessonButton/page';
import { possitionByModularAddition } from '@/app/utils/functions/possitionByModularAddition';
import Tooltip, { TooltipColors } from '../../Tooltip/page';
import {
  LessonType,
  ResultType,
  getResultsData,
} from '@/app/API/classes-service/lessons/functions';
import { PopupsTypes, usePopupStore } from '@/app/store/stores/usePopupStore';
import StartLessonPopup from '@/app/popups/StartLessonPopup/page';
library.add(faBook);

const UserUnitSection: React.FC = () => {
  const userId = useStore(useUserStore, (state) => state.userId);
  const nextLessonId = useStore(useUserStore, (state) => state.nextLessonId);
  const courseId = useStore(useCourseStore, (state) => state.courseId);

  const updateSelectedPopup = usePopupStore.getState().updateSelectedPopup;

  const [units, setUnits] = useState<UnitType[]>([]);
  const [levels, setLevels] = useState<
    { unitId: string; levels: LevelType[] }[]
  >([]);
  const [lessons, setLessons] = useState<
    { levelId: string; lessons: LessonType[] }[]
  >([]);

  type ResultsState = {
    lessonId: string;
    results: { numOfExercises: number; results: ResultType[] };
  }[];

  const [results, setResults] = useState<ResultsState>([]);

  const [currentLevelId, setCurrentLevelId] = useState<string>();
  const [currentUnitId, setCurrentUnitId] = useState<string>();

  const [lockedLessons, setLockedLessons] = useState<string[]>([]);
  const [lockedLevelsIds, setLockedLevelsIds] = useState<string[]>([]);
  const [finisedLevelsIds, setFinisedLevelsIds] = useState<string[]>([]);
  const [numOfLessonsMade, setNumOfLessonsMade] = useState<number>(0);
  const [isNextLessonPopupVisible, setIsNextLessonPopupVisible] =
    useState<boolean>(false);

  const startLessonRef = useRef<HTMLDivElement>(null);
  const levelButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (courseId) {
        const response = await getUnitsData(courseId);
        setUnits(response);
      }
    };
    fetchData();
  }, [courseId]);

  useEffect(() => {
    const fetchLevels = async () => {
      const promises = units.map(async (unit) => {
        const levelsData = await getLevelsData(unit._id);
        return { unitId: unit._id, levels: levelsData };
      });
      const response = await Promise.all(promises);
      setLevels(response);
    };
    if (units) {
      if (units.length > 0) {
        fetchLevels();
      }
    }
  }, [units]);

  useEffect(() => {
    const fetchLessons = async () => {
      const allLevels: { levelId: string; lessons: LessonType[] }[] = [];
      levels.forEach((unit) => {
        unit.levels?.forEach((level) => {
          allLevels.push({ levelId: level._id, lessons: [] });
        });
      });

      const promises = allLevels.map(async (level) => {
        const lessonsData = await getLessonsData(level.levelId);
        if (lessonsData) {
          level.lessons = lessonsData;
        }
        return level;
      });

      const response = await Promise.all(promises);
      setLessons(response);
    };

    if (levels.length > 0) {
      fetchLessons();
    }
  }, [levels]);

  useEffect(() => {
    const fetchResults = async () => {
      if (userId) {
        const allLessons = lessons.reduce(
          (acc, cur) => acc.concat(cur.lessons),
          [] as LessonType[]
        );
        const promises = allLessons.map(async (lesson) => {
          const resultsData = await getResultsData(lesson._id, userId);
          return { lessonId: lesson._id, results: resultsData };
        });
        const result = await Promise.all(promises);
        setResults(result);
      }
    };
    if (lessons.length > 0 && userId !== undefined) {
      fetchResults();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessons]);

  useEffect(() => {
    console.log('courseId', courseId);
  }, [courseId]);

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
    console.log('results', results);
  }, [results]);

  useEffect(() => {
    if (results && results.length > 0) {
      for (let r: number = 0; r < results.length; r++) {
        let numOfResultsInCurrentLesson = results[r].results.results.length;

        const numOfExercisesInCurrentLesson = results[r].results.numOfExercises;

        for (let t: number = 0; t < results[r].results.results.length; t++) {
          const res = results[r].results.results[t];

          // res.score = -1 means that the user started the exercise but hasnt finished it yet
          // means he still needs to complete the lesson even though he started it

          if (res.score === -1) {
            numOfResultsInCurrentLesson = numOfResultsInCurrentLesson - 1;
          }
        }
        if (numOfExercisesInCurrentLesson > numOfResultsInCurrentLesson) {
          !lockedLessons.includes(results[r].lessonId)
            ? setLockedLessons((pervLessons) => [
                ...pervLessons,
                results[r].lessonId,
              ])
            : null;
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results]);

  useEffect(() => {
    if (nextLessonId && lessons) {
      for (let i: number = 0; i < lessons.length; i++) {
        const lessonsIds = lessons[i].lessons.map((lesson) => lesson._id);
        if (lessonsIds.includes(nextLessonId)) {
          setCurrentLevelId(lessons[i].levelId);
          return;
        }
      }
    }
  }, [nextLessonId, lessons]);

  useEffect(() => {
    if (currentLevelId && units) {
      for (let i: number = 0; i < units.length; i++) {
        const levelsIds = units[i].levels;
        if (levelsIds && levelsIds.includes(currentLevelId)) {
          setCurrentUnitId(units[i]._id);
          const finisedLevels = levelsIds.slice(
            0,
            levelsIds.indexOf(currentLevelId)
          );

          console.log('finisedLevels1', finisedLevels);
          for (let f: number = 0; f < finisedLevels.length; f++) {
            if (!finisedLevelsIds.includes(finisedLevels[f])) {
              setFinisedLevelsIds((pervLevels) => [
                ...pervLevels,
                finisedLevels[f],
              ]);
            }
          }
          let lockedLevels: string[];
          if (levelsIds.indexOf(currentLevelId) + 1 === levelsIds.length) {
            lockedLevels = [levelsIds[levelsIds.indexOf(currentLevelId) + 1]];
          } else {
            lockedLevels = levelsIds.slice(
              levelsIds.indexOf(currentLevelId) + 1
            );
          }
          console.log('lockedLevels1', lockedLevels);

          for (let l: number = 0; l < lockedLevels.length; l++) {
            if (!lockedLevelsIds.includes(lockedLevels[l])) {
              setLockedLevelsIds((pervLevels) => [
                ...pervLevels,
                lockedLevels[l],
              ]);
            }
          }
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLevelId, units]);

  useEffect(() => {
    if (currentUnitId && units) {
      const unitsIds = units.map((unit) => unit._id);
      const activeUnitIndex = unitsIds.indexOf(currentUnitId);
      const finisedUnits = unitsIds.slice(0, activeUnitIndex);
      const lockedUnits = unitsIds.slice(activeUnitIndex + 1);
      console.log('activeUnitIndex', activeUnitIndex);

      for (let f: number = 0; f < finisedUnits.length; f++) {
        const finishedUnit = units.filter(
          (unit) => unit._id === finisedUnits[f]
        )[0];
        const finishedLevels = finishedUnit.levels;
        if (finishedLevels) {
          for (let fl: number = 0; fl < finishedLevels.length; fl++) {
            const finishedLevel = finishedLevels[fl];
            if (!finisedLevelsIds.includes(finishedLevel)) {
              setFinisedLevelsIds((pervLevels) => [
                ...pervLevels,
                finishedLevel,
              ]);
            }
          }
        }
      }
      for (let l: number = 0; l < lockedUnits.length; l++) {
        const lockedUnit = units.filter(
          (unit) => unit._id === lockedUnits[l]
        )[0];
        const lockedLevels = lockedUnit.levels;
        if (lockedLevels) {
          for (let ll: number = 0; ll < lockedLevels.length; ll++) {
            const lockedLevel = lockedLevels[ll];
            if (!lockedLevels.includes(lockedLevel)) {
              setLockedLevelsIds((pervLevels) => [...pervLevels, lockedLevel]);
            }
          }
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUnitId, units]);

  useEffect(() => {
    if (currentLevelId && nextLessonId) {
      const currentLevel = lessons.filter(
        (lessonObject) => lessonObject.levelId === currentLevelId
      )[0];
      const lessonsIds = currentLevel.lessons.map((lesson) => lesson._id);
      console.log(
        'index',
        lessonsIds,
        nextLessonId,
        lessonsIds.indexOf(nextLessonId)
      );
      setNumOfLessonsMade(lessonsIds.indexOf(nextLessonId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLevelId, nextLessonId]);

  useEffect(() => {
    console.log('lockedLevelsIds', lockedLevelsIds);
  }, [lockedLevelsIds]);

  useEffect(() => {
    console.log('finisedLevelsIds', finisedLevelsIds);
  }, [finisedLevelsIds]);

  useEffect(() => {
    console.log('nextLessonId', nextLessonId);
  }, [nextLessonId]);

  const handleOutsideClick = (event: MouseEvent) => {
    if (
      startLessonRef.current &&
      !startLessonRef.current.contains(event.target as Node) &&
      levelButtonRef.current &&
      !levelButtonRef.current.contains(event.target as Node)
    ) {
      // console.log("handleOutsideClick");
      setIsNextLessonPopupVisible(false);
      updateSelectedPopup(PopupsTypes.CLOSED);
    }
  };

  useEffect(() => {
    // console.log("isNextLessonPopupVisible", isNextLessonPopupVisible);
    if (isNextLessonPopupVisible) {
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
  }, [isNextLessonPopupVisible]);

  return (
    <div className='flex h-full w-full flex-col items-center justify-center px-3 py-6'>
      <div className='relative mx-auto  flex h-full w-[40rem] flex-wrap 2xl:w-[50rem]'>
        {units
          ? units.length > 0
            ? units.map((unit, unitIndex) => (
                <div
                  key={unitIndex}
                  className='basis-full items-center justify-center'
                >
                  <section
                    key={unitIndex}
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
                      {levels && levels.length > 0
                        ? levels.map((levelsObject, levelsObjectIndex) => (
                            <div key={levelsObjectIndex} className='h-full'>
                              {lockedLevelsIds.length > 0 &&
                              levelsObject.unitId === unit._id ? (
                                <div className='my-6 flex h-full flex-col items-center'>
                                  {levelsObject.levels.length > 0
                                    ? levelsObject.levels.map(
                                        (level, levelIndex) => (
                                          <section key={levelIndex}>
                                            {level &&
                                            level.lessons &&
                                            level.lessons?.length > 0 ? (
                                              lockedLevelsIds.includes(
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
                                              ) : finisedLevelsIds.includes(
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
                                              ) : nextLessonId !== undefined ? (
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
                                                    <Tooltip
                                                      isFloating={true}
                                                      color={
                                                        TooltipColors.GREEN
                                                      }
                                                    />

                                                    <LessonButton
                                                      status={Status.PROGRESS}
                                                      numberOfLessonsMade={
                                                        numOfLessonsMade
                                                      }
                                                      numberOfTotalLessons={
                                                        level.lessons.length
                                                      }
                                                      onClick={() =>
                                                        setIsNextLessonPopupVisible(
                                                          !isNextLessonPopupVisible
                                                        )
                                                      }
                                                      buttonRef={levelButtonRef}
                                                    />

                                                    <StartLessonPopup
                                                      numberOfLessonsMade={
                                                        numOfLessonsMade + 1
                                                      }
                                                      numberOfTotalLessons={
                                                        level.lessons.length
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
                          ))
                        : null}
                    </div>
                  </section>
                </div>
              ))
            : null
          : null}

        {/* <div className="grid grid-rows-2 grid-col-3 grid-flow-col bg-duoGreen-default w-[38rem] 2xl:w-[60rem] h-[7rem] rounded-xl text-white mb-5">
                    <label className="col-span-2 flex justify-start items-center pt-4 pl-4 font-extrabold text-2xl">
                        Unit 1
                    </label>
                    <label className="col-span-2 flex justify-start items-center pb-3 pl-4">
                        Form basic sentences, greet people
                    </label>
                    <div className="row-span-2 flex justify-end items-center mr-4 cursor-pointer">
                        <button className="flex flex-row justify-start items-center w-40 text-sm font-bold border-b-[4px] border-[2.5px] border-duoGreen-darker bg-duoGreen-button p-3 rounded-2xl hover:border-duoGreen-borderHover hover:bg-duoGreen-default hover:text-duoGreen-textHover active:border-[2.5px]">
                            <FontAwesomeIcon
                                className="h-6 w-6 mr-2 ml-2"
                                icon={faBook}
                            />
                            <label className="text-center justify-center items-center cursor-pointer font-extrabold text-md">
                                GUIDEBOOK
                            </label>
                        </button>
                    </div>
                </div> */}
      </div>
    </div>
  );
};

export default UserUnitSection;
