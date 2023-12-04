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

export interface ResultType {
    _id: string;
    userId: string;
    date: Date;
    exerciseId: string;
    answers: string[];
    score: number;
}

export const getExercisesData = async (lessonId: string) => {
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
            return response;
        }
    } catch (error) {
        console.error("Error fetching lesson:", error);
        return [];
    }
};


export const getResultsData = async (lessonId: string, userId: string): Promise<any> => {
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