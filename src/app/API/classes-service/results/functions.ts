export interface ResultType {
    _id: string;
    userId: string;
    date: Date;
    exerciseId: string;
    answers: string[];
    score: number;
}
export const startExercise = async (exerciseId: string, userId: string): Promise<ResultType | null> => {
    try {
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
            console.error("Failed to fetch lessons by id.");
            return null;
        }
    } catch (error) {
        console.error("Error fetching level:", error);
        return null;
    }
};

export const submitExercise = async (resultId: string, exerciseId: string, userId: string): Promise<ResultType | null> => {
    try {
        const response = await fetch(
            `http://localhost:8080/api/results/${resultId}`,
            {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: userId,
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
            console.error("Failed to fetch lessons by id.");
            return null;
        }
    } catch (error) {
        console.error("Error fetching level:", error);
        return null;
    }
};