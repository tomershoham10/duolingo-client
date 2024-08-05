"use client"
import { mountStoreDevtool } from 'simple-zustand-devtools';
import { create } from 'zustand';

export interface SpotreccSubExercise {
    fileName: string;
    description: string | null;
    time: number;
}

type CreateSpotreccState = {
    subExercises: SpotreccSubExercise[];
}

type Action = {
    addSubExercise: (file: SpotreccSubExercise) => void;
    removeSubExercise: (fileName: string) => void;
    resetStore: () => void;
}

export const useCreateSpotreccStore = create<CreateSpotreccState & Action>(
    (set) => ({
        subExercises: [],
        addSubExercise: (subExercise) => set((state) => {
            const exists = state.subExercises.some(exercise => exercise.fileName === subExercise.fileName);
            if (!exists) {
                return {
                    subExercises: [...state.subExercises, subExercise]
                };
            }
            return state;
        }),
        removeSubExercise: (fileName) => set((state) => ({
            subExercises: state.subExercises.filter((subExercise) => subExercise.fileName !== fileName)
        })),
        resetStore: () => {
            set(() => ({
                subExercises: []
            }));
        }
    })
)

if (process.env.NODE_ENV === 'development') {
    mountStoreDevtool('useCreateSpotreccStore', useCreateSpotreccStore);
}

