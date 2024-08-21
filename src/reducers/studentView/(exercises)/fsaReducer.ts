export enum fsaAction {
    SET_CURRENT_EXERCISE = "setCurrentExercise",
    SET_ZIP_PASSWORD = "setZipPassword",
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
    SET_IS_EXERCISE_STARTED = "setIsExerciseStarted",
    SET_IS_EXERCISE_FINISHED = "setIsExerciseFinished",
    SET_IS_EXERCISE_SUBMITTED = "setIsExerciseSubmitted",
    DOWNLOAD_EXERCISE_RECORD = "downloadExerciseRecord",
}

export type TimeType = {
    minutes: number,
    seconds: number,
}

export type TargetToSubmitType = {
    id: string,
    name: string,
}

export type fsaDispatchAction =
    | { type: fsaAction.SET_CURRENT_EXERCISE, payload: FsaType | null }
    | { type: fsaAction.SET_ZIP_PASSWORD, payload: number | null }
    | { type: fsaAction.SET_RELEVANT, payload: TargetType[] }
    | { type: fsaAction.SET_CURRENT_ANSWERS, payload: TargetType[] }
    | { type: fsaAction.SET_CURRENT_RESULT, payload: ResultType | null }
    | { type: fsaAction.SET_GRABBED_TARGET_ID, payload: string | null }
    | { type: fsaAction.SET_TOTAL_SCORE, payload: number }
    | { type: fsaAction.SET_IS_EXERCISE_STARTED, payload: boolean }
    | { type: fsaAction.SET_IS_EXERCISE_FINISHED, payload: boolean }
    | { type: fsaAction.SET_IS_EXERCISE_SUBMITTED, payload: boolean }
    | { type: fsaAction.SET_SELECTED_TARGET_INDEX, payload: number }
    | { type: fsaAction.SET_TARGETS_TO_SUBMIT, payload: TargetToSubmitType[] }
    | { type: fsaAction.ADD_TARGET_TO_SUBMIT, payload: TargetToSubmitType }
    | { type: fsaAction.SET_TARGET_FROM_DROPDOWN, payload: TargetType | null }
    | { type: fsaAction.SHOW_PLACEHOLDER }
    | { type: fsaAction.HIDE_PLACEHOLDER }
    | { type: fsaAction.SET_FADE_EFFECT, payload: boolean }
    | { type: fsaAction.SET_FADE_EFFECT, payload: boolean }
    | { type: fsaAction.UPDATE_TIME_REMAINING, payload: TimeType }
    | { type: fsaAction.DOWNLOAD_EXERCISE_RECORD }

export interface FsaReducerType {
    currentExercise: FsaType | null;
    zipPassword: number | null; // null
    relevant: TargetType[];
    currentAnswers: TargetType[];
    currentResult: ResultType | null; // null
    grabbedTargetId: string | null; // null
    totalScore: number; // -1
    timeRemaining: TimeType; // { minutes: 0, seconds: 0 }
    selectedTargetIndex: number; // -1
    targetsToSubmit: TargetToSubmitType[];
    targetFromDropdown: TargetType | null; // null
    showPlaceholder: boolean; // true
}

export const fsaReducer = (
    state: FsaReducerType,
    action: fsaDispatchAction
): FsaReducerType => {
    switch (action.type) {
        case fsaAction.SET_CURRENT_EXERCISE:
            return { ...state, currentExercise: action.payload };
        case fsaAction.SET_ZIP_PASSWORD:
            return { ...state, zipPassword: action.payload };
        case fsaAction.SET_RELEVANT:
            return { ...state, relevant: action.payload };
        case fsaAction.SET_CURRENT_ANSWERS:
            return { ...state, currentAnswers: action.payload };
        case fsaAction.SET_CURRENT_RESULT:
            return { ...state, currentResult: action.payload };
        case fsaAction.SET_GRABBED_TARGET_ID:
            return { ...state, grabbedTargetId: action.payload };
        case fsaAction.SET_TOTAL_SCORE:
            return { ...state, totalScore: action.payload };
        case fsaAction.SET_SELECTED_TARGET_INDEX:
            return { ...state, selectedTargetIndex: action.payload };
        case fsaAction.SET_TARGETS_TO_SUBMIT:
            return { ...state, targetsToSubmit: action.payload };
        case fsaAction.ADD_TARGET_TO_SUBMIT:
            return { ...state, targetsToSubmit: [...state.targetsToSubmit, action.payload] };
        case fsaAction.SET_TARGET_FROM_DROPDOWN:
            return { ...state, targetFromDropdown: action.payload };
        case fsaAction.SHOW_PLACEHOLDER:
            return { ...state, showPlaceholder: true };
        case fsaAction.HIDE_PLACEHOLDER:
            return { ...state, showPlaceholder: false };
        case fsaAction.UPDATE_TIME_REMAINING:
            return { ...state, timeRemaining: action.payload };

        default:
            return state;
    }
};

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


