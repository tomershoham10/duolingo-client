'use client';

import { lazy, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import pRetry from 'p-retry';

import { useStore } from 'zustand';
import { FaTrashAlt } from 'react-icons/fa';
import { MdEdit } from 'react-icons/md';
import {
  SpotreccSubExercise,
  useCreateSpotreccStore,
} from '@/app/store/stores/(createExercises)/useCreateSpotreccStore';
import Button, { ButtonColors } from '@/components/(buttons)/Button/page';
import { PopupsTypes, usePopupStore } from '@/app/store/stores/usePopupStore';
import { BucketsNames } from '@/app/API/files-service/functions';
import {
  createExercise,
  ExercisesTypes,
} from '@/app/API/classes-service/exercises/functions';
import { AlertSizes, useAlertStore } from '@/app/store/stores/useAlertStore';

const EditSpotrecc = lazy(
  () => import('@/app/(popups)/(edit)/EditSpotrecc/page')
);
const Preview = lazy(() => import('@/app/(popups)/Preview/page'));

const CreateSpotrecc: React.FC = () => {
  const router = useRouter();
  const addAlert = useAlertStore.getState().addAlert;

  const subExercises = useStore(
    useCreateSpotreccStore,
    (state) => state.subExercises
  );
  const updateSubExercise = useCreateSpotreccStore.getState().updateSubExercise;
  const removeSubExercise = useCreateSpotreccStore.getState().removeSubExercise;
  const resetCreateSpotreccStore = useCreateSpotreccStore.getState().resetStore;

  const updateSelectedPopup = usePopupStore.getState().updateSelectedPopup;

  const [openedFileIndex, setOpenedFileIndex] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const removeFile = useCallback(
    (fileName: string) => {
      setOpenedFileIndex(null);
      removeSubExercise(fileName);
    },
    [removeSubExercise]
  );

  const subExericseUpdate = useCallback(
    (updatedExercise: SpotreccSubExercise) => {
      console.log('updatedExercise', updatedExercise);
      updateSubExercise(updatedExercise);
      updateSelectedPopup(PopupsTypes.CLOSED);
    },
    [updateSelectedPopup, updateSubExercise]
  );

  const submit = useCallback(async () => {
    try {
      console.log('submit spotrecc', subExercises);
      if (subExercises.length > 0) {
        setIsUploading(true);
        const exerciseObject = {
          type: ExercisesTypes.SPOTRECC,
          subExercises: subExercises,
        };
        console.log('submit spotrecc exerciseObject', exerciseObject);

        const response = await pRetry(() => createExercise(exerciseObject), {
          retries: 5,
        });
        if (response) {
          addAlert('Exercise added successfully', AlertSizes.small);
          resetCreateSpotreccStore();
          router.push('/classroom');
        } else {
          addAlert('Error while createing an exercise', AlertSizes.small);
        }
      } else {
        addAlert('Please select a file', AlertSizes.small);
      }
      setIsUploading(false);
    } catch (err) {
      console.error('submit error:', err);
    }
  }, [addAlert, resetCreateSpotreccStore, router, subExercises]);

  return (
    <div className='flex h-full w-full flex-col overflow-hidden'>
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
            {openedFileIndex !== null && openedFileIndex === index && (
              <section>
                <button
                  onClick={() => updateSelectedPopup(PopupsTypes.EDIT_SPOTRECC)}
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
                    Exercise time
                  </p>
                  {exercise.exerciseTime} seconds
                </span>

                <span className='flex flex-row gap-2'>
                  <p className='font-bold text-duoGrayDark-lightestOpacity'>
                    Answering time
                  </p>
                  {exercise.bufferTime} seconds
                </span>

                <button
                  className='font-bold text-duoBlueDark-default'
                  onClick={() => updateSelectedPopup(PopupsTypes.PREVIEW)}
                >
                  preview
                </button>
                <EditSpotrecc
                  subExercise={subExercises[openedFileIndex]}
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
          onClick={submit}
          isLoading={false}
        />
      </section>
      {openedFileIndex !== null && openedFileIndex < subExercises.length && (
        <>
          <Preview
            bucketName={BucketsNames.RECORDS}
            exerciseType={ExercisesTypes.SPOTRECC}
            objectName={subExercises[openedFileIndex].fileName}
          />
        </>
      )}
    </div>
  );
};

export default CreateSpotrecc;
