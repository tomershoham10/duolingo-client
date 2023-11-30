'use client';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useEffect } from 'react';

interface SortableItemProps {
  id: string;
  name: string;
  isGrabbed: boolean;
  isDisabled: boolean;
}

const SortableItem: React.FC<SortableItemProps> = ({
  id,
  name,
  isGrabbed,
  isDisabled,
}) => {
  useEffect(() => {
    console.log('isGrabbed', isGrabbed);
  }, [isGrabbed]);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id, disabled: isDisabled });

  const style = { transform: CSS.Transform.toString(transform), transition };
  return (
    <div className='flex h-[5rem] w-[75%] flex-none items-center justify-center'>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`border-border-duoGray-regular w-[80%] flex-none rounded-xl border-2 
        border-b-4 py-4 text-lg font-bold
        ${
          isDisabled
            ? ' cursor-default'
            : 'cursor-pointer active:translate-y-[1px] active:border-b-2'
        } ${isGrabbed ? 'z-50 bg-white opacity-100' : ''}`}
      >
        <span
          className='relative flex items-center justify-center 
                text-ellipsis text-center'
        >
          {name}
        </span>
      </div>
    </div>
  );
};

export default SortableItem;
