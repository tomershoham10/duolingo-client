import { LessonType } from "../lessons/functions";

export interface LevelType {
    _id: string;
    lessons?: string[];
}

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

export const getLessonsData = async (levelId: string): Promise<LessonType[] | null> => {
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
            console.log("leves api - resLessons", resLessons);
            // setLessons((pervArr) => [
            //     ...pervArr,
            //     { levelId: levelId, lessons: resLessons },
            // ]);

            return resLessons;
        } else {
            console.error("Failed to fetch lessons by id.");
            return [];
        }
    } catch (error) {
        console.error("Error fetching level:", error);
        return [];
    }
};