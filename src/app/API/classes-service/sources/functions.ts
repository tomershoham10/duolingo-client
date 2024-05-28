import { COURSES_SERVICE_ENDPOINTS } from "../apis";

export const getSourcesList = async (): Promise<ResponseSourceType[] | null> => {
    try {
        const response = await fetch(
            `${COURSES_SERVICE_ENDPOINTS.SOURCES}`,
            {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                }
            },
        );
        if (response.ok) {
            const data = await response.json();
            console.log("getSourcesList data", data);
            const sourcesList = data.sources as ResponseSourceType[];
            if (sourcesList) {
                localStorage.setItem(
                    "sourcesList", JSON.stringify(sourcesList.map(({ __v, ...rest }) => rest)));
                return sourcesList;
            } else return null;
        } else {
            console.error("Failed to fetch sourcesList.");
            return null;
        }
    } catch (error) {
        console.error("Error fetching sourcesList:", error);
        return null;
    }
};
