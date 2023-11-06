"use client";
import { useEffect, useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";
// import {
//     CourseContext,
//     TypesOfCourses,
//     useCourseType,
//     useSetCourseType,
// } from "@/app/utils/context/CourseConext";

import useStore from "@/app/store/useStore";
import {
    TypesOfCourses,
    useCourseStore,
} from "@/app/store/stores/useCourseStore";

const NavBar: React.FC = () => {
    const [selected, setSelected] = useState<string>();

    const courseType = useStore(useCourseStore, (state) => state.courseType);
    const coursesList = useStore(useCourseStore, (state) => state.coursesList);

    const updateCourseType = useCourseStore.getState().updateCourseType;
    const updateCourseId = useCourseStore.getState().updateCourseId;

    // const courseType = useCourseType();
    // const setCourseType = useSetCourseType();

    // const { CoursesList, setCourseId } = useContext(CourseContext);

    const pathname = usePathname();

    useEffect(() => {
        if (pathname.includes("searider")) {
            updateCourseType(TypesOfCourses.SENIOR);
        } else if (pathname.includes("senior")) {
            updateCourseType(TypesOfCourses.SENIOR);
        }

        if (coursesList && courseType) {
            for (
                let i: number = 0;
                i < Object.values(coursesList).length;
                i++
            ) {
                if (
                    courseType.toLocaleLowerCase() ===
                    coursesList[i].courseType?.toLocaleLowerCase()
                ) {
                    // console.log("nav bar course type", coursesList[i].courseId);
                    updateCourseId(coursesList[i].courseId);
                }
            }
        }

        for (let i: number = 0; i < navItems.length; i++) {
            pathname.includes(navItems[i].label.toLocaleLowerCase())
                ? setSelected(navItems[i].label)
                : "";
        }
    }, [pathname, coursesList]);

    const navItems: {
        label: string;
        href: string;
    }[] = [
        {
            label: "STUDENTS",
            href: `/classroom/courses/${courseType}/students`,
        },
        {
            label: "ASSIGNMENTS",
            href: `/classroom/courses/${courseType}/assignments`,
        },
        {
            label: "SYLLABUS",
            href: `/classroom/courses/${courseType}/syllabus`,
        },
        {
            label: "SETTINGS",
            href: `/classroom/courses/${courseType}/settings`,
        },
    ];

    return (
        <>
            {courseType ? (
                <div className="block border-b-2 w-full pt-4">
                    <p className="text-duoGray-darkest text-3xl uppercase font-extrabold pl-5 pt-2 pb-4">
                        {courseType} course
                    </p>
                    <ul
                        className="pb-2 bt-2 pl-3 pr-3 w-max flex relative justify-center text-center text-duoGray-dark text-sm 
            font-extrabold tracking-tight space-x-5"
                    >
                        {navItems.map(
                            (
                                item: { label: string; href: string },
                                index: number,
                            ) => (
                                <li
                                    key={index}
                                    className="block relative cursor-pointer mb-[-1px] pl-2 pr-2"
                                >
                                    <span
                                        className={
                                            selected === item.label
                                                ? "border-b-2 border-duoBlue-light text-duoBlue-light pb-2"
                                                : "border-b-2 border-transparent hover:text-duoBlue-light hover:border-duoBlue-light pb-2"
                                        }
                                    >
                                        <Link href={item.href}>
                                            {item.label}
                                        </Link>
                                    </span>
                                </li>
                            ),
                        )}
                    </ul>
                </div>
            ) : (
                <></>
            )}
        </>
    );
};

export default NavBar;
