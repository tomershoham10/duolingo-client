import { Active, Over } from '@dnd-kit/core';
import {
    SortableContext,
    arrayMove,
    horizontalListSortingStrategy,
} from '@dnd-kit/sortable';

export enum draggingAction {
    REARANGE_ITEMS_LIST = 'rearangeItemsList',
}

type Action =
    | { type: draggingAction.REARANGE_ITEMS_LIST; payload: { itemsList: any[], active: Active, over: Over | null } }

export interface draggingType {
    itemsList: any[] | undefined,
}

export const draggingReducer = (
    state: draggingType,
    action: Action
): draggingType => {
    switch (action.type) {
        case draggingAction.REARANGE_ITEMS_LIST:
            return { ...state, itemsList: rearangeList(action.payload.itemsList, action.payload.active, action.payload.over) };
        default:
            return state;
    }
};

function rearangeList(itemsList: any[], active: Active, over: Over | null): any[] | undefined {
    if (over && active.id !== over.id) {

        const activeIndex = itemsList
            .map((item) => item._id)
            .indexOf(active.id as string);

        const overIndex = itemsList
            .map((item) => item._id)
            .indexOf(over.id as string);

        return arrayMove(itemsList, activeIndex, overIndex);

    } else {
        return itemsList;
    }
}
