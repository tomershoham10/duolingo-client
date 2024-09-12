export enum uploadFilesAction {
    SET_MAIN_ID = "setMainId",
    SET_SUB_TYPE_ID = "setSubTypeId",
    SET_MODEL = "setModel",

    SET_FILES = 'setFiles',
    RESET_FILES_STATE = 'resetFilesState',
    REMOVE_FILE = 'removeFile',
}



type Action =
    | { type: uploadFilesAction.SET_FILES, payload: File[] }

    | { type: uploadFilesAction.SET_MAIN_ID, payload: string | null }
    | { type: uploadFilesAction.SET_SUB_TYPE_ID, payload: string | null }
    | { type: uploadFilesAction.SET_MODEL, payload: TargetType | null }

    | { type: uploadFilesAction.RESET_FILES_STATE }
    | { type: uploadFilesAction.REMOVE_FILE, payload: string | null }

export interface uploadFilesDataType {
    mainId: string | null;
    subtypeId: string | null;
    model: TargetType | null;

    files: File[];
}

export const uploadFilesReducer = (
    state: uploadFilesDataType,
    action: Action
): uploadFilesDataType => {
    switch (action.type) {
        case uploadFilesAction.SET_FILES:
            return { ...state, files: action.payload };

        case uploadFilesAction.SET_MAIN_ID:
            return { ...state, mainId: action.payload };
        case uploadFilesAction.SET_SUB_TYPE_ID:
            return { ...state, subtypeId: action.payload };
        case uploadFilesAction.SET_MODEL:
            return { ...state, model: action.payload };

        case uploadFilesAction.RESET_FILES_STATE:
            return { ...state, files: [] };

        case uploadFilesAction.REMOVE_FILE:
            return { ...state, files: state.files.filter(file => file.name !== action.payload) };

        default:
            return state;
    };
}