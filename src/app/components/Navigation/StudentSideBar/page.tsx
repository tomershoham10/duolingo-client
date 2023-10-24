"use client";
import { useEffect, useState } from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faHome,
    faUser,
    faCog,
    faRightToBracket,
    faFolderPlus,
} from "@fortawesome/free-solid-svg-icons";
import Button, { Color } from "../../Button/page";

import { useUserRole, useLoggedIn } from "@/app/utils/context/UserContext";
import Link from "next/link";

library.add(faHome, faUser, faCog, faRightToBracket, faFolderPlus);

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
            const coursesObject = data.courses;
            const coursesList = Object.values(coursesObject).map(
                (course: any) => ({ courseName: course.type }),
            );
            console.log("coursesList:", coursesList);
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

const SideBar: React.FC = () => {
    const userRole = useUserRole();
    const isLoggedIn = useLoggedIn();
    const [selected, setSelected] = useState<number>();
    const [cousersList, setCousersList] = useState<object[]>([]); // Correct the typo here

    useEffect(() => {
        if (userRole === "admin") {
            getCourses().then((coursesList) => {
                console.log("coursesList1", coursesList, coursesList.length);
                setCousersList(coursesList);
            });
        }
    }, [userRole]);

    const sidebarItems: {
        [key: string]: { label: string; icon: any; href?: string }[];
    } = {
        admin: [
            { label: "DASHBOARD", icon: faHome, href: "/Dashboard" },

            {
                label: "NEW COURSE",
                icon: faFolderPlus,
                href: "/classroom/create/new-course",
            },
            { label: "SETTINGS", icon: faCog },
        ],
        student: [
            { label: "DASHBOARD", icon: faHome },
            { label: "USERS", icon: faUser },
        ],
        teacher: [{ label: "DASHBOARD", icon: faHome }],
    };

    const items = sidebarItems[userRole] || [];

    return (
        <div
            className={`${
                userRole === "admin"
                    ? "bg-[#F7F5F7] flex flex-col justify-center border-r-2 h-screen tracking-wide border-[#EBEAEB] text-[#939293] font-extrabold"
                    : "flex flex-col justify-center border-r-2 h-screen tracking-wide border-zinc-500/25 text-sm text-gray-500 font-extrabold"
            }`}
        >
            <label className="text-[2rem] font-[850] text-[#58CC02] pl-6 pr-6 pt-6 pb-2 mb-2 mt-2">
                doulingo
            </label>

            {userRole === "admin" ? (
                <div className="border-b-2 flex justify-center items-center">
                    <ul className="w-full">
                        {cousersList.length > 0 ? (
                            cousersList.map((item: any, index: any) => (
                                <li
                                    key={index}
                                    className="pl-3 pr-3 pt-3 pb-3 cursor-pointer text-lg hover:text-sky-400 hover:bg-[#DDF4FF] w-full text-center"
                                >
                                    {item.className}
                                </li>
                            ))
                        ) : (
                            <p>problem</p>
                        )}
                    </ul>
                </div>
            ) : (
                <></>
            )}

            <ul className="flex-grow">
                {items.map((item, index) => (
                    <li
                        key={index}
                        className={`${
                            selected === index
                                ? userRole === "admin"
                                    ? "text-sky-400 pl-3 pr-3 pt-3 pb-3 cursor-pointer bg-[#DDF4FF]"
                                    : "text-sky-400 pl-3 pr-3 pt-2 pb-2 mb-2 mt-2 cursor-pointer rounded-xl border-2 border-sky-300 bg-[#DDF4FF]"
                                : userRole === "admin"
                                ? "pl-3 pr-3 pt-3 pb-3 cursor-pointer hover:bg-[#ECECEC]"
                                : "pl-3 pr-3 pt-2 pb-2 mb-2 mt-2 cursor-pointer rounded-xl hover-bg-zinc-100 border-2 border-transparent"
                        }`}
                    >
                        <button
                            className="flex flex-row justify-center items-center cursor-pointer pr-2"
                            onClick={() => setSelected(index)}
                        >
                            <FontAwesomeIcon
                                className="h-6 w-6 mr-4 ml-2 fa-xs fa-solid"
                                icon={item.icon}
                            />

                            <Link
                                className="flex h-full cursor-pointer"
                                href={item.href ? item.href : ""}
                            >
                                {item.label}
                            </Link>
                        </button>
                    </li>
                ))}
            </ul>
            {isLoggedIn ? (
                <></>
            ) : (
                <Button
                    label="Loggin"
                    icon={faRightToBracket}
                    color={Color.blue}
                    onClick={() => {
                        console.log("log in clicked.");
                    }}
                    href={"/Login"}
                />
            )}
        </div>
    );
};

export default SideBar;
