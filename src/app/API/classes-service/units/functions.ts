export interface UnitType {
    _id: string;
    levels?: string[];
    guidebook?: string;
    description?: string;
}


export const getUnits = async (): Promise<UnitType[] | null> => {
    try {
        const response = await fetch(
            "http://localhost:8080/api/units/",
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
            const resUnits = data.units;
            return resUnits;

        } else {
            console.error("Failed to fetch unit by id.");
            return null;
        }
    } catch (error) {
        console.error("Error fetching unit by id:", error);
        return null;
    }
};

export const getUnitById = async (unitId: string): Promise<UnitType | null> => {
    try {
        const response = await fetch(
            `http://localhost:8080/api/units/${unitId}`,
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
            const resUnit = data.unit;
            return resUnit;

        } else {
            console.error("Failed to fetch unit by id.");
            return null;
        }
    } catch (error) {
        console.error("Error fetching unit by id:", error);
        return null;
    }
};

export const getLevelsData = async (unitId: string) => {
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
            // console.log("api units - getlevels res", data, resLevels);

            // setLevels((pervArr) => [
            //     ...pervArr,
            //     { unitId: unitId, levels: resLevels },
            // ]);

            return resLevels;

        } else {
            console.error("Failed to fetch unit getLevelsData.");
            return [];
        }
    } catch (error) {
        console.error("Error fetching getLevelsData:", error);
        return [];
    }
};