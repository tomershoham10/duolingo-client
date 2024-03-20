"use client"
import { create } from 'zustand';
import { mountStoreDevtool } from 'simple-zustand-devtools';

//*********************************************************************//
// to import a store value :
// // const fieldToEdit = useStore(useInfoBarStore, (state) => state.fieldToEdit);

// to import a store function :
// // const updateFieldToEdit = useInfoBarStore.getState().updateFieldToEdit;
//*********************************************************************//

export enum fieldToEditType {
    UNIT = "unit",
    LEVEL = "level",
    LESSON = "lesson",
    EXERCISE = "exercise",
}

type useInfoBarState = {
    syllabusFieldType: fieldToEditType | undefined;
    syllabusFieldId: string | undefined;
    syllabusFieldIndex: number;
    syllabusFieldFatherId: string | undefined;
    syllabusIsFieldSuspended: boolean;

    selectedFile: RecordType | SonogramType | undefined;
}
type Action = {
    updatesyllabusFieldType: (syllabusFieldType: useInfoBarState['syllabusFieldType']) => void;
    updateSyllabusFieldId: (syllabusFieldId: useInfoBarState['syllabusFieldId']) => void;
    updateSyllabusFieldIndex: (syllabusFieldIndex: useInfoBarState['syllabusFieldIndex']) => void;
    updateSyllabusFieldFatherIndex: (syllabusFieldFatherId: useInfoBarState['syllabusFieldFatherId']) => void;
    updateSyllabusIsFieldSuspended: (syllabusIsFieldSuspended: useInfoBarState['syllabusIsFieldSuspended']) => void;

    updateSelectedFile: (selectedRecord: useInfoBarState['selectedFile']) => void;
    resetStore: () => void;
}


export const useInfoBarStore = create<useInfoBarState & Action>(
    (set) => ({
        syllabusFieldType: undefined,
        syllabusFieldId: undefined,
        syllabusFieldIndex: 0,
        syllabusFieldFatherId: undefined,
        syllabusIsFieldSuspended: false,
        selectedFile: undefined,
        updatesyllabusFieldType: (syllabusFieldType) => set(() => ({ syllabusFieldType: syllabusFieldType })),
        updateSyllabusFieldId: (syllabusFieldId) => set(() => ({ syllabusFieldId: syllabusFieldId })),
        updateSyllabusFieldIndex: (syllabusFieldIndex) => set(() => ({ syllabusFieldIndex: syllabusFieldIndex })),
        updateSyllabusFieldFatherIndex: (syllabusFieldFatherId) => set(() => ({ syllabusFieldFatherId: syllabusFieldFatherId })),
        updateSyllabusIsFieldSuspended: (syllabusIsFieldSuspended) => set(() => ({ syllabusIsFieldSuspended: syllabusIsFieldSuspended })),
        updateSelectedFile: (newSelectedFile) => set({ selectedFile: newSelectedFile }),
        resetStore: () => {
            set(() => ({
                syllabusFieldType: undefined,
                syllabusFieldId: undefined,
                selectedFile: undefined,
            }));
        }
    }),
)

if (process.env.NODE_ENV === 'development') {
    mountStoreDevtool('useInfoBarStore', useInfoBarStore);
}