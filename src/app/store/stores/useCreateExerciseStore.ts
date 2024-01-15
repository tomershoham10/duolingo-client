"use client"
import { create } from 'zustand';

interface TimeBuffersType {
    timeBuffer: number;
    grade: number;
}

type CreateExerciseState = {
    recordName: string | undefined;
    sonolistFiles: string[] | undefined;
    description: string | undefined;
    timeBuffers: TimeBuffersType | undefined;
    relevant: string[] | undefined;
    answersList: string[] | undefined;
    acceptableAnswers: string[] | undefined;
}

type Action = {
    updateRecordName: (recordName: CreateExerciseState['recordName']) => void;
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
        sonolistFiles: undefined,
        description: undefined,
        timeBuffers: undefined,
        relevant: undefined,
        answersList: undefined,
        acceptableAnswers: undefined,
        updateRecordName: (recordName) => set(() => ({ recordName: recordName })),
        updateSonolistFiles: (sonolistFiles) => set(() => ({ sonolistFiles: sonolistFiles })),
        updateDescription: (description) => set(() => ({ description: description })),
        updateTimeBuffers: (timeBuffers) => set(() => ({ timeBuffers: timeBuffers })),
        updateRelevant: (relevant) => set(() => ({ relevant: relevant })),
        updateAnswersList: (answersList) => set(() => ({ answersList: answersList })),
        updateAcceptableAnswers: (acceptableAnswers) => set(() => ({ acceptableAnswers: acceptableAnswers })),
    })
)
