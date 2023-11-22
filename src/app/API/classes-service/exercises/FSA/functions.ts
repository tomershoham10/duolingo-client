export const getRelevantByFSAId = async (currentExerciseId: string) => {
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
            return response;
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

