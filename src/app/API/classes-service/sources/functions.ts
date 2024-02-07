export const getSourcesList = async (): Promise<ResponseSourceType[] | null> => {
    try {
        const response = await fetch(
            "http://localhost:8080/api/sources",
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
