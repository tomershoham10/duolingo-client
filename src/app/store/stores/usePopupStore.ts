"use client"
import { create } from 'zustand';
import { mountStoreDevtool } from 'simple-zustand-devtools';
import { UserType } from '../../types';

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
    EDIT_USER = "editUser"
}

type PopupState = {
    selectedPopup: PopupsTypes;
    selectedUser: UserType | null;
}
type Action = {
    updateSelectedPopup: (selectedPopup: PopupsTypes) => void;
    setSelectedUser: (user: UserType | null) => void;
}

export const usePopupStore = create<PopupState & Action>(
    (set) => ({
        selectedPopup: PopupsTypes.CLOSED,
        selectedUser: null,
        updateSelectedPopup: (selectedPopup) => set(() => ({ selectedPopup: selectedPopup })),
        setSelectedUser: (user) => set(() => ({ selectedUser: user })),
    })
)

if (process.env.NODE_ENV === 'development') {
    mountStoreDevtool('PopupStore', usePopupStore);
}


