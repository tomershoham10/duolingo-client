export const getResultsByLessonAndUser = async (lessonId: string, userId: string): Promise<ResultType[] | null> => {
    try {
        // console.log(`http://localhost:8080/api/results/getResultsByLessonAndUser/${lessonId}/${userId}`);
        const response = await fetch(
            `http://localhost:8080/api/results/getResultsByLessonAndUser/${lessonId}/${userId}`,
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
            console.error("Failed to fetch Results By LessonAndUser.");
            return null;
        }
    } catch (error) {
        console.error("Error fetching ResultsByLessonAndUser:", error);
        return null;
    }
};

export const startExercise = async (lessonId: string, exerciseId: string, userId: string): Promise<ResultType | null> => {
    try {
        console.log("startExercise", "userId:", userId,
            "lessonId:", lessonId,
            "exerciseId:", exerciseId,
            "answers:", [],
            "score:", -1)
        const response = await fetch(
            `http://localhost:8080/api/results/`,
            {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: userId,
                    lessonId: lessonId,
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
            `http://localhost:8080/api/results/${resultToSubmit._id}`,
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
            console.log("resopnse", updatedResult)
            if (updatedResult) {
                return updatedResult;
            } else return null
        } else {
            console.error("Failed to fetch lessons by id.");
            return null;
        }
    } catch (error) {
        console.error("Error fetching level:", error);
        return null;
    }
};