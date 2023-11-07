"use client"
import { create } from 'zustand';
import { mountStoreDevtool } from 'simple-zustand-devtools';

//*********************************************************************//
// to import a store value :
// // const fieldToEdit = useStore(useEditSyllabusStore, (state) => state.fieldToEdit);

// to import a store function :
// // const updateFieldToEdit = useEditSyllabusStore.getState().updateFieldToEdit;
//*********************************************************************//


export enum fieldToEditType {
    UNIT = "unit",
    LEVEL = "level",
    LESSON = "lesson",
    EXERCISE = "exercise",
}

type EditSyllabusState = {
    fieldToEdit: fieldToEditType | undefined;
    fieldId: string | undefined;
}
type Action = {
    updateFieldToEdit: (fieldToEdit: EditSyllabusState['fieldToEdit']) => void;
    updateFieldId: (fieldId: EditSyllabusState['fieldId']) => void;
}


export const useEditSyllabusStore = create<EditSyllabusState & Action>(
    (set) => ({
        fieldToEdit: undefined,
        fieldId: undefined,
        updateFieldToEdit: (fieldToEdit) => set(() => ({ fieldToEdit: fieldToEdit })),
        updateFieldId: (fieldId) => set(() => ({ fieldId: fieldId })),
    })
)

if (process.env.NODE_ENV === 'development') {
    mountStoreDevtool('EditSyllabusStore', useEditSyllabusStore);
}