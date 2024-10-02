import { COURSES_SERVICE_ENDPOINTS } from "../apis";


interface ResponseRelevantType extends RelevantType {
    __v: number
}


export const getRelevantLists = async (): Promise<RelevantType[] | null> => {
    try {
        const response = await fetch(
            `${COURSES_SERVICE_ENDPOINTS.RELEVANT}`,
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
            console.log("getRelevantLists data", data);
            const relevantLists = data.lists as ResponseRelevantType[];
            if (relevantLists) {
                const formatedRelevantLists = relevantLists.map(({ __v, ...rest }) => rest)
                localStorage.setItem(
                    "relevantLists", JSON.stringify(formatedRelevantLists));
                return formatedRelevantLists;
            } else return null;
        } else {
            console.error("Failed to fetch relevantLists.");
            return null;
        }
    } catch (error) {
        console.error("Error fetching relevantLists:", error);
        return null;
    }
};
