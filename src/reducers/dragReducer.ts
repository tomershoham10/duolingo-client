import { Active, Over } from '@dnd-kit/core';
import {
    arrayMove,
} from '@dnd-kit/sortable';

export enum draggingAction {
    SET_ITEMS_LIST = 'setItemsList',
    ADD_ITEM = 'addItem',

    SET_GRABBED_ITEM_ID = 'setGrabbedItemId',

    HANDLE_DRAG_MOVE = 'handleDragMove',
    HANDLE_DRAG_END = 'handleDragEnd',
}

export type DraggingAction =
    | { type: draggingAction.SET_ITEMS_LIST; payload: ItemsList[] }
    | { type: draggingAction.ADD_ITEM; payload: ItemsList }
    | { type: draggingAction.SET_GRABBED_ITEM_ID; payload: string }
    | { type: draggingAction.HANDLE_DRAG_MOVE; payload: { active: Active, over: Over | null } }
    | { type: draggingAction.HANDLE_DRAG_END; payload: { active: Active, over: Over | null } }

interface ItemsList {
    id: string,
    name: string,
}

export interface draggingType {
    grabbedItemId: string,

    itemsList: ItemsList[],
}

export const draggingReducer = (
    state: draggingType,
    action: DraggingAction
): draggingType => {
    switch (action.type) {
        case draggingAction.SET_ITEMS_LIST:
            return { ...state, itemsList: action.payload };
        case draggingAction.ADD_ITEM:
            return { ...state, itemsList: [...state.itemsList, action.payload] };
        case draggingAction.SET_GRABBED_ITEM_ID:
            return { ...state, grabbedItemId: action.payload };

        case draggingAction.HANDLE_DRAG_MOVE:
            return { ...state, itemsList: handleDragMove(state, action.payload.active, action.payload.over) };
        case draggingAction.HANDLE_DRAG_END:
            return { ...state, itemsList: handleDragEnd(state, action.payload.active, action.payload.over), grabbedItemId: 'released' };
        default:
            return state;
    }
};

const handleDragMove = (state: draggingType, active: Active, over: Over | null): any[] => {
    if (over && active.id !== over.id) {
        const ids = state.itemsList.map((item) => item.id);
        const activeIndex = ids.indexOf(active.id as string);
        const overIndex = ids.indexOf(over.id as string);
        return arrayMove(state.itemsList, activeIndex, overIndex);

    } else {
        return state.itemsList;
    }
}

const handleDragEnd = (state: draggingType, active: Active, over: Over | null): any[] => {
    if (active && over && active.id !== over.id) {
        const ids = state.itemsList.map((item) => item.id);
        const activeIndex = ids.indexOf(active.id as string);
        const overIndex = ids.indexOf(over.id as string);
        return arrayMove(state.itemsList, activeIndex, overIndex);
    } else {
        return state.itemsList;
    }
};
