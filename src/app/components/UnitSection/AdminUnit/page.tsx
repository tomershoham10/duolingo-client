import { useEffect, useState } from "react";
import useStore from "@/app/store/useStore";
import { useCourseStore } from "@/app/store/stores/useCourseStore";
import { getUnitsData } from "@/app/API/classes-service/courses/functions";
import { getSectionsData } from "@/app/API/classes-service/units/functions";
import { getLessonsData } from "@/app/API/classes-service/sections/functions";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
    faBook,
    faPenToSquare,
    faStar,
} from "@fortawesome/free-solid-svg-icons";

library.add(faBook, faPenToSquare, faStar);

interface UnitType {
    _id: string;
    sections?: string[];
    guidebook?: string;
    description?: string;
}

interface SectionType {
    _id: string;
    lessons?: string[];
}

enum TypesOfLessons {
    searider = "searider",
    crew = "crew",
    senior = "senior",
}

interface LessonType {
    _id: string;
    name: string;
    exercises: string[];
    type: TypesOfLessons;
}

const AdminUnit: React.FC = () => {
    const courseId = useStore(useCourseStore, (state) => state.courseId);

    const [units, setUnits] = useState<UnitType[]>([]);
    const [sections, setSections] = useState<
        { unitId: string; sections: SectionType[] }[]
    >([]);
    const [lessons, setLessons] = useState<
        { sectionId: string; lessons: LessonType[] }[]
    >([]);

    useEffect(() => {
        if (courseId) {
            getUnitsData(courseId, setUnits);
        }
    }, [courseId]);

    useEffect(() => {
        units.map((unit, index) => {
            // console.log("unit", index, unit);
            getSectionsData(unit._id, setSections);
        });
    }, [units]);

    useEffect(() => {
        sections.map((subSections, index) => {
            // console.log("section", index, subSections);
            subSections.sections.map((section, subIndex) => {
                // console.log("subSections", subIndex, section);
                getLessonsData(section._id, setLessons);
            });
        });
    }, [sections]);

    useEffect(() => {
        console.log("sections", sections);
    }, [sections]);

    useEffect(() => {
        console.log("lessons", lessons);
    }, [lessons]);

    return (
        <div className="w-full h-fit">
            {units && units.length > 0 ? (
                <>
                    {units.map((unit, unitIndex) => (
                        <section key={unitIndex} className="mb-5">
                            <div className="grid grid-rows-2 grid-col-3 grid-flow-col bg-duoGreen-default w-full h-fit rounded-t-lg text-white pl-4 py-3">
                                <label className="col-span-2 flex justify-start items-center font-extrabold text-xl">
                                    Unit {unitIndex + 1}
                                </label>
                                <label className="col-span-2 flex justify-start items-center">
                                    {unit.description}
                                </label>
                                <div className="row-span-2 flex justify-end">
                                    <button className="flex flex-row justify-start items-center w-40 text-sm font-bold border-b-[4px] border-[2.5px] border-duoGreen-darker bg-duoGreen-button p-3 rounded-2xl hover:border-duoGreen-dark hover:bg-duoGreen-default hover:text-duoGreen-textHover active:border-[2.5px]  cursor-pointer">
                                        <FontAwesomeIcon
                                            className="h-6 w-6 mr-2 ml-2"
                                            icon={faBook}
                                        />
                                        <label className="text-center justify-center items-center cursor-pointer">
                                            GUIDEBOOK
                                        </label>
                                    </button>
                                    <button className="top-0 mx-3 h-fit">
                                        <FontAwesomeIcon icon={faPenToSquare} />
                                    </button>
                                </div>
                            </div>

                            {unit.sections && sections
                                ? unit.sections.length > 0
                                    ? unit.sections.map((section, index) => (
                                          <div key={index}>
                                              {sections.length > 0
                                                  ? sections.map(
                                                        (
                                                            sectionData,
                                                            sectionIndex,
                                                        ) => {
                                                            return unit._id ===
                                                                sectionData.unitId ? (
                                                                <div
                                                                    key={
                                                                        sectionIndex
                                                                    }
                                                                    className={
                                                                        index ===
                                                                        sections.length
                                                                            ? "border-2 border-t-0 border-duoGray-light rounded-b-lg h-full px-4 py-3 flex flex-row"
                                                                            : "border-2 border-t-0 border-duoGray-light h-full px-4 py-3 flex flex-row"
                                                                    }
                                                                >
                                                                    <div className="w-12 h-12 rounded-full bg-duoGreen-default text-white flex-none font-extrabold">
                                                                        <div className="flex flex-col justify-center items-center mx-auto my-auto h-full">
                                                                            <FontAwesomeIcon
                                                                                icon={
                                                                                    faStar
                                                                                }
                                                                                size="lg"
                                                                            />
                                                                            <span className="text-[11px]">
                                                                                {unitIndex +
                                                                                    1}

                                                                                -
                                                                                {index +
                                                                                    1}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="ml-4 mr-12 w-full">
                                                                        {lessons.length >
                                                                        0
                                                                            ? lessons.map(
                                                                                  (
                                                                                      sectionLesson,
                                                                                      lesIndex,
                                                                                  ) => {
                                                                                      return sectionLesson.sectionId ===
                                                                                          sectionData
                                                                                              .sections[
                                                                                              index
                                                                                          ]
                                                                                              ._id
                                                                                          ? sectionLesson
                                                                                                .lessons
                                                                                                .length >
                                                                                            0
                                                                                              ? sectionLesson.lessons.map(
                                                                                                    (
                                                                                                        lesson,
                                                                                                        subLessonIndex,
                                                                                                    ) => {
                                                                                                        return (
                                                                                                            <div
                                                                                                                key={
                                                                                                                    subLessonIndex
                                                                                                                }
                                                                                                                className="flex flex-col w-full font-medium text-base 2xl:1920px"
                                                                                                            >
                                                                                                                <div className="font-extrabold text-duoGray-dark w-full">
                                                                                                                    {
                                                                                                                        lesson.name
                                                                                                                    }
                                                                                                                </div>
                                                                                                                <div className="flex flex-col w-full">
                                                                                                                    <span className="text-duoGray-darkest text-xl font-extrabold">
                                                                                                                        exercise1
                                                                                                                        -
                                                                                                                        FSA
                                                                                                                    </span>
                                                                                                                    <div className="flex flex-col ml-5 divide-y-2 w-full">
                                                                                                                        <div className="flex flex-col">
                                                                                                                            <span className="font-extrabold text-duoGray-darker">
                                                                                                                                description
                                                                                                                            </span>
                                                                                                                            <span>
                                                                                                                                The
                                                                                                                                flimbly
                                                                                                                                borblesnatch
                                                                                                                                zoomed
                                                                                                                                around
                                                                                                                                the
                                                                                                                                glistening
                                                                                                                                galaxy,
                                                                                                                                singing
                                                                                                                                to
                                                                                                                                the
                                                                                                                                glittering
                                                                                                                                stars
                                                                                                                                and
                                                                                                                                balancing
                                                                                                                                atop
                                                                                                                                frothy,
                                                                                                                                fizzling
                                                                                                                                bubbles.
                                                                                                                                Jumbled
                                                                                                                                jargons
                                                                                                                                jolted
                                                                                                                                its
                                                                                                                                jinxed
                                                                                                                                jaunt,
                                                                                                                                as
                                                                                                                                spiffy
                                                                                                                                blibber-blubber
                                                                                                                                ballooned
                                                                                                                                and
                                                                                                                                boggled
                                                                                                                                amid
                                                                                                                                the
                                                                                                                                whispering
                                                                                                                                winds.
                                                                                                                                Pernickety
                                                                                                                                picklewumpkins
                                                                                                                                cavorted
                                                                                                                                merrily,
                                                                                                                                wiggling
                                                                                                                                and
                                                                                                                                wriggling
                                                                                                                                their
                                                                                                                                way
                                                                                                                                through
                                                                                                                                zany
                                                                                                                                zibber-zabber.
                                                                                                                                Sizzling
                                                                                                                                snickersnacks
                                                                                                                                giggled
                                                                                                                                uncontrollably,
                                                                                                                                zipping
                                                                                                                                past
                                                                                                                                the
                                                                                                                                fluttering
                                                                                                                                flibbertigibbets
                                                                                                                                that
                                                                                                                                frolicked
                                                                                                                                freely.
                                                                                                                                Bouncing
                                                                                                                                brimblesnoots
                                                                                                                                hopped
                                                                                                                                elegantly,
                                                                                                                                painting
                                                                                                                                the
                                                                                                                                sky
                                                                                                                                with
                                                                                                                                sprightly
                                                                                                                                squiggles
                                                                                                                                and
                                                                                                                                wibbly-wobbly
                                                                                                                                wonders.
                                                                                                                                Quirky
                                                                                                                                quilldoodles
                                                                                                                                danced
                                                                                                                                in
                                                                                                                                delightful
                                                                                                                                circles,
                                                                                                                                spinning
                                                                                                                                an
                                                                                                                                enchanting
                                                                                                                                tale
                                                                                                                                of
                                                                                                                                nonsensical
                                                                                                                                gobbledygook.
                                                                                                                                Jumbled
                                                                                                                                jubilant
                                                                                                                                jibber-jabber
                                                                                                                                swirled
                                                                                                                                in
                                                                                                                                kaleidoscopic
                                                                                                                                confusion,
                                                                                                                                blibbering
                                                                                                                                in
                                                                                                                                jubilant
                                                                                                                                jargon
                                                                                                                                to
                                                                                                                                the
                                                                                                                                tune
                                                                                                                                of
                                                                                                                                whimsical
                                                                                                                                whatchamacallits.
                                                                                                                            </span>
                                                                                                                        </div>
                                                                                                                        <div className="flex flex-col">
                                                                                                                            <span className="font-extrabold text-duoGray-darker">
                                                                                                                                options
                                                                                                                                and
                                                                                                                                answers
                                                                                                                            </span>
                                                                                                                            <ul className="flex flex-row space-x-4 my-2 text-duoGray-darkest tracking-wider">
                                                                                                                                <li className="rounded-3xl font-semibold bg-duoGreen-default cursor-pointer">
                                                                                                                                    <span className="m-2 text-white">
                                                                                                                                        option
                                                                                                                                        1
                                                                                                                                    </span>
                                                                                                                                </li>
                                                                                                                                <li className="rounded-3xl font-semibold bg-gray-300/60 cursor-pointer">
                                                                                                                                    <span className="m-2">
                                                                                                                                        option
                                                                                                                                        2
                                                                                                                                    </span>
                                                                                                                                </li>
                                                                                                                                <li className="rounded-3xl font-semibold bg-gray-300/60 cursor-pointer">
                                                                                                                                    <span className="m-2">
                                                                                                                                        option
                                                                                                                                        3
                                                                                                                                    </span>
                                                                                                                                </li>
                                                                                                                                <li className="rounded-3xl font-semibold bg-gray-300/60 cursor-pointer">
                                                                                                                                    <span className="m-2">
                                                                                                                                        option
                                                                                                                                        4
                                                                                                                                    </span>
                                                                                                                                </li>
                                                                                                                                <li className="rounded-3xl font-semibold bg-gray-300/60 cursor-pointer">
                                                                                                                                    <span className="m-2">
                                                                                                                                        option5
                                                                                                                                    </span>
                                                                                                                                </li>
                                                                                                                            </ul>
                                                                                                                        </div>

                                                                                                                        <div className="flex flex-col">
                                                                                                                            <span className="font-extrabold text-duoGray-darker">
                                                                                                                                firstTimeBuffer
                                                                                                                            </span>
                                                                                                                            <span>
                                                                                                                                5
                                                                                                                                minutes
                                                                                                                                for
                                                                                                                                high
                                                                                                                                score
                                                                                                                            </span>
                                                                                                                        </div>
                                                                                                                        <div className="flex flex-col">
                                                                                                                            <span className="font-extrabold text-duoGray-darker">
                                                                                                                                secondTimeBuffer
                                                                                                                            </span>
                                                                                                                            <span>
                                                                                                                                7
                                                                                                                                minutes
                                                                                                                                for
                                                                                                                                medium
                                                                                                                                score
                                                                                                                            </span>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <br />
                                                                                                                <br />
                                                                                                                <br />
                                                                                                                <br />
                                                                                                            </div>
                                                                                                        );
                                                                                                    },
                                                                                                )
                                                                                              : null
                                                                                          : null;
                                                                                  },
                                                                              )
                                                                            : null}
                                                                    </div>
                                                                </div>
                                                            ) : null;
                                                        },
                                                    )
                                                  : null}
                                          </div>
                                      ))
                                    : null
                                : null}
                        </section>
                    ))}
                </>
            ) : (
                <p>problem</p>
            )}
        </div>
    );
};

export default AdminUnit;
