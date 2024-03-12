export enum courseDataAction {
    SET_UNITS = 'setUnits',
    SET_UNSUSPENDED_UNITS = 'setUbsuspendedUnits',
    SET_LEVELS = 'setLevels',
    SET_UNSUSPENDED_LEVELS = 'setUNnsuspendedLevels',
    SET_LESSONS = 'setLessons',
    SET_UNSUSPENDED_LESSONS = 'setUNnsuspendedLessons',
    SET_EXERCISES = 'setExercises',
    SET_UNSUSPENDED_EXERCISES = 'setUNnsuspendedExercises',
}

interface DataWithFatherId<T> {
    fatherId: string | undefined;
    data: T[];
}

export type CourseDataActionTypes =
    | { type: courseDataAction.SET_UNITS, payload: UnitType[] }
    | { type: courseDataAction.SET_UNSUSPENDED_UNITS, payload: UnitType[] }
    | { type: courseDataAction.SET_LEVELS, payload: DataWithFatherId<LevelType>[] }
    | { type: courseDataAction.SET_UNSUSPENDED_LEVELS, payload: DataWithFatherId<LevelType>[] }
    | { type: courseDataAction.SET_LESSONS, payload: DataWithFatherId<LessonType>[] }
    | { type: courseDataAction.SET_UNSUSPENDED_LESSONS, payload: DataWithFatherId<LessonType>[] }
    | { type: courseDataAction.SET_EXERCISES, payload: DataWithFatherId<FSAType>[] }
    | { type: courseDataAction.SET_UNSUSPENDED_EXERCISES, payload: DataWithFatherId<FSAType>[] }


export interface courseDataType {
    courseId: string | undefined,
    units: UnitType[];
    unsuspendedUnits: UnitType[];
    levels: DataWithFatherId<LevelType>[];
    unsuspendedLevels: DataWithFatherId<LevelType>[];
    lessons: DataWithFatherId<LessonType>[];
    unsuspendedLessons: DataWithFatherId<LessonType>[];
    exercises: DataWithFatherId<FSAType>[];
    unsuspendedExercises: DataWithFatherId<FSAType>[];
}

export const courseDataReducer = (
    state: courseDataType,
    action: CourseDataActionTypes
): courseDataType => {
    switch (action.type) {
        case courseDataAction.SET_UNITS:
            return { ...state, units: action.payload };
        case courseDataAction.SET_UNSUSPENDED_UNITS:
            return { ...state, unsuspendedUnits: action.payload };
        case courseDataAction.SET_LEVELS:
            return { ...state, levels: action.payload };
        case courseDataAction.SET_UNSUSPENDED_LEVELS:
            return { ...state, unsuspendedLevels: action.payload };
        case courseDataAction.SET_LESSONS:
            return { ...state, lessons: action.payload };
        case courseDataAction.SET_UNSUSPENDED_LESSONS:
            return { ...state, unsuspendedLessons: action.payload };
        case courseDataAction.SET_EXERCISES:
            return { ...state, exercises: action.payload };
        case courseDataAction.SET_UNSUSPENDED_EXERCISES:
            return { ...state, unsuspendedExercises: action.payload };

        default:
            return state;
    }
};
