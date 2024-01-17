export enum submitRecordAction {
    SET_RECORD_FILE = 'setRecrodFile',
    SET_SONOLIST = 'setSonolist',
    SET_METADATA = 'setMetadata',
}

type Action =
    | { type: submitRecordAction.SET_RECORD_FILE; payload: File }
    | { type: submitRecordAction.SET_SONOLIST; payload: FileList }
    | { type: submitRecordAction.SET_METADATA; payload: Partial<RecordMetadataType> }

export interface submitDataType {
    record: File | undefined,
    recordMetadata: Partial<RecordMetadataType>,
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
        case submitRecordAction.SET_METADATA:
            return { ...state, recordMetadata: action.payload };
        default:
            return state;
    }
};

