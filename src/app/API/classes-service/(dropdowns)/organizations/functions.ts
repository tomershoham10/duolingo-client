import { COURSES_SERVICE_ENDPOINTS } from "../../apis";

export const getOrganizationsList = async (): Promise<OrganizationType[] | null> => {
    try {
        const response = await fetch(
            `${COURSES_SERVICE_ENDPOINTS.ORGANIZATIONS}`,
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
            console.log("getOrganizationsList data", data);
            const organizationsList = data.organizations as OrganizationType[];
            if (organizationsList) {
                localStorage.setItem("organizationsList", JSON.stringify(organizationsList));
                return organizationsList;
            } else return null;
        } else {
            console.error("Failed to fetch organizationsList.");
            return null;
        }
    } catch (error) {
        console.error("Error fetching organizationsList:", error);
        return null;
    }
};
