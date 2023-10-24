"use client";
import { useContext, useEffect, useState } from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faHome,
    faUser,
    faCog,
    faRightToBracket,
    faSquarePlus,
} from "@fortawesome/free-solid-svg-icons";

import {
    CourseContext,
    TypesOfCourses,
} from "@/app/utils/context/CourseConext";
import { usePopup } from "@/app/utils/context/PopupContext";

import Link from "next/link";
import useStore from "@/app/store/useStore";
import { useUserStore } from "@/app/store/stores/useUserStore";

enum TypesOfUser {
    LOGGEDOUT = "loggedOut",
    ADMIN = "admin",
    SEARIDER = "searider",
    SENIOR = "senior",
    TEACHER = "teacher",
    CREW = "crew",
}

library.add(faHome, faUser, faCog, faRightToBracket, faSquarePlus);

const getCourses = async () => {
    try {
        const response = await fetch("http://localhost:8080/api/courses/", {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            const data = await response.json();
            const coursesObject = data.courses as {
                _id: string;
                type: TypesOfCourses;
            }[];

            const coursesList: {
                courseId: string;
                courseType: TypesOfCourses;
            }[] = Object.values(coursesObject).map(
                (course: { _id: string; type: TypesOfCourses }) => ({
                    courseId: course._id as string,
                    courseType: course.type as TypesOfCourses,
                }),
            );
            console.log(coursesList);
            return coursesList;
        } else {
            console.error("Failed to fetch courses.");
            return [];
        }
    } catch (error) {
        console.error("Error fetching courses:", error);
        return [];
    }
};

const AdminSideBar: React.FC = () => {
    const userRole = useStore(useUserStore, (state) => state.userRole);
    const isLoggedIn = useStore(useUserStore, (state) => state.isLoggedIn);

    // const { userRole, isLoggedIn } = useUserStore();

    const { CourseType, CoursesList, setCoursesList } =
        useContext(CourseContext);

    const [selected, setSelected] = useState<number>();

    const setSelectedPopup = usePopup();

    useEffect(() => {
        if (userRole === "admin") {
            getCourses().then((coursesList) => {
                setCoursesList(coursesList);
                console.log(
                    "set course list (adminsidebar component)",
                    coursesList,
                );
            });
        }
    }, [userRole]);

    const sidebarItems: {
        label: string;
        icon: any;
        href?: string;
    }[] = [
        { label: "DASHBOARD", icon: faHome, href: "/Dashboard" },
        {
            label: "NEW USER",
            icon: faSquarePlus,
        },
        { label: "SETTINGS", icon: faCog },
    ];

    return (
        <>
            {userRole === TypesOfUser.ADMIN && isLoggedIn ? (
                <div
                    className="min-w-[12.5rem] lg:min-w-[13rem] 
                    bg-[#F7F5F7] flex flex-col justify-center border-r-2 h-screen tracking-wide 
                border-[#EBEAEB] text-[#939293] font-extrabold"
                >
                    <label className="text-[2rem] font-[850] text-[#20A6EC] pl-6 pr-6 pt-6 pb-2 mb-2 mt-2">
                        doulingo
                    </label>

                    <div className="border-b-2 flex justify-center items-center">
                        <ul className="w-full">
                            {CoursesList.length > 0 ? (
                                CoursesList.map((item: any, index: any) => (
                                    <li
                                        key={index}
                                        className={
                                            CourseType?.toLocaleLowerCase() ===
                                            item.courseType.toLocaleLowerCase()
                                                ? "pl-3 pr-3 pt-3 pb-3 cursor-pointer text-lg text-sky-400 bg-[#DDF4FF] w-full text-center"
                                                : "pl-3 pr-3 pt-3 pb-3 cursor-pointer text-lg text-[#4B4B4B] hover:text-sky-400 hover:bg-[#DDF4FF] w-full text-center"
                                        }
                                    >
                                        <Link
                                            href={`/classroom/courses/${item.courseType.toLocaleLowerCase()}/students`}
                                        >
                                            {item.courseType}
                                        </Link>
                                    </li>
                                ))
                            ) : (
                                <p>problem</p>
                            )}
                        </ul>
                    </div>

                    <ul className="flex-grow">
                        {sidebarItems.map((item, index) => (
                            <li
                                key={index}
                                className={`${
                                    selected === index
                                        ? "text-sky-400 pl-3 pr-3 pt-3 pb-3 cursor-pointer bg-[#DDF4FF]"
                                        : "pl-3 pr-3 pt-3 pb-3 cursor-pointer hover:bg-[#ECECEC]"
                                }`}
                            >
                                <button
                                    className="flex flex-row justify-center items-center cursor-pointer pr-2"
                                    onClick={() => setSelectedPopup(item.label)}
                                >
                                    <FontAwesomeIcon
                                        className="h-6 w-6 mr-4 ml-2 fa-xs fa-solid"
                                        icon={item.icon}
                                    />
                                    {item.href ? (
                                        <Link
                                            className="flex h-full cursor-pointer"
                                            href={item.href}
                                        >
                                            {item.label}
                                        </Link>
                                    ) : (
                                        <span>{item.label}</span>
                                    )}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <></>
            )}
        </>
    );
};

export default AdminSideBar;
