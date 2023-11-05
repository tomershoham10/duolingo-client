import { Dispatch, SetStateAction } from "react";

interface UnitType {
    _id: string;
    sections?: string[];
    guidebook?: string;
    description?: string;
}

export const getUnitsData = async (courseId: string, setUnits: Dispatch<SetStateAction<UnitType[]>>) => {
    try {
        const response = await fetch(
            `http://localhost:8080/api/courses/getUnitsById/${courseId}`,
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
            const resUnits = data.units;
            // console.log(resUnits);
            setUnits(resUnits);
        } else {
            console.error("Failed to fetch course by id.");
            return [];
        }
    } catch (error) {
        console.error("Error fetching courses:", error);
        return [];
    }
};