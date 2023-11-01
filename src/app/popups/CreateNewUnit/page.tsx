"use client";
import { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import { AlertSizes, useAlertStore } from "@/app/store/stores/useAlertStore";

import Input, { Types } from "@/app/components/Input/page";
import Button, { Color } from "@/app/components/Button/page";
import Dropdown from "@/app/components/Dropdown/page";
import useStore from "@/app/store/useStore";
import { usePopupStore } from "@/app/store/stores/usePopupStore";

library.add(faXmark);

const CreateNewUnit: React.FC = () => {
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

    const addFailedFeilds = (value: string) => {
        setFailedFeilds((pervFeilds: string[]) => [...pervFeilds, value]);
    };

    return (
        <div
            className={
                selectedPopup === "NEW UNIT"
                    ? "z-20 fixed flex justify-center items-center overflow-auto bg-[rgb(0,0,0)] bg-[rgba(0,0,0,0.4)] w-full h-full transition ease-out duration-200"
                    : "opacity-0 z-0 transition ease-in duration-200"
            }
        >
            {selectedPopup === "NEW UNIT" ? (
                <div className="flex bg-white w-[40rem] h-[30rem] rounded-md m-5 p-5">
                    <button
                        onClick={() => {
                            updateSelectedPopup("");
                        }}
                        className="flex-none h-fit w-fit rounded-md text-duoGray-dark"
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
                        items-center text-duoGray-darkest"
                        >
                            CREATE NEW USER
                        </p>

                        <p className="flex-none col-span-1 font-bold text-lg text-duoGray-darkest">
                            User Name:
                        </p>

                        <div className="flex-none col-span-3 flex flex-col justify-center items-center mx-4 ">
                            a
                        </div>

                        <p className="flex-none col-span-1 font-bold text-lg text-duoGray-darkest">
                            T-ID:
                        </p>

                        <div className="flex-none col-span-3 flex flex-col justify-center items-center mx-4">
                            a
                        </div>

                        <p className="flex-none col-span-1 font-bold text-lg text-duoGray-darkest">
                            Password:
                        </p>

                        <div className="flex-none col-span-3 flex flex-col justify-center items-center mx-4">
                            a
                        </div>
                        <p className="flex-none col-span-1 font-bold text-lg text-duoGray-darkest">
                            Role:
                        </p>
                        <div className="flex-none col-span-3 flex flex-col justify-center items-center mx-4">
                            a
                        </div>

                        <div className="flex-none col-span-2 col-start-2 justify-center mt-2">
                            a
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default CreateNewUnit;
