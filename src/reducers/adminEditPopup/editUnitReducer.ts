export enum editUnitAction {
    SET_UNIT_ID = 'setUnitId',
    SET_DESCRIPTION = 'setDescription',
    SET_LEVELS = 'setLevels',
    SET_SUSPENDED_LEVELS = 'setSuspendedLevels',
    ADD_LEVEL = 'addLevel',
    DELETE_LEVEL = 'deleteLevel',
}

type Action =
    | { type: editUnitAction.SET_UNIT_ID, payload: string }
    | { type: editUnitAction.SET_DESCRIPTION, payload: string | undefined }
    | { type: editUnitAction.SET_LEVELS, payload: string[] }
    | { type: editUnitAction.SET_SUSPENDED_LEVELS, payload: string[] }
    | { type: editUnitAction.ADD_LEVEL, payload: string }
    | { type: editUnitAction.DELETE_LEVEL, payload: string }

export interface UnitDataType {
    unitId: string,
    description: string | undefined,
    levels: string[],
}

export const editUnitReducer = (
    state: UnitDataType,
    action: Action
): UnitDataType => {
    switch (action.type) {
        case editUnitAction.SET_UNIT_ID:
            return { ...state, unitId: action.payload };
        case editUnitAction.SET_DESCRIPTION:
            return { ...state, description: action.payload };
        case editUnitAction.SET_LEVELS:
            return { ...state, levels: action.payload };
        case editUnitAction.ADD_LEVEL:
            return { ...state, levels: [...state.levels, action.payload] };
        case editUnitAction.DELETE_LEVEL:
            return { ...state, levels: [...state.levels, action.payload] };

        default:
            return state;
    }
};
