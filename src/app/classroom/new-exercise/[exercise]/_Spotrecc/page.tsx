'use client';

import { useState } from 'react';
import { useStore } from 'zustand';
import { useCreateSpotreccStore } from '@/app/store/stores/useCreateSpotreccStore';
import { MdEdit } from 'react-icons/md';
import Button, { ButtonColors } from '@/components/Button/page';
import { PopupsTypes, usePopupStore } from '@/app/store/stores/usePopupStore';
import SpotreccData from '@/app/(popups)/SpotreccData/page';

const Spotrecc: React.FC = () => {
  const subExercises = useStore(
    useCreateSpotreccStore,
    (state) => state.subExercises
  );

  const updateSelectedPopup = usePopupStore.getState().updateSelectedPopup;

  const [openedFileIndex, setOpenedFileIndex] = useState<number | null>(null);

  return (
    <div className='flex h-full w-full flex-col overflow-hidden'>
      <div className='flex basis-[12.5%] items-center gap-3 text-4xl font-extrabold uppercase'>
        <p> create</p>
        <p className='text-duoGrayDark-lighter'> spotrecc</p>
      </div>
      <section className='flex max-h-[80%] basis-[75%] flex-col gap-4 overflow-auto pr-3'>
        {subExercises.map((exercise, index) => (
          <div
            key={index}
            onClick={() => setOpenedFileIndex(index)}
            className={`relative w-full rounded-lg border-2 border-duoGrayDark-lighter px-3 py-2 text-xl hover:bg-duoGrayDark-dark ${
              index === openedFileIndex
                ? 'cursor-default bg-duoGrayDark-dark'
                : 'cursor-pointer'
            }`}
          >
            <p className={`font-extrabold`}>{exercise.fileName}</p>
            {index === openedFileIndex && (
              <section>
                <button
                  onClick={() => updateSelectedPopup(PopupsTypes.SPOTRECC_DATA)}
                  className='absolute right-3 top-2'
                >
                  <MdEdit />
                </button>

                <span className='flex flex-row gap-2'>
                  <p className='font-bold text-duoGrayDark-lightestOpacity'>
                    Description
                  </p>
                  {exercise.description || 'none'}
                </span>
                <span className='flex flex-row gap-2'>
                  <p className='font-bold text-duoGrayDark-lightestOpacity'>
                    Time
                  </p>
                  {exercise.time} seconds
                </span>

                <button className='font-bold text-duoBlueDark-default'>
                  preview
                </button>
              </section>
            )}
          </div>
        ))}
      </section>
      <section className='flex basis-[12.5%] items-center'>
        <Button
          label='CREATE'
          color={ButtonColors.BLUE}
          onClick={() => {}}
          isLoading={false}
        />
        <SpotreccData />
      </section>
    </div>
  );
};

export default Spotrecc;
