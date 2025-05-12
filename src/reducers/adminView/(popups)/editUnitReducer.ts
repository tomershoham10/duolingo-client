export enum EditUnitAction {
    SET_UNIT_ID = 'setUnitId',
    SET_DESCRIPTION = 'setDescription',
    SET_LEVELS = 'setLevels',
    SET_SUSPENDED_LEVELS = 'setSuspendedLevels',
    ADD_LEVEL = 'addLevel',
    DELETE_LEVEL = 'deleteLevel',
    SET_NAME = "setName",
}

type Action =
    | { type: EditUnitAction.SET_UNIT_ID, payload: string | null }
    | { type: EditUnitAction.SET_DESCRIPTION, payload: string | undefined }
    | { type: EditUnitAction.SET_LEVELS, payload: string[] }
    | { type: EditUnitAction.SET_SUSPENDED_LEVELS, payload: string[] }
    | { type: EditUnitAction.ADD_LEVEL, payload: string }
    | { type: EditUnitAction.DELETE_LEVEL, payload: string }
    | { type: EditUnitAction.SET_NAME, payload: string | undefined }

export interface UnitDataType {
    unitId: string | null,
    description: string | undefined,
    levels: string[],
    name: string | undefined,
}

export const editUnitReducer = (
    state: UnitDataType,
    action: Action
): UnitDataType => {
    switch (action.type) {
        case EditUnitAction.SET_UNIT_ID:
            return { ...state, unitId: action.payload };
        case EditUnitAction.SET_DESCRIPTION:
            return { ...state, description: action.payload };
        case EditUnitAction.SET_LEVELS:
            return { ...state, levels: action.payload };
        case EditUnitAction.ADD_LEVEL:
            return { ...state, levels: [...state.levels, action.payload] };
        case EditUnitAction.DELETE_LEVEL:
            return { ...state, levels: [...state.levels, action.payload] };
        case EditUnitAction.SET_NAME:
            return { ...state, name: action.payload };

        default:
            return state;
    }
};
