export enum courseDataAction {
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

export type CourseDataActionTypes =
    | { type: courseDataAction.SET_COURSE_ID, payload: string | null }
    | { type: courseDataAction.SET_UNITS, payload: UnitType[] }
    | { type: courseDataAction.SET_SUSPENDED_UNITS_IDS, payload: string[] }
    | { type: courseDataAction.SET_LEVELS, payload: DataWithFatherId<LevelType>[] }
    // | { type: courseDataAction.SET_UNSUSPENDED_LEVELS, payload: DataWithFatherId<LevelType>[] }
    | { type: courseDataAction.SET_LESSONS, payload: DataWithFatherId<LessonType>[] }
    // | { type: courseDataAction.SET_UNSUSPENDED_LESSONS, payload: DataWithFatherId<LessonType>[] }
    | { type: courseDataAction.SET_EXERCISES, payload: DataWithFatherId<ExerciseType>[] }
    // | { type: courseDataAction.SET_UNSUSPENDED_EXERCISES, payload: DataWithFatherId<ExerciseType>[] }
    | { type: courseDataAction.SET_RESULTS, payload: ResultsState[] }


export interface courseDataType {
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
    state: courseDataType,
    action: CourseDataActionTypes
): courseDataType => {
    switch (action.type) {
        case courseDataAction.SET_COURSE_ID:
            return { ...state, courseId: action.payload };
        case courseDataAction.SET_UNITS:
            return { ...state, units: action.payload };
        case courseDataAction.SET_SUSPENDED_UNITS_IDS:
            return { ...state, suspendedUnitsIds: action.payload };
        case courseDataAction.SET_LEVELS:
            return { ...state, levels: action.payload };
        // case courseDataAction.SET_UNSUSPENDED_LEVELS:
        //     return { ...state, unsuspendedLevels: action.payload };
        case courseDataAction.SET_LESSONS:
            return { ...state, lessons: action.payload };
        // case courseDataAction.SET_UNSUSPENDED_LESSONS:
        //     return { ...state, unsuspendedLessons: action.payload };
        case courseDataAction.SET_EXERCISES:
            return { ...state, exercises: action.payload };
        // case courseDataAction.SET_UNSUSPENDED_EXERCISES:
        //     return { ...state, unsuspendedExercises: action.payload };
        case courseDataAction.SET_RESULTS:
            return { ...state, results: action.payload };

        default:
            return state;
    }
};
