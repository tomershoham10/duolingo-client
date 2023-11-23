"use client";
import { useEffect, useState } from "react";

import useStore from "@/app/store/useStore";
import { AlertSizes, useAlertStore } from "@/app/store/stores/useAlertStore";

import Button, { Color } from "../Button/page";

const Alert: React.FC = () => {
    const alerts = useStore(useAlertStore, (state) => state.alerts);
    const removeAlert = useAlertStore.getState().removeAlert;

    const [isAlertOpened, setIsAlertOpened] = useState<boolean>(false);
    const [alertId, setAlertId] = useState<number>();
    const [alertMessage, setAlertMessage] = useState<string>();
    const [alertSize, setAlertSize] = useState<AlertSizes>();

    const [boxHight, setBoxHight] = useState<string>();

    useEffect(() => {
        console.log("alert added");
        if (alerts && alerts?.length > 0) {
            setIsAlertOpened(true);
            setAlertId(alerts[0].id);
            setAlertMessage(alerts[0].message);
            setAlertSize(alerts[0].size);
        } else {
            setIsAlertOpened(false);
        }
    }, [alerts]);

    useEffect(() => {
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
    }, [alertSize]);

    return (
        <div
            className={
                isAlertOpened
                    ? "z-30 fixed flex justify-center items-start overflow-auto w-full h-full transition ease-out duration-200 cursor-pointer "
                    : "opacity-0 z-0 transition ease-in duration-200 flex-none"
            }
        >
            {isAlertOpened && alertId ? (
                <div
                    className={`mt-5 bg-white rounded-xl ${boxHight} min-w-[15rem] max-w-[25rem] grid grid-cols-3 grid-rows-2 flex-none cursor-default px-4 pt-3 pb-2 shadow-sm border-2 border-duoGray-light`}
                >
                    <span className="col-span-3 h-fit font-semibold flex-none text-duoGray-darkest">
                        {alertMessage}
                    </span>
                    <Button
                        color={Color.blue}
                        label={"Close"}
                        style={
                            " col-span-1 col-start-3 h-fit self-end flex-none"
                        }
                        onClick={() => removeAlert(alertId)}
                    />
                </div>
            ) : null}
        </div>
    );
};

export default Alert;
