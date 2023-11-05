import { Dispatch, SetStateAction } from "react";

enum DifficultyLevel {
    Easy = "Easy",
    Medium = "Medium",
    Hard = "Hard",
}

interface FSAType {
    id: string;
    filesKeys: string[];
    difficultyLevel: DifficultyLevel;
    options: string[];
    answers: string[]; //my be 2 correct answers
    firstTimeBuffer: number; //in minutes
    secondTimeBuffer: number; //in minutes
    description: string;
    dateCreated: Date;
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