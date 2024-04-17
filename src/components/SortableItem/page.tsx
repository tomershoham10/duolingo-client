'use client';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableItem: React.FC<SortableItemProps> = (
  props: SortableItemProps
) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id, disabled: props.isDisabled });

  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div className='flex h-[5rem] w-full flex-none select-none items-center justify-start'>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`border-border-duoGray-regular w-full flex-none rounded-xl border-2 border-b-4 py-4 text-lg font-bold dark:border-duoGrayDark-light ${
          props.addedStyle
        }
        ${
          props.isDisabled
            ? ' cursor-default'
            : 'cursor-pointer active:translate-y-[1px] active:border-b-2'
        } ${
          props.isGrabbed
            ? 'z-50 bg-white opacity-100 dark:bg-duoGrayDark-dark'
            : ''
        }`}
      >
        <span className='relative flex items-center justify-center text-ellipsis px-5 text-center'>
          {props.name}
        </span>
      </div>
    </div>
  );
};

export default SortableItem;
