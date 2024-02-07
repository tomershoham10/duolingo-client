export enum recordMetaAction {
    SET_RECORD_LENGTH = 'setRecrodLength',
    SET_DIFFICULTY_LEVEL = 'setDifficultyLevel',
    SET_TARGETS_IDS = 'setTargetsIds',
    SET_OPERATION_NAME = 'setOperationName',
    SET_SOURCE = 'setSource',
    SET_ITALY_STATUS = 'setItalyStatus',
    SET_TRANSMISSION_TYPE = 'setTransmissionType',
    SET_NUMBER_OF_CHANNELS = 'setNumberOfChannels',
    SET_SONAR_SYSTEM = 'setSonarSystem',
    TOGGLE_BACKROUND_VESSELS = 'toggleBackroundVessels',
    TOGGLE_AUX = 'toggleAux',
}

type Action =
    | { type: recordMetaAction.SET_RECORD_LENGTH; payload: number }
    | { type: recordMetaAction.SET_DIFFICULTY_LEVEL; payload: number }
    | { type: recordMetaAction.SET_TARGETS_IDS; payload: string[] }
    | { type: recordMetaAction.SET_OPERATION_NAME; payload: string }
    | { type: recordMetaAction.SET_SOURCE; payload: string }
    | { type: recordMetaAction.SET_ITALY_STATUS; payload: boolean }
    | { type: recordMetaAction.SET_TRANSMISSION_TYPE; payload: Transmissions }
    | { type: recordMetaAction.SET_NUMBER_OF_CHANNELS; payload: 1 | 2 }
    | { type: recordMetaAction.SET_SONAR_SYSTEM; payload: SonarSystem }
    | { type: recordMetaAction.TOGGLE_BACKROUND_VESSELS }
    | { type: recordMetaAction.TOGGLE_AUX };

export const recordMetadataReducer = (
    state: RecordMetadataType,
    action: Action
): RecordMetadataType => {
    switch (action.type) {
        case recordMetaAction.SET_RECORD_LENGTH:
            return { ...state, record_length: action.payload };
        case recordMetaAction.SET_DIFFICULTY_LEVEL:
            return { ...state, difficulty_level: action.payload };
        case recordMetaAction.SET_TARGETS_IDS:
            return { ...state, targets_ids_list: action.payload };
        case recordMetaAction.SET_OPERATION_NAME:
            return { ...state, operation: action.payload };
        case recordMetaAction.SET_SOURCE:
            return { ...state, source: action.payload };
        case recordMetaAction.SET_ITALY_STATUS:
            return { ...state, is_in_italy: !state.is_in_italy };
        case recordMetaAction.SET_TRANSMISSION_TYPE:
            return { ...state, transmission: action.payload };
        case recordMetaAction.SET_NUMBER_OF_CHANNELS:
            return { ...state, channels_number: action.payload };
        case recordMetaAction.SET_SONAR_SYSTEM:
            return { ...state, sonar_system: action.payload };
        case recordMetaAction.TOGGLE_BACKROUND_VESSELS:
            return { ...state, is_backround_vessels: !state.is_backround_vessels };
        case recordMetaAction.TOGGLE_AUX:
            return { ...state, aux: !state.aux };
        default:
            return state;
    }
};
