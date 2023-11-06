import { Dispatch, SetStateAction } from "react";

export enum TypesOfLessons {
    searider = "searider",
    crew = "crew",
    senior = "senior",
}

export interface LessonType {
    _id: string;
    name: string;
    exercises: string[];
    type: TypesOfLessons;
}

export const getLessonsData = async (sectionId: string, setLessons?: Dispatch<SetStateAction<{
    sectionId: string;
    lessons: LessonType[];
}[]>>) => {
    try {
        const response = await fetch(
            `http://localhost:8080/api/sections/getLessonsById/${sectionId}`,
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
            // console.log("resLessons", resLessons);
            // setLessons((pervArr) => [
            //     ...pervArr,
            //     { sectionId: sectionId, lessons: resLessons },
            // ]);

            return resLessons;
        } else {
            console.error("Failed to fetch lessons by id.");
            return [];
        }
    } catch (error) {
        console.error("Error fetching section:", error);
        return [];
    }
};