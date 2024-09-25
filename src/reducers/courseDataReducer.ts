export enum CourseDataActionsList {
    SET_COURSE_ID = 'setCourseId',
    SET_UNITS = 'setUnits',
    SET_SUSPENDED_UNITS_IDS = 'setSuspendedUnitsIds',
    SET_LEVELS = 'setLevels',
    // SET_UNSUSPENDED_LEVELS = 'setUNnsuspendedLevels',
    SET_LESSONS = 'setLessons',
    // SET_UNSUSPENDED_LESSONS = 'setUNnsuspendedLessons',
    SET_EXERCISES = 'setExercises',
    // SET_UNSUSPENDED_EXERCISES = 'setUNnsuspendedExercises',
    SET_RESULTS = 'setResults',
}

export interface DataWithFatherId<T> {
    fatherId: string | null;
    data: T[];
}

export interface ResultsState {
    lessonId: string;
    results: { numOfExercises: number; results: ResultType[] };
}[];

export type CourseDataAction =
    | { type: CourseDataActionsList.SET_COURSE_ID, payload: string | null }
    | { type: CourseDataActionsList.SET_UNITS, payload: UnitType[] }
    | { type: CourseDataActionsList.SET_SUSPENDED_UNITS_IDS, payload: string[] }
    | { type: CourseDataActionsList.SET_LEVELS, payload: DataWithFatherId<LevelType>[] }
    // | { type: CourseDataActionsList.SET_UNSUSPENDED_LEVELS, payload: DataWithFatherId<LevelType>[] }
    | { type: CourseDataActionsList.SET_LESSONS, payload: DataWithFatherId<LessonType>[] }
    // | { type: CourseDataActionsList.SET_UNSUSPENDED_LESSONS, payload: DataWithFatherId<LessonType>[] }
    | { type: CourseDataActionsList.SET_EXERCISES, payload: DataWithFatherId<ExerciseType>[] }
    // | { type: CourseDataActionsList.SET_UNSUSPENDED_EXERCISES, payload: DataWithFatherId<ExerciseType>[] }
    | { type: CourseDataActionsList.SET_RESULTS, payload: ResultsState[] }


export interface CourseDataType {
    courseId: string | null,
    units: UnitType[];
    suspendedUnitsIds: string[];
    levels: DataWithFatherId<LevelType>[];
    // unsuspendedLevels: DataWithFatherId<LevelType>[];
    lessons: DataWithFatherId<LessonType>[];
    // unsuspendedLessons: DataWithFatherId<LessonType>[];
    exercises: DataWithFatherId<ExerciseType>[];
    // unsuspendedExercises: DataWithFatherId<ExerciseType>[];
    results: ResultsState[];
}

export const courseDataReducer = (
    state: CourseDataType,
    action: CourseDataAction
): CourseDataType => {
    switch (action.type) {
        case CourseDataActionsList.SET_COURSE_ID:
            return { ...state, courseId: action.payload };
        case CourseDataActionsList.SET_UNITS:
            return { ...state, units: action.payload };
        case CourseDataActionsList.SET_SUSPENDED_UNITS_IDS:
            return { ...state, suspendedUnitsIds: action.payload };
        case CourseDataActionsList.SET_LEVELS:
            return { ...state, levels: action.payload };
        // case CourseDataActionsList.SET_UNSUSPENDED_LEVELS:
        //     return { ...state, unsuspendedLevels: action.payload };
        case CourseDataActionsList.SET_LESSONS:
            return { ...state, lessons: action.payload };
        // case CourseDataActionsList.SET_UNSUSPENDED_LESSONS:
        //     return { ...state, unsuspendedLessons: action.payload };
        case CourseDataActionsList.SET_EXERCISES:
            return { ...state, exercises: action.payload };
        // case CourseDataActionsList.SET_UNSUSPENDED_EXERCISES:
        //     return { ...state, unsuspendedExercises: action.payload };
        case CourseDataActionsList.SET_RESULTS:
            return { ...state, results: action.payload };

        default:
            return state;
    }
};
