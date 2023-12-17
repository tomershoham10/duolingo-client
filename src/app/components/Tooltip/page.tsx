'use client';
import { useState, useEffect } from 'react';
import useStore from '@/app/store/useStore';
import { PopupsTypes, usePopupStore } from '@/app/store/stores/usePopupStore';

export enum TooltipColors {
  GREEN = 'green',
  WHITE = 'white',
}

interface tooltipProps {
  placeholder?: string | number;
  isFloating: boolean;
  color: TooltipColors;
}

const Tooltip: React.FC<tooltipProps> = (props) => {
  const placeholder = props.placeholder;
  const isFloating = props.isFloating;
  const propsColor = props.color;
  const selectedPopup = useStore(usePopupStore, (state) => state.selectedPopup);

  const [isPopEffect, setIsPopEffect] = useState<boolean>(false);

  let backgroundColor: string = '';
  let borderColor: string = '';
  let textColor: string = '';
  switch (propsColor) {
    case TooltipColors.GREEN:
      backgroundColor = 'bg-duoGreen-default';
      borderColor = 'border-white';
      textColor = 'text-white';
      break;
    case TooltipColors.WHITE:
      backgroundColor = 'bg-white';
      borderColor = 'border-duoGray-light';
      textColor = 'text-duoGray-darkText';
      break;
  }

  useEffect(() => {
    console.log('tooltip', selectedPopup);
    if (selectedPopup === PopupsTypes.STARTLESSON) {
      setIsPopEffect(true);
    }
  }, [selectedPopup]);

  useEffect(() => {
    const tooltipElement = document.getElementById('tooltip-main-div');
    // console.log('isPopEffect', isPopEffect, tooltipElement);
    if (
      tooltipElement &&
      isPopEffect &&
      selectedPopup !== PopupsTypes.STARTLESSON
    ) {
      tooltipElement.classList.remove('tooltip');
      tooltipElement.classList.add('bounce-and-pop');
    }
  }, [isPopEffect, selectedPopup]);
  return (
    <>
      {selectedPopup !== PopupsTypes.STARTLESSON ? (
        <div id='tooltip-main-div' className='tooltip absolute left-1/2 z-20'>
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
