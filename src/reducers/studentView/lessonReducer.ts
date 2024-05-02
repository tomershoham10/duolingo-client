import { downloadFile } from "@/app/API/files-service/functions";

export enum lessonAction {
    SET_EXERCISES_DATA = 'setExercisesData',
    SET_LESSON_RESULTS = 'setLessonResults',
    SET_EXERCISES_IDS = 'setExercisesIds',
    ADD_EXERCISE_ID = 'addExerciseId',
    SET_NUM_OF_EXERCISES_MADE = 'setNumOfExercisesMade',
    SET_CURRENT_EXERCISE = "setCurrentExercise",
    SET_RELEVANT = "setRelevant",
    SET_CURRENT_ANSWERS = "setCurrentAnswers",
    SET_CURRENT_RESULT = "setCurrentResult",
    SET_GRABBED_TARGET_ID = "setGrabbedTargetId",
    SET_TOTAL_SCORE = "setTotalScore",
    SET_SELECTED_TARGET_INDEX = "setSelectedTargetIndex",
    SET_TARGETS_TO_SUBMIT = "setTargetsToSubmit",
    ADD_TARGET_TO_SUBMIT = "addTargetToSubmit",
    SET_TARGET_FROM_DROPDOWN = "setTargetFromDropdown",
    SHOW_PLACEHOLDER = "showPlaceHolder",
    HIDE_PLACEHOLDER = "hidePlaceHolder",
    SET_FADE_EFFECT = "setFadeEffect",
    UPDATE_TIME_REMAINING = "setTimeRemaining",
    START_TIMER = "startTimer",
    SET_IS_EXERCISE_STARTED = "setIsExerciseStarted",
    SET_IS_EXERCISE_FINISHED = "setIsExerciseFinished",
    SET_IS_EXERCISE_SUBMITTED = "setIsExerciseSubmitted",
    STOP_TIMER = "stopTimer",
    DOWNLOAD_EXERCISE_RECORD = "downloadExerciseRecord",
    UPDATE_NEXT_EXERCISE = "updateNextExercise",
}

type TimeType = {
    minutes: number,
    seconds: number,
}

type TargetToSubmitType = {
    id: string,
    name: string,
}

export type LessonDispatchAction =
    | { type: lessonAction.SET_EXERCISES_DATA, payload: FSAType[] }
    | { type: lessonAction.SET_LESSON_RESULTS, payload: ResultType[] }
    | { type: lessonAction.SET_EXERCISES_IDS, payload: string[] }
    | { type: lessonAction.ADD_EXERCISE_ID, payload: string }
    | { type: lessonAction.SET_NUM_OF_EXERCISES_MADE, payload: number }
    | { type: lessonAction.SET_CURRENT_EXERCISE, payload: FSAType }
    | { type: lessonAction.SET_RELEVANT, payload: TargetType[] }
    | { type: lessonAction.SET_CURRENT_ANSWERS, payload: TargetType[] }
    | { type: lessonAction.SET_CURRENT_RESULT, payload: ResultType | undefined }
    | { type: lessonAction.SET_GRABBED_TARGET_ID, payload: string }
    | { type: lessonAction.SET_TOTAL_SCORE, payload: number }
    | { type: lessonAction.START_TIMER }
    | { type: lessonAction.STOP_TIMER }
    | { type: lessonAction.SET_IS_EXERCISE_STARTED, payload: boolean }
    | { type: lessonAction.SET_IS_EXERCISE_FINISHED, payload: boolean }
    | { type: lessonAction.SET_IS_EXERCISE_SUBMITTED, payload: boolean }
    | { type: lessonAction.SET_SELECTED_TARGET_INDEX, payload: number }
    | { type: lessonAction.SET_TARGETS_TO_SUBMIT, payload: TargetToSubmitType[] }
    | { type: lessonAction.ADD_TARGET_TO_SUBMIT, payload: TargetToSubmitType }
    | { type: lessonAction.SET_TARGET_FROM_DROPDOWN, payload: TargetType | null }
    | { type: lessonAction.SHOW_PLACEHOLDER }
    | { type: lessonAction.HIDE_PLACEHOLDER }
    | { type: lessonAction.SET_FADE_EFFECT, payload: boolean }
    | { type: lessonAction.SET_FADE_EFFECT, payload: boolean }
    | { type: lessonAction.UPDATE_TIME_REMAINING, payload: TimeType }
    | { type: lessonAction.DOWNLOAD_EXERCISE_RECORD }
    | { type: lessonAction.UPDATE_NEXT_EXERCISE }

export interface lessonType {
    exercisesData: FSAType[],
    lessonResults: ResultType[],
    exercisesIds: string[],
    numOfExercisesMade: number, //0
    currentExercise: FSAType | undefined,
    relevant: TargetType[],
    currentAnswers: TargetType[],
    currentResult: ResultType | undefined,
    grabbedTargetId: string | undefined,
    totalScore: number, //-1
    isExerciseStarted: boolean, //false
    isExerciseFinished: boolean,//false
    isExerciseSubmitted: boolean,
    timeRemaining: TimeType, //{ minutes: 0, seconds: 0 }
    selectedTargetIndex: number //-1,
    targetsToSubmit: TargetToSubmitType[],
    targetFromDropdown: TargetType | null,
    showPlaceholder: boolean, //true
    fadeEffect: boolean, //true
}

export const lessonReducer = async (
    state: lessonType,
    action: LessonDispatchAction
): Promise<lessonType> => {
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
        case lessonAction.SET_RELEVANT:
            return { ...state, relevant: action.payload };
        case lessonAction.SET_CURRENT_ANSWERS:
            return { ...state, currentAnswers: action.payload };
        case lessonAction.SET_CURRENT_RESULT:
            return { ...state, currentResult: action.payload };
        case lessonAction.SET_GRABBED_TARGET_ID:
            return { ...state, grabbedTargetId: action.payload };
        case lessonAction.SET_TOTAL_SCORE:
            return { ...state, totalScore: action.payload };
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
        case lessonAction.SET_SELECTED_TARGET_INDEX:
            return { ...state, selectedTargetIndex: action.payload };
        case lessonAction.SET_TARGETS_TO_SUBMIT:
            return { ...state, targetsToSubmit: action.payload };
        case lessonAction.ADD_TARGET_TO_SUBMIT:
            return { ...state, targetsToSubmit: [...state.targetsToSubmit, action.payload] };
        case lessonAction.SET_TARGET_FROM_DROPDOWN:
            return { ...state, targetFromDropdown: action.payload };
        case lessonAction.SHOW_PLACEHOLDER:
            return { ...state, showPlaceholder: true };
        case lessonAction.HIDE_PLACEHOLDER:
            return { ...state, showPlaceholder: false };
        case lessonAction.SET_FADE_EFFECT:
            return { ...state, fadeEffect: action.payload };
        case lessonAction.UPDATE_TIME_REMAINING:
            return { ...state, timeRemaining: action.payload };

        case lessonAction.DOWNLOAD_EXERCISE_RECORD:
            state.currentExercise?.recordKey ? await downloadExerciseRecord(state.currentExercise?.recordKey) : null;
            return { ...state };
        case lessonAction.UPDATE_NEXT_EXERCISE:
            return {
                ...state, currentExercise: state.exercisesData[state.exercisesData.indexOf(
                    state.currentExercise || state.exercisesData[0]
                ) + 1],
                isExerciseStarted: false,
                isExerciseFinished: false,
                isExerciseSubmitted: false,
                targetFromDropdown: null,
                totalScore: -1,
                targetsToSubmit: [],
            };

        default:
            return state;
    }
};

const downloadExerciseRecord = async (recordKey: string) => {
    const res = await downloadFile('records',recordKey);
}

export const calculateTimeRemaining = (pastDate: Date, totalMinutes: number) => {
    const exerciseStartDate = new Date(pastDate).getTime();

    const finalTime = new Date(exerciseStartDate);
    finalTime.setMinutes(finalTime.getMinutes() + Math.floor(totalMinutes));

    const remainingSeconds = Math.floor((totalMinutes % 1) * 60);
    finalTime.setSeconds(finalTime.getSeconds() + remainingSeconds);

    const now = new Date().getTime();

    const isTimePassed = finalTime.getTime() - now;
    if (isTimePassed <= 0) {
        // If the finalTime is in the past, set timeRemaining to 0
        return { minutes: 0, seconds: 0 };
    }

    const minutesRemaining = Math.floor(
        (isTimePassed % (1000 * 60 * 60)) / (1000 * 60)
    );
    const secondsRemaining = Math.floor((isTimePassed % (1000 * 60)) / 1000);

    return {
        minutes: minutesRemaining,
        seconds: secondsRemaining,
    };
};


