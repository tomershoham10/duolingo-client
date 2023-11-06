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
    SectionType,
    getSectionsData,
} from "@/app/API/classes-service/units/functions";
import {
    LessonType,
    getLessonsData,
} from "@/app/API/classes-service/sections/functions";
import LessonButton, { Status } from "../../LessonButton/page";
import { possitionByModularAddition } from "@/app/utils/functions/possitionByModularAddition";
import Tooltip from "../../Tooltip/page";
library.add(faBook);

const UserUnitSection: React.FC = () => {
    const userRole = useStore(useUserStore, (state) => state.userRole);
    const courseId = useStore(useCourseStore, (state) => state.courseId);
    const [units, setUnits] = useState<UnitType[]>([]);
    const [sections, setSections] = useState<
        { unitId: string; sections: SectionType[] }[]
    >([]);
    const [lessons, setLessons] = useState<
        { sectionId: string; lessons: LessonType[] }[]
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
        const fetchSections = async () => {
            const promises = units.map(async (unit) => {
                // await getSectionsData(unit._id, setSections);
                const sectionsData = await getSectionsData(unit._id);
                return { unitId: unit._id, sections: sectionsData };
            });
            const result = await Promise.all(promises);
            setSections(result);
        };
        if (units.length > 0) {
            fetchSections();
        }
    }, [units]);

    useEffect(() => {
        const fetchLessons = async () => {
            const allSections: { sectionId: string; lessons: LessonType[] }[] =
                [];
            sections.forEach((unit) => {
                unit.sections?.forEach((section) => {
                    allSections.push({ sectionId: section._id, lessons: [] });
                });
            });

            const promises = allSections.map(async (section) => {
                const lessonsData = await getLessonsData(section.sectionId);
                section.lessons = lessonsData;
                return section;
            });

            const result = await Promise.all(promises);
            setLessons(result);
        };

        if (sections.length > 0) {
            fetchLessons();
        }
    }, [sections]);

    useEffect(() => {
        console.log("courseId", courseId);
    }, [courseId]);

    useEffect(() => {
        console.log("units", units);
    }, [units]);

    useEffect(() => {
        console.log("sections", sections);
    }, [sections]);

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
                                          {sections && sections.length > 0
                                              ? sections.map(
                                                    (
                                                        sectionsObject,
                                                        sectionsObjectIndex,
                                                    ) => (
                                                        <div
                                                            key={
                                                                sectionsObjectIndex
                                                            }
                                                            className="h-full"
                                                        >
                                                            {sectionsObject.unitId ===
                                                            unit._id ? (
                                                                <div className="flex flex-col items-center h-full my-6">
                                                                    {sectionsObject
                                                                        .sections
                                                                        .length >
                                                                    0
                                                                        ? sectionsObject.sections.map(
                                                                              (
                                                                                  section,
                                                                                  sectionIndex,
                                                                              ) => (
                                                                                  <div
                                                                                      key={
                                                                                          sectionIndex
                                                                                      }
                                                                                      className={`flex relative ${possitionByModularAddition(
                                                                                          sectionIndex,
                                                                                      )} my-2 w-fit h-fit`}
                                                                                  >
                                                                                      <Tooltip />

                                                                                      <LessonButton
                                                                                          status={
                                                                                              Status.PROGRESS
                                                                                          }
                                                                                          numberOfLessonsMade={
                                                                                              2
                                                                                          }
                                                                                          numberOfTotalLessons={
                                                                                              5
                                                                                          }
                                                                                      />
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
