import { Dispatch, SetStateAction } from "react";

export enum DifficultyLevel {
    Easy = "Easy",
    Medium = "Medium",
    Hard = "Hard",
}

export interface FSAType {
    _id: string;
    filesKeys: string[];
    difficultyLevel: DifficultyLevel;
    options: string[];
    answers: string[]; //my be 2 correct answers
    firstTimeBuffer: number; //in minutes
    secondTimeBuffer: number; //in minutes
    description: string;
    dateCreated: Date;
}

export interface ResultType {
    _id: string;
    userId: string;
    date: Date;
    exerciseId: string;
    answers: string[];
    score: number;
}

export const getExercisesData = async (lessonId: string, setExercises?: Dispatch<SetStateAction<{
    lessonId: string;
    exercises: FSAType[];
}[]>>) => {
    try {
        const response = await fetch(
            `http://localhost:8080/api/lessons/getExercisesById/${lessonId}`,
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
            const resExercises = data.exercises;
            // console.log("resExercises", lessonId, resExercises);
            // setExercises((pervArr) => [
            //     ...pervArr,
            //     { lessonId: lessonId, exercises: resExercises },
            // ]);

            return resExercises;
        } else {
            console.error("Failed to fetch exercises by id.");
            return null;
        }
    } catch (error) {
        console.error("Error fetching lesson:", error);
        return [];
    }
};


export const getResultsData = async (lessonId: string, userId: string) => {
    try {
        const response = await fetch(
            `http://localhost:8080/api/lessons/getResultsByLessonAndUser/${lessonId}/results/${userId}`,
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
            const resResults = data.results;
            // console.log("resResults", `http://localhost:8080/api/lessons/getResultsByLessonAndUser/${lessonId}/results/${userId}`, resResults);
            // setExercises((pervArr) => [
            //     ...pervArr,
            //     { lessonId: lessonId, exercises: resExercises },
            // ]);

            return resResults as ResultType[];
        } else {
            console.error("Failed to fetch results by id.");
            return [];
        }
    } catch (error) {
        console.error("Error fetching lesson:", error);
        return [];
    }
};