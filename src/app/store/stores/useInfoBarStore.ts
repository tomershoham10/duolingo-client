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
    syllabusFieldToEdit: fieldToEditType | undefined;
    syllabusFieldId: string | undefined;
    syllabusFieldIndex: number | undefined;
    selectedFile: RecordType | SonogramType | undefined;
}
type Action = {
    updateSyllabusFieldToEdit: (syllabusFieldToEdit: useInfoBarState['syllabusFieldToEdit']) => void;
    updateSyllabusFieldId: (syllabusFieldId: useInfoBarState['syllabusFieldId']) => void;
    updateSyllabusFieldIndex: (syllabusFieldIndex: useInfoBarState['syllabusFieldIndex']) => void;
    updateSelectedFile: (selectedRecord: useInfoBarState['selectedFile']) => void;
    resetStore: () => void;
}


export const useInfoBarStore = create<useInfoBarState & Action>(
    (set) => ({
        syllabusFieldToEdit: undefined,
        syllabusFieldId: undefined,
        selectedFile: undefined,
        syllabusFieldIndex: undefined,
        updateSyllabusFieldToEdit: (syllabusFieldToEdit) => set(() => ({ syllabusFieldToEdit: syllabusFieldToEdit })),
        updateSyllabusFieldId: (syllabusFieldId) => set(() => ({ syllabusFieldId: syllabusFieldId })),
        updateSyllabusFieldIndex: (syllabusFieldIndex) => set(() => ({ syllabusFieldIndex: syllabusFieldIndex })),
        updateSelectedFile: (newSelectedFile) => set({ selectedFile: newSelectedFile }),
        resetStore: () => {
            set(() => ({
                syllabusFieldToEdit: undefined,
                syllabusFieldId: undefined,
                selectedFile: undefined,
            }));
        }
    }),
)

if (process.env.NODE_ENV === 'development') {
    mountStoreDevtool('useInfoBarStore', useInfoBarStore);
}