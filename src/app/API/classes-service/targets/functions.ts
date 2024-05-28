import { COURSES_SERVICE_ENDPOINTS } from "../apis";

export const getTargetsList = async (): Promise<ResponseTargetType[] | null> => {
    try {
        const response = await fetch(
            `${COURSES_SERVICE_ENDPOINTS.TARGETS}`,
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
            console.log("getTargetsList data", data);
            const targetsList = data.targets as ResponseTargetType[];
            if (targetsList) {
                localStorage.setItem(
                    "targetsList", JSON.stringify(targetsList.map(({ __v, ...rest }) => rest)));
                return targetsList;
            } else return null;
        } else {
            console.error("Failed to fetch TargetsList.");
            return null;
        }
    } catch (error) {
        console.error("Error fetching TargetsList:", error);
        return null;
    }
};
