export const getOptionsByExerciseId = async (currentExerciseId: string) => {
    try {
        const response = await fetch(
            `http://localhost:8080/api/FSA/getOptionsById/${currentExerciseId}`,
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
            const resOptions = data.options;
            return resOptions;
        } else {
            console.error("Failed to fetch options by id.");
            return response;
        }
    } catch (error) {
        console.error("Error fetching options:", error);
        return [];
    }
};


export const getAnswersByExerciseId = async (currentExerciseId: string) => {
    try {
        const response = await fetch(
            `http://localhost:8080/api/lessons/getAnswersById/${currentExerciseId}`,
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
