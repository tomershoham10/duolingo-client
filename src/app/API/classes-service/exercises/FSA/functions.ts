import { COURSES_SERVICE_ENDPOINTS, EXERCISES_API } from "@/app/API/classes-service/apis";

export const getAllFSAs = async (): Promise<FSAType[]> => {
    try {
        const response = await fetch(
            `${COURSES_SERVICE_ENDPOINTS.EXERCISES.FSA}`,
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
            const resFSAs = data.exercises;
            console.log("leves api - getAllFSAs", resFSAs);
            return resFSAs;
        } else {
            console.error("Failed to fetch getAllFSAs.");
            return [];
        }
    } catch (error) {
        console.error("Error fetching getAllFSAs:", error);
        return [];
    }
};

export const getRelevantByFSAId = async (currentExerciseId: string): Promise<TargetType[]> => {
    try {
        // console.log(`http://localhost:8080/api/FSA/getRelevantByFSAId/${currentExerciseId}`);
        const response = await fetch(
            `${EXERCISES_API.FSA.GET_RELEVANT_BY_ID}/${currentExerciseId}`,
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
            `${EXERCISES_API.FSA.GET_ANSWERS_BY_FSA_ID}/${currentExerciseId}`,
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
            `${EXERCISES_API.FSA.GET_RESULT_BY_USER_AND_FSA_ID}/${currentExerciseId}/${userId}`,
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

export const createFSA = async (newFSA: Partial<FSAType>): Promise<string> => {
    try {
        console.log('create fsa')
        // let sonolistIds: string[] = []
        // if (newFSA.sonolist) {
        //     const uploadSonolistResponse = await uploadFile('sonograms', newFSA.sonolist) as UploadedObjectInfo[][];
        //     console.log("uploadSonolistResponse", uploadSonolistResponse);
        //     sonolistIds = Array(uploadSonolistResponse.map(array => array.map(item => item.etag)).join())
        //     console.log("sonolistIds", sonolistIds)
        // }

        const response = await fetch(
            `${COURSES_SERVICE_ENDPOINTS.EXERCISES.FSA}`,
            {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newFSA)
            },
        );
        if (response.ok) {
            console.log("create fsa res", response);
            const resJson = await response.json() as FSAType;
            if (response.status === 201) {
                console.log("new fsa", resJson);
            }
            return 'created successfully';
        } else {
            throw new Error('error creating FSA');
        }
    } catch (error) {
        console.error("Error creating fsa:", error);
        throw new Error(`error creating FSA ${error}`);
    }
};
