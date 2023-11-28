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

import Link from "next/link";
import useStore from "@/app/store/useStore";
import { useUserStore } from "@/app/store/stores/useUserStore";

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

const StudentSideBar: React.FC = () => {
    const userRole = useStore(useUserStore, (state) => state.userRole);
    const isLoggedIn = useStore(useUserStore, (state) => state.isLoggedIn);

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

    const items = userRole ? sidebarItems[userRole] : [];

    return (
        <div className="flex flex-col justify-center border-r-2 h-screen tracking-wide border-zinc-500/25 text-sm text-gray-500 font-extrabold">
            <label className="text-[2rem] font-[850] text-duoGreen-default pl-6 pr-6 pt-6 pb-2 mb-2 mt-2">
                doulingo
            </label>

            <ul className="flex-grow">
                {items
                    ? items.map((item, index) => (
                          <li
                              key={index}
                              className={`${
                                  selected === index
                                      ? "text-duoBlue-light pl-3 pr-3 pt-2 pb-2 mb-2 mt-2 cursor-pointer rounded-xl border-2 border-duoBlue-lighter bg-duoBlue-lightest"
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
                      ))
                    : null}
            </ul>
            {isLoggedIn ? (
                <></>
            ) : (
                <Button
                    label="Loggin"
                    icon={faRightToBracket}
                    color={Color.BLUE}
                    onClick={() => {
                        console.log("log in clicked.");
                    }}
                    href={"/login"}
                />
            )}
        </div>
    );
};

export default StudentSideBar;
