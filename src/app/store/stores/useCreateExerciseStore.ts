"use client"
import { mountStoreDevtool } from 'simple-zustand-devtools';
import { create } from 'zustand';

type CreateExerciseState = {
    // recordId: string | undefined;
    type: ExercisesTypes | null;
    fileName: string | null;
    recordLength: number | null;
    sonolistFiles: string[];
    description: string | null;
    timeBuffers: TimeBuffersType[];
    relevant: string[];
    answersList: string[];
    acceptableAnswers: string[];
}

type Action = {
    // updateRecordId: (recordId: CreateExerciseState['recordId']) => void;
    updateExerciseType: (type: CreateExerciseState['type']) => void;
    updateFileName: (recordName: CreateExerciseState['fileName']) => void;
    updateRecordLength: (recordLength: CreateExerciseState['recordLength']) => void;
    updateSonolistFiles: (sonolistFiles: CreateExerciseState['sonolistFiles']) => void;
    updateDescription: (description: CreateExerciseState['description']) => void;
    updateTimeBuffers: (timeBuffers: CreateExerciseState['timeBuffers']) => void;
    updateRelevant: (relevant: CreateExerciseState['relevant']) => void;
    updateAnswersList: (answersList: CreateExerciseState['answersList']) => void;
    updateAcceptableAnswers: (acceptableAnswers: CreateExerciseState['acceptableAnswers']) => void;
    resetStore: () => void;
}

export const useCreateExerciseStore = create<CreateExerciseState & Action>(
    (set) => ({
        // recordId: undefined,
        type: null,
        fileName: null,
        recordLength: null,
        sonolistFiles: [],
        description: null,
        timeBuffers: [],
        relevant: [],
        answersList: [],
        acceptableAnswers: [],
        // updateRecordId: (recordId) => set(() => ({ recordId: recordId })),
        updateExerciseType: (type) => set(() => ({ type: type })),
        updateFileName: (fileName) => set(() => ({ fileName: fileName })),
        updateRecordLength: (recordLength) => set(() => ({ recordLength: recordLength })),
        updateSonolistFiles: (sonolistFiles) => set(() => ({ sonolistFiles: sonolistFiles })),
        updateDescription: (description) => set(() => ({ description: description })),
        updateTimeBuffers: (timeBuffers) => set(() => ({ timeBuffers: timeBuffers })),
        updateRelevant: (relevant) => set(() => ({ relevant: relevant })),
        updateAnswersList: (answersList) => set(() => ({ answersList: answersList })),
        updateAcceptableAnswers: (acceptableAnswers) => set(() => ({ acceptableAnswers: acceptableAnswers })),
        resetStore: () => {
            set(() => ({
                // recordId: undefined,
                type: null,
                recordName: null,
                recordLength: null,
                sonolistFiles: [],
                description: null,
                timeBuffers: [],
                relevant: [],
                answersList: [],
                acceptableAnswers: [],
            }));
        }
    })
)

if (process.env.NODE_ENV === 'development') {
    mountStoreDevtool('useCreateExerciseStore', useCreateExerciseStore);
}

