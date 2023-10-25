"use client";
import { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

// import { PopupContext, usePopup } from "@/app/utils/context/PopupContext";

import { AlertSizes, useAlertStore } from "@/app/store/stores/useAlertStore";

import Input, { Types } from "@/app/components/Input/page";
import Button, { Color } from "@/app/components/Button/page";
import Dropdown from "@/app/components/Dropdown/page";
import useStore from "@/app/store/useStore";
import { usePopupStore } from "@/app/store/stores/usePopupStore";

library.add(faXmark);

const CreateNewUser: React.FC = () => {
    // const { selectedPopup } = useContext(PopupContext);
    // const setSelectedPopup = usePopup();
    const selectedPopup = useStore(
        usePopupStore,
        (state) => state.selectedPopup,
    );
    const addAlert = useAlertStore.getState().addAlert;
    const updateSelectedPopup = usePopupStore.getState().updateSelectedPopup;

    const [userName, setUserName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [tId, setTId] = useState<string>("");
    const [role, setRole] = useState<string>("");
    const [failedFeilds, setFailedFeilds] = useState<string[]>([]);
    // const [alertId, setAlertId] = useState<number>();

    // useEffect(() => {
    //     if (alerts) {
    //         if (alerts.length > 0) {
    //             setAlertId(Math.random());
    //         }
    //     }
    // }, [alerts]);

    const handleUserName = (value: string) => {
        setUserName(value);
    };

    const handlePassword = (value: string) => {
        setPassword(value);
    };

    const handleTId = (value: string) => {
        setTId(value);
    };

    const handleRole = (value: string) => {
        setRole(value);
    };

    const addFailedFeilds = (value: string) => {
        setFailedFeilds((pervFeilds: string[]) => [...pervFeilds, value]);
    };

    const createUser = async (
        userName: string,
        tId: string,
        password: string,
        role: string,
    ) => {
        console.log("create user:", userName, tId, password, role);
        setFailedFeilds([]);
        if (
            userName.length < 3 ||
            (0 < tId.length && tId.length < 9) ||
            (!tId.includes("t") && tId.length === 9) ||
            password.length < 8 ||
            role === ""
        ) {
            if (userName.length < 3) {
                addAlert("Please enter a valid user name.", AlertSizes.small);
                addFailedFeilds("userName");
            }

            if (
                (0 < tId.length && tId.length < 9) ||
                (!tId.includes("t") && tId.length === 9)
            ) {
                addAlert("Please enter a valid T-Id.", AlertSizes.small);
                addFailedFeilds("tId");
            }

            if (password.length < 8) {
                addAlert("Password too short.", AlertSizes.small);
                addFailedFeilds("password");
            }

            if (role === "") {
                addAlert("Please select a role.", AlertSizes.small);
                addFailedFeilds("role");
            }
            return;
        }

        const response = await fetch(`http://localhost:4001/api/users/`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userName: userName,
                tId: tId,
                password: password,
                permission: role,
            }),
        });
        console.log(response);
        if (response.status === 200) {
            const resFromServer = await response.json();
            console.log(resFromServer);
            addAlert("User created successfully.", AlertSizes.small);
        }

        if (response.status === 409) {
            addAlert("User already existed!", AlertSizes.small);
        }
    };

    return (
        <div
            className={
                selectedPopup === "NEW USER"
                    ? "z-20 fixed flex justify-center items-center overflow-auto bg-[rgb(0,0,0)] bg-[rgba(0,0,0,0.4)] w-full h-full transition ease-out duration-200"
                    : "opacity-0 z-0 transition ease-in duration-200"
            }
        >
            {selectedPopup === "NEW USER" ? (
                <div className="flex bg-white w-[40rem] h-[30rem] rounded-md m-5 p-5">
                    <button
                        onClick={() => {
                            updateSelectedPopup("");
                        }}
                        className="flex-none h-fit w-fit rounded-md text-[#AFAFAF]"
                    >
                        <FontAwesomeIcon
                            className="flex-none fa-lg fa-solid"
                            icon={faXmark}
                        />
                    </button>
                    <div
                        className="flex-none ml-[5.5rem] mr-24 grid grid-cols-4 grid-rows-6 
                    flex-col justify-center items-center"
                    >
                        <p
                            className=" flex-none col-span-4 font-extrabold text-2xl flex justify-center 
                        items-center text-[#4B4B4B]"
                        >
                            CREATE NEW USER
                        </p>

                        <p className="flex-none col-span-1 font-bold text-lg text-[#4B4B4B]">
                            User Name:
                        </p>

                        <div className="flex-none col-span-3 flex flex-col justify-center items-center mx-4 ">
                            <Input
                                type={Types.text}
                                placeholder={"User Name"}
                                value={userName}
                                onChange={handleUserName}
                                failed={
                                    failedFeilds.includes("userName")
                                        ? true
                                        : false
                                }
                            />
                        </div>

                        <p className="flex-none col-span-1 font-bold text-lg text-[#4B4B4B]">
                            T-ID:
                        </p>

                        <div className="flex-none col-span-3 flex flex-col justify-center items-center mx-4">
                            <Input
                                type={Types.text}
                                placeholder={"T-ID (optional)"}
                                value={tId}
                                onChange={handleTId}
                                failed={
                                    failedFeilds.includes("tId") ? true : false
                                }
                            />
                        </div>

                        <p className="flex-none col-span-1 font-bold text-lg text-[#4B4B4B]">
                            Password:
                        </p>

                        <div className="flex-none col-span-3 flex flex-col justify-center items-center mx-4">
                            <Input
                                type={Types.password}
                                placeholder={"Password"}
                                value={password}
                                onChange={handlePassword}
                                failed={
                                    failedFeilds.includes("password")
                                        ? true
                                        : false
                                }
                            />
                        </div>
                        <p className="flex-none col-span-1 font-bold text-lg text-[#4B4B4B]">
                            Role:
                        </p>
                        <div className="flex-none col-span-3 flex flex-col justify-center items-center mx-4">
                            <Dropdown
                                items={[
                                    "searider",
                                    "senior",
                                    "crew",
                                    "teacher",
                                    "admin",
                                ]}
                                placeholder="role"
                                value={role}
                                onChange={handleRole}
                                failed={
                                    failedFeilds.includes("role") ? true : false
                                }
                            />
                        </div>

                        <div className="flex-none col-span-2 col-start-2 justify-center mt-2">
                            <Button
                                label={"CREATE"}
                                color={Color.blue}
                                onClick={() =>
                                    createUser(userName, tId, password, role)
                                }
                            />
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default CreateNewUser;
