'use client';
import { useState, useEffect, useRef, useReducer } from 'react';
import useStore from '@/app/store/useStore';
import { usePopupStore, PopupsTypes } from '@/app/store/stores/usePopupStore';
import useClickOutside from '@/app/_utils/hooks/useClickOutside';
import {
  TooltipType,
  tooltipAction,
  tooltipReducer,
} from '@/reducers/tooltipReducer';

export enum TooltipColors {
  GREEN = 'green',
  RED = 'red',
  WHITE = 'white',
}

const Tooltip: React.FC<tooltipProps> = (props) => {
  //   const placeholder = props.placeholder;
  //   const isInEditMode = props.editMode;
  //   const isFloating = isInEditMode ? false : props.isFloating;
  //   const propsColor = props.color;
  //   const deletable = props.deletable;
  //   const newVal = props.value;

  //   const onDelete = props.onDelete;
  //   const onEdit = props.onEdit;
  //   const onSave = props.onSave;

  const {
    className,
    placeholder,
    isFloating,
    deletable,
    editMode,
    color,
    onDelete,
    value,
    onEdit,
    onSave,
  } = props;
  const selectedPopup = useStore(usePopupStore, (state) => state.selectedPopup);

  const initialTooltipState: TooltipType = {
    isInDeletingMode: false,
    isPopEffect: false,
    backgroundColor: '',
    borderColor: '',
    textColor: '',
  };

  const [tooltipState, tooltipDispatch] = useReducer(
    tooltipReducer,
    initialTooltipState
  );

  const tooltipRef = useClickOutside(() =>
    tooltipDispatch({
      type: tooltipAction.SET_IS_IN_DELETING_MODE,
      payload: false,
    })
  );

  useEffect(() => {
    switch (color) {
      case TooltipColors.GREEN:
        tooltipDispatch({
          type: tooltipAction.SET_BACKGROUND_COLOR,
          payload: tooltipState.isInDeletingMode
            ? 'bg-duoRed-light'
            : 'bg-duoGreen-default dark:bg-duoGrayDark-darkest',
        });
        tooltipDispatch({
          type: tooltipAction.SET_BORDER_COLOR,
          payload: tooltipState.isInDeletingMode
            ? 'border-duoRed-darker'
            : 'border-white dark:border-duoGrayDark-light',
        });

        tooltipDispatch({
          type: tooltipAction.SET_TEXT_COLOR,
          payload: tooltipState.isInDeletingMode
            ? 'text-duoRed-default'
            : 'text-white dark:text-duoGreenDark-text',
        });
        break;

      case TooltipColors.WHITE:
        tooltipDispatch({
          type: tooltipAction.SET_BACKGROUND_COLOR,
          payload: !!tooltipState.isInDeletingMode
            ? 'bg-duoRed-light'
            : editMode
              ? 'bg-white dark:bg-[#1C2536]'
              : 'bg-white dark:bg-duoBlueDark-darkest',
        });
        tooltipDispatch({
          type: tooltipAction.SET_BORDER_COLOR,
          payload: tooltipState.isInDeletingMode
            ? 'border-duoRed-darker'
            : 'border-duoGray-light dark:border-duoGrayDark-light',
        });
        tooltipDispatch({
          type: tooltipAction.SET_TEXT_COLOR,
          payload: tooltipState.isInDeletingMode
            ? 'text-duoRed-default'
            : 'text-duoGray-darkText dark:text-duoGrayDark-lightest',
        });
        break;
    }
  }, [tooltipState.isInDeletingMode, color, editMode]);

  useEffect(() => {
    // console.log('tooltip', selectedPopup);
    if (selectedPopup === PopupsTypes.STARTLESSON) {
      tooltipDispatch({
        type: tooltipAction.SET_IS_POP_EFFECT,
        payload: true,
      });
    }
  }, [selectedPopup]);

  useEffect(() => {
    const tooltipElement = document.getElementById('tooltip-main-div');
    if (
      tooltipElement &&
      tooltipState.isPopEffect &&
      selectedPopup !== PopupsTypes.STARTLESSON
    ) {
      tooltipElement.classList.remove('tooltip');
      tooltipElement.classList.add('bounce-and-pop');
    }
  }, [tooltipState.isPopEffect, selectedPopup]);

  const handleDeleteKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    console.log(event.key);
    if (event.key === 'Delete' && onDelete && tooltipState.isInDeletingMode) {
      console.log('Delete key pressed!');
      onDelete();
      tooltipDispatch({
        type: tooltipAction.SET_IS_IN_DELETING_MODE,
        payload: false,
      });
    }
    if (event.key === 'Enter' && onSave && editMode) {
      value ? onSave(Number(value)) : null;
    }
  };

  return (
    <section className={className}>
      {selectedPopup !== PopupsTypes.STARTLESSON ? (
        <div
          id='tooltip-main-div'
          onClick={() =>
            deletable
              ? tooltipDispatch({
                  type: tooltipAction.TOGGLE_DELETING_MODE,
                })
              : null
          }
          onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) =>
            tooltipState.isInDeletingMode || editMode
              ? handleDeleteKeyPress(e)
              : null
          }
          tabIndex={0}
          ref={tooltipRef}
          className={`absolute left-1/2 ${
            isFloating && !tooltipState.isInDeletingMode
              ? 'tooltip cursor-pointer'
              : 'cursor-default'
          }`}
        >
          <div className='relative'>
            <section className='inline-flex'>
              <div
                className={`absolute bottom-full left-1/2 -translate-x-1/2 translate-y-[35%] transform rounded-xl
              border-2 ${tooltipState.borderColor} ${tooltipState.backgroundColor} px-3 py-2 text-center text-base font-extrabold uppercase tracking-wide
               ${tooltipState.textColor}`}
              >
                <div className='min-w-[1.5rem]'>
                  {editMode ? (
                    <input
                      className='w-[2rem] bg-transparent text-center outline-none'
                      type='number'
                      autoFocus
                      value={typeof value === 'number' ? value : ''}
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
                className={`absolute left-1/2 top-full h-4 w-4 origin-center -translate-x-1/2 -translate-y-[120%] rotate-45 transform rounded-sm border-b-2 border-r-2 ${tooltipState.borderColor} ${tooltipState.backgroundColor} text-transparent`}
              >
                {/* <div className='origin-center'></div> */}
              </div>
            </section>
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default Tooltip;
