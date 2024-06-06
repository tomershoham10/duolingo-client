export enum ExercisesFieldsType {
    DESCRIPTION = 'description',
    RELEVANT = 'relevant',
    TIMEBUFFERS = 'timeBuffers',
}

export enum exerciseDataAction {
    SET_DESCRIPTION = 'setDescription',

    SET_RELEVANT = 'setRelevant',
    ADD_RELEVANT = 'addRelevant',
    REMOVE_TARGET_FROM_RELEVANT = 'removeTargetFromRelevant',

    SET_UNFILLED_FIELDS = 'setUnfilledFields',

    SET_SHOW_PLACE_HOLDER = 'setShowPlaceholder',
    SET_TARGET_FROM_DROPDOWN = 'setTargetFromDropdown'
}

type Action =
    | { type: exerciseDataAction.SET_DESCRIPTION; payload: string }
    | { type: exerciseDataAction.SET_RELEVANT, payload: relevantList[] }
    | { type: exerciseDataAction.ADD_RELEVANT, payload: relevantList }
    | { type: exerciseDataAction.REMOVE_TARGET_FROM_RELEVANT; payload: relevantList }
    | { type: exerciseDataAction.SET_UNFILLED_FIELDS, payload: ExercisesFieldsType[] }
    | { type: exerciseDataAction.SET_SHOW_PLACE_HOLDER, payload: boolean }
    | { type: exerciseDataAction.SET_TARGET_FROM_DROPDOWN, payload: TargetType | null }

interface relevantList {
    id: string,
    name: string,
}

export interface exerciseDataType {
    description: string | undefined,
    relevant: relevantList[],
    unfilledFields: ExercisesFieldsType[],
    showPlaceholder: boolean,
    targetFromDropdown: TargetType | null
}

export const exerciseDataReducer = (
    state: exerciseDataType,
    action: Action
): exerciseDataType => {
    switch (action.type) {
        case exerciseDataAction.SET_DESCRIPTION:
            return { ...state, description: action.payload };
        case exerciseDataAction.SET_RELEVANT:
            return { ...state, relevant: action.payload };
        case exerciseDataAction.ADD_RELEVANT:
            return { ...state, relevant: [...state.relevant, action.payload] };
        case exerciseDataAction.REMOVE_TARGET_FROM_RELEVANT:
            return { ...state, relevant: state.relevant };

        case exerciseDataAction.SET_UNFILLED_FIELDS:
            return { ...state, unfilledFields: action.payload };

        case exerciseDataAction.SET_SHOW_PLACE_HOLDER:
            return { ...state, showPlaceholder: action.payload };

        case exerciseDataAction.SET_TARGET_FROM_DROPDOWN:
            return { ...state, targetFromDropdown: action.payload };

        default:
            return state;
    }
};
