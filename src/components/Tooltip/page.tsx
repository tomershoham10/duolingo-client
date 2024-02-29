'use client';
import { useState, useEffect, useRef } from 'react';
import useStore from '@/app/store/useStore';
import { usePopupStore, PopupsTypes } from '@/app/store/stores/usePopupStore';
import useClickOutside from '@/app/utils/hooks/useClickOutside';

export enum TooltipColors {
  GREEN = 'green',
  RED = 'red',
  WHITE = 'white',
}

const Tooltip: React.FC<tooltipProps> = (props) => {
  const placeholder = props.placeholder;
  const isInEditMode = props.editMode;
  const isFloating = isInEditMode ? false : props.isFloating;
  const propsColor = props.color;
  const deletable = props.deletable;
  const newVal = props.value;

  const onDelete = props.onDelete;
  const onEdit = props.onEdit;
  const onSave = props.onSave;
  const selectedPopup = useStore(usePopupStore, (state) => state.selectedPopup);

  const tooltipRef = useClickOutside(() => setIsInDeletingMode(false));

  const [isInDeletingMode, setIsInDeletingMode] = useState<boolean>(false);
  const [isPopEffect, setIsPopEffect] = useState<boolean>(false);

  const [backgroundColor, setBackgroundColor] = useState<string>();
  const [borderColor, setBorderColor] = useState<string>();
  const [textColor, setTextColor] = useState<string>();

  useEffect(() => {
    switch (propsColor) {
      case TooltipColors.GREEN:
        setBackgroundColor(
          isInDeletingMode ? 'bg-duoRed-light' : 'bg-duoGreen-default'
        );
        setBorderColor(
          isInDeletingMode ? 'border-duoRed-darker' : 'border-white'
        );
        setTextColor(isInDeletingMode ? 'text-duoRed-default' : 'text-white');
        break;

      case TooltipColors.WHITE:
        setBackgroundColor(
          !!isInDeletingMode
            ? 'bg-duoRed-light'
            : isInEditMode
              ? 'bg-white dark:bg-[#1C2536]'
              : 'bg-white dark:bg-duoBlueDark-darkest'
        );
        setBorderColor(
          isInDeletingMode
            ? 'border-duoRed-darker'
            : 'border-duoGray-light dark:border-duoGrayDark-light'
        );
        setTextColor(
          isInDeletingMode
            ? 'text-duoRed-default'
            : 'text-duoGray-darkText dark:text-duoGrayDark-lightest'
        );
        break;
    }
  }, [isInDeletingMode, propsColor]);

  useEffect(() => {
    // console.log('tooltip', selectedPopup);
    if (selectedPopup === PopupsTypes.STARTLESSON) {
      setIsPopEffect(true);
    }
  }, [selectedPopup]);

  useEffect(() => {
    const tooltipElement = document.getElementById('tooltip-main-div');
    if (
      tooltipElement &&
      isPopEffect &&
      selectedPopup !== PopupsTypes.STARTLESSON
    ) {
      tooltipElement.classList.remove('tooltip');
      tooltipElement.classList.add('bounce-and-pop');
    }
  }, [isPopEffect, selectedPopup]);

  const handleDeleteKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    console.log(event.key);
    if (event.key === 'Delete' && onDelete && isInDeletingMode) {
      console.log('Delete key pressed!');
      onDelete();
      setIsInDeletingMode(false);
    }
    if (event.key === 'Enter' && onSave && isInEditMode) {
      newVal ? onSave(Number(newVal)) : null;
    }
  };

  return (
    <>
      {selectedPopup !== PopupsTypes.STARTLESSON ? (
        <div
          id='tooltip-main-div'
          onClick={() =>
            deletable ? setIsInDeletingMode(!isInDeletingMode) : null
          }
          onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) =>
            isInDeletingMode || isInEditMode ? handleDeleteKeyPress(e) : null
          }
          tabIndex={0}
          ref={tooltipRef}
          className={`absolute left-1/2 ${
            isFloating && !isInDeletingMode
              ? 'tooltip cursor-pointer'
              : 'cursor-default'
          }`}
        >
          <div className='relative'>
            <section className='inline-flex'>
              <div
                className={`absolute bottom-full left-1/2 -translate-x-1/2 translate-y-[35%] transform rounded-xl
              border-2 ${borderColor} ${backgroundColor} px-3 py-2 text-center text-base font-extrabold uppercase tracking-wide
               ${textColor}`}
              >
                <div className='min-w-[1.5rem]'>
                  {isInEditMode ? (
                    <input
                      className='w-[2rem] bg-transparent text-center outline-none'
                      type='number'
                      autoFocus
                      value={typeof newVal === 'number' ? newVal : ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        onEdit ? onEdit(Number(val)) : null;
                      }}
                    />
                  ) : placeholder ? (
                    placeholder
                  ) : (
                    'START'
                  )}
                </div>
              </div>
              <div
                className={`absolute left-1/2 top-full h-4 w-4 origin-center -translate-x-1/2 -translate-y-[120%] rotate-45 transform rounded-sm border-b-2 border-r-2 ${borderColor} ${backgroundColor} text-transparent`}
              >
                {/* <div className='origin-center'></div> */}
              </div>
            </section>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Tooltip;
