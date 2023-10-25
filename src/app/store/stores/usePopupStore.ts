"use client"
import { create } from 'zustand';
import { mountStoreDevtool } from 'simple-zustand-devtools';

type PopupState = {
    selectedPopup: string | undefined;
}
type Action = {
    updateSelectedPopup: (selectedPopup: string | undefined) => void;
}


export const usePopupStore = create<PopupState & Action>(
    (set) => ({
        selectedPopup: undefined,
        updateSelectedPopup: (selectedPopup) => set(() => ({ selectedPopup: selectedPopup })),
    })
)

if (process.env.NODE_ENV === 'development') {
    mountStoreDevtool('PopupStore', usePopupStore);
}


