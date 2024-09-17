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
    syllabusSubIdsListField: string[];
    syllabusIsFieldSuspended: boolean;

    selectedMainTypeId: string | null;
    selectedSubTypeId: string | null;
    selectedModel: TargetType | null;

    selectedFile: Partial<FileType> | undefined;
}
type Action = {
    updatesyllabusFieldType: (syllabusFieldType: useInfoBarState['syllabusFieldType']) => void;
    updateSyllabusFieldId: (syllabusFieldId: useInfoBarState['syllabusFieldId']) => void;
    updateSyllabusFieldIndex: (syllabusFieldIndex: useInfoBarState['syllabusFieldIndex']) => void;
    updateSyllabusFieldFatherIndex: (syllabusFieldFatherId: useInfoBarState['syllabusFieldFatherId']) => void;
    updateSyllabusSubIdsListField: (syllabusSubIdsListField: useInfoBarState['syllabusSubIdsListField']) => void;
    updateSyllabusIsFieldSuspended: (syllabusIsFieldSuspended: useInfoBarState['syllabusIsFieldSuspended']) => void;

    updateSelectedMainTypeId: (selectedMainTypeId: useInfoBarState['selectedMainTypeId']) => void;
    updateSelectedSubTypeId: (selectedSubTypeId: useInfoBarState['selectedSubTypeId']) => void;
    updateSelectedModel: (selectedModel: useInfoBarState['selectedModel']) => void;

    updateSelectedFile: (selectedFile: useInfoBarState['selectedFile']) => void;

    resetStore: () => void;
}


export const useInfoBarStore = create<useInfoBarState & Action>(
    (set) => ({
        syllabusFieldType: undefined,
        syllabusFieldId: undefined,
        syllabusFieldIndex: 0,
        syllabusFieldFatherId: undefined,
        syllabusIsFieldSuspended: false,
        syllabusSubIdsListField: [],
        selectedMainTypeId: null,
        selectedSubTypeId: null,
        selectedModel: null,
        selectedFile: undefined,
        updatesyllabusFieldType: (syllabusFieldType) => set(() => ({ syllabusFieldType: syllabusFieldType })),
        updateSyllabusFieldId: (syllabusFieldId) => set(() => ({ syllabusFieldId: syllabusFieldId })),
        updateSyllabusFieldIndex: (syllabusFieldIndex) => set(() => ({ syllabusFieldIndex: syllabusFieldIndex })),
        updateSyllabusFieldFatherIndex: (syllabusFieldFatherId) => set(() => ({ syllabusFieldFatherId: syllabusFieldFatherId })),
        updateSyllabusSubIdsListField: (syllabusSubIdsListField) => set(() => ({ syllabusSubIdsListField: syllabusSubIdsListField })),
        updateSyllabusIsFieldSuspended: (syllabusIsFieldSuspended) => set(() => ({ syllabusIsFieldSuspended: syllabusIsFieldSuspended })),

        updateSelectedMainTypeId: (selectedMainTypeId) => set({ selectedMainTypeId: selectedMainTypeId }),
        updateSelectedSubTypeId: (selectedSubTypeId) => set({ selectedSubTypeId: selectedSubTypeId }),
        updateSelectedModel: (newSelectedModel) => set({ selectedModel: newSelectedModel }),

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