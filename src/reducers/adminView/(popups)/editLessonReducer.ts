import { TableHead, TableRow } from "@/components/Table/page";

export enum editLessonAction {
    SET_EXERCISES = 'setExercises',
    SET_SELECTED_EXERCISES = 'setSelctedExercise',
    SET_TABLE_DATA = 'setTableData',
    ADD_TABLE_ROW = 'addTableRow',
}

type Action =
    | { type: editLessonAction.SET_EXERCISES, payload: ExerciseType[] }
    | { type: editLessonAction.SET_SELECTED_EXERCISES, payload: string }
    | { type: editLessonAction.SET_TABLE_DATA, payload: TableRow[] }
    | { type: editLessonAction.ADD_TABLE_ROW, payload: TableRow }

export interface editLessonType {
    exercisesList: ExerciseType[],
    selectedExercise: string | undefined,
    tableHeaders: TableHead[],
    tableData: TableRow[],
}

export const editLessonReducer = (
    state: editLessonType,
    action: Action
): editLessonType => {
    switch (action.type) {
        case editLessonAction.SET_EXERCISES:
            return { ...state, exercisesList: action.payload };
        case editLessonAction.SET_SELECTED_EXERCISES:
            return { ...state, selectedExercise: action.payload };
        case editLessonAction.SET_TABLE_DATA:
            return { ...state, tableData: action.payload };
        case editLessonAction.ADD_TABLE_ROW:
            return { ...state, tableData: [...state.tableData, action.payload] };

        default:
            return state;
    }
};
