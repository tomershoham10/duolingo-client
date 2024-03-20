import { TableHead, TableRow } from "@/components/Table/page";

export enum editLessonAction {
    SET_FSAS = 'setFSAs',
    SET_SELECTED_FSA = 'setSelctedFSA',
    SET_TABLE_DATA = 'setTableData',
    ADD_TABLE_ROW = 'addTableRow',
}

type Action =
    | { type: editLessonAction.SET_FSAS, payload: FSAType[] }
    | { type: editLessonAction.SET_SELECTED_FSA, payload: FSAType }
    | { type: editLessonAction.SET_TABLE_DATA, payload: TableRow[] }
    | { type: editLessonAction.ADD_TABLE_ROW, payload: TableRow }

export interface editLessonType {
    fsasList: FSAType[],
    selectedFSA: FSAType | undefined,
    tableHeaders: TableHead[],
    tableData: TableRow[],
}

export const editLessonReducer = (
    state: editLessonType,
    action: Action
): editLessonType => {
    switch (action.type) {
        case editLessonAction.SET_FSAS:
            return { ...state, fsasList: action.payload };
        case editLessonAction.SET_SELECTED_FSA:
            return { ...state, selectedFSA: action.payload };
        case editLessonAction.SET_TABLE_DATA:
            return { ...state, tableData: action.payload };
        case editLessonAction.ADD_TABLE_ROW:
            return { ...state, tableData: [...state.tableData, action.payload] };

        default:
            return state;
    }
};
