import { BucketsNames } from "@/app/API/files-service/functions";

export enum submitFileAction {
    SET_FILE = 'setFile',
    SET_FILE_TYPE = 'setFileType',
    SET_EXERCISE_TYPE = 'updateExerciseType',
    UPDATE_METADATA = 'updateMetadata',
    REMOVE_FILE = 'removeFile'
}

const deepUpdate = (obj: any, path: string, value: any): any => {
    console.log('deepUpdate', obj, path, value);
    const keys = path.split('.');
    const lastKey = keys.pop();
    const lastObj = keys.reduce((acc, key) => acc[key] = acc[key] || {}, obj);
    lastObj[lastKey!] = value;
    console.log({ ...obj });
    return { ...obj };
};

type Action =
    | { type: submitFileAction.SET_FILE, payload: File | null }
    | { type: submitFileAction.SET_FILE_TYPE, payload: BucketsNames | null }
    | { type: submitFileAction.SET_EXERCISE_TYPE, payload: ExercisesTypes }
    | { type: submitFileAction.UPDATE_METADATA, field: string, value: any }
    | { type: submitFileAction.REMOVE_FILE };

export interface submitFileDataType {
    file: File | null;
    fileType: BucketsNames | null;
    exerciseType: ExercisesTypes | null;
    metadata: Partial<Metadata>;
}

export const submitFileReducer = (
    state: submitFileDataType,
    action: Action
): submitFileDataType => {
    switch (action.type) {
        case submitFileAction.SET_FILE:
            return { ...state, file: action.payload };

        case submitFileAction.SET_FILE_TYPE:
            if (action.payload === BucketsNames.IMAGES) {
                return { ...state, fileType: action.payload, metadata: {} as Partial<ImageMetadata> };
            }
            if (action.payload === BucketsNames.RECORDS) {
                return { ...state, fileType: action.payload, metadata: { record_length: 0 } as Partial<RecordMetadata> };
            }
            return state;

        case submitFileAction.SET_EXERCISE_TYPE:
            return { ...state, exerciseType: action.payload };

        case submitFileAction.UPDATE_METADATA:
            // console.log(action.payload, { ...state.metadata, ...action.payload });
            return {
                ...state,
                metadata: deepUpdate(state.metadata, action.field, action.value),

                // metadata: {
                //     ...state.metadata,
                //     [action.field]: action.value,
                // },
            };

        case submitFileAction.REMOVE_FILE:
            if (state.fileType === BucketsNames.RECORDS) {
                return { file: null, metadata: { record_length: 0 } as Partial<RecordMetadata>, fileType: state.fileType, exerciseType: state.exerciseType }
            }
            else {
                return {
                    file: null, metadata: {} as Partial<ImageMetadata>, fileType: state.fileType, exerciseType: state.exerciseType
                }
            }

        default:
            return state;
    };
}