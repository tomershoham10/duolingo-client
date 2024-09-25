export enum UploadFilesAction {
    SET_MAIN_ID = "setMainId",
    SET_SUB_TYPE_ID = "setSubTypeId",
    SET_MODEL = "setModel",

    SET_FILES = 'setFiles',
    RESET_FILES_STATE = 'resetFilesState',
    REMOVE_FILE = 'removeFile',
}



type Action =
    | { type: UploadFilesAction.SET_FILES, payload: File[] }

    | { type: UploadFilesAction.SET_MAIN_ID, payload: string | null }
    | { type: UploadFilesAction.SET_SUB_TYPE_ID, payload: string | null }
    | { type: UploadFilesAction.SET_MODEL, payload: TargetType | null }

    | { type: UploadFilesAction.RESET_FILES_STATE }
    | { type: UploadFilesAction.REMOVE_FILE, payload: string | null }

export interface UploadFilesDataType {
    mainId: string | null;
    subtypeId: string | null;
    model: TargetType | null;

    files: File[];
}

export const uploadFilesReducer = (
    state: UploadFilesDataType,
    action: Action
): UploadFilesDataType => {
    switch (action.type) {
        case UploadFilesAction.SET_FILES:
            return { ...state, files: action.payload };

        case UploadFilesAction.SET_MAIN_ID:
            return { ...state, mainId: action.payload };
        case UploadFilesAction.SET_SUB_TYPE_ID:
            return { ...state, subtypeId: action.payload };
        case UploadFilesAction.SET_MODEL:
            return { ...state, model: action.payload };

        case UploadFilesAction.RESET_FILES_STATE:
            return { ...state, files: [] };

        case UploadFilesAction.REMOVE_FILE:
            return { ...state, files: state.files.filter(file => file.name !== action.payload) };

        default:
            return state;
    };
}