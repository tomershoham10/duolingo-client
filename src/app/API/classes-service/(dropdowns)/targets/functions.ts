import { COURSES_SERVICE_ENDPOINTS } from "../../apis";

export const getTargetsList = async (): Promise<TargetType[] | null> => {
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
                const formatedTargetsList = targetsList.map(({ __v, ...rest }) => rest)
                localStorage.setItem(
                    "targetsList", JSON.stringify(formatedTargetsList));
                return formatedTargetsList;
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
