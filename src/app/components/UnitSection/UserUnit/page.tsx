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
library.add(faBook);

const UserUnitSection: React.FC = () => {
    const userRole = useStore(useUserStore, (state) => state.userRole);
    const courseId = useStore(useCourseStore, (state) => state.courseId);
    const [units, setUnits] = useState<UnitType[]>([]);
    const [levels, setLevels] = useState<
        { unitId: string; levels: LevelType[] }[]
    >([]);
    const [lessons, setLessons] = useState<
        { levelId: string; lessons: LessonType[] }[]
    >([]);

    useEffect(() => {
        const fetchData = async () => {
            if (courseId) {
                await getUnitsData(courseId, setUnits);
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
            const allLevels: { levelId: string; lessons: LessonType[] }[] =
                [];
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
        console.log("courseId", courseId);
    }, [courseId]);

    useEffect(() => {
        console.log("units", units);
    }, [units]);

    useEffect(() => {
        console.log("levels", levels);
    }, [levels]);

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
                                          <label className="col-span-2 flex justify-start items-center pb-3 px-4">
                                              {unit.description}
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
                                                            {levelsObject.unitId ===
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
                                                                              ) => (
                                                                                  <div
                                                                                      key={
                                                                                          levelIndex
                                                                                      }
                                                                                      className={`flex relative ${possitionByModularAddition(
                                                                                          levelIndex,
                                                                                      )} my-10 w-fit h-fit`}
                                                                                  >
                                                                                      {level.lessons &&
                                                                                      level
                                                                                          .lessons
                                                                                          .length >
                                                                                          0 ? (
                                                                                          <>
                                                                                              <Tooltip />

                                                                                              <LessonButton
                                                                                                  status={
                                                                                                      Status.PROGRESS
                                                                                                  }
                                                                                                  numberOfLessonsMade={
                                                                                                      1
                                                                                                  }
                                                                                                  numberOfTotalLessons={
                                                                                                      level
                                                                                                          .lessons
                                                                                                          .length
                                                                                                  }
                                                                                              />
                                                                                          </>
                                                                                      ) : null}
                                                                                  </div>
                                                                              ),
                                                                          )
                                                                        : null}
                                                                </div>
                                                            ) : null}
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
