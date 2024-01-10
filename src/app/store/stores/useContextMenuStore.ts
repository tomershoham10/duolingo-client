"use client"
import { create } from 'zustand';

interface CoordinatesType {
    pageX: number;
    pageY: number;
}

interface ContentType {
    placeHolder: string;
    onClick: () => void;
}

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
