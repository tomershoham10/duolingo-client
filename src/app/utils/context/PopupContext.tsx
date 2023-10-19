"use client";
import { ReactNode, createContext, useState, useContext } from "react";

export const PopupContext = createContext<{
    selectedPopup: string | undefined;
    setSelectedPopup: (popup: string | undefined) => void;
}>({
    selectedPopup: undefined,
    setSelectedPopup: () => {},
});

export function PopupProvider({ children }: { children: ReactNode }) {
    const [selectedPopup, setSelectedPopup] = useState<string | undefined>(
        undefined,
    );

    const handleSetPopup = (popup: string | undefined) => {
        setSelectedPopup(popup);
    };

    return (
        <PopupContext.Provider
            value={{ selectedPopup, setSelectedPopup: handleSetPopup }}
        >
            {children}
        </PopupContext.Provider>
    );
}

export function usePopup() {
    const { setSelectedPopup } = useContext(PopupContext);
    return setSelectedPopup;
}
