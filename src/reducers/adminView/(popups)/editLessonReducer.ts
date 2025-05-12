import { TableHead, TableRow } from "@/components/Table/page";

export enum EditLessonAction {
    SET_EXERCISES = 'setExercises',
    SET_SELECTED_EXERCISES = 'setSelctedExercise',
    SET_TABLE_DATA = 'setTableData',
    ADD_TABLE_ROW = 'addTableRow',
    SET_LESSON = 'setLesson',
}

type Action =
    | { type: EditLessonAction.SET_EXERCISES, payload: ExerciseType[] }
    | { type: EditLessonAction.SET_SELECTED_EXERCISES, payload: string }
    | { type: EditLessonAction.SET_TABLE_DATA, payload: TableRow[] }
    | { type: EditLessonAction.ADD_TABLE_ROW, payload: TableRow }
    | { type: EditLessonAction.SET_LESSON, payload: LessonType }

export interface EditLessonType {
    exercisesList: ExerciseType[],
    selectedExercise: string | undefined,
    tableHeaders: TableHead[],
    tableData: TableRow[],
    lesson: LessonType | undefined,
}

export const editLessonReducer = (
    state: EditLessonType,
    action: Action
): EditLessonType => {
    switch (action.type) {
        case EditLessonAction.SET_EXERCISES:
            return { ...state, exercisesList: action.payload };
        case EditLessonAction.SET_SELECTED_EXERCISES:
            return { ...state, selectedExercise: action.payload };
        case EditLessonAction.SET_TABLE_DATA:
            return { ...state, tableData: action.payload };
        case EditLessonAction.ADD_TABLE_ROW:
            return { ...state, tableData: [...state.tableData, action.payload] };
        case EditLessonAction.SET_LESSON:
            return { ...state, lesson: action.payload };
        default:
            return state;
    }
};
