export const getAllLevels = async (): Promise<LevelType[] | null> => {
    try {
        const response = await fetch(
            "http://localhost:8080/api/levels/",
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

export const getLessonsData = async (levelId: string): Promise<LessonType[]> => {
    try {
        const response = await fetch(
            `http://localhost:8080/api/levels/getLessonsById/${levelId}`,
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
            `http://localhost:8080/api/levels/getsUnsuspendedLessonsById/${levelId}`,
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
            console.log("leves api getUnsuspendedLessonsData - resLessons", resLessons);
            return resLessons;
        } else {
            throw new Error('error while fetching lessons');
        }
    } catch (error: any) {
        throw new Error(`error while fetching lessons: ${error.message}`);
    }
};