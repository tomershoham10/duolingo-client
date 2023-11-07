import { Dispatch, SetStateAction } from "react";

export interface LevelType {
    _id: string;
    lessons?: string[];
}

export const getLevelsData = async (unitId: string, setLevels?: Dispatch<SetStateAction<{
    unitId: string;
    levels: LevelType[];
}[]>>) => {
    try {
        const response = await fetch(
            `http://localhost:8080/api/units/getLevelsById/${unitId}`,
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

            // setLevels((pervArr) => [
            //     ...pervArr,
            //     { unitId: unitId, levels: resLevels },
            // ]);

            return resLevels;

        } else {
            console.error("Failed to fetch unit by id.");
            return [];
        }
    } catch (error) {
        console.error("Error fetching courses:", error);
        return [];
    }
};