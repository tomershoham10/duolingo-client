"use client"
import { mountStoreDevtool } from 'simple-zustand-devtools';
import { create } from 'zustand';

type CreateExerciseState = {
    recordId: string | undefined;
    recordName: string | undefined;
    recordLength: number | undefined;
    sonolistFiles: string[];
    description: string | undefined;
    timeBuffers: TimeBuffersType[];
    relevant: string[];
    answersList: string[];
    acceptableAnswers: string[];
}

type Action = {
    updateRecordId: (recordId: CreateExerciseState['recordId']) => void;
    updateRecordName: (recordName: CreateExerciseState['recordName']) => void;
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
        recordId: undefined,
        recordName: undefined,
        recordLength: undefined,
        sonolistFiles: [],
        description: undefined,
        timeBuffers: [],
        relevant: [],
        answersList: [],
        acceptableAnswers: [],
        updateRecordId: (recordId) => set(() => ({ recordId: recordId })),
        updateRecordName: (recordName) => set(() => ({ recordName: recordName })),
        updateRecordLength: (recordLength) => set(() => ({ recordLength: recordLength })),
        updateSonolistFiles: (sonolistFiles) => set(() => ({ sonolistFiles: sonolistFiles })),
        updateDescription: (description) => set(() => ({ description: description })),
        updateTimeBuffers: (timeBuffers) => set(() => ({ timeBuffers: timeBuffers })),
        updateRelevant: (relevant) => set(() => ({ relevant: relevant })),
        updateAnswersList: (answersList) => set(() => ({ answersList: answersList })),
        updateAcceptableAnswers: (acceptableAnswers) => set(() => ({ acceptableAnswers: acceptableAnswers })),
        resetStore: () => {
            set(() => ({
                recordId: undefined,
                recordName: undefined,
                recordLength: undefined,
                sonolistFiles: undefined,
                description: undefined,
                timeBuffers: undefined,
                relevant: undefined,
                answersList: undefined,
                acceptableAnswers: undefined,
            }));
        }
    })
)

if (process.env.NODE_ENV === 'development') {
    mountStoreDevtool('useCreateExerciseStore', useCreateExerciseStore);
}

