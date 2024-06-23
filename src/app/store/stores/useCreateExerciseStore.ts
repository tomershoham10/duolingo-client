"use client"
import { mountStoreDevtool } from 'simple-zustand-devtools';
import { create } from 'zustand';

type CreateExerciseState = {
    // recordId: string | undefined;
    type: ExercisesTypes | null;
    files: FileObject[];
    recordLength: number | null;
    sonolistFiles: string[];
    description: string | null;
    timeBuffers: TimeBuffersType[];

    relevant?: string[];
    targetsList?: string[];
    acceptableTargets?: string[];

    notableFeatures?: FeatureObject[];
}

type Action = {
    // updateRecordId: (recordId: CreateExerciseState['recordId']) => void;
    updateExerciseType: (type: CreateExerciseState['type']) => void;
    updateFiles: (files: CreateExerciseState['files']) => void;
    addFile: (file: FileObject) => void;
    updateRecordLength: (recordLength: CreateExerciseState['recordLength']) => void;
    updateSonolistFiles: (sonolistFiles: CreateExerciseState['sonolistFiles']) => void;
    updateDescription: (description: CreateExerciseState['description']) => void;
    updateTimeBuffers: (timeBuffers: CreateExerciseState['timeBuffers']) => void;
    updateRelevant: (relevant: CreateExerciseState['relevant']) => void;
    updateTargetsList: (targetsList: CreateExerciseState['targetsList']) => void;
    updateAcceptableTargets: (acceptableTargets: CreateExerciseState['acceptableTargets']) => void;
    resetStore: () => void;
}

export const useCreateExerciseStore = create<CreateExerciseState & Action>(
    (set) => ({
        // recordId: undefined,
        type: null,
        files: [],
        recordLength: null,
        sonolistFiles: [],
        description: null,
        timeBuffers: [],
        relevant: [],
        targetsList: [],
        acceptableTargets: [],
        // updateRecordId: (recordId) => set(() => ({ recordId: recordId })),
        updateExerciseType: (type) => set(() => ({ type: type })),
        updateFiles: (files) => set(() => ({ files: files })),
        addFile: (file) => set((state) => ({ files: [...state.files, file] })),
        updateRecordLength: (recordLength) => set(() => ({ recordLength: recordLength })),
        updateSonolistFiles: (sonolistFiles) => set(() => ({ sonolistFiles: sonolistFiles })),
        updateDescription: (description) => set(() => ({ description: description })),
        updateTimeBuffers: (timeBuffers) => set(() => ({ timeBuffers: timeBuffers })),
        updateRelevant: (relevant) => set(() => ({ relevant: relevant })),
        updateTargetsList: (targetsList) => set(() => ({ targetsList: targetsList })),
        updateAcceptableTargets: (acceptableTargets) => set(() => ({ acceptableTargets: acceptableTargets })),
        resetStore: () => {
            set(() => ({
                // recordId: undefined,
                type: null,
                files: [],
                sonolistFiles: [],
                description: null,
                timeBuffers: [],
                relevant: [],
                targetsList: [],
                acceptableTargets: [],
                notableFeatures: []
            }));
        }
    })
)

if (process.env.NODE_ENV === 'development') {
    mountStoreDevtool('useCreateExerciseStore', useCreateExerciseStore);
}

