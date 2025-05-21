import { COURSES_SERVICE_ENDPOINTS, RESULTS_API } from "../apis";

export const getResultsByLevelAndUser = async (levelId: string, userId: string): Promise<ResultType[] | null> => {
    try {
        // console.log(`http://localhost:8080/api/results/getResultsByLessonAndUser/${levelId}/${userId}`);
        const response = await fetch(
            `${RESULTS_API.GET_RESULTS_BY_EXERCISE_AND_USER}/${levelId}/${userId}`,
            {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                }
            },
        );
        if (response.ok) {
            const data = await response.json();
            // console.log("ResultsByLessonAndUser data", data);
            const results = data.results as ResultType[];
            if (results) {
                return results
            } else return null
        } else {
            console.error("Failed to fetch Results By LevelAndUser.");
            return null;
        }
    } catch (error) {
        console.error("Error fetching ResultsByLevelAndUser:", error);
        return null;
    }
};

export const startExercise = async (levelId: string, exerciseId: string, userId: string): Promise<ResultType | null> => {
    try {
        console.log("startExercise", "userId:", userId,
            "levelId:", levelId,
            "exerciseId:", exerciseId,
            "answers:", [],
            "score:", -1)
        const response = await fetch(
            `${COURSES_SERVICE_ENDPOINTS.RESULTS}`,
            {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: userId,
                    levelId: levelId,
                    exerciseId: exerciseId,
                    answers: [],
                    score: -1
                })
            },
        );
        if (response.ok) {
            const data = await response.json();
            const newResult = data.newResult;
            if (newResult) {
                return newResult
            } else return null
        } else {
            console.error("Failed to initiat exercise.");
            return null;
        }
    } catch (error) {
        console.error("Failed to initiat exercise:", error);
        return null;
    }
};

export const submitExercise = async (resultToSubmit: Partial<ResultType>): Promise<ResultType | null> => {
    try {
        const response = await fetch(
            `${COURSES_SERVICE_ENDPOINTS.RESULTS}/${resultToSubmit._id}`,
            {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(
                    resultToSubmit
                )
            },
        );
        if (response.ok) {
            const data = await response.json();
            const updatedResult = data.updatedResult;
            console.log("response", updatedResult)
            if (updatedResult) {
                return updatedResult;
            } else return null
        } else {
            console.error("Failed to update result.");
            return null;
        }
    } catch (error) {
        console.error("Error updating result:", error);
        return null;
    }
};