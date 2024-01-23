export enum submitRecordAction {
    SET_RECORD_FILE = 'setRecrodFile',
    REMOVE_RECORD_FILE = 'removeRecordFile',
    SET_RECORD_METADATA = 'setRecordMetadata',
    REMOVE_RECORD_METADATA = 'removeRecordMetadata',


    SET_SONOLIST = 'setSonolist',
    REMOVE_SONOGRAM = 'removeSonogram',
    SET_SONOGRAM_META = 'setSonogramsMeta',
    REMOVE_SONOGRAM_META = 'removeSonogramMeta',
}

type Action =
    | { type: submitRecordAction.SET_RECORD_FILE; payload: File }
    | { type: submitRecordAction.REMOVE_RECORD_FILE; payload: number }
    | { type: submitRecordAction.SET_RECORD_METADATA; payload: Partial<RecordMetadataType> }
    | { type: submitRecordAction.REMOVE_RECORD_METADATA; payload: Partial<RecordMetadataType> }

    | { type: submitRecordAction.SET_SONOLIST; payload: FileList }
    | { type: submitRecordAction.REMOVE_SONOGRAM; payload: number }
    | { type: submitRecordAction.SET_SONOGRAM_META; payload: Partial<SonogramMetadataType> }
    | { type: submitRecordAction.REMOVE_SONOGRAM_META; payload: number }

export interface submitDataType {
    record: File | undefined,
    recordMetadata: Partial<RecordMetadataType> | undefined,
    sonograms: FileList | undefined,
    sonogramsMetadata: Partial<SonogramMetadataType>[],
}

export const submitRecordReducer = (
    state: submitDataType,
    action: Action
): submitDataType => {
    switch (action.type) {
        case submitRecordAction.SET_RECORD_FILE:
            return { ...state, record: action.payload };
        case submitRecordAction.REMOVE_RECORD_FILE:
            return { ...state, record: undefined, recordMetadata: {} };

        case submitRecordAction.SET_RECORD_METADATA:
            return { ...state, recordMetadata: action.payload };
        case submitRecordAction.REMOVE_RECORD_METADATA:
            return { ...state, recordMetadata: undefined };

        case submitRecordAction.SET_SONOLIST:
            return { ...state, sonograms: action.payload };
        case submitRecordAction.REMOVE_SONOGRAM:
            return { ...state, sonograms: removeFileFromList(state.sonograms, action.payload) };

        case submitRecordAction.SET_SONOGRAM_META:
            return { ...state, sonogramsMetadata: [...state.sonogramsMetadata, action.payload] };
        case submitRecordAction.REMOVE_SONOGRAM_META:
            return { ...state, sonogramsMetadata: removeMetadataObj(state.sonogramsMetadata, action.payload) };
        default:
            return state;
    }
};

function removeFileFromList(fileList: FileList | undefined, indexToRemove: number): FileList | undefined {
    if (!!fileList) {
        const files = Array.from(fileList).filter((_, index) => index !== indexToRemove);

        const dataTransfer = new DataTransfer();
        files.forEach(file => dataTransfer.items.add(file));

        const newFileList = dataTransfer.files;

        return newFileList;
    } else {
        return undefined;
    }
}

function removeMetadataObj(sonolistMetas: Partial<SonogramMetadataType>[], indexToRemove: number): Partial<SonogramMetadataType>[] {
    const filteredMetas = sonolistMetas.filter((_, index) => index !== indexToRemove);
    return filteredMetas;
}
