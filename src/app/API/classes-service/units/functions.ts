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

export const getLevelsData = async (unitId: string): Promise<LevelType[] | []> => {
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
            const resLevels = data.levels as LevelType[];

            return resLevels;

        } else {
            throw new Error('error while fetching levels');
        }
    } catch (error: any) {
        throw new Error(`error while fetching levels: ${error.message}`);
    }
};

export const getUnsuspendedLevelsData = async (unitId: string): Promise<LevelType[] | []> => {
    try {
        const response = await fetch(
            `http://localhost:8080/api/units/getUnsuspendedLevelsById/${unitId}`,
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
            const resLevels = data.levels as LevelType[];

            return resLevels;

        } else {
            throw new Error('error while fetching levels');
        }
    } catch (error: any) {
        throw new Error(`error while fetching levels: ${error.message}`);
    }
};