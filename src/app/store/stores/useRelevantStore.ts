"use client"
import { create } from 'zustand';
import { mountStoreDevtool } from 'simple-zustand-devtools';

type RelevantState = {
    relevantLists: RelevantType[] | null;
}

type Action = {
    setRelevantLists: (relevantLists: RelevantType[] | null) => void;
    addList: (list: RelevantType) => void;
}

export const useRelevantStore = create<RelevantState & Action>(
    (set) => ({
        relevantLists: null,
        setRelevantLists: (relevantLists: RelevantType[] | null) => set(() => ({ relevantLists: relevantLists })),
        addList: (list: RelevantType) => set((state) => ({
            relevantLists: state.relevantLists ? [...state.relevantLists, list]
                : [list]
        })),
    })
);


if (process.env.NODE_ENV === 'development') {
    mountStoreDevtool('RelevantStore', useRelevantStore);
}