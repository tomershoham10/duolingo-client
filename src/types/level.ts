export interface LevelType {
    _id: string;
    name: string;
    lessonsIds?: string[];
    suspendedLessonsIds?: string[];
    exercisesIds?: string[];
    suspendedExercisesIds?: string[];
} 