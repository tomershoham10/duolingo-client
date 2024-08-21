export enum lessonAction {
    SET_EXERCISES_DATA = 'setExercisesData',
    SET_LESSON_RESULTS = 'setLessonResults',
    SET_EXERCISES_IDS = 'setExercisesIds',
    ADD_EXERCISE_ID = 'addExerciseId',
    SET_NUM_OF_EXERCISES_MADE = 'setNumOfExercisesMade',
    SET_CURRENT_EXERCISE = "setCurrentExercise",
    SET_FADE_EFFECT = "setFadeEffect",
    START_TIMER = "startTimer",
    SET_IS_EXERCISE_STARTED = "setIsExerciseStarted",
    SET_IS_EXERCISE_FINISHED = "setIsExerciseFinished",
    SET_IS_EXERCISE_SUBMITTED = "setIsExerciseSubmitted",
    STOP_TIMER = "stopTimer",
    DOWNLOAD_EXERCISE_RECORD = "downloadExerciseRecord",
    UPDATE_NEXT_EXERCISE = "updateNextExercise",
}

export type TimeType = {
    minutes: number,
    seconds: number,
}

export type TargetToSubmitType = {
    id: string,
    name: string,
}

export type LessonDispatchAction =
    | { type: lessonAction.SET_EXERCISES_DATA, payload: (FsaType | SpotreccType)[] }
    | { type: lessonAction.SET_LESSON_RESULTS, payload: ResultType[] }
    | { type: lessonAction.SET_EXERCISES_IDS, payload: string[] }
    | { type: lessonAction.ADD_EXERCISE_ID, payload: string }
    | { type: lessonAction.SET_NUM_OF_EXERCISES_MADE, payload: number }
    | { type: lessonAction.SET_CURRENT_EXERCISE, payload: FsaType | SpotreccType | null }
    | { type: lessonAction.START_TIMER }
    | { type: lessonAction.STOP_TIMER }
    | { type: lessonAction.SET_IS_EXERCISE_STARTED, payload: boolean }
    | { type: lessonAction.SET_IS_EXERCISE_FINISHED, payload: boolean }
    | { type: lessonAction.SET_IS_EXERCISE_SUBMITTED, payload: boolean }
    | { type: lessonAction.SET_FADE_EFFECT, payload: boolean }
    | { type: lessonAction.DOWNLOAD_EXERCISE_RECORD }
    | { type: lessonAction.UPDATE_NEXT_EXERCISE }

export interface lessonType {
    exercisesData: (FsaType | SpotreccType)[],
    lessonResults: ResultType[],
    exercisesIds: string[],
    numOfExercisesMade: number, //0
    currentExercise: FsaType | SpotreccType | null,
    isExerciseStarted: boolean, //false
    isExerciseFinished: boolean, //false
    isExerciseSubmitted: boolean, //false
    fadeEffect: boolean, //true
}

export const lessonReducer = (
    state: lessonType,
    action: LessonDispatchAction
): lessonType => {
    switch (action.type) {
        case lessonAction.SET_EXERCISES_DATA:
            return { ...state, exercisesData: action.payload };
        case lessonAction.SET_LESSON_RESULTS:
            return { ...state, lessonResults: action.payload };
        case lessonAction.SET_EXERCISES_IDS:
            return { ...state, exercisesIds: action.payload };
        case lessonAction.ADD_EXERCISE_ID:
            return { ...state, exercisesIds: [...state.exercisesIds, action.payload] };
        case lessonAction.SET_NUM_OF_EXERCISES_MADE:
            return { ...state, numOfExercisesMade: action.payload };
        case lessonAction.SET_CURRENT_EXERCISE:
            return { ...state, currentExercise: action.payload };
        case lessonAction.START_TIMER:
            return { ...state, isExerciseStarted: true };
        case lessonAction.SET_IS_EXERCISE_STARTED:
            return { ...state, isExerciseStarted: action.payload };
        case lessonAction.SET_IS_EXERCISE_FINISHED:
            return { ...state, isExerciseFinished: action.payload };
        case lessonAction.SET_IS_EXERCISE_SUBMITTED:
            return { ...state, isExerciseSubmitted: action.payload };
        case lessonAction.STOP_TIMER:
            return { ...state, isExerciseFinished: true };
        case lessonAction.SET_FADE_EFFECT:
            return { ...state, fadeEffect: action.payload };

        case lessonAction.UPDATE_NEXT_EXERCISE:
            return {
                ...state, currentExercise: state.exercisesData[state.exercisesData.indexOf(
                    state.currentExercise || state.exercisesData[0]
                ) + 1],
                isExerciseStarted: false,
                isExerciseFinished: false,
                isExerciseSubmitted: false,
            };

        default:
            return state;
    }
};

