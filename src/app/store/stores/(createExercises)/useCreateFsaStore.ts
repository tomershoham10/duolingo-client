// "use client"
// import { mountStoreDevtool } from 'simple-zustand-devtools';
// import { create } from 'zustand';


// type CreateFsaState = {
//     fileName: string | null;
//     recordLength: number;
// }

// type Action = {
//     setFileName: (fileName: string | null) => void;
//     updateRecordLength: (recordLength: number) => void;
//     resetStore: () => void;
// }

// export const useCreateFsaStore = create<CreateFsaState & Action>(
//     (set) => ({
//         fileName: null,
//         recordLength: 0,
//         description: undefined,

//         setFileName: (fileName) => set(() => ({ fileName: fileName })),
//         updateRecordLength: (recordLength) => set(() => ({ recordLength: recordLength })),
//         resetStore: () => {
//             set(() => ({
//                 fileName: null,
//                 recordLength: 0
//             }));
//         }
//     })
// )

// if (process.env.NODE_ENV === 'development') {
//     mountStoreDevtool('useCreateFsaStore', useCreateFsaStore);
// }

