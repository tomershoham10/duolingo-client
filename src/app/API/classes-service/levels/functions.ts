import { COURSES_SERVICE_ENDPOINTS, LEVELS_API } from "../apis";

export const getAllLevels = async (): Promise<LevelType[] | null> => {
    try {
        const response = await fetch(
            `${COURSES_SERVICE_ENDPOINTS.LEVELS}`,
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
            const resLevels = data.levels;
            // console.log("leves api - getAllLevels", resLevels);
            return resLevels;
        } else {
            console.error("Failed to fetch all levels.");
            return [];
        }
    } catch (error) {
        console.error("Error fetching levels:", error);
        return [];
    }
};

export const getLevelById = async (levelId: string): Promise<LevelType | null> => {
    try {
        const response = await fetch(
            `${COURSES_SERVICE_ENDPOINTS.LEVELS}/${levelId}`,
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
            const resLevel = data.level;
            return resLevel;

        } else {
            console.error("Failed to fetch level by id.");
            return null;
        }
    } catch (error) {
        console.error("Error fetching level by id:", error);
        return null;
    }
};

export const getLessonsData = async (levelId: string): Promise<LessonType[]> => {
    try {
        const response = await fetch(
            `${LEVELS_API.GET_LESSONS_BY_ID}/${levelId}`,
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
            console.log("leves api getLessonsData - resLessons", resLessons);
            return resLessons;
        } else if (response.status === 404) {
            return [];
        } else {
            throw new Error('error while fetching lessons');
        }
    } catch (error: any) {
        throw new Error(`error while fetching lessons: ${error.message}`);
    }
};

export const getUnsuspendedLessonsData = async (levelId: string): Promise<LessonType[]> => {
    try {
        const response = await fetch(
            `${LEVELS_API.GET_UNSUSPENDED_LESSON_BY_ID}/${levelId}`,
            {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
        console.log('getUnsuspendedLessonsData - response', response);

        if (response.ok) {
            const data = await response.json();
            const resLessons = data.lessons;
            // console.log("leves api getUnsuspendedLessonsData - resLessons", resLessons);
            return resLessons;
        } else if (response.status === 404) {
            console.log('getUnsuspendedLessonsData - 404');
            return [];
        } else {
            throw new Error('error while fetching lessons');
        }
    } catch (error: any) {
        throw new Error(`error while fetching lessons: ${error.message}`);
    }
};

export const updateLevel = async (level: Partial<LevelType>): Promise<boolean> => {
    try {
        let fieldsToUpdate: Partial<LevelType> = {};

        level.lessons ? fieldsToUpdate.lessons : null;
        level.suspendedLessons ? fieldsToUpdate.suspendedLessons : null;

        const response = await fetch(
            `${COURSES_SERVICE_ENDPOINTS.LEVELS}/${level._id}`,
            {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(fieldsToUpdate)
            },
        );
        return response.status === 200;
    } catch (error: any) {
        throw new Error(`error while updating level: ${error.message}`);
    }
}

export const suspendLesson = async (levelId: string, lessonId: string): Promise<boolean> => {
    try {
        const response = await fetch(
            `${LEVELS_API.SUSPENDED_LESSON}/${levelId}/${lessonId}`,
            {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
        return response.status === 200;
    } catch (error: any) {
        throw new Error(`error while updating level: ${error.message}`);
    }
}

export const unsuspendLesson = async (levelId: string, lessonId: string): Promise<boolean> => {
    try {
        const response = await fetch(
            `${LEVELS_API.UNSUSPENDED_LESSON}/${levelId}/${lessonId}`,
            {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
        return response.status === 200;
    } catch (error: any) {
        throw new Error(`error while updating level: ${error.message}`);
    }
}