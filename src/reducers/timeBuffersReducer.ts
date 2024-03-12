export enum TimeBuffersAction {
    SET_RANGE_INDEX = 'setRangeIndex',
    ADD_SCORE = 'addScore',
    SET_SCORES_ARRAY = 'setScoresArray',
    ADD_VAL_TIME_ARRAY = 'addValTimeArray',
    EDIT_TIME_VALS_ARRAY = 'editTimeValsArray',
    DELETE_TIME_VAL = 'deleteTimeVal',
    SET_ADDED_VALUE_LEFT_PERC = 'setAddedValueLeftPerc'
}

interface NewSliderVal {
    index: number,
    newVal: number
}

type Action =
    | { type: TimeBuffersAction.SET_RANGE_INDEX, payload: number }
    | { type: TimeBuffersAction.ADD_SCORE, payload: number }
    | { type: TimeBuffersAction.SET_SCORES_ARRAY, payload: number[] }
    | { type: TimeBuffersAction.ADD_VAL_TIME_ARRAY, payload: number }
    | { type: TimeBuffersAction.EDIT_TIME_VALS_ARRAY, payload: NewSliderVal }
    | { type: TimeBuffersAction.DELETE_TIME_VAL, payload: number }
    | { type: TimeBuffersAction.SET_ADDED_VALUE_LEFT_PERC, payload: number }

export interface TimeBuffersType {
    rangeIndex: number,
    timeBuffersScores: number[],
    timeBufferRangeValues: number[],
    addedValueLeftPerc: number,
}

export const timeBuffersReducer = (
    state: TimeBuffersType,
    action: Action
): TimeBuffersType => {
    switch (action.type) {
        case TimeBuffersAction.SET_RANGE_INDEX:
            return { ...state, rangeIndex: action.payload };
        case TimeBuffersAction.SET_SCORES_ARRAY:
            return { ...state, timeBuffersScores: action.payload };
        case TimeBuffersAction.ADD_SCORE:
            return { ...state, timeBuffersScores: [...state.timeBuffersScores, action.payload] };
        case TimeBuffersAction.ADD_VAL_TIME_ARRAY:
            return { ...state, timeBufferRangeValues: [...state.timeBufferRangeValues, action.payload] };
        case TimeBuffersAction.EDIT_TIME_VALS_ARRAY:
            return { ...state, timeBufferRangeValues: editSliders(state, action.payload) };
        case TimeBuffersAction.DELETE_TIME_VAL:
            return { ...state, timeBufferRangeValues: deleteTimeRangeVal(state, action.payload) };

        case TimeBuffersAction.SET_ADDED_VALUE_LEFT_PERC:
            return { ...state, addedValueLeftPerc: action.payload };

        default:
            return state;
    }
};

const editSliders = (state: TimeBuffersType, payload: NewSliderVal) => {
    return state.timeBufferRangeValues.map((value, i) =>
        i === payload.index
            ? payload.newVal > state.timeBufferRangeValues[i + 1]
                ? state.timeBufferRangeValues[i + 1] - 1 / 6
                : payload.newVal < state.timeBufferRangeValues[i - 1]
                    ? state.timeBufferRangeValues[i - 1] + 1 / 6
                    : payload.newVal
            : value
    );
}

const deleteTimeRangeVal = (state: TimeBuffersType, index: number) => {
    return state.timeBufferRangeValues.filter(
        (item) => item !== state.timeBufferRangeValues[index]
    )
}