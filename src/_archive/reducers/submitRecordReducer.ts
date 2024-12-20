// export enum submitRecordAction {
//     SET_RECORD_FILE = 'setRecrodFile',
//     REMOVE_RECORD_FILE = 'removeRecordFile',
//     SET_RECORD_METADATA = 'setRecordMetadata',
//     REMOVE_RECORD_METADATA = 'removeRecordMetadata',


//     SET_SONOLIST = 'setSonolist',
//     REMOVE_SONOGRAM = 'removeSonogram',
//     SET_SONOGRAM_META = 'setSonogramsMeta',
//     REMOVE_SONOGRAM_META = 'removeSonogramMeta',
// }

// type Action =
//     | { type: submitRecordAction.SET_RECORD_FILE, payload: File }
//     | { type: submitRecordAction.REMOVE_RECORD_FILE }
//     | { type: submitRecordAction.SET_RECORD_METADATA, payload: Partial<Metadata> }
//     | { type: submitRecordAction.REMOVE_RECORD_METADATA, payload: Partial<Metadata> }

//     // | { type: submitRecordAction.SET_SONOLIST; payload: FileList }
//     | { type: submitRecordAction.SET_SONOLIST; payload: File[] }
//     | { type: submitRecordAction.REMOVE_SONOGRAM; payload: number }
//     | { type: submitRecordAction.SET_SONOGRAM_META; payload: Partial<Metadata> }
//     | { type: submitRecordAction.REMOVE_SONOGRAM_META; payload: number }

// export interface submitRecordDataType {
//     record: File | undefined,
//     recordMetadata: Partial<Metadata> | undefined,
//     // sonograms: FileList | undefined,
//     sonograms: File[] | undefined,
//     sonogramsMetadata: Partial<Metadata>[],
// }

// export const submitRecordReducer = (
//     state: submitRecordDataType,
//     action: Action
// ): submitRecordDataType => {
//     switch (action.type) {
//         case submitRecordAction.SET_RECORD_FILE:
//             return { ...state, record: action.payload };
//         case submitRecordAction.REMOVE_RECORD_FILE:
//             return { ...state, record: undefined, recordMetadata: {} };

//         case submitRecordAction.SET_RECORD_METADATA:
//             return { ...state, recordMetadata: action.payload };
//         case submitRecordAction.REMOVE_RECORD_METADATA:
//             return { ...state, recordMetadata: undefined };

//         case submitRecordAction.SET_SONOLIST:
//             return { ...state, sonograms: action.payload };
//         case submitRecordAction.REMOVE_SONOGRAM:
//             return { ...state, sonograms: removeFileFromList(state.sonograms, action.payload) };

//         case submitRecordAction.SET_SONOGRAM_META:
//             return { ...state, sonogramsMetadata: [...state.sonogramsMetadata, action.payload] };
//         case submitRecordAction.REMOVE_SONOGRAM_META:
//             return { ...state, sonogramsMetadata: removeMetadataObj(state.sonogramsMetadata, action.payload) };
//         default:
//             return state;
//     }
// };

// // function removeFileFromList(fileList: FileList | undefined, indexToRemove: number): FileList | undefined {
// function removeFileFromList(fileList: File[] | undefined, indexToRemove: number): File[] | undefined {
//     if (!!fileList) {
//         const files = Array.from(fileList).filter((_, index) => index !== indexToRemove);

//         // const dataTransfer = new DataTransfer();
//         // files.forEach(file => dataTransfer.items.add(file));

//         // const newFileList = dataTransfer.files;

//         // return newFileList;
//         return files;
//     } else {
//         return undefined;
//     }
// }

// function removeMetadataObj(sonolistMetas: Partial<Metadata>[], indexToRemove: number): Partial<Metadata>[] {
//     const filteredMetas = sonolistMetas.filter((_, index) => index !== indexToRemove);
//     return filteredMetas;
// }
