export enum EditRecordMetadataAction {
    SET_DIFFICULTY_LEVEL = 'setDifficultyLevel',
    SET_NUMBER_OF_CHANNELS = 'setNumberOfChannels',
    ADD_SONOGRAM = 'addSonogram',
    SET_SONOGRAM_NAMES = 'setSonogramNames',
    SET_OPERATION_NAME = 'setOperationName',
    SET_SOURCE_ID = 'setSourceId',
    SET_ITALY_STATUS = 'setItalyStatus',
    TOGGLE_ITALY_STATUS = 'toggleItalyStatus',
    TOGGLE_AUX = 'toggleAux',
    SET_SIGNATURE_TYPE = 'setSignatureType',
    SET_SONAR_SYSTEM = 'setSonarSystem'
}

type Action =
    | { type: EditRecordMetadataAction.SET_DIFFICULTY_LEVEL, payload: number | null }
    | { type: EditRecordMetadataAction.SET_NUMBER_OF_CHANNELS, payload: number | null }
    | { type: EditRecordMetadataAction.ADD_SONOGRAM, payload: string | null }
    | { type: EditRecordMetadataAction.SET_SONOGRAM_NAMES, payload: string[] }
    | { type: EditRecordMetadataAction.SET_OPERATION_NAME, payload: string | null }
    | { type: EditRecordMetadataAction.SET_SOURCE_ID, payload: string | null }
    | { type: EditRecordMetadataAction.SET_ITALY_STATUS, payload: boolean | null }
    | { type: EditRecordMetadataAction.TOGGLE_ITALY_STATUS }
    | { type: EditRecordMetadataAction.TOGGLE_AUX }
    | { type: EditRecordMetadataAction.SET_SIGNATURE_TYPE, payload: SignatureTypes | null }
    | { type: EditRecordMetadataAction.SET_SONAR_SYSTEM, payload: SonarSystem | null }

export interface EditRecordMetadata {
    difficulty_level: number | null;
    number_of_channels: number | null;
    sonograms_names: string[];
    targets_ids_list: string[];
    operation: string | null;
    source_id: string | null;
    is_in_italy: boolean | null;
    aux: boolean | null;
    is_backround_vessels: boolean | null;
    signature_type: SignatureTypes | null;
    sonar_system: SonarSystem | null;
}

export const editRecordMetadataReducer = (
    state: EditRecordMetadata,
    action: Action
): EditRecordMetadata => {
    switch (action.type) {
        case EditRecordMetadataAction.SET_DIFFICULTY_LEVEL:
            return { ...state, difficulty_level: action.payload };
        case EditRecordMetadataAction.SET_NUMBER_OF_CHANNELS:
            return { ...state, number_of_channels: action.payload };
        case EditRecordMetadataAction.ADD_SONOGRAM:
            if (action.payload) {
                return { ...state, sonograms_names: [...state.sonograms_names, action.payload] };
            }
            return state;
        case EditRecordMetadataAction.SET_SONOGRAM_NAMES:
            return { ...state, sonograms_names: action.payload };
        case EditRecordMetadataAction.SET_OPERATION_NAME:
            return { ...state, operation: action.payload };
        case EditRecordMetadataAction.SET_SOURCE_ID:
            return { ...state, source_id: action.payload };
        case EditRecordMetadataAction.SET_ITALY_STATUS:
            return { ...state, is_in_italy: action.payload };
        case EditRecordMetadataAction.TOGGLE_ITALY_STATUS:
            return { ...state, is_in_italy: !state.is_in_italy };
        case EditRecordMetadataAction.TOGGLE_AUX:
            return { ...state, aux: !state.aux };
        case EditRecordMetadataAction.SET_SIGNATURE_TYPE:
            return { ...state, signature_type: action.payload };
        case EditRecordMetadataAction.SET_SONAR_SYSTEM:
            return { ...state, sonar_system: action.payload };


        default:
            return state;
    }
};
