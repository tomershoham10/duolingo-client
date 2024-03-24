export enum studentDashboardAction {
    ADD_LOCKED_LEVEL = 'addLockedLevel',
    ADD_FINISHED_LEVEL_ID = 'addFinishedLevelId',
    ADD_LOCKED_LESSON = 'addLockedLesson',
    SET_CURRENT_UNIT_ID = 'setCurrentUnitId',
    SET_CURRENT_LEVEL_ID = 'setCurrentLevelId',
    SET_LOCKED_LESSONS = 'setLockedLessons',
    SET_LOCKED_LEVELS = 'setLockedLevels',
    SET_NUM_OF_LESSONS_MADE = 'setNumOfLessonsMade',
    SET_IS_NEXT_LESSON_POPUP_VISIBLE = 'setIsNextLessonPopupVisible',
    TOGGLE_IS_NEXT_LESSON_POPUP_VISIBLE = 'toggleIsNextLessonPopupVisible',
}


type Action =
    | { type: studentDashboardAction.ADD_LOCKED_LEVEL, payload: string }
    | { type: studentDashboardAction.ADD_FINISHED_LEVEL_ID, payload: string }
    | { type: studentDashboardAction.ADD_LOCKED_LESSON, payload: string }
    | { type: studentDashboardAction.SET_CURRENT_UNIT_ID, payload: string }
    | { type: studentDashboardAction.SET_CURRENT_LEVEL_ID, payload: string }
    | { type: studentDashboardAction.SET_LOCKED_LEVELS, payload: string[] }
    | { type: studentDashboardAction.SET_LOCKED_LESSONS, payload: string[] }
    | { type: studentDashboardAction.SET_NUM_OF_LESSONS_MADE, payload: number }
    | { type: studentDashboardAction.SET_IS_NEXT_LESSON_POPUP_VISIBLE, payload: boolean }
    | { type: studentDashboardAction.TOGGLE_IS_NEXT_LESSON_POPUP_VISIBLE }

export interface studentDashboardType {
    currentUnitId: string | undefined;
    currentLevelId: string | undefined;
    lockedLessons: string[];
    lockedLevelsIds: string[];
    finisedLevelsIds: string[];
    numOfLessonsMade: number;
    isNextLessonPopupVisible: boolean;
}

export const studentDashboardReducer = (
    state: studentDashboardType,
    action: Action
): studentDashboardType => {
    switch (action.type) {
        case studentDashboardAction.SET_CURRENT_UNIT_ID:
            return { ...state, currentUnitId: action.payload };
        case studentDashboardAction.SET_CURRENT_LEVEL_ID:
            return { ...state, currentLevelId: action.payload };
        case studentDashboardAction.SET_LOCKED_LESSONS:
            return { ...state, lockedLessons: action.payload };
        case studentDashboardAction.ADD_FINISHED_LEVEL_ID:
            return { ...state, finisedLevelsIds: [...state.finisedLevelsIds, action.payload] };
        case studentDashboardAction.ADD_LOCKED_LESSON:
            return { ...state, lockedLessons: [...state.lockedLessons, action.payload] };
        case studentDashboardAction.ADD_FINISHED_LEVEL_ID:
            return { ...state, finisedLevelsIds: [...state.finisedLevelsIds, action.payload] };
        case studentDashboardAction.ADD_LOCKED_LEVEL:
            return { ...state, lockedLevelsIds: [...state.lockedLevelsIds, action.payload] };
        case studentDashboardAction.SET_NUM_OF_LESSONS_MADE:
            return { ...state, numOfLessonsMade: action.payload };
        case studentDashboardAction.SET_IS_NEXT_LESSON_POPUP_VISIBLE:
            return { ...state, isNextLessonPopupVisible: action.payload };
        case studentDashboardAction.TOGGLE_IS_NEXT_LESSON_POPUP_VISIBLE:
            return { ...state, isNextLessonPopupVisible: !state.isNextLessonPopupVisible };
        default:
            return state;
    }
};
