'use client';

import { lazy, useCallback, useState } from 'react';
import { useStore } from 'zustand';
import { FaTrashAlt } from 'react-icons/fa';
import { MdEdit } from 'react-icons/md';
import {
  SpotreccSubExercise,
  useCreateSpotreccStore,
} from '@/app/store/stores/useCreateSpotreccStore';
import Button, { ButtonColors } from '@/components/Button/page';
import { PopupsTypes, usePopupStore } from '@/app/store/stores/usePopupStore';
import { BucketsNames } from '@/app/API/files-service/functions';
import { ExercisesTypes } from '@/app/API/classes-service/exercises/functions';

const EditSpotrecc = lazy(() => import('@/app/(popups)/EditSpotrecc/page'));
const Preview = lazy(() => import('@/app/(popups)/Preview/page'));

const Spotrecc: React.FC = () => {
  const subExercises = useStore(
    useCreateSpotreccStore,
    (state) => state.subExercises
  );
  const updateSubExercise = useCreateSpotreccStore.getState().updateSubExercise;
  const removeSubExercise = useCreateSpotreccStore.getState().removeSubExercise;

  const updateSelectedPopup = usePopupStore.getState().updateSelectedPopup;

  const [openedFileIndex, setOpenedFileIndex] = useState<number | null>(null);

  const removeFile = useCallback(
    (fileName: string) => {
      setOpenedFileIndex(null);
      removeSubExercise(fileName);
    },
    [removeSubExercise]
  );

  const subExericseUpdate = useCallback(
    (updatedExercise: SpotreccSubExercise) => {
      updateSubExercise(updatedExercise);
      updateSelectedPopup(PopupsTypes.CLOSED);
    },
    []
  );

  const createExercise = useCallback(() => {
    console.log(subExercises);
  }, [subExercises]);

  return (
    <div className='flex h-full w-full flex-col overflow-hidden'>
      {/* <div className='flex basis-[12.5%] items-center gap-3 text-4xl font-extrabold uppercase'>
        <p> create</p>
        <p className='text-duoGrayDark-lighter'> spotrecc</p>
      </div> */}
      <section className='flex max-h-[80%] basis-[85%] flex-col gap-4 overflow-auto pr-3'>
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
            {openedFileIndex !== null &&
              openedFileIndex < subExercises.length && (
                <section>
                  <button
                    onClick={() =>
                      updateSelectedPopup(PopupsTypes.EDIT_SPOTRECC)
                    }
                    className='absolute right-3 top-2'
                  >
                    <MdEdit />
                  </button>

                  <button
                    onClick={() => removeFile(exercise.fileName)}
                    className='absolute right-10 top-2'
                  >
                    <FaTrashAlt />
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

                  <button
                    className='font-bold text-duoBlueDark-default'
                    onClick={() => updateSelectedPopup(PopupsTypes.PREVIEW)}
                  >
                    preview
                  </button>
                  <EditSpotrecc
                    subExercise={exercise}
                    onSave={subExericseUpdate}
                  />
                </section>
              )}
          </div>
        ))}
      </section>
      <section className='flex basis-[15%] items-center'>
        <Button
          label='CREATE'
          color={ButtonColors.BLUE}
          onClick={createExercise}
          isLoading={false}
        />
      </section>
      {openedFileIndex !== null && openedFileIndex < subExercises.length && (
        <Preview
          bucketName={BucketsNames.RECORDS}
          exerciseType={ExercisesTypes.SPOTRECC}
          objectName={subExercises[openedFileIndex].fileName}
        />
      )}
    </div>
  );
};

export default Spotrecc;
