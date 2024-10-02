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

if (typeof window !== 'undefined' && localStorage) {
    const relevantData = localStorage.getItem("relevantLists");
    // console.log("relevantData - store", relevantData);
    if (relevantData) {
        const parsedData = JSON.parse(relevantData) as RelevantType[];
        // console.log("useRelevantStore parsedData", parsedData);
        useRelevantStore.getState().setRelevantLists(Object.values(parsedData));
        // console.log("useRelevantStore useRelevantStore.getState().relevantLists", useRelevantStore.getState().relevantLists, typeof parsedData);
    } else {
        useRelevantStore.getState().setRelevantLists(null);
    }
} else {
    useRelevantStore.getState().setRelevantLists(null);
}


if (process.env.NODE_ENV === 'development') {
    mountStoreDevtool('RelevantStore', useRelevantStore);
}