import { COURSES_SERVICE_ENDPOINTS, LESSONS_API } from "../apis";

export const getAllLessons = async (): Promise<LessonType[] | null> => {
    try {
        const response = await fetch(
            `${COURSES_SERVICE_ENDPOINTS.LESSONS}`,
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
            const resLessons = data.lessons;
            // console.log("leves api - getAllLessons", resLessons);
            return resLessons;
        } else {
            console.error("Failed to fetch all Lessons.");
            return [];
        }
    } catch (error) {
        console.error("Error fetching Lessons:", error);
        return [];
    }
};

export const updateLesson = async (lessonId: string, newFields: Partial<LessonType>): Promise<boolean> => {
    try {
        console.log("updateLesson newFields", newFields);
        const response = await fetch(
            `${COURSES_SERVICE_ENDPOINTS.LESSONS}/${lessonId}`,
            {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newFields)
            },
        );
        return response.ok;
    } catch (error) {
        console.error("Error fetching lesson:", error);
        return false;
    }
};


export const getExercisesData = async (lessonId: string): Promise<ExerciseType[]> => {
    try {
        const response = await fetch(
            `${LESSONS_API.GET_EXERCISES_BY_ID}/${lessonId}`,
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
        } else if (response.status === 404) {
            return [];
        } else {
            throw new Error('error while fetching Exercises');
        }
    } catch (error: any) {
        console.log(error.message)
        throw new Error(`error while fetching Exercises: ${error.message}`);
    }
};

export const getUnsuspendedExercisesData = async (lessonId: string): Promise<ExerciseType[]> => {
    try {
        const response = await fetch(
            `${LESSONS_API.GET_EXERCISES_BY_ID}/${lessonId}`,
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
        }
        else if (response.status === 404) {
            console.log('getUnsuspendedExercisesData - 404');
            return [];
        }
        else {
            throw new Error('error while fetching Exercises');
        }
    } catch (error: any) {
        throw new Error(`error while fetching Exercises: ${error.message}`);
    }
};

export const getResultsData = async (lessonId: string, userId: string) => {
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

