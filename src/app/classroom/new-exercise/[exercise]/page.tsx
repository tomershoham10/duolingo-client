'use client';
import { lazy, useCallback, useEffect } from 'react';
import pRetry from 'p-retry';
import { useStore } from 'zustand';
import Pagination from '@/components/Navigation/Pagination/page';
import { AlertSizes, useAlertStore } from '@/app/store/stores/useAlertStore';
import { useCreateExerciseStore } from '@/app/store/stores/useCreateExerciseStore';
import { createExercise } from '@/app/API/classes-service/exercises/functions';

const AcintDataSection = lazy(() => import('./_fsaPages/_AcintData/page'));
const ExerciseDataSection = lazy(
  () => import('./_fsaPages/_ExerciseData/page')
);
const FilesDataSection = lazy(
  () => import('./_spotreccPages/_FilesDataSection/page')
);
const SpotreccDataSection = lazy(
  () => import('./_spotreccPages/_SpotreccDataSection/page')
);

// import { useInfoBarStore } from '@/app/store/stores/useInfoBarStore';

export enum ExercisesTypes {
  FSA = 'fsa',
  SPOTRECC = 'spotrecc',
}

const NewExercise = ({ params }: { params: { exercise: ExercisesTypes } }) => {
  console.log('params.exercise', params.exercise);
  const addAlert = useAlertStore.getState().addAlert;

  const updateExerciseType =
    useCreateExerciseStore.getState().updateExerciseType;

  const exerciseToSubmit = {
    // recordName: useStore(useCreateExerciseStore, (state) => state.recordId),
    type: useStore(useCreateExerciseStore, (state) => state.type),
    fileName: useStore(useCreateExerciseStore, (state) => state.fileName),
    recordLength: useStore(
      useCreateExerciseStore,
      (state) => state.recordLength
    ),
    sonolistFiles: useStore(
      useCreateExerciseStore,
      (state) => state.sonolistFiles
    ),
    answersList: useStore(useCreateExerciseStore, (state) => state.answersList),
    description: useStore(useCreateExerciseStore, (state) => state.description),
    relevant: useStore(useCreateExerciseStore, (state) => state.relevant),
    timeBuffers: useStore(useCreateExerciseStore, (state) => state.timeBuffers),
    resetStore: useCreateExerciseStore.getState().resetStore,
  };

  const components = {
    [ExercisesTypes.FSA]: {
      records: AcintDataSection, // Import your components
      exercise: ExerciseDataSection,
    },
    [ExercisesTypes.SPOTRECC]: {
      files: FilesDataSection,
      exercise: SpotreccDataSection,
    },
  };

  const onNextFuncs = {
    records: () => {
      console.log(
        'exerciseToSubmit - acint section',
        exerciseToSubmit.fileName,
        exerciseToSubmit.recordLength,
        exerciseToSubmit.sonolistFiles,
        exerciseToSubmit.answersList
      );
      return (
        // !!exerciseToSubmit.recordId &&
        !!exerciseToSubmit.fileName &&
        !!exerciseToSubmit.recordLength &&
        !!exerciseToSubmit.sonolistFiles &&
        !!exerciseToSubmit.answersList
      );
    },
    exercise: () => {
      //   console.log(
      //     exerciseToSubmit.description,
      //     exerciseToSubmit.relevant,
      //     exerciseToSubmit.timeBuffers
      //   );
      return (
        !!exerciseToSubmit.description &&
        !!exerciseToSubmit.relevant &&
        !!exerciseToSubmit.timeBuffers
      );
    },
  };

  const submitExercise = async () => {
    try {
      console.log('submit', exerciseToSubmit);
      //   if (exerciseToSubmit.recordName && exerciseToSubmit.description) {
      const res = await pRetry(
        () =>
          exerciseToSubmit.fileName && exerciseToSubmit.description
            ? createExercise({
                relevant: exerciseToSubmit.relevant,
                answersList: exerciseToSubmit.answersList,
                timeBuffers: exerciseToSubmit.timeBuffers,
                description: exerciseToSubmit.description,
                fileName: exerciseToSubmit.fileName,
              })
            : null,
        {
          retries: 5,
        }
      );

      // const res = await createExercise({
      //   relevant: exerciseToSubmit.relevant,
      //   answersList: exerciseToSubmit.answersList,
      //   //   acceptableAnswers: exerciseToSubmit.acceptableAnswers,
      //   timeBuffers: exerciseToSubmit.timeBuffers,
      //   description: exerciseToSubmit.description,
      //   recordName: exerciseToSubmit.recordName,
      // });
      if (res === 'created successfully') {
        location.reload();
      } else {
        addAlert('propblem while creating the exercise', AlertSizes.small);
      }
      return;
      //   }
    } catch (err) {
      console.error(err);
    }
  };

  const updateType = useCallback(() => {
    updateExerciseType(params.exercise);
  }, [params.exercise, updateExerciseType]);

  useEffect(() => {
    updateType();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.exercise]);

  console.log('exerciseToSubmit.type', exerciseToSubmit.type);

  return (
    <div className='h-full w-full overflow-x-hidden px-10 2xl:px-16 3xl:pt-4'>
      <Pagination
        header={'create'}
        subHeader={params.exercise ? params.exercise.toString() : undefined}
        components={components[params.exercise]}
        onNext={onNextFuncs}
        onSubmit={submitExercise}
      />
    </div>
  );
};
export default NewExercise;
