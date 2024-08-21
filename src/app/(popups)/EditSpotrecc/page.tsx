'use client';

import { useCallback, useEffect, useState } from 'react';
import Input, { InputTypes } from '@/components/Input/page';
import Button, { ButtonColors } from '@/components/Button/page';
import { PopupsTypes } from '@/app/store/stores/usePopupStore';
import PopupHeader, { PopupSizes } from '../PopupHeader/page';
import Textbox, { FontSizes } from '@/components/Textbox/page';
import { SpotreccSubExercise } from '@/app/store/stores/(createExercises)/useCreateSpotreccStore';

export interface EditSpotreccProps {
  subExercise: SpotreccSubExercise;
  onSave: (updatedExercise: SpotreccSubExercise) => void;
}

const EditSpotrecc: React.FC<EditSpotreccProps> = (props) => {
  const { subExercise, onSave } = props;
  console.log('EditSpotrecc popup', subExercise);

  const [description, setDescription] = useState<string>('');
  const [time, setTime] = useState<number>(0);

  useEffect(() => {
    setDescription(subExercise.description || '');
    setTime(subExercise.time);
  }, [subExercise]);

  const handleDescriptionChange = useCallback((text: string) => {
    setDescription(text);
  }, []);

  const handleTimeChange = useCallback((text: string) => {
    setTime(Number(text));
  }, []);

  return (
    <PopupHeader
      popupType={PopupsTypes.EDIT_SPOTRECC}
      size={PopupSizes.MEDIUM}
      header={`Edit sub-exercise - ${subExercise.fileName}`}
    >
      <form
        className='mt-12 grid w-full grid-cols-4 grid-rows-3 gap-y-4 px-4 py-4 3xl:gap-y-12'
        action={() =>
          onSave({
            fileName: subExercise.fileName,
            description: description.length === 0 ? null : description,
            time: time,
          })
        }
      >
        <p className='col-span-1 flex-none text-lg font-bold text-duoGray-darkest dark:text-duoGrayDark-lightest'>
          Description
        </p>

        <div className='col-span-3 mx-4 flex w-full flex-none flex-col items-center justify-center'>
          <section className='w-full'>
            <Textbox
              isEditMode={false}
              fontSizeProps={FontSizes.MEDIUM}
              placeHolder={'Add desription...'}
              value={description}
              onChange={handleDescriptionChange}
            />
          </section>
        </div>

        <p className='col-span-1 flex-none text-lg font-bold text-duoGray-darkest dark:text-duoGrayDark-lightest'>
          Exercise time
        </p>
        <div className='col-span-3 mx-4 flex w-full flex-none flex-col items-center justify-center'>
          <section className='w-full'>
            <Input
              type={InputTypes.NUMBER}
              value={time}
              onChange={handleTimeChange}
            />
          </section>
        </div>

        <div className='col-span-2 col-start-2 mt-2 flex-none justify-center'>
          <Button label={'UPDATE'} color={ButtonColors.BLUE} />
        </div>
      </form>
    </PopupHeader>
  );
};

export default EditSpotrecc;
