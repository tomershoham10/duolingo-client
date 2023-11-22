import { TargetType } from "@/app/store/stores/useTargetStore";

interface ResponseTargetType extends TargetType {
    __v: number
}

export const getTargetsList = async (): Promise<ResponseTargetType[] | null> => {
    try {
        const response = await fetch(
            "http://localhost:8080/api/targets",
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
