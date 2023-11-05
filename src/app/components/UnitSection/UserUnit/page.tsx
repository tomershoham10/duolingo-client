"use client";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook } from "@fortawesome/free-solid-svg-icons";
import { useUserStore } from "@/app/store/stores/useUserStore";
import { useStore } from "zustand";
import { useCourseStore } from "@/app/store/stores/useCourseStore";
import { useEffect } from "react";
import { getUnitsData } from "@/app/API/classes-service/courses/functions";
library.add(faBook);

const UserUnitSection = () => {
    const userRole = useStore(useUserStore, (state) => state.userRole);
    const courseId = useStore(useCourseStore, (state) => state.courseId);
    const [units, setUnits] = useState<UnitType[]>([]);



    console.log("userRole", userRole);

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
                console.log("lessonsData", lessonsData);
                section.lessons = lessonsData;
                console.log(section);
                return section;
            });

            const result = await Promise.all(promises);
            setLessons(result);
        };

        if (sections.length > 0) {
            fetchLessons();
        }
    }, [sections]);

    return (
        <div
            className="grid grid-rows-2 grid-col-3 grid-flow-col  
    bg-duoGreen-default w-[35rem] h-[6rem] rounded-xl text-white mb-5"
        >
            <label className="col-span-2 flex justify-start items-center pt-4 pl-4 font-extrabold text-2xl">
                Unit 1
            </label>
            <label className="col-span-2 flex justify-start items-center pb-3 pl-4">
                Form basic sentences, greet people
            </label>
            <div className="row-span-2 flex justify-end items-center mr-4 cursor-pointer">
                <button
                    className="flex flex-row justify-start items-center w-40 text-sm font-bold
            border-b-[4px] border-[2.5px] border-duoGreen-darker bg-duoGreen-button p-3 rounded-2xl
            hover:border-duoGreen-borderHover hover:bg-duoGreen-default hover:text-duoGreen-textHover active:border-[2.5px]"
                >
                    <FontAwesomeIcon
                        className="h-6 w-6 mr-2 ml-2"
                        icon={faBook}
                    />
                    <label className="text-center justify-center items-center cursor-pointer">
                        GUIDEBOOK
                    </label>
                </button>
            </div>
        </div>
    );
};

export default UserUnitSection;
