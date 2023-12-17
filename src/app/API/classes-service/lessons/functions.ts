import { FSAType } from "../exercises/FSA/functions";

export enum TypesOfLessons {
    searider = "searider",
    crew = "crew",
    senior = "senior",
}

export interface LessonType {
    _id: string;
    name: string;
    exercises: string[];
    type: TypesOfLessons;
}

export interface ResultType {
    _id: string;
    userId: string;
    date: Date;
    exerciseId: string;
    answers: string[];
    score: number;
}

export const getAllLessons = async (): Promise<LessonType[] | null> => {
    try {
        const response = await fetch(
            "http://localhost:8080/api/lessons/",
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
            const resLessons = data.lessons;
            // console.log("leves api - getAllLessons", resLessons);
            return resLessons;
        } else {
            console.error("Failed to fetch all Lessons.");
            return [];
        }
    } catch (error) {
        console.error("Error fetching Lessons:", error);
        return [];
    }
};

export const getExercisesData = async (lessonId: string): Promise<FSAType[] | null> => {
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

export const getResultsData = async (lessonId: string, userId: string): Promise<{ numOfExercises: number, results: ResultType[] } | []> => {
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

            return resResults as { numOfExercises: number, results: ResultType[] };
        } else {
            console.error("Failed to fetch results by id.");
            return [];
        }
    } catch (error) {
        console.error("Error fetching lesson:", error);
        return [];
    }
};