import { COURSES_SERVICE_ENDPOINTS, LEVELS_API } from "../apis";
import { LevelType, LessonType, ExerciseType } from "@/app/types";

export const getAllLevels = async (): Promise<LevelType[] | null> => {
    try {
        const response = await fetch(
            `${COURSES_SERVICE_ENDPOINTS.LEVELS}`,
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
            // console.log("leves api - getAllLevels", resLevels);
            return resLevels;
        } else {
            console.error("Failed to fetch all levels.");
            return [];
        }
    } catch (error) {
        console.error("Error fetching levels:", error);
        return [];
    }
};

export const getLevelById = async (levelId: string): Promise<LevelType | null> => {
    try {
        const response = await fetch(
            `${COURSES_SERVICE_ENDPOINTS.LEVELS}/${levelId}`,
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
            const resLevel = data.level;
            return resLevel;

        } else {
            console.error("Failed to fetch level by id.");
            return null;
        }
    } catch (error) {
        console.error("Error fetching level by id:", error);
        return null;
    }
};

export const getLessonsData = async (levelId: string): Promise<LessonType[]> => {
    try {
        const response = await fetch(
            `${LEVELS_API.GET_LESSONS_BY_ID}/${levelId}`,
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
            const resLessons = data.lessons;
            console.log("leves api getLessonsData - resLessons", resLessons);
            return resLessons;
        } else if (response.status === 404) {
            return [];
        } else {
            throw new Error('error while fetching lessons');
        }
    } catch (error: any) {
        throw new Error(`error while fetching lessons: ${error.message}`);
    }
};

export const addLevelByUnitId = async (unitId: string): Promise<boolean> => {
    try {
        const response = await fetch(
            `${LEVELS_API.ADD_LEVEL_BY_UNIT_ID}/${unitId}`,
            {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );

        return response.status === 201;
    } catch (error: any) {
        throw new Error(`error while addLevelByUnitId: ${error.message}`);
    }
};

export const getUnsuspendedLessonsData = async (levelId: string): Promise<LessonType[]> => {
    try {
        const response = await fetch(
            `${LEVELS_API.GET_UNSUSPENDED_LESSON_BY_ID}/${levelId}`,
            {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
        console.log('getUnsuspendedLessonsData - response', response);

        if (response.ok) {
            const data = await response.json();
            const resLessons = data.lessons;
            // console.log("leves api getUnsuspendedLessonsData - resLessons", resLessons);
            return resLessons;
        } else if (response.status === 404) {
            console.log('getUnsuspendedLessonsData - 404');
            return [];
        } else {
            throw new Error('error while fetching lessons');
        }
    } catch (error: any) {
        throw new Error(`error while fetching lessons: ${error.message}`);
    }
};

export const updateLevel = async (level: Partial<LevelType>): Promise<boolean> => {
    try {
        let fieldsToUpdate: Partial<LevelType> = {};

        if (level.lessonsIds) fieldsToUpdate.lessonsIds = level.lessonsIds;
        if (level.suspendedLessonsIds) fieldsToUpdate.suspendedLessonsIds = level.suspendedLessonsIds;
        if (level.exercisesIds) fieldsToUpdate.exercisesIds = level.exercisesIds;
        if (level.suspendedExercisesIds) fieldsToUpdate.suspendedExercisesIds = level.suspendedExercisesIds;
        if (level.name) fieldsToUpdate.name = level.name;

        console.log('Updating level with fields:', fieldsToUpdate);

        const response = await fetch(
            `${COURSES_SERVICE_ENDPOINTS.LEVELS}/${level._id}`,
            {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(fieldsToUpdate)
            },
        );
        
        if (response.status === 200) {
            console.log('Level updated successfully, response:', await response.text());
            // The backend should handle cache clearing, but we'll log to confirm
            return true;
        } else {
            console.error('Failed to update level, status:', response.status);
            return false;
        }
    } catch (error: any) {
        console.error('Error while updating level:', error);
        throw new Error(`error while updating level: ${error.message}`);
    }
}

export const suspendLesson = async (levelId: string, lessonId: string): Promise<boolean> => {
    try {
        const response = await fetch(
            `${LEVELS_API.SUSPENDED_LESSON}/${levelId}/${lessonId}`,
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

export const unsuspendLesson = async (levelId: string, lessonId: string): Promise<boolean> => {
    try {
        const response = await fetch(
            `${LEVELS_API.UNSUSPENDED_LESSON}/${levelId}/${lessonId}`,
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

export const createByCourse = async (courseId: string): Promise<boolean> => {
    try {
        const response = await fetch(
            `${LEVELS_API.ADD_LEVEL_BY_COURSE}/${courseId}`,
            {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );

        return response.status === 201;
    } catch (error: any) {
        throw new Error(`error while creating level by course: ${error.message}`);
    }
};

export const deleteLevelById = async (levelId: string): Promise<boolean> => {
    try {
        const host = process.env.NEXT_PUBLIC_HOST || 'localhost';
        const url = `http://${host}:8080/api/levels/${levelId}`;
        console.log("Deleting level with ID:", levelId, "using URL:", url);
        
        const response = await fetch(
            url,
            {
                method: "DELETE",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
        
        console.log("Delete level response:", response.status, response.statusText);
        return response.status === 200 || response.status === 201 || response.status === 204;
    } catch (error: any) {
        console.error("Error deleting level:", error);
        throw new Error(`error while deleting level: ${error.message}`);
    }
};

export const getExercisesByLevelId = async (levelId: string): Promise<ExerciseType[]> => {
    try {
        const url = `${LEVELS_API.GET_EXERCISES_BY_ID}/${levelId}`;
        console.log('getExercisesByLevelId - Fetching from URL:', url);
        
        const response = await fetch(
            url,
            {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );

        console.log('getExercisesByLevelId - Response status:', response.status);

        if (response.ok) {
            const data = await response.json();
            console.log('getExercisesByLevelId - Raw response data:', data);
            const resExercises = data.exercises || [];
            console.log(`getExercisesByLevelId - Found ${resExercises.length} exercises for level ${levelId}`);
            return resExercises;
        } else if (response.status === 404) {
            console.log('getExercisesByLevelId - 404: No exercises found for level', levelId);
            return [];
        } else {
            console.error("Failed to fetch exercises by level id. Status:", response.status);
            return [];
        }
    } catch (error: any) {
        console.error("Error fetching exercises by level id:", error);
        throw new Error(`error while fetching exercises: ${error.message}`);
    }
};

export const removeExerciseFromLevel = async (levelId: string, exerciseId: string): Promise<boolean> => {
    try {
        console.log('removeExerciseFromLevel called with:', { levelId, exerciseId });
        
        // Get the current level data
        const currentLevel = await getLevelById(levelId);
        console.log('Current level data:', currentLevel);
        
        if (!currentLevel) {
            console.error('Failed to fetch level data');
            return false;
        }

        // Check if exercise exists in the level
        if (!currentLevel.exercisesIds?.includes(exerciseId)) {
            console.log('Exercise not found in this level');
            return false;
        }

        // Remove the exercise ID from the level's exercisesIds array
        const updatedExercisesIds = currentLevel.exercisesIds.filter(id => id !== exerciseId);
        console.log('Updated exercisesIds:', updatedExercisesIds);
        
        // Update the level with the new exercisesIds
        const success = await updateLevel({
            _id: levelId,
            exercisesIds: updatedExercisesIds
        });

        if (success) {
            console.log('Exercise removed successfully from level');
            return true;
        } else {
            console.error('Failed to update level after removing exercise');
            return false;
        }
    } catch (error) {
        console.error('Error removing exercise from level:', error);
        return false;
    }
};