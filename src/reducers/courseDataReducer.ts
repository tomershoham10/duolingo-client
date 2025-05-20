export enum CourseDataActionsList {
    SET_COURSE_ID = 'setCourseId',
    SET_LEVELS = 'setLevels',
    SET_LESSONS = 'setLessons',
    SET_EXERCISES = 'setExercises',
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
    | { type: CourseDataActionsList.SET_LEVELS, payload: DataWithFatherId<LevelType>[] }
    | { type: CourseDataActionsList.SET_LESSONS, payload: DataWithFatherId<LessonType>[] }
    | { type: CourseDataActionsList.SET_EXERCISES, payload: DataWithFatherId<ExerciseType>[] }
    | { type: CourseDataActionsList.SET_RESULTS, payload: ResultsState[] }

export interface CourseDataType {
    courseId: string | null,
    levels: DataWithFatherId<LevelType>[];
    lessons: DataWithFatherId<LessonType>[];
    exercises: DataWithFatherId<ExerciseType>[];
    results: ResultsState[];
}

export const courseDataReducer = (
    state: CourseDataType,
    action: CourseDataAction
): CourseDataType => {
    switch (action.type) {
        case CourseDataActionsList.SET_COURSE_ID:
            return { ...state, courseId: action.payload };
        case CourseDataActionsList.SET_LEVELS:
            return { ...state, levels: action.payload };
        case CourseDataActionsList.SET_LESSONS:
            return { ...state, lessons: action.payload };
        case CourseDataActionsList.SET_EXERCISES:
            return { ...state, exercises: action.payload };
        case CourseDataActionsList.SET_RESULTS:
            return { ...state, results: action.payload };
        default:
            return state;
    }
};
