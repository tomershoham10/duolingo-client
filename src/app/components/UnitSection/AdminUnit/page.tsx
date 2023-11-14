import { useEffect, useState } from "react";
import useStore from "@/app/store/useStore";
import {
    TypesOfCourses,
    useCourseStore,
} from "@/app/store/stores/useCourseStore";
import {
    CoursesType,
    UnitType,
    getCourseByType,
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
import {
    FSAType,
    getExercisesData,
} from "@/app/API/classes-service/lessons/functions";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
    faBook,
    faChevronDown,
    faPenToSquare,
    faStar,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Button, { Color } from "../../Button/page";
import {
    fieldToEditType,
    useEditSyllabusStore,
} from "@/app/store/stores/useEditSyllabus";
import { usePathname } from "next/navigation";

library.add(faBook, faChevronDown, faPenToSquare, faStar);

const AdminUnit: React.FC = () => {
    const pathname = usePathname();

    const [course, setCourse] = useState<CoursesType | undefined>();

    const updateFieldToEdit = useEditSyllabusStore.getState().updateFieldToEdit;
    const updateFieldId = useEditSyllabusStore.getState().updateFieldId;

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

    useEffect(() => {
        let courseType: TypesOfCourses = TypesOfCourses.UNDEFINED;
        if (pathname.includes("searider")) {
            courseType = TypesOfCourses.SEARIDER;
        } else if (pathname.includes("senior")) {
            courseType = TypesOfCourses.SENIOR;
        }
        const fetchData = async () => {
            const response = await getCourseByType(courseType);
            if (response) {
                setCourse(response);
            }
        };
        fetchData();
    }, []);

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
        const fetchExercises = async () => {
            const allLessons = lessons.reduce(
                (acc, cur) => acc.concat(cur.lessons),
                [] as LessonType[],
            );
            const promises = allLessons.map(async (lesson) => {
                const exercisesData = await getExercisesData(lesson._id);
                return { lessonId: lesson._id, exercises: exercisesData };
            });
            const result = await Promise.all(promises);
            setExercises(result);
        };

        if (lessons.length > 0) {
            fetchExercises();
        }
    }, [lessons]);

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
        console.log("exercises", exercises);
    }, [exercises]);

    const [exerciseAccordion, setExerciseAccordion] = useState<string[]>([]);
    const toggleAccordion = (exerciseId: string) => {
        exerciseAccordion.includes(exerciseId)
            ? setExerciseAccordion((pervExercises) =>
                  pervExercises.filter((id) => {
                      return id !== exerciseId;
                  }),
              )
            : setExerciseAccordion((pervExercises) => [
                  ...pervExercises,
                  exerciseId,
              ]);
    };

    useEffect(
        () => console.log("exerciseAccordion", exerciseAccordion),
        [exerciseAccordion],
    );

    return (
        <div className="w-full flex">
            <div className="w-full mx-24 h-full text-black">
                {units &&
                    units.length > 0 &&
                    units.map((unit, unitIndex) => (
                        <div key={unitIndex} className="py-[2rem] flex-none">
                            <div className="flex-col">
                                <div className="grid grid-rows-2 grid-col-3 grid-flow-col h-[6.5rem] max-h-[6.5rem] min-h-[6.5rem] sm:h-fit bg-duoGreen-default w-full rounded-t-lg text-white pl-4 py-3 justify-between items-center">
                                    <button
                                        className="col-span-1 flex-none justify-start items-center font-extrabold text-xl cursor-pointer"
                                        onClick={() => {
                                            updateFieldToEdit(
                                                fieldToEditType.UNIT,
                                            );
                                            updateFieldId(unit._id);
                                        }}
                                    >
                                        <label className="cursor-pointer">
                                            Unit {unitIndex + 1}
                                        </label>
                                    </button>
                                    <label className="col-span-2 font-semibold justify-center items-center w-[90%]">
                                        {unit.description}
                                    </label>
                                    <div className="row-span-2 flex justify-end items-start mr-5">
                                        {unit.guidebook ? (
                                            <button className="flex flex-row justify-start items-center w-40 text-sm font-bold border-b-[4px] border-[2.5px] border-duoGreen-darker bg-duoGreen-button p-3 rounded-2xl hover:border-duoGreen-dark hover:bg-duoGreen-default hover:text-duoGreen-textHover active:border-[2.5px] cursor-pointer">
                                                <FontAwesomeIcon
                                                    className="h-6 w-6 mr-2 ml-2"
                                                    icon={faBook}
                                                />
                                                <Link href={""}>
                                                    <label className="text-center justify-center items-center cursor-pointer">
                                                        GUIDEBOOK
                                                    </label>
                                                </Link>
                                            </button>
                                        ) : (
                                            <div className="">
                                                <Button
                                                    label={"CREATE GUIDEBOOK"}
                                                    color={Color.white}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    {/* <button className="top-0 right-0 mx-3 h-fit">
                                        <FontAwesomeIcon icon={faPenToSquare} />
                                    </button> */}
                                </div>
                                <div className="flex flex-col">
                                    {levels && levels.length > 0
                                        ? levels.map(
                                              (
                                                  levelsObject,
                                                  levelsObjectIndex,
                                              ) => (
                                                  <div key={levelsObjectIndex} className="flex-none">
                                                      {levelsObject.unitId ===
                                                      unit._id ? (
                                                          <div className="flex flex-col">
                                                              {levelsObject
                                                                  .levels
                                                                  .length > 0
                                                                  ? levelsObject.levels.map(
                                                                        (
                                                                            level,
                                                                            levelIndex,
                                                                        ) => (
                                                                            <div
                                                                                key={
                                                                                    levelIndex
                                                                                }
                                                                                className={
                                                                                    levelIndex ===
                                                                                    levels.length
                                                                                        ? "border-2 border-t-0 border-duoGray-light rounded-b-lg h-fit px-6 py-3 flex flex-col"
                                                                                        : "border-2 border-t-0 border-duoGray-light h-fit px-6 py-3 flex flex-col"
                                                                                }
                                                                            >
                                                                                <div className="w-full">
                                                                                    {lessons &&
                                                                                    lessons.length >
                                                                                        0
                                                                                        ? lessons.map(
                                                                                              (
                                                                                                  lessonsObject,
                                                                                                  lessonsObjectIndex,
                                                                                              ) => (
                                                                                                  <div
                                                                                                      key={
                                                                                                          lessonsObjectIndex
                                                                                                      }
                                                                                                  >
                                                                                                      {lessonsObject.levelId ===
                                                                                                      level._id ? (
                                                                                                          <div className="divide-y-2 divide-duoGray-hover">
                                                                                                              {lessonsObject
                                                                                                                  .lessons
                                                                                                                  .length >
                                                                                                              0
                                                                                                                  ? lessonsObject.lessons.map(
                                                                                                                        (
                                                                                                                            lesson,
                                                                                                                            lessonIndex,
                                                                                                                        ) => (
                                                                                                                            <div
                                                                                                                                key={
                                                                                                                                    lessonIndex
                                                                                                                                }
                                                                                                                                className="flex flex-row w-full font-medium text-base pt-4 2xl:1920px"
                                                                                                                            >
                                                                                                                                <div className="w-12 h-12 rounded-full bg-duoGreen-default text-white flex-none font-extrabold">
                                                                                                                                    <div className="flex flex-col justify-center items-center mx-auto my-auto h-full ">
                                                                                                                                        <div className="flex flex-col justify-center items-center h-full mt-1">
                                                                                                                                            <FontAwesomeIcon
                                                                                                                                                icon={
                                                                                                                                                    faStar
                                                                                                                                                }
                                                                                                                                                size="lg"
                                                                                                                                                className=""
                                                                                                                                            />
                                                                                                                                            <span className="text-[11px] h-fit">
                                                                                                                                                {levelIndex +
                                                                                                                                                    1}

                                                                                                                                                -
                                                                                                                                                {lessonIndex +
                                                                                                                                                    1}
                                                                                                                                            </span>
                                                                                                                                        </div>
                                                                                                                                    </div>
                                                                                                                                </div>
                                                                                                                                <div className="mx-6 w-full">
                                                                                                                                    <span className="font-extrabold text-duoGray-dark w-full">
                                                                                                                                        LESSON
                                                                                                                                        {
                                                                                                                                            " - "
                                                                                                                                        }
                                                                                                                                        {
                                                                                                                                            lesson.name
                                                                                                                                        }
                                                                                                                                    </span>
                                                                                                                                    <div className="flex flex-col w-full">
                                                                                                                                        {exercises &&
                                                                                                                                        exercises.length >
                                                                                                                                            0
                                                                                                                                            ? exercises.map(
                                                                                                                                                  (
                                                                                                                                                      exerciseObject,
                                                                                                                                                      exerciseObjectIndex,
                                                                                                                                                  ) => (
                                                                                                                                                      <div
                                                                                                                                                          key={
                                                                                                                                                              exerciseObjectIndex
                                                                                                                                                          }
                                                                                                                                                          className="divide-y-2 w-full"
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
                                                                                                                                                                            exerciseIndex,
                                                                                                                                                                        ) => (
                                                                                                                                                                            <div
                                                                                                                                                                                key={
                                                                                                                                                                                    exerciseIndex
                                                                                                                                                                                }
                                                                                                                                                                                className={`transition-all duration-500 ease-in flex flex-col w-full
                                                                                                                                                                                    ${
                                                                                                                                                                                        exerciseAccordion.includes(
                                                                                                                                                                                            exercise._id,
                                                                                                                                                                                        )
                                                                                                                                                                                            ? ""
                                                                                                                                                                                            : ""
                                                                                                                                                                                    }`}
                                                                                                                                                                                onClick={() => {
                                                                                                                                                                                    toggleAccordion(
                                                                                                                                                                                        exercise._id,
                                                                                                                                                                                    );
                                                                                                                                                                                }}
                                                                                                                                                                            >
                                                                                                                                                                                {exerciseAccordion.includes(
                                                                                                                                                                                    exercise._id,
                                                                                                                                                                                ) ? (
                                                                                                                                                                                    <div className="">
                                                                                                                                                                                        <span>
                                                                                                                                                                                            EXERCISE
                                                                                                                                                                                            ID
                                                                                                                                                                                            :
                                                                                                                                                                                            {
                                                                                                                                                                                                exercise._id
                                                                                                                                                                                            }
                                                                                                                                                                                        </span>
                                                                                                                                                                                        <div className="flex flex-col">
                                                                                                                                                                                            <span className="font-bold">
                                                                                                                                                                                                description
                                                                                                                                                                                            </span>
                                                                                                                                                                                            <span>
                                                                                                                                                                                                {
                                                                                                                                                                                                    exercise.description
                                                                                                                                                                                                }
                                                                                                                                                                                            </span>
                                                                                                                                                                                        </div>
                                                                                                                                                                                        <div className="flex flex-col">
                                                                                                                                                                                            <span className="font-bold">
                                                                                                                                                                                                difficulty
                                                                                                                                                                                                Level
                                                                                                                                                                                            </span>
                                                                                                                                                                                            <span>
                                                                                                                                                                                                {
                                                                                                                                                                                                    exercise.difficultyLevel
                                                                                                                                                                                                }
                                                                                                                                                                                            </span>
                                                                                                                                                                                        </div>
                                                                                                                                                                                        <div className="flex flex-col">
                                                                                                                                                                                            <span className="font-bold">
                                                                                                                                                                                                options
                                                                                                                                                                                                and
                                                                                                                                                                                                answers
                                                                                                                                                                                            </span>
                                                                                                                                                                                            <span>
                                                                                                                                                                                                {
                                                                                                                                                                                                    exercise.options
                                                                                                                                                                                                }
                                                                                                                                                                                            </span>
                                                                                                                                                                                        </div>
                                                                                                                                                                                        <div className="flex flex-col">
                                                                                                                                                                                            <span className="font-bold">
                                                                                                                                                                                                firstTimeBuffer
                                                                                                                                                                                            </span>
                                                                                                                                                                                            <span>
                                                                                                                                                                                                {
                                                                                                                                                                                                    exercise.firstTimeBuffer
                                                                                                                                                                                                }{" "}
                                                                                                                                                                                                minutes
                                                                                                                                                                                            </span>
                                                                                                                                                                                        </div>
                                                                                                                                                                                        <div className="flex flex-col">
                                                                                                                                                                                            <span className="font-bold">
                                                                                                                                                                                                secondTimeBuffer
                                                                                                                                                                                            </span>
                                                                                                                                                                                            <span>
                                                                                                                                                                                                {
                                                                                                                                                                                                    exercise.secondTimeBuffer
                                                                                                                                                                                                }{" "}
                                                                                                                                                                                                minutes
                                                                                                                                                                                            </span>
                                                                                                                                                                                        </div>
                                                                                                                                                                                    </div>
                                                                                                                                                                                ) : (
                                                                                                                                                                                    <div className="my-1 p-2 hover:bg-duoGray-lighter hover:rounded-md h-fit flex w-full justify-between items-center text-duoGray-darkest">
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
                                                                                                                                                                        ),
                                                                                                                                                                    )
                                                                                                                                                                  : null
                                                                                                                                                              : null}
                                                                                                                                                      </div>
                                                                                                                                                  ),
                                                                                                                                              )
                                                                                                                                            : null}
                                                                                                                                    </div>
                                                                                                                                </div>
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
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default AdminUnit;
