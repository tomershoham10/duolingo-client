"use client"
import { create } from 'zustand';
import { mountStoreDevtool } from 'simple-zustand-devtools';

type SourceState = {
    sources: SourceType[];
}

type Action = {
    setSources: (sources: SourceType[]) => void;
    addSource: (source: SourceType) => void;
    removeSource: (sourceId: string) => void;
}

export const useSourceStore = create<SourceState & Action>(
    (set) => ({
        sources: [],
        setSources: (sources: SourceType[]) => set(() => ({ sources: sources })),
        addSource: (source: SourceType) => set((state) => ({ sources: [...state.sources, source] })),
        removeSource: (sourceId: string) => set((state) => ({ sources: state.sources.filter(s => s._id !== sourceId) })),
    })
);


if (typeof window !== 'undefined' && localStorage) {
    const targetData = localStorage.getItem("sourcesList");
    // console.log("targetData - store", targetData);
    if (targetData) {
        const parsedData = JSON.parse(targetData) as SourceType[];
        // console.log("useSourceStore parsedData", parsedData);
        useSourceStore.getState().setSources(Object.values(parsedData));
        // console.log("useSourceStore useSourceStore.getState().targets", useSourceStore.getState().targets, typeof parsedData);
    }
}


if (process.env.NODE_ENV === 'development') {
    mountStoreDevtool('SourceStore', useSourceStore);
}