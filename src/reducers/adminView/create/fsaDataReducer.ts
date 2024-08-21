export enum fsaFieldsType {
    DESCRIPTION = 'description',
    RELEVANT = 'relevant',
    TIMEBUFFERS = 'timeBuffers',
}

export enum fsaDataAction {
    SET_DESCRIPTION = 'setDescription',

    SET_RELEVANT = 'setRelevant',
    ADD_RELEVANT = 'addRelevant',
    REMOVE_TARGET_FROM_RELEVANT = 'removeTargetFromRelevant',

    SET_UNFILLED_FIELDS = 'setUnfilledFields',

    SET_SHOW_PLACE_HOLDER = 'setShowPlaceholder',
    SET_TARGET_FROM_DROPDOWN = 'setTargetFromDropdown'
}

type Action =
    | { type: fsaDataAction.SET_DESCRIPTION; payload: string }
    | { type: fsaDataAction.SET_RELEVANT, payload: relevantList[] }
    | { type: fsaDataAction.ADD_RELEVANT, payload: relevantList }
    | { type: fsaDataAction.REMOVE_TARGET_FROM_RELEVANT; payload: relevantList }
    | { type: fsaDataAction.SET_UNFILLED_FIELDS, payload: fsaFieldsType[] }
    | { type: fsaDataAction.SET_SHOW_PLACE_HOLDER, payload: boolean }
    | { type: fsaDataAction.SET_TARGET_FROM_DROPDOWN, payload: TargetType | null }

interface relevantList {
    id: string,
    name: string,
}

export interface fsaDataType {
    description: string | undefined,
    relevant: relevantList[],
    unfilledFields: fsaFieldsType[],
    showPlaceholder: boolean,
    targetFromDropdown: TargetType | null
}

export const fsaDataReducer = (
    state: fsaDataType,
    action: Action
): fsaDataType => {
    switch (action.type) {
        case fsaDataAction.SET_DESCRIPTION:
            return { ...state, description: action.payload };
        case fsaDataAction.SET_RELEVANT:
            return { ...state, relevant: action.payload };
        case fsaDataAction.ADD_RELEVANT:
            return { ...state, relevant: [...state.relevant, action.payload] };
        case fsaDataAction.REMOVE_TARGET_FROM_RELEVANT:
            return { ...state, relevant: state.relevant };

        case fsaDataAction.SET_UNFILLED_FIELDS:
            return { ...state, unfilledFields: action.payload };

        case fsaDataAction.SET_SHOW_PLACE_HOLDER:
            return { ...state, showPlaceholder: action.payload };

        case fsaDataAction.SET_TARGET_FROM_DROPDOWN:
            return { ...state, targetFromDropdown: action.payload };

        default:
            return state;
    }
};
