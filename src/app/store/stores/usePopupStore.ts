"use client"
import { create } from 'zustand';
import { mountStoreDevtool } from 'simple-zustand-devtools';

export enum PopupsTypes {
    CLOSED = "closed",
    NEWUSER = "newUser",
    NEWCOURSE = "newCourse",
    NEWUNIT = "newUnit",
    STARTLESSON = "startLesson",
    ADMINEDIT = "adminEdit",
    METADATA = 'metadata'
}

type PopupState = {
    selectedPopup: PopupsTypes;
}
type Action = {
    updateSelectedPopup: (selectedPopup: PopupsTypes) => void;
}


export const usePopupStore = create<PopupState & Action>(
    (set) => ({
        selectedPopup: PopupsTypes.CLOSED,
        updateSelectedPopup: (selectedPopup) => set(() => ({ selectedPopup: selectedPopup })),
    })
)

if (process.env.NODE_ENV === 'development') {
    mountStoreDevtool('PopupStore', usePopupStore);
}


