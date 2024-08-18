import { COURSES_SERVICE_ENDPOINTS, EXERCISES_API, FSA_API } from "@/app/API/classes-service/apis";

export enum ExercisesTypes {
    FSA = "fsa",
    SPOTRECC = "spotrecc"
}

export const createExercise = async (newExercise: Partial<FsaType> | Partial<SpotreccType>): Promise<string> => {
    try {
        console.log('create exercise');

        const response = await fetch(
            `${COURSES_SERVICE_ENDPOINTS.EXERCISES}`,
            {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newExercise)
            },
        );
        if (response.ok) {
            console.log("create exercise res", response);
            const resJson = await response.json() as ExerciseType;
            if (response.status === 201) {
                console.log("new exercise", resJson);
            }
            return 'created successfully';
        } else {
            throw new Error('error creating exercise');
        }
    } catch (error) {
        console.error("Error creating exercise:", error);
        throw new Error(`error creating exercise ${error}`);
    }
};

export const getAllExercises = async (): Promise<ExerciseType[]> => {
    try {
        const response = await fetch(
            `${COURSES_SERVICE_ENDPOINTS.EXERCISES}`,
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
            console.log("leves api - getAllExercises", resExercises);
            return resExercises;
        } else {
            console.error("Failed to fetch getAllExercises.");
            return [];
        }
    } catch (error) {
        console.error("Error fetching getAllExercises:", error);
        return [];
    }
};

export const getResultByUserAndExerciseId = async (currentExerciseId: string, userId: string) => {
    try {
        const response = await fetch(
            `${EXERCISES_API.GET_RESULT_BY_USER_AND_EXERCISE_ID}/${currentExerciseId}/${userId}`,
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
        console.error("Error fetching getResultByUserAndExerciseId:", error);
        return [];
    }
};


