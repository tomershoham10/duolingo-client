"use client"
import { create } from 'zustand';
import { mountStoreDevtool } from 'simple-zustand-devtools';

export enum PopupsTypes {
    CLOSED = "closed",
    NEW_USER = "newUser",
    NEW_COURSE = "newCourse",
    DELETE_COURSE = 'deleteCourse',
    DELETE_LEVEL = 'deleteLevel',
    NEW_UNIT = "newUnit",
    START_LESSON = "startLesson",
    ADMIN_EDIT = "adminEdit",
    UPLOAD_FILES = "uploadFiles",
    EDIT_METADATA = "editMetadata",
    SONOLIST_METADATA = "sonolistMetadata",
    EDIT_SPOTRECC = "editSpotrecc",
    EDIT_LESSON = "editLesson",
    EDIT_LEVEL = "editLevel",
    EDIT_UNIT = "editUnit",
    ADD_EXERCISES = "addExercises",
    PREVIEW = "preview",
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


