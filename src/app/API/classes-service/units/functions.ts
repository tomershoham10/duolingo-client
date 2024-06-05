import { COURSES_SERVICE_ENDPOINTS, UNITS_API } from "../apis";

export const getUnits = async (): Promise<UnitType[] | null> => {
    try {
        const response = await fetch(
            `${COURSES_SERVICE_ENDPOINTS.UNITS}`,
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

        } else if (response.status === 404) {
            return [];
        } else {
            console.error("Failed to fetch unit by id.");
            return null;
        }
    } catch (error) {
        console.error("Error fetching unit by id:", error);
        return null;
    }
};

export const createByCourse = async (courseId: string): Promise<number> => {
    try {
        const response = await fetch(
            'http://localhost:8080/api/units/createByCourse',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    unitData: { levels: [] },
                    courseId: courseId,
                }),
            }
        );
        return response.status;
    } catch (error) {
        console.error("Error creating unit ny course:", error);
        return 500;
    }
};

export const getUnitById = async (unitId: string): Promise<UnitType | null> => {
    try {
        const response = await fetch(
            `${COURSES_SERVICE_ENDPOINTS.UNITS}/${unitId}`,
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

export const getLevelsData = async (unitId: string): Promise<LevelType[]> => {
    try {
        const response = await fetch(
            `${UNITS_API.GET_LEVELS_BY_ID}/${unitId}`,
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

        } else if (response.status === 404) {
            return [];
        } else {
            throw new Error('error while fetching levels');
        }
    } catch (error: any) {
        throw new Error(`error while fetching levels: ${error.message}`);
    }
};

export const getUnsuspendedLevelsData = async (unitId: string): Promise<LevelType[]> => {
    try {
        const response = await fetch(
            `${UNITS_API.GET_UNSUSPENDED_LEVELS_BY_ID}/${unitId}`,
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

        } else if (response.status === 404) {
            return [];
        } else {
            throw new Error('error while fetching levels');
        }
    } catch (error: any) {
        throw new Error(`error while fetching levels: ${error.message}`);
    }
};

export const updateUnit = async (unit: Partial<UnitType>): Promise<boolean> => {
    try {
        let fieldsToUpdate: Partial<UnitType> = {};

        unit.description ? fieldsToUpdate.description = unit.description : null;
        unit.levels ? fieldsToUpdate.levels = unit.levels : null;
        unit.suspendedLevels ? fieldsToUpdate.suspendedLevels = unit.suspendedLevels : null;
        unit.guidebook ? fieldsToUpdate.guidebook = unit.guidebook : null;

        console.log('updateUnit', fieldsToUpdate)

        const response = await fetch(
            `${COURSES_SERVICE_ENDPOINTS.UNITS}/${unit._id}`,
            {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(fieldsToUpdate)
            },
        );
        return response.status === 200;
    } catch (error: any) {
        throw new Error(`error while updating unit: ${error.message}`);
    }
}

export const suspendLevel = async (unitId: string, levelId: string): Promise<boolean> => {
    try {
        const response = await fetch(
            `${UNITS_API.SUSPENDED_LEVEL}/${unitId}/${levelId}`,
            {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
        return response.status === 200;
    } catch (error: any) {
        throw new Error(`error while updating level: ${error.message}`);
    }
}

export const unsuspendLevel = async (unitId: string, levelId: string): Promise<boolean> => {
    try {
        const response = await fetch(
            `${UNITS_API.UNSUSPENDED_LEVEL}/${unitId}/${levelId}`,
            {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
        return response.status === 200;
    } catch (error: any) {
        throw new Error(`error while updating level: ${error.message}`);
    }
}
