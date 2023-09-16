"use client";
import { useState } from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faHome,
    faUser,
    faCog,
    faRightToBracket,
} from "@fortawesome/free-solid-svg-icons";
// import {SideBarProps} from types
import Button, { Color } from "../Button/page";
library.add(faHome, faUser, faCog, faRightToBracket);

interface SideBarProps {
    authLevel: "admin" | "student" | "teacher";
}

const SideBar: React.FC<SideBarProps> = ({ authLevel }) => {
    const [selected, setSelected] = useState<number>();
    const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);

    const openLogin = () => {
        console.log("clicked");
        setIsLoginOpen(true);
    };

    const sidebarItems = {
        admin: [
            { label: "DASHBOARD", icon: "fa-home" },
            { label: "USERS", icon: "fa-user" },
            { label: "SETTINGS", icon: "fa-cog" },
        ],
        student: [
            { label: "DASHBOARD", icon: "fa-home" },
            { label: "USERS", icon: "fa-user" },
        ],
        teacher: [
            { label: "DASHBOARD", icon: "fa-home" },
            // Other items...
        ],
    };

    const items = sidebarItems[authLevel] || [];

    return (
        <div className="flex flex-col justify-center p-4 border-r-2 h-screen tracking-wide border-zinc-500/25 text-sm text-gray-500 font-extrabold">
            <label className="text-[2rem] font-[850] text-[#58CC02] pl-3 pr-3 pt-2 pb-2 mb-2 mt-2">
                doulingo
            </label>
            <ul className="flex-grow ">
                {items.map((item, index) => (
                    <li
                        key={index}
                        className={`${
                            selected === index
                                ? "text-sky-400 pl-3 pr-3 pt-2 pb-2 mb-2 mt-2 cursor-pointer rounded-xl border-2 border-sky-300 bg-[#DDF4FF]"
                                : "pl-3 pr-3 pt-2 pb-2 mb-2 mt-2 cursor-pointer rounded-xl hover:bg-zinc-100 border-2 border-transparent"
                        }`}
                    >
                        <button
                            className="flex flex-row justify-center items-center cursor-pointer pr-2"
                            onClick={() => setSelected(index)}
                        >
                            <FontAwesomeIcon
                                className="h-6 w-6 mr-4 ml-2"
                                icon={`fa-xs fa-solid ${item.icon}`}
                            />
                            <label className="flex h-full cursor-pointer">
                                {item.label}
                            </label>
                        </button>
                    </li>
                ))}
            </ul>

            <Button
                label="Loggin"
                icon="fa-right-to-bracket"
                color={Color.blue}
                onClick={openLogin}
            />
        </div>
    );
};

export default SideBar;
