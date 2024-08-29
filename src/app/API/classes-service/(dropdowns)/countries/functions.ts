import { COURSES_SERVICE_ENDPOINTS } from "../../apis";

export const getCountriesList = async (): Promise<CountryType[] | null> => {
    try {
        const response = await fetch(
            `${COURSES_SERVICE_ENDPOINTS.COUNTRIES}`,
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
            console.log("getCountriesList data", data);
            const countriesList = data.countries as CountryType[];
            if (countriesList) {
                localStorage.setItem("countriesList", JSON.stringify(countriesList));
                return countriesList;
            } else return null;
        } else {
            console.error("Failed to fetch countriesList.");
            return null;
        }
    } catch (error) {
        console.error("Error fetching countriesList:", error);
        return null;
    }
};
