"use client"
import { create } from 'zustand';
import { mountStoreDevtool } from 'simple-zustand-devtools';
import { RecordType } from '@/app/API/files-service/functions';

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
    selectedRecord: RecordType | undefined;
}
type Action = {
    updateSyllabusFieldToEdit: (syllabusFieldToEdit: useInfoBarState['syllabusFieldToEdit']) => void;
    updateSyllabusFieldId: (syllabusFieldId: useInfoBarState['syllabusFieldId']) => void;
    updateSelectedRecord: (selectedRecord: useInfoBarState['selectedRecord']) => void;
}


export const useInfoBarStore = create<useInfoBarState & Action>(
    (set) => ({
        syllabusFieldToEdit: undefined,
        syllabusFieldId: undefined,
        selectedRecord: undefined,
        updateSyllabusFieldToEdit: (syllabusFieldToEdit) => set(() => ({ syllabusFieldToEdit: syllabusFieldToEdit })),
        updateSyllabusFieldId: (syllabusFieldId) => set(() => ({ syllabusFieldId: syllabusFieldId })),
        updateSelectedRecord: (selectedRecord) => set(() => ({ selectedRecord: selectedRecord })),
    })
)

if (process.env.NODE_ENV === 'development') {
    mountStoreDevtool('useInfoBarStore', useInfoBarStore);
}