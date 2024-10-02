"use client"
import { mountStoreDevtool } from 'simple-zustand-devtools';
import { create } from 'zustand';

export interface SpotreccSubExercise {
    description?: string;
    fileRoute: FileRoute;
    exerciseTime: number; // in seconds
    bufferTime: number; // in seconds
}

type CreateSpotreccState = {
    adminComments: string | undefined,
    subExercises: SpotreccSubExercise[];
}

type Action = {
    setAdminComments: (adminComments: string | undefined) => void;
    addSubExercise: (exercise: SpotreccSubExercise) => void;
    updateSubExercise: (updartedExercise: SpotreccSubExercise) => void;
    removeSubExercise: (fileRoute: FileRoute) => void;
    resetStore: () => void;
}

export const useCreateSpotreccStore = create<CreateSpotreccState & Action>(
    (set) => ({
        adminComments: undefined,
        subExercises: [],
        setAdminComments: (adminComments) => set(() => ({ adminComments: adminComments })),
        addSubExercise: (subExercise) => set((state) => {
            const exists = state.subExercises.some(exercise =>
                exercise.fileRoute.mainId === subExercise.fileRoute.mainId &&
                exercise.fileRoute.subTypeId === subExercise.fileRoute.subTypeId &&
                exercise.fileRoute.modelId === subExercise.fileRoute.modelId &&
                exercise.fileRoute.fileType === subExercise.fileRoute.fileType &&
                exercise.fileRoute.objectName === subExercise.fileRoute.objectName);
            if (!exists) {
                return {
                    subExercises: [...state.subExercises, subExercise]
                };
            }
            return state;
        }),
        updateSubExercise: (updatedExercise) => set((state) => ({
            subExercises: state.subExercises.map((subExercise) =>
                subExercise.fileRoute.mainId === updatedExercise.fileRoute.mainId &&
                    subExercise.fileRoute.subTypeId === updatedExercise.fileRoute.subTypeId &&
                    subExercise.fileRoute.modelId === updatedExercise.fileRoute.modelId &&
                    subExercise.fileRoute.fileType === updatedExercise.fileRoute.fileType &&
                    subExercise.fileRoute.objectName === updatedExercise.fileRoute.objectName
                    ? updatedExercise
                    : subExercise
            )
        })),
        removeSubExercise: (fileRoute) => set((state) => ({
            subExercises: state.subExercises.filter(
                (subExercise) =>
                    !(
                        subExercise.fileRoute.mainId === fileRoute.mainId &&
                        subExercise.fileRoute.subTypeId === fileRoute.subTypeId &&
                        subExercise.fileRoute.modelId === fileRoute.modelId &&
                        subExercise.fileRoute.fileType === fileRoute.fileType &&
                        subExercise.fileRoute.objectName === fileRoute.objectName
                    )
            )
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

