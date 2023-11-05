import { Dispatch, SetStateAction } from "react";

interface SectionType {
    _id: string;
    lessons?: string[];
}

export const getSectionsData = async (unitId: string, setSections?: Dispatch<SetStateAction<{
    unitId: string;
    sections: SectionType[];
}[]>>) => {
    try {
        const response = await fetch(
            `http://localhost:8080/api/units/getSectionsById/${unitId}`,
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
            const resSections = data.sections;

            // setSections((pervArr) => [
            //     ...pervArr,
            //     { unitId: unitId, sections: resSections },
            // ]);

            return resSections;

        } else {
            console.error("Failed to fetch unit by id.");
            return [];
        }
    } catch (error) {
        console.error("Error fetching courses:", error);
        return [];
    }
};