"use client"
import { create } from 'zustand';

interface TimeBuffersType {
    timeBuffer: number;
    grade: number;
}

type CreateExerciseState = {
    recordIds: string[] | undefined;
    sonolistIds: string[] | undefined;
    description: string | undefined;
    timeBuffers: TimeBuffersType | undefined;
    relevant: string[] | undefined;
    answersList: string[] | undefined;
    acceptableAnswers: string[] | undefined;
}

type Action = {
    updateRecordIds: (recordIds: CreateExerciseState['recordIds']) => void;
    updateSonolistIds: (sonolistIds: CreateExerciseState['sonolistIds']) => void;
    updateDescription: (description: CreateExerciseState['description']) => void;
    updateTimeBuffers: (timeBuffers: CreateExerciseState['timeBuffers']) => void;
    updateRelevant: (relevant: CreateExerciseState['relevant']) => void;
    updateAnswersList: (answersList: CreateExerciseState['answersList']) => void;
    updateAcceptableAnswers: (acceptableAnswers: CreateExerciseState['acceptableAnswers']) => void;
}

export const useCreateExerciseStore = create<CreateExerciseState & Action>(
    (set) => ({
        recordIds: undefined,
        sonolistIds: undefined,
        description: undefined,
        timeBuffers: undefined,
        relevant: undefined,
        answersList: undefined,
        acceptableAnswers: undefined,
        updateRecordIds: (recordIds) => set(() => ({ recordIds: recordIds })),
        updateSonolistIds: (sonolistIds) => set(() => ({ sonolistIds: sonolistIds })),
        updateDescription: (description) => set(() => ({ description: description })),
        updateTimeBuffers: (timeBuffers) => set(() => ({ timeBuffers: timeBuffers })),
        updateRelevant: (relevant) => set(() => ({ relevant: relevant })),
        updateAnswersList: (answersList) => set(() => ({ answersList: answersList })),
        updateAcceptableAnswers: (acceptableAnswers) => set(() => ({ acceptableAnswers: acceptableAnswers })),
    })
)
