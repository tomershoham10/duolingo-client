import { TargetType } from "@/app/store/stores/useTargetStore";

export interface TimeBuffersType {
    timeBuffer: number;
    grade: number;
}

export interface FSAType {
    _id: string;
    filesKeys: string[];
    difficultyLevel: number;
    relevant: string[];
    answers: string[]; //may be 2 correct answers
    timeBuffers: TimeBuffersType[];
    description: string;
    dateCreated: Date;
    sonolistKeys: string[];
}

export const getAllFSAs = async (): Promise<FSAType[] | null> => {
    try {
        const response = await fetch(
            "http://localhost:8080/api/FSA/",
            {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
        if (response.ok) {
            const data = await response.json();
            const resFSAs = data.exercises;
            console.log("leves api - getAllFSAs", resFSAs);
            return resFSAs;
        } else {
            console.error("Failed to fetch getAllFSAs.");
            return null;
        }
    } catch (error) {
        console.error("Error fetching getAllFSAs:", error);
        return null;
    }
};

export const getRelevantByFSAId = async (currentExerciseId: string): Promise<TargetType[] | number | null> => {
    try {
        // console.log(`http://localhost:8080/api/FSA/getRelevantByFSAId/${currentExerciseId}`);
        const response = await fetch(
            `http://localhost:8080/api/FSA/getRelevantByFSAId/${currentExerciseId}`,
            {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
        if (response.status !== 200) {
            console.log("Not found");
            return response.status;
        }
        if (response.ok) {
            const data = await response.json();

            const resRelevant = data.relevantTargets;
            return resRelevant;
        } else {
            console.error("Failed to fetch targets by id.");
            return null;
        }
    } catch (error) {
        console.error("Error fetching targets:", error);
        return [];
    }
};

export const getAnswersByExerciseId = async (currentExerciseId: string) => {
    try {
        const response = await fetch(
            `http://localhost:8080/api/FSA/getAnswersByFSAId/${currentExerciseId}`,
            {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
        if (response.ok) {
            const data = await response.json();
            if (!data) {
                console.error("Empty response body.");
                return [];
            }
            const resAnswers = data.answers;
            return resAnswers;
        } else {
            console.error("Failed to fetch answers by id.");
            return response;
        }
    } catch (error) {
        console.error("Error fetching lesson:", error);
        return [];
    }
};

export const getResultByUserAndFSAId = async (currentExerciseId: string, userId: string) => {
    try {
        const response = await fetch(
            `http://localhost:8080/api/FSA/getResultByUserAndFSAId/${currentExerciseId}/${userId}`,
            {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
        // console.log("response", response);
        if (response.ok) {
            const data = await response.json();
            if (!data) {
                console.error("Empty response body.");
                return [];
            }
            const resResult = data.result;
            return resResult;
        } else {
            console.error("Failed to fetch result by id.");
            console.log("not ok", response);
            return response.status;
        }
    } catch (error) {
        console.error("Error fetching ResultByUserAndFSAId:", error);
        return [];
    }
};

