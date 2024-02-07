"use client"
import { mountStoreDevtool } from 'simple-zustand-devtools';
import { create } from 'zustand';

type CreateExerciseState = {
    recordName: string | undefined;
    recordLength: number | undefined;
    sonolistFiles: string[] | undefined;
    description: string | undefined;
    timeBuffers: TimeBuffersType | undefined;
    relevant: string[] | undefined;
    answersList: string[] | undefined;
    acceptableAnswers: string[] | undefined;
}

type Action = {
    updateRecordName: (recordName: CreateExerciseState['recordName']) => void;
    updateRecordLength: (recordLength: CreateExerciseState['recordLength']) => void;
    updateSonolistFiles: (sonolistFiles: CreateExerciseState['sonolistFiles']) => void;
    updateDescription: (description: CreateExerciseState['description']) => void;
    updateTimeBuffers: (timeBuffers: CreateExerciseState['timeBuffers']) => void;
    updateRelevant: (relevant: CreateExerciseState['relevant']) => void;
    updateAnswersList: (answersList: CreateExerciseState['answersList']) => void;
    updateAcceptableAnswers: (acceptableAnswers: CreateExerciseState['acceptableAnswers']) => void;
}

export const useCreateExerciseStore = create<CreateExerciseState & Action>(
    (set) => ({
        recordName: undefined,
        recordLength: undefined,
        sonolistFiles: undefined,
        description: undefined,
        timeBuffers: undefined,
        relevant: undefined,
        answersList: undefined,
        acceptableAnswers: undefined,
        updateRecordName: (recordName) => set(() => ({ recordName: recordName })),
        updateRecordLength: (recordLength) => set(() => ({ recordLength: recordLength })),
        updateSonolistFiles: (sonolistFiles) => set(() => ({ sonolistFiles: sonolistFiles })),
        updateDescription: (description) => set(() => ({ description: description })),
        updateTimeBuffers: (timeBuffers) => set(() => ({ timeBuffers: timeBuffers })),
        updateRelevant: (relevant) => set(() => ({ relevant: relevant })),
        updateAnswersList: (answersList) => set(() => ({ answersList: answersList })),
        updateAcceptableAnswers: (acceptableAnswers) => set(() => ({ acceptableAnswers: acceptableAnswers })),
    })
)

if (process.env.NODE_ENV === 'development') {
    mountStoreDevtool('useCreateExerciseStore', useCreateExerciseStore);
}
