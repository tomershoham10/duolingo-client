import { FSA_API } from "../../apis";

export const getRelevantByExerciseId = async (currentExerciseId: string): Promise<TargetType[]> => {
    try {
        const response = await fetch(
            `${FSA_API.GET_RELEVANT_BY_ID}/${currentExerciseId}`,
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
            return [];
        }
        if (response.ok) {
            const data = await response.json();

            const resRelevant = data.relevantTargets;
            return resRelevant;
        } else {
            console.error("Failed to fetch targets by id.");
            return [];
        }
    } catch (error) {
        console.error("Error fetching targets:", error);
        return [];
    }
};

export const getAnswersByExerciseId = async (currentExerciseId: string) => {
    try {
        const response = await fetch(
            `${FSA_API.GET_ANSWERS_BY_EXERCISE_ID}/${currentExerciseId}`,
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

