"use client"
import { mountStoreDevtool } from 'simple-zustand-devtools';
import { create } from 'zustand';

type PopupState = {
    isOpen: boolean;
    coordinates: CoordinatesType;
    content: ContentType[];
}
type Action = {
    toggleMenuOpen: () => void;
    setCoordinates: (coordinates: CoordinatesType) => void;
    setContent: (content: ContentType[]) => void;
}

export const useContextMenuStore = create<PopupState & Action>((set) => ({
    isOpen: false,
    coordinates: { pageX: 0, pageY: 0 },
    content: [],
    toggleMenuOpen: () => set((state) => ({ isOpen: !state.isOpen })),
    setCoordinates: (coordinates: CoordinatesType) => set(() => ({ coordinates: coordinates })),
    setContent: (content: any) => set(() => ({ content: content }))
}));

if (process.env.NODE_ENV === 'development') {
    mountStoreDevtool('useContextMenuStore', useContextMenuStore);
}