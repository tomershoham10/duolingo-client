"use client";
import { useContext, useEffect, useState } from "react";

import {
    AlertContext,
    AlertSizes,
    useAlertMessge,
    useAlertStatus,
    useAlertToggle,
} from "@/app/utils/context/AlertContext";
import Button, { Color } from "../Button/page";

const Alert: React.FC = () => {
    const isAlertOpened = useAlertStatus();
    const setIsAlertOpened = useAlertToggle();

    const { alertSize, alertMessage } = useContext(AlertContext);

    const [boxHight, setBoxHight] = useState<string>();

    useEffect(() => {
        console.log("alert component", alertSize);

        switch (alertSize) {
            case AlertSizes.small:
                setBoxHight("h-[7.5rem]");
                break;
            case AlertSizes.medium:
                setBoxHight("h-[10rem]");

                break;
            case AlertSizes.large:
                setBoxHight("h-[12rem]");

                break;
        }
    }, [alertSize, isAlertOpened]);

    return (
        <div
            className={
                isAlertOpened
                    ? "z-30 fixed flex justify-center items-start overflow-auto w-full h-full transition ease-out duration-200 cursor-pointer "
                    : "opacity-0 z-0 transition ease-in duration-200 flex-none"
            }
        >
            {isAlertOpened ? (
                <div
                    className={`mt-5 bg-white rounded-xl ${boxHight} min-w-[15rem] max-w-[25rem] grid grid-cols-3 grid-rows-2 flex-none cursor-default px-4 pt-3 pb-2 shadow-sm border-2 border-[#EBEAEB]`}
                >
                    <span className="col-span-3 h-fit font-semibold flex-none text-[#4B4B4B]">
                        {alertMessage}
                    </span>
                    <Button
                        color={Color.blue}
                        label={"Close"}
                        style={
                            " col-span-1 col-start-3 h-fit self-end flex-none"
                        }
                        onClick={() => setIsAlertOpened(false)}
                    />
                </div>
            ) : null}
        </div>
    );
};

export default Alert;
