"use client";
import { useEffect, useState } from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faHome,
    faUser,
    faCog,
    faRightToBracket,
    faSquarePlus,
} from "@fortawesome/free-solid-svg-icons";

import Link from "next/link";
import useStore from "@/app/store/useStore";
import { useUserStore, TypesOfUser } from "@/app/store/stores/useUserStore";
import { useCourseStore } from "@/app/store/stores/useCourseStore";
import { usePopupStore } from "@/app/store/stores/usePopupStore";
import { getCourses } from "@/app/API/classes-service/courses/functions";

library.add(faHome, faUser, faCog, faRightToBracket, faSquarePlus);

const AdminSideBar: React.FC = () => {
    const userRole = useStore(useUserStore, (state) => state.userRole);
    const isLoggedIn = useStore(useUserStore, (state) => state.isLoggedIn);

    const courseType = useStore(useCourseStore, (state) => state.courseType);
    const coursesList = useStore(useCourseStore, (state) => state.coursesList);

    const updateCoursesList = useCourseStore.getState().updateCoursesList;

    const updateSelectedPopup = usePopupStore.getState().updateSelectedPopup;

    const [selected, setSelected] = useState<number>();

    useEffect(() => {
        const fetchData = async () => {
            if (userRole === TypesOfUser.ADMIN && updateCoursesList) {
                try {
                    const coursesList = await getCourses();
                    updateCoursesList(coursesList);
                } catch (error) {
                    console.error("Error fetching courses:", error);
                }
            }
        };

        fetchData();
    }, [updateCoursesList, userRole]);

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
                    bg-duoGray-lighter flex flex-col justify-center border-r-2 h-screen tracking-wide 
                border-duoGray-light text-duoGray-darker font-extrabold"
                >
                    <label className="text-[2rem] font-[850] text-duoBlue-default pl-6 pr-6 pt-6 pb-2 mb-2 mt-2">
                        doulingo
                    </label>

                    <div className="border-b-2 flex justify-center items-center">
                        <ul className="w-full uppercase">
                            {coursesList ? (
                                coursesList.length > 0 ? (
                                    coursesList.map((item: any, index: any) => (
                                        <li
                                            key={index}
                                            className={
                                                courseType?.toLocaleLowerCase() ===
                                                item.courseType.toLocaleLowerCase()
                                                    ? "pl-3 pr-3 pt-3 pb-3 cursor-pointer text-lg text-duoBlue-light bg-duoBlue-lightest w-full text-center"
                                                    : "pl-3 pr-3 pt-3 pb-3 cursor-pointer text-lg text-duoGray-darkest hover:text-duoBlue-light hover:bg-duoBlue-lightest w-full text-center"
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
                                )
                            ) : null}
                        </ul>
                    </div>

                    <ul className="flex-grow">
                        {sidebarItems.map((item, index) => (
                            <li
                                key={index}
                                className={`${
                                    selected === index
                                        ? "text-duoBlue-light pl-3 pr-3 pt-3 pb-3 cursor-pointer bg-duoBlue-lightest"
                                        : "pl-3 pr-3 pt-3 pb-3 cursor-pointer hover:bg-duoGray-hover"
                                }`}
                            >
                                <button
                                    className="flex flex-row justify-center items-center cursor-pointer pr-2"
                                    onClick={() =>
                                        updateSelectedPopup(item.label)
                                    }
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
