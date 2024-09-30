export enum TimeBuffersActionsList {
    SET_RANGE_INDEX = 'setRangeIndex',
    ADD_SCORE = 'addScore',
    SET_SCORES_ARRAY = 'setScoresArray',
    ADD_VAL_TIME_ARRAY = 'addValTimeArray',
    EDIT_TIME_VALS_ARRAY = 'editTimeValsArray',
    DELETE_TIME_VAL = 'deleteTimeVal',
    SET_ADDED_VALUE_LEFT_PERC = 'setAddedValueLeftPerc',
    ADD_NEW_SCORE_BUFFER = 'addNewScoreBuffer',
    DELETE_TIME_BUFFER = 'deleteTimeBuffer'
}

interface NewSliderVal {
    index: number,
    newVal: number
}

export type TimeBuffersAction =
    | { type: TimeBuffersActionsList.SET_RANGE_INDEX, payload: number }
    | { type: TimeBuffersActionsList.ADD_SCORE, payload: number }
    | { type: TimeBuffersActionsList.SET_SCORES_ARRAY, payload: number[] }
    | { type: TimeBuffersActionsList.ADD_VAL_TIME_ARRAY, payload: number }
    | { type: TimeBuffersActionsList.EDIT_TIME_VALS_ARRAY, payload: NewSliderVal }
    | { type: TimeBuffersActionsList.DELETE_TIME_VAL, payload: number }
    | { type: TimeBuffersActionsList.SET_ADDED_VALUE_LEFT_PERC, payload: number }
    | { type: TimeBuffersActionsList.ADD_NEW_SCORE_BUFFER, payload: { newScore: number, newTime: number } }
    | { type: TimeBuffersActionsList.DELETE_TIME_BUFFER, payload: number }

export interface TimeBuffersReducerType {
    rangeIndex: number,
    timeBuffersScores: number[],
    timeBufferRangeValues: number[],
    addedValueLeftPerc: number,
}

export const timeBuffersReducer = (
    state: TimeBuffersReducerType,
    action: TimeBuffersAction
): TimeBuffersReducerType => {
    switch (action.type) {
        case TimeBuffersActionsList.SET_RANGE_INDEX:
            return { ...state, rangeIndex: action.payload };
        case TimeBuffersActionsList.SET_SCORES_ARRAY:
            return { ...state, timeBuffersScores: action.payload };
        case TimeBuffersActionsList.ADD_SCORE:
            return { ...state, timeBuffersScores: [...state.timeBuffersScores, action.payload] };
        case TimeBuffersActionsList.ADD_VAL_TIME_ARRAY:
            return { ...state, timeBufferRangeValues: [...state.timeBufferRangeValues, action.payload] };
        case TimeBuffersActionsList.EDIT_TIME_VALS_ARRAY:
            return { ...state, timeBufferRangeValues: editSliders(state, action.payload) };
        case TimeBuffersActionsList.DELETE_TIME_VAL:
            return { ...state, timeBufferRangeValues: deleteTimeRangeVal(state, action.payload) };

        case TimeBuffersActionsList.SET_ADDED_VALUE_LEFT_PERC:
            return { ...state, addedValueLeftPerc: action.payload };

        case TimeBuffersActionsList.ADD_NEW_SCORE_BUFFER:
            return {
                ...state,
                rangeIndex: state.rangeIndex + 1,
                timeBuffersScores: [...state.timeBuffersScores, action.payload.newScore],
                timeBufferRangeValues: [...state.timeBufferRangeValues, action.payload.newTime],
            };

        case TimeBuffersActionsList.DELETE_TIME_BUFFER:
            const newScores = state.timeBuffersScores.filter(
                (_, i) => i !== action.payload
            );
            const newRangeValues = state.timeBufferRangeValues.filter(
                (_, i) => i !== action.payload
            );
            return {
                ...state,
                rangeIndex: state.rangeIndex - 1,
                timeBuffersScores: newScores,
                timeBufferRangeValues: newRangeValues,
            };


        default:
            return state;
    }
};

const editSliders = (state: TimeBuffersReducerType, payload: NewSliderVal) => {
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

const deleteTimeRangeVal = (state: TimeBuffersReducerType, index: number) => {
    return state.timeBufferRangeValues.filter(
        (item) => item !== state.timeBufferRangeValues[index]
    )
}