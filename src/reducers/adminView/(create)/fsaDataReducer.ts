export enum fsaFieldsType {
    DESCRIPTION = 'description',
    RELEVANT = 'relevant',
    TIMEBUFFERS = 'timeBuffers',
}

export enum FsaDataActionsList {
    SET_DESCRIPTION = 'setDescription',

    SET_RELEVANT = 'setRelevant',
    ADD_RELEVANT = 'addRelevant',
    REMOVE_TARGET_FROM_RELEVANT = 'removeTargetFromRelevant',

    SET_UNFILLED_FIELDS = 'setUnfilledFields',

    SET_SHOW_PLACE_HOLDER = 'setShowPlaceholder',
    SET_TARGET_FROM_DROPDOWN = 'setTargetFromDropdown'
}

export type FsaDataAction =
    | { type: FsaDataActionsList.SET_DESCRIPTION; payload: string }
    | { type: FsaDataActionsList.SET_RELEVANT, payload: RelevantList[] }
    | { type: FsaDataActionsList.ADD_RELEVANT, payload: RelevantList }
    | { type: FsaDataActionsList.REMOVE_TARGET_FROM_RELEVANT; payload: RelevantList }
    | { type: FsaDataActionsList.SET_UNFILLED_FIELDS, payload: fsaFieldsType[] }
    | { type: FsaDataActionsList.SET_SHOW_PLACE_HOLDER, payload: boolean }
    | { type: FsaDataActionsList.SET_TARGET_FROM_DROPDOWN, payload: TargetType | null }

interface RelevantList {
    id: string,
    name: string,
}

export interface FsaDataType {
    description: string | undefined,
    relevant: RelevantList[],
    unfilledFields: fsaFieldsType[],
    showPlaceholder: boolean,
    targetFromDropdown: TargetType | null
}

export const fsaDataReducer = (
    state: FsaDataType,
    action: FsaDataAction
): FsaDataType => {
    switch (action.type) {
        case FsaDataActionsList.SET_DESCRIPTION:
            return { ...state, description: action.payload };
        case FsaDataActionsList.SET_RELEVANT:
            return { ...state, relevant: action.payload };
            case FsaDataActionsList.ADD_RELEVANT:
            return { ...state, relevant: [...state.relevant, action.payload] };
        case FsaDataActionsList.REMOVE_TARGET_FROM_RELEVANT:
            return { ...state, relevant: state.relevant };

        case FsaDataActionsList.SET_UNFILLED_FIELDS:
            return { ...state, unfilledFields: action.payload };

        case FsaDataActionsList.SET_SHOW_PLACE_HOLDER:
            return { ...state, showPlaceholder: action.payload };

        case FsaDataActionsList.SET_TARGET_FROM_DROPDOWN:
            return { ...state, targetFromDropdown: action.payload };

        default:
            return state;
    }
};
