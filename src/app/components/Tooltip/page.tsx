'use client';
import { useState, useEffect, useRef } from 'react';
import useStore from '@/app/store/useStore';
import { PopupsTypes, usePopupStore } from '@/app/store/stores/usePopupStore';

export enum TooltipColors {
  GREEN = 'green',
  RED = 'red',
  WHITE = 'white',
}

interface tooltipProps {
  placeholder?: string | number;
  isFloating: boolean;
  edittable?: boolean;
  color: TooltipColors;
  onDelete?: () => void;
}

const Tooltip: React.FC<tooltipProps> = (props) => {
  const placeholder = props.placeholder;
  const isFloating = props.isFloating;
  const propsColor = props.color;
  const edittable = props.edittable;

  const onDelete = props.onDelete;
  const selectedPopup = useStore(usePopupStore, (state) => state.selectedPopup);

  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const [isInEditMode, setIsInEditMode] = useState<boolean>(false);
  const [isPopEffect, setIsPopEffect] = useState<boolean>(false);

  const [backgroundColor, setBackgroundColor] = useState<string>();
  const [borderColor, setBorderColor] = useState<string>();
  const [textColor, setTextColor] = useState<string>();

  //   let backgroundColor: string = '';
  //   let borderColor: string = '';
  //   let textColor: string = '';
  useEffect(() => {
    switch (propsColor) {
      case TooltipColors.GREEN:
        setBackgroundColor(
          isInEditMode ? 'bg-duoRed-light' : 'bg-duoGreen-default'
        );
        setBorderColor(isInEditMode ? 'border-duoRed-darker' : 'border-white');
        setTextColor(isInEditMode ? 'text-duoRed-default' : 'text-white');
        break;

      case TooltipColors.WHITE:
        setBackgroundColor(isInEditMode ? 'bg-duoRed-light' : 'bg-white');
        setBorderColor(
          isInEditMode ? 'border-duoRed-darker' : 'border-duoGray-light'
        );
        setTextColor(
          isInEditMode ? 'text-duoRed-default' : 'text-duoGray-darkText'
        );
        break;
    }
  }, [isInEditMode, propsColor]);
  useEffect(() => {
    console.log('tooltip', selectedPopup);
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

  const handleClickOutside = (event: MouseEvent) => {
    if (
      tooltipRef.current &&
      !tooltipRef.current.contains(event.target as Node)
    ) {
      setIsInEditMode(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDeleteKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Delete' && onDelete) {
      console.log('Delete key pressed!');
      onDelete();
      setIsInEditMode(false);
    }
  };

  return (
    <>
      {selectedPopup !== PopupsTypes.STARTLESSON ? (
        <div
          id='tooltip-main-div'
          onClick={() => (edittable ? setIsInEditMode(!isInEditMode) : null)}
          onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) =>
            isInEditMode ? handleDeleteKeyPress(e) : null
          }
          tabIndex={0}
          ref={tooltipRef}
          className={`absolute left-1/2 ${
            isFloating && !isInEditMode ? 'tooltip' : ''
          }`}
        >
          <div className='relative cursor-pointer'>
            <section className='inline-flex'>
              <div
                className={`absolute bottom-full left-1/2 -translate-x-1/2 translate-y-[35%] transform rounded-xl
              border-2 ${borderColor} ${backgroundColor} px-3 py-2 text-center text-base font-extrabold uppercase tracking-wide
               ${textColor}`}
              >
                <div>{placeholder ? placeholder : 'START'}</div>
              </div>
              <div
                className={`absolute left-1/2 top-full h-4 w-4 origin-center -translate-x-1/2 -translate-y-[120%] rotate-45 transform rounded-sm border-b-2 
              border-r-2 ${borderColor} ${backgroundColor} text-transparent`}
              >
                <div className='origin-center'></div>
              </div>
            </section>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Tooltip;
