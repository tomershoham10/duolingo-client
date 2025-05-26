export enum studentDashboardAction {
    ADD_LOCKED_LEVEL = 'addLockedLevel',
    ADD_FINISHED_LEVEL_ID = 'addFinishedLevelId',
    SET_CURRENT_LEVEL_ID = 'setCurrentLevelId',
    SET_LOCKED_LEVELS = 'setLockedLevels',
    SET_NUM_OF_EXERCISES_MADE = 'setNumOfExercisesMade',
    SET_IS_START_LEVEL_POPUP_VISIBLE = 'setIsStartLevelPopupVisible',
    TOGGLE_IS_START_LEVEL_POPUP_VISIBLE = 'toggleIsStartLevelPopupVisible',
}


type Action =
    | { type: studentDashboardAction.ADD_LOCKED_LEVEL, payload: string }
    | { type: studentDashboardAction.ADD_FINISHED_LEVEL_ID, payload: string }
    | { type: studentDashboardAction.SET_CURRENT_LEVEL_ID, payload: string }
    | { type: studentDashboardAction.SET_LOCKED_LEVELS, payload: string[] }
    | { type: studentDashboardAction.SET_NUM_OF_EXERCISES_MADE, payload: number }
    | { type: studentDashboardAction.SET_IS_START_LEVEL_POPUP_VISIBLE, payload: boolean }
    | { type: studentDashboardAction.TOGGLE_IS_START_LEVEL_POPUP_VISIBLE }

export interface studentDashboardType {
    currentLevelId: string | undefined;
    lockedLevelsIds: string[];
    finisedLevelsIds: string[];
    numOfExercisesMade: number;
    isStartLevelPopupVisible: boolean;
}

export const studentDashboardReducer = (
    state: studentDashboardType,
    action: Action
): studentDashboardType => {
    switch (action.type) {
        case studentDashboardAction.SET_CURRENT_LEVEL_ID:
            return { ...state, currentLevelId: action.payload };
        case studentDashboardAction.SET_LOCKED_LEVELS:
            return { ...state, lockedLevelsIds: action.payload };
        case studentDashboardAction.ADD_FINISHED_LEVEL_ID:
            return { ...state, finisedLevelsIds: [...state.finisedLevelsIds, action.payload] };
        case studentDashboardAction.ADD_LOCKED_LEVEL:
            return { ...state, lockedLevelsIds: [...state.lockedLevelsIds, action.payload] };
        case studentDashboardAction.SET_NUM_OF_EXERCISES_MADE:
            return { ...state, numOfExercisesMade: action.payload };
        case studentDashboardAction.SET_IS_START_LEVEL_POPUP_VISIBLE:
            return { ...state, isStartLevelPopupVisible: action.payload };
        case studentDashboardAction.TOGGLE_IS_START_LEVEL_POPUP_VISIBLE:
            return { ...state, isStartLevelPopupVisible: !state.isStartLevelPopupVisible };
        default:
            return state;
    }
};
