'use client';
import { Dispatch } from 'react';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import {
  SortableContext,
  horizontalListSortingStrategy,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import {
  DraggingAction,
  draggingAction,
  draggingType,
} from '@/reducers/dragReducer';
import SortableItem from '../SortableItem/page';

export enum Diractions {
  ROW = 'flex-row',
  COL = 'flex-col',
}

type ItemsType = {
  id: string;
  name: string;
};

interface DraggbleListProps {
  items: ItemsType[];
  isDisabled: boolean;
  draggingState: draggingType;
  draggingDispatch: Dispatch<DraggingAction>;
  diraction: Diractions;
//   onDragEnd: () => void;
}

const DraggbleList: React.FC<DraggbleListProps> = (props) => {
  const propsItems = props.items;
  const propsState = props.draggingState;
  const propsDispach = props.draggingDispatch;
    const flexDiraction = props.diraction;
  return (
    <div
      className={`flex h-fit w-full ${flexDiraction} items-center font-bold`}
    >
      <DndContext
        collisionDetection={closestCenter}
        onDragStart={(event: DragEndEvent) => {
          const { active } = event;
          propsDispach({
            type: draggingAction.SET_GRABBED_ITEM_ID,
            payload: active.id.toString(),
          });
        }}
        onDragMove={(e: DragEndEvent) =>
          propsDispach({
            type: draggingAction.HANDLE_DRAG_MOVE,
            payload: { active: e.active, over: e.over },
          })
        }
        onDragEnd={(e: DragEndEvent) =>
          propsDispach({
            type: draggingAction.HANDLE_DRAG_END,
            payload: { active: e.active, over: e.over },
          })
        }
      >
        <SortableContext
          items={propsItems}
          strategy={
            flexDiraction === Diractions.ROW
              ? horizontalListSortingStrategy
              : verticalListSortingStrategy
          }
        >
          <div
            className={`flex h-full w-full ${flexDiraction} items-center justify-start`}
          >
            {props.items.map((targetObject, targetObjectIndex) => (
              <div
                key={targetObjectIndex}
                className='mb-2 flex w-[8rem] flex-row'
              >
                <SortableItem
                  id={targetObject.id}
                  name={targetObject.name}
                  key={targetObjectIndex}
                  isGrabbed={
                    propsState.grabbedItemId
                      ? propsState.grabbedItemId === targetObject.id
                      : false
                  }
                  isDisabled={props.isDisabled}
                />
              </div>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default DraggbleList;
