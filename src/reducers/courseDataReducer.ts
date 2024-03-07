export enum courseDataAction {
    SET_UNITS = 'setUnits',
    SET_LEVELS = 'setLevels',
    SET_LESSONS = 'setLessons',
    SET_EXERCISES = 'setExercises',
}

interface DataWithFatherId<T> {
    fatherId: string | undefined;
    data: T[];
}

export type CourseDataActionTypes =
    | { type: courseDataAction.SET_UNITS, payload: UnitType[] }
    | { type: courseDataAction.SET_LEVELS, payload: DataWithFatherId<LevelType>[] }
    | { type: courseDataAction.SET_LESSONS, payload: DataWithFatherId<LessonType>[] }
    | { type: courseDataAction.SET_EXERCISES, payload: DataWithFatherId<FSAType>[] }


export interface courseDataType {
    courseId: string | undefined,
    units: UnitType[];
    levels: DataWithFatherId<LevelType>[];
    lessons: DataWithFatherId<LessonType>[];
    exercises: DataWithFatherId<FSAType>[];
}

export const courseDataReducer = (
    state: courseDataType,
    action: CourseDataActionTypes
): courseDataType => {
    switch (action.type) {
        case courseDataAction.SET_UNITS:
            return { ...state, units: action.payload };
        case courseDataAction.SET_LEVELS:
            return { ...state, levels: action.payload };
        case courseDataAction.SET_LESSONS:
            return { ...state, lessons: action.payload };
        case courseDataAction.SET_EXERCISES:
            return { ...state, exercises: action.payload };
        default:
            return state;
    }
};
