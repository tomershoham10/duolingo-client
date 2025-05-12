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

export const getLessonById = async (lessonId: string|undefined,): Promise<LessonType | null> => {
    try {
        const response = await fetch(
            `${COURSES_SERVICE_ENDPOINTS.LESSONS}/${lessonId}`,
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
            const resLesson = data.lesson;
            // console.log("leves api - getAllLessons", resLessons);
            return resLesson;
        } else {
            console.error("Failed to fetch Lesson: " + lessonId);
            return null;
        }
    } catch (error) {
        console.error("Error fetching Lesson: " + lessonId + " :", error);
        return null;
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

interface LessonWithExericesType extends LessonType {
    exercises: (FsaType | SpotreccType)[]
}

export const getExercisesData = async (lessonId: string): Promise<LessonWithExericesType | null> => {
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
            console.log(data);
            const resExercises = data.data[0];
            return resExercises;
        } else if (response.status === 404) {
            return null;
        } else {
            throw new Error('error while fetching Exercises');
        }
    } catch (error: any) {
        console.log(error.message)
        throw new Error(`error while fetching Exercises: ${error.message}`);
    }
};

export const addLessonByLevelId = async (levelId: string): Promise<boolean> => {
    try {
        const response = await fetch(
            `${LESSONS_API.ADD_LESSON_BY_LEVEL_ID}/${levelId}`,
            {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );

        return response.status === 201;
    } catch (error: any) {
        throw new Error(`error while addLessonByLevelId: ${error.message}`);
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
            `${LESSONS_API.GET_RESULTS_BY_LESSON_AND_USER}/${lessonId}/results/${userId}`,
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

