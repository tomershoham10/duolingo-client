'use client';
import { useEffect, useState } from 'react';

import Input, { InputTypes } from '@/components/Input/page';
import Button, { ButtonColors } from '@/components/Button/page';
import { PopupsTypes } from '@/app/store/stores/usePopupStore';
import PopupHeader, { PopupSizes } from '../PopupHeader/page';
import Textbox, { FontSizes } from '@/components/Textbox/page';

const SpotreccData: React.FC = () => {
  return (
    <PopupHeader
      popupType={PopupsTypes.SPOTRECC_DATA}
      size={PopupSizes.MEDIUM}
      header='Edit sub-exercise'
    >
      <form
        className='mt-12 grid w-full grid-cols-4 grid-rows-3 gap-y-4 px-4 py-4 3xl:gap-y-12'
        action={() => {}}
      >
        <p className='col-span-1 flex-none text-lg font-bold text-duoGray-darkest dark:text-duoGrayDark-lightest'>
          Description
        </p>

        <div className='col-span-3 mx-4 flex flex-none flex-col items-center justify-center w-full'>
          <Textbox
            isEditMode={false}
            fontSizeProps={FontSizes.MEDIUM}
            placeHolder={'Add desription...'}
            value={'abc'}
            onChange={(text: string) => {
              console.log(text);
            }}
          />
        </div>

        <div className='col-span-2 col-start-2 mt-2 flex-none justify-center'>
          <Button label={'CREATE'} color={ButtonColors.BLUE} />
        </div>
      </form>
    </PopupHeader>
  );
};

export default SpotreccData;
