'use client';

import { useCallback, useEffect, useState } from 'react';
import Input, { InputTypes } from '@/components/Input/page';
import Button, { ButtonColors } from '@/components/(buttons)/Button/page';
import { PopupsTypes } from '@/app/store/stores/usePopupStore';
import PopupHeader, { PopupSizes } from '../../PopupHeader/page';
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
  const [header, setHeader] = useState<string>('Edit sub-exercise');
  const [exerciseTime, setExerciseTime] = useState<number>(0);
  const [bufferTime, setBufferTime] = useState<number>(0);

  useEffect(() => {
    setDescription(subExercise.description || '');
    setExerciseTime(subExercise.exerciseTime);
    setBufferTime(subExercise.bufferTime);
  }, [subExercise]);

  useEffect(() => {
    subExercise.fileName
      ? setHeader(`Edit sub-exercise - ${subExercise.fileName}`)
      : setHeader(`Edit sub-exercise`);
  }, [subExercise]);

  const handleDescriptionChange = useCallback((text: string) => {
    setDescription(text);
  }, []);

  const handleExerciseTimeChange = useCallback((text: string) => {
    setExerciseTime(Number(text));
  }, []);

  const handleBufferTimeChange = useCallback((text: string) => {
    setBufferTime(Number(text));
  }, []);

  return (
    <PopupHeader
      popupType={PopupsTypes.EDIT_SPOTRECC}
      size={PopupSizes.MEDIUM}
      header={header}
      onClose={() => {}}
    >
      <form
        className='mt-12 grid w-full grid-cols-4 grid-rows-3 gap-y-4 px-4 py-4 3xl:gap-y-12'
        action={() =>
          onSave({
            fileName: subExercise.fileName,
            description: description.length === 0 ? null : description,
            exerciseTime: exerciseTime,
            bufferTime: bufferTime,
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
              value={exerciseTime}
              onChange={handleExerciseTimeChange}
            />
          </section>
        </div>
        <p className='col-span-1 flex-none text-lg font-bold text-duoGray-darkest dark:text-duoGrayDark-lightest'>
          Answering time
        </p>
        <div className='col-span-3 mx-4 flex w-full flex-none flex-col items-center justify-center'>
          <section className='w-full'>
            <Input
              type={InputTypes.NUMBER}
              value={bufferTime}
              onChange={handleBufferTimeChange}
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
