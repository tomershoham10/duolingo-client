export enum exerciseDataAction {
    SET_DESCRIPTION = 'setDescription',

    SET_RELEVANT = 'setRelevant',
    REMOVE_TARGET_FROM_RELEVANT = 'removeTargetFromRelevant',

    SET_UNFILLED_FIELDS = 'setUnfilledFields',

    SET_SHOW_PLACE_HOLDER = 'setShowPlaceholder',
    SET_TARGET_FROM_DROPDOWN = 'setTargetFromDropdown'
}

type Action =
    | { type: exerciseDataAction.SET_DESCRIPTION; payload: string }
    | { type: exerciseDataAction.SET_RELEVANT, payload: TargetType }
    | { type: exerciseDataAction.REMOVE_TARGET_FROM_RELEVANT; payload: TargetType }
    | { type: exerciseDataAction.SET_UNFILLED_FIELDS; payload: FSAFieldsType[] }
    | { type: exerciseDataAction.SET_SHOW_PLACE_HOLDER; payload: boolean }
    | { type: exerciseDataAction.SET_TARGET_FROM_DROPDOWN; payload: TargetType | null }


export interface exerciseDataType {
    description: string | undefined,
    relevant: TargetType[],
    unfilledFields: FSAFieldsType[],
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
            return { ...state, relevant: [...state.relevant, action.payload] };
        case exerciseDataAction.REMOVE_TARGET_FROM_RELEVANT:
            return { ...state, relevant: state.relevant.filter(target => target._id !== action.payload._id) };

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
