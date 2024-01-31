export enum submitExerciseDataAction {
    SET_DESCRIPTION = 'setDescription',

    SET_RELEVANT = 'setRelevant',
    REMOVE_TARGET_FROM_RELEVANT = 'removeTargetFromRelevant',

    SET_UNFILLED_FIELDS = 'setUnfilledFields',
}

type Action =
    | { type: submitExerciseDataAction.SET_DESCRIPTION; payload: string }
    | { type: submitExerciseDataAction.SET_RELEVANT, payload: TargetType }
    | { type: submitExerciseDataAction.REMOVE_TARGET_FROM_RELEVANT; payload: TargetType }
    | { type: submitExerciseDataAction.SET_UNFILLED_FIELDS; payload: FSAFieldsType[] }


export interface submitExerciseDataType {
    description: string | undefined,
    relevant: TargetType[],
    unfilledFields: FSAFieldsType[]
}

export const submitExerciseReducer = (
    state: submitExerciseDataType,
    action: Action
): submitExerciseDataType => {
    switch (action.type) {
        case submitExerciseDataAction.SET_DESCRIPTION:
            return { ...state, description: action.payload };

        case submitExerciseDataAction.SET_RELEVANT:
            return { ...state, relevant: [...state.relevant, action.payload] };
        case submitExerciseDataAction.REMOVE_TARGET_FROM_RELEVANT:
            return { ...state, relevant: state.relevant.filter(target => target._id !== action.payload._id) };

        case submitExerciseDataAction.SET_UNFILLED_FIELDS:
            return { ...state, unfilledFields: action.payload };
        default:
            return state;
    }
};
