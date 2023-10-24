"use client";
import { useContext, useEffect, useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    CourseContext,
    TypesOfCourses,
    useCourseType,
    useSetCourseType,
} from "@/app/utils/context/CourseConext";

const NavBar: React.FC = () => {
    const [selected, setSelected] = useState<string>();

    const courseType = useCourseType();
    const setCourseType = useSetCourseType();

    const { CoursesList, setCourseId } = useContext(CourseContext);

    const pathname = usePathname();

    useEffect(() => {
        if (pathname.includes("searider")) {
            setCourseType(TypesOfCourses.searider);
        } else if (pathname.includes("senior")) {
            setCourseType(TypesOfCourses.senior);
        }

        for (let i: number = 0; i < Object.values(CoursesList).length; i++) {
            console.log(
                "admin sidebar",
                courseType,
                CoursesList[i].courseType,
                CoursesList[i].courseId,
            );
            courseType === CoursesList[i].courseType
                ? setCourseId(CoursesList[i].courseId)
                : null;
        }

        for (let i: number = 0; i < navItems.length; i++) {
            pathname.includes(navItems[i].label.toLocaleLowerCase())
                ? setSelected(navItems[i].label)
                : "";
        }
    }, [pathname]);

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
                    <p className="text-[#4B4B4B] text-3xl uppercase font-extrabold pl-5 pt-2 pb-4">
                        {courseType} course
                    </p>
                    <ul
                        className="pb-2 bt-2 pl-3 pr-3 w-max flex relative justify-center text-center text-[#B3B3B3] text-sm 
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
                                                ? "border-b-2 border-[#1CB0F6] text-[#1CB0F6] pb-2"
                                                : "border-b-2 border-transparent hover:text-[#1CB0F6] hover:border-[#1CB0F6] pb-2"
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
