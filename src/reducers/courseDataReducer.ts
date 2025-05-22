import { ExerciseType, LevelType, ResultType } from "@/app/types";

export enum CourseDataActionsList {
    SET_COURSE_ID = 'setCourseId',
    SET_LEVELS = 'setLevels',
    SET_EXERCISES = 'setExercises',
    SET_RESULTS = 'setResults',
    SET_ALL_DATA = 'setAllData',
}

export interface DataWithChildId<T> {
    childId: string | null;
    data: T[];
}

export interface ResultsState {
    levelId: string;
    results: { numOfExercises: number; results: ResultType[] };
}[];

export type CourseDataAction =
    | { type: CourseDataActionsList.SET_COURSE_ID, payload: string | null }
    | { type: CourseDataActionsList.SET_LEVELS, payload: DataWithChildId<LevelType>[] }
    | { type: CourseDataActionsList.SET_EXERCISES, payload: DataWithChildId<ExerciseType>[] }
    | { type: CourseDataActionsList.SET_RESULTS, payload: ResultsState[] }
    | { 
        type: CourseDataActionsList.SET_ALL_DATA, 
        payload: {
            levels: DataWithChildId<LevelType>[];
            exercises: DataWithChildId<ExerciseType>[];
        } 
      }

export interface CourseDataType {
    courseId: string | null,
    levels: DataWithChildId<LevelType>[];
    exercises: DataWithChildId<ExerciseType>[];
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
        case CourseDataActionsList.SET_EXERCISES:
            return { ...state, exercises: action.payload };
        case CourseDataActionsList.SET_RESULTS:
            return { ...state, results: action.payload };
        case CourseDataActionsList.SET_ALL_DATA:
            return { 
                ...state, 
                levels: action.payload.levels,
                exercises: action.payload.exercises
            };
        default:
            return state;
    }
};
