"use client";
import { ReactNode, createContext, useState, useContext } from "react";

export enum AlertSizes {
    small = "small",
    medium = "medium",
    large = "large",
}

export const AlertContext = createContext<{
    isAlertOpened: boolean;
    setIsAlertOpened: (isOpen: boolean) => void;
    alertMessage: string | undefined;
    setAlertMessage: (message: string | undefined) => void;
    alertSize: AlertSizes;
    setAlertSize: (sizee: AlertSizes) => void;
}>({
    isAlertOpened: false,
    setIsAlertOpened: () => {},
    alertMessage: undefined,
    setAlertMessage: () => {},
    alertSize: AlertSizes.small,
    setAlertSize: () => {},
});

export function AlertProvider({ children }: { children: ReactNode }) {
    const [isAlertOpened, setIsAlertOpened] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string | undefined>(
        undefined,
    );
    const [alertSize, setAlertSize] = useState<AlertSizes>(AlertSizes.small);

    const handleMessage = (message: string | undefined) => {
        setAlertMessage(message);
    };
    console.log("alert context:", isAlertOpened);

    return (
        <AlertContext.Provider
            value={{
                isAlertOpened,
                setIsAlertOpened,
                alertMessage,
                setAlertMessage: handleMessage,
                alertSize,
                setAlertSize: () => {},
            }}
        >
            {children}
        </AlertContext.Provider>
    );
}

export function useAlertStatus() {
    const { isAlertOpened } = useContext(AlertContext);
    return isAlertOpened;
}

export function useAlertToggle() {
    const { setIsAlertOpened } = useContext(AlertContext);
    return setIsAlertOpened;
}

export function useAlertMessge() {
    const { setAlertMessage } = useContext(AlertContext);
    return setAlertMessage;
}

export function useAlertSize() {
    const { setAlertSize } = useContext(AlertContext);
    return setAlertSize;
}
