import { BucketsNames } from "@/app/API/files-service/functions";

export enum submitFileAction {
    SET_FILE = 'setFile',
    // SET_EXERCISE_TYPE = 'setExerciseType',
    SET_FILE_TYPE = 'setFileType',
    SET_EXERCISE_TYPE = 'updateExerciseType',
    UPDATE_METADATA = 'updateMetadata',
    REMOVE_FILE = 'removeFile'
}

type Action =
    | { type: submitFileAction.SET_FILE, payload: Partial<FileType> }
    // | { type: submitFileAction.SET_EXERCISE_TYPE, payload: ExercisesTypes | null }
    | { type: submitFileAction.SET_FILE_TYPE, payload: BucketsNames | null }
    | { type: submitFileAction.SET_EXERCISE_TYPE, payload: ExercisesTypes }
    | { type: submitFileAction.UPDATE_METADATA, payload: Partial<Metadata> }
    | { type: submitFileAction.REMOVE_FILE };

export interface submitFileDataType {
    file: Partial<FileType>,
    // exerciseType: ExercisesTypes | null,
    fileType: BucketsNames | null,
}

export const submitFileReducer = (
    state: submitFileDataType,
    action: Action
): submitFileDataType => {
    switch (action.type) {
        case submitFileAction.SET_FILE:
            return { ...state, file: { ...state.file, name: action.payload.name } };

        // case submitFileAction.SET_EXERCISE_TYPE:
        //     return { ...state, exerciseType: action.payload };

        case submitFileAction.SET_FILE_TYPE:
            if (action.payload === BucketsNames.RECORDS) {
                if (!state.file.metadata || Object.values(state.file.metadata).length === 0) {
                    return {
                        ...state, file: { ...state.file, metadata: { record_length: 0 } as Partial<RecordMetadata> },
                        fileType: action.payload
                    };
                } else {
                    return {
                        ...state, file: { ...state.file, metadata: { ...state.file.metadata } as Partial<RecordMetadata> },
                        fileType: action.payload
                    };
                }
            }
            if (action.payload === BucketsNames.IMAGES) {
                if (!state.file.metadata || Object.values(state.file.metadata).length === 0) {
                    return {
                        ...state, file: { ...state.file, metadata: {} as Partial<ImageMetadata> },
                        fileType: action.payload
                    };
                } else {
                    let imgMeta = { ...state.file.metadata };
                    if (Object.keys(state.file.metadata).includes('record_length')) {
                        imgMeta = { ...state.file.metadata } as Partial<RecordMetadata>
                        delete imgMeta.record_length;
                    }
                    return {
                        ...state, file: { ...state.file, metadata: { ...imgMeta } as Partial<ImageMetadata> },
                        fileType: action.payload
                    };
                }
            }
            return state;

        case submitFileAction.SET_EXERCISE_TYPE:
            if (state.file) {
                return {
                    ...state,
                    file: {
                        ...state.file,
                        exerciseType: action.payload,
                        metadata: {
                            ...state.file.metadata,
                        }
                    }
                };
            }
            return state;

        case submitFileAction.UPDATE_METADATA:
            if (state.file) {
                return {
                    ...state,
                    file: {
                        ...state.file,
                        metadata: {
                            ...state.file.metadata,
                            ...action.payload
                        }
                    }
                };
            }
            return state;

        case submitFileAction.REMOVE_FILE:
            if (state.fileType === BucketsNames.RECORDS) {
                return { file: { metadata: { record_length: 0 } as Partial<RecordMetadata> }, fileType: state.fileType }
            } else {
                return { file: { metadata: {} as Partial<ImageMetadata> }, fileType: state.fileType }
            }
        default:
            return state;
    }
};
