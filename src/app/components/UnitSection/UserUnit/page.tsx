"use client";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook } from "@fortawesome/free-solid-svg-icons";
import { useUserStore } from "@/app/store/stores/useUserStore";
import { useStore } from "zustand";
import { useCourseStore } from "@/app/store/stores/useCourseStore";
import { useEffect, useState } from "react";
import {
    UnitType,
    getUnitsData,
} from "@/app/API/classes-service/courses/functions";
import {
    LevelType,
    getLevelsData,
} from "@/app/API/classes-service/units/functions";
import {
    LessonType,
    getLessonsData,
} from "@/app/API/classes-service/levels/functions";
import LessonButton, { Status } from "../../LessonButton/page";
import { possitionByModularAddition } from "@/app/utils/functions/possitionByModularAddition";
import Tooltip from "../../Tooltip/page";
import {
    ResultType,
    getResultsData,
} from "@/app/API/classes-service/lessons/functions";
import { usePopupStore } from "@/app/store/stores/usePopupStore";
import StartLessonPopup from "@/app/popups/StartLessonPopup/page";
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

    const [lockedLessons, setLockedLessons] = useState<string[]>([]);
    const [lockedLevels, setLockedLevels] = useState<string[]>([]);
    const [finisedLevels, setFinisedLevels] = useState<string[]>([]);

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
            levels.forEach((unit) => {
                unit.levels?.forEach((level) => {
                    allLevels.push({ levelId: level._id, lessons: [] });
                });
            });

            const promises = allLevels.map(async (level) => {
                const lessonsData = await getLessonsData(level.levelId);
                level.lessons = lessonsData;
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
        const fetchResults = async () => {
            if (userId) {
                const allLessons = lessons.reduce(
                    (acc, cur) => acc.concat(cur.lessons),
                    [] as LessonType[],
                );
                const promises = allLessons.map(async (lesson) => {
                    const resultsData = await getResultsData(
                        lesson._id,
                        userId,
                    );
                    return { lessonId: lesson._id, results: resultsData };
                });
                const result = await Promise.all(promises);
                setResults(result);
            }
        };
        if (lessons.length > 0 && userId !== undefined) {
            fetchResults();
        }
    }, [lessons, setResults]);

    useEffect(() => {
        console.log("courseId", courseId);
    }, [courseId]);

    useEffect(() => {
        console.log("units", units);
    }, [units]);

    useEffect(() => {
        console.log("levels", levels);
    }, [levels]);

    useEffect(() => {
        console.log("lessons", lessons);
    }, [lessons]);

    useEffect(() => {
        console.log("results", results);
    }, [results]);

    useEffect(() => {
        if (results) {
            for (let r: number = 0; r < results.length; r++) {
                const numOfResultsInCurrentLesson =
                    results[r].results.results.length;
                const numOfExercisesInCurrentLesson =
                    results[r].results.numOfExercises;
                // console.log(
                // "check",
                // results[r].lessonId,
                // numOfExercisesInCurrentLesson,
                // numOfResultsInCurrentLesson,
                // );
                if (
                    numOfExercisesInCurrentLesson > numOfResultsInCurrentLesson
                ) {
                    !lockedLessons.includes(results[r].lessonId)
                        ? setLockedLessons((pervLessons) => [
                              ...pervLessons,
                              results[r].lessonId,
                          ])
                        : null;
                }
            }
        }
    }, [results]);

    useEffect(() => {
        if (levels && lessons) {
            for (let i: number = 0; i < levels.length; i++) {
                const currentlevels = levels[i].levels;
                for (let j: number = 0; j < currentlevels.length; j++) {
                    const currentLevelId = currentlevels[j]._id;
                    const currentLessons = lessons.find(
                        (lesson) => lesson.levelId === currentLevelId,
                    )?.lessons;
                    const lessonsIds = currentLessons?.map((item) => item._id);
                    const isLevelLocked = lessonsIds?.every((item) =>
                        lockedLessons.includes(item),
                    );

                    const isLevelFinished = lessonsIds?.every(
                        (item) => !lockedLessons.includes(item),
                    );

                    j > 0 &&
                    isLevelLocked &&
                    !lockedLevels.includes(currentLevelId)
                        ? setLockedLevels((pervLessons) => [
                              ...pervLessons,
                              currentLevelId,
                          ])
                        : null;

                    isLevelFinished
                        ? setFinisedLevels((pervLessons) => [
                              ...pervLessons,
                              currentLevelId,
                          ])
                        : null;
                }
            }
        }
    }, [lockedLessons]);

    // useEffect(() => {
    //     console.log("lockedLessons", lockedLessons);
    // }, [lockedLessons]);

    useEffect(() => {
        console.log("lockedLevels", lockedLevels);
    }, [lockedLevels]);

    useEffect(() => {
        console.log("finisedLevels", finisedLevels);
    }, [finisedLevels]);

    useEffect(() => {
        console.log("nextLessonId", nextLessonId);
    }, [nextLessonId]);

    return (
        <div className="h-full py-6 px-3 w-full flex flex-col justify-center items-center">
            <div className="flex flex-wrap relative h-full w-[40rem] m-auto">
                {units
                    ? units.length > 0
                        ? units.map((unit, unitIndex) => (
                              <div key={unitIndex} className="basis-full ">
                                  <section
                                      key={unitIndex}
                                      className="absolute h-full"
                                  >
                                      <div className="grid grid-rows-2 grid-col-3 grid-flow-col bg-duoGreen-default w-[38rem] 2xl:w-[60rem] h-[7rem] rounded-xl text-white">
                                          <label className="col-span-2 flex justify-start items-center pt-4 pl-4 font-extrabold text-2xl">
                                              Unit {unitIndex + 1}
                                          </label>
                                          {unit.description ? (
                                              <label className="col-span-2 flex justify-start items-center pb-3 px-4">
                                                  {unit.description}
                                              </label>
                                          ) : null}
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
                                      </div>
                                      <div className="basis-full h-full">
                                          {levels && levels.length > 0
                                              ? levels.map(
                                                    (
                                                        levelsObject,
                                                        levelsObjectIndex,
                                                    ) => (
                                                        <div
                                                            key={
                                                                levelsObjectIndex
                                                            }
                                                            className="h-full"
                                                        >
                                                            {lockedLevels.length >
                                                                0 &&
                                                            levelsObject.unitId ===
                                                                unit._id ? (
                                                                <div className="flex flex-col items-center h-full my-6">
                                                                    {levelsObject
                                                                        .levels
                                                                        .length >
                                                                    0
                                                                        ? levelsObject.levels.map(
                                                                              (
                                                                                  level,
                                                                                  levelIndex,
                                                                              ) => {
                                                                                  const currentLessonsIds =
                                                                                      level.lessons;
                                                                                  let numOfLessonsMade: number = 0;

                                                                                  if (
                                                                                      currentLessonsIds &&
                                                                                      currentLessonsIds.length >
                                                                                          0 &&
                                                                                      !lockedLevels.includes(
                                                                                          level._id,
                                                                                      ) &&
                                                                                      !finisedLevels.includes(
                                                                                          level._id,
                                                                                      )
                                                                                  ) {
                                                                                      for (
                                                                                          let i: number = 0;
                                                                                          i <
                                                                                          currentLessonsIds.length;
                                                                                          i++
                                                                                      ) {
                                                                                          if (
                                                                                              nextLessonId &&
                                                                                              level.lessons
                                                                                          ) {
                                                                                              numOfLessonsMade =
                                                                                                  level.lessons.indexOf(
                                                                                                      nextLessonId,
                                                                                                  );
                                                                                          }
                                                                                      }
                                                                                  }
                                                                                  return (
                                                                                      <section
                                                                                          key={
                                                                                              levelIndex
                                                                                          }
                                                                                      >
                                                                                          {level &&
                                                                                          level.lessons &&
                                                                                          level
                                                                                              .lessons
                                                                                              ?.length >
                                                                                              0 ? (
                                                                                              lockedLevels.includes(
                                                                                                  level._id,
                                                                                              ) ? (
                                                                                                  <div
                                                                                                      key={
                                                                                                          levelIndex
                                                                                                      }
                                                                                                      className={`flex relative ${possitionByModularAddition(
                                                                                                          levelIndex,
                                                                                                      )} mt-2 w-fit h-fit`}
                                                                                                  >
                                                                                                      <>
                                                                                                          <LessonButton
                                                                                                              status={
                                                                                                                  Status.LOCKED
                                                                                                              }
                                                                                                          />
                                                                                                      </>
                                                                                                  </div>
                                                                                              ) : finisedLevels.includes(
                                                                                                    level._id,
                                                                                                ) ? (
                                                                                                  <div
                                                                                                      key={
                                                                                                          levelIndex
                                                                                                      }
                                                                                                      className={`flex relative ${possitionByModularAddition(
                                                                                                          levelIndex,
                                                                                                      )} mt-2 w-fit h-fit`}
                                                                                                  >
                                                                                                      <LessonButton
                                                                                                          status={
                                                                                                              Status.DONE
                                                                                                          }
                                                                                                      />
                                                                                                  </div>
                                                                                              ) : currentLessonsIds &&
                                                                                                nextLessonId !==
                                                                                                    undefined ? (
                                                                                                  <div
                                                                                                      key={
                                                                                                          levelIndex
                                                                                                      }
                                                                                                      className={`flex relative ${possitionByModularAddition(
                                                                                                          levelIndex,
                                                                                                      )} mt-10 w-fit h-fit`}
                                                                                                  >
                                                                                                      <>
                                                                                                          <Tooltip />
                                                                                                          <LessonButton
                                                                                                              status={
                                                                                                                  Status.PROGRESS
                                                                                                              }
                                                                                                              numberOfLessonsMade={
                                                                                                                  numOfLessonsMade
                                                                                                              }
                                                                                                              numberOfTotalLessons={
                                                                                                                  level
                                                                                                                      .lessons
                                                                                                                      .length
                                                                                                              }
                                                                                                              onClick={() =>
                                                                                                                  updateSelectedPopup(
                                                                                                                      "START LESSON",
                                                                                                                  )
                                                                                                              }
                                                                                                          />
                                                                                                          <StartLessonPopup
                                                                                                              numberOfLessonsMade={
                                                                                                                  numOfLessonsMade +
                                                                                                                  1
                                                                                                              }
                                                                                                              numberOfTotalLessons={
                                                                                                                  level
                                                                                                                      .lessons
                                                                                                                      .length
                                                                                                              }
                                                                                                              nextLessonId={
                                                                                                                  nextLessonId
                                                                                                              }
                                                                                                          />
                                                                                                      </>
                                                                                                  </div>
                                                                                              ) : null
                                                                                          ) : null}
                                                                                      </section>
                                                                                  );
                                                                              },
                                                                          )
                                                                        : null}
                                                                </div>
                                                            ) : (
                                                                <p>
                                                                    unit
                                                                    finished
                                                                </p>
                                                            )}
                                                        </div>
                                                    ),
                                                )
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
