'use client';
import { useRouter } from 'next/navigation';
import { useStore } from 'zustand';
import Pagination from '@/components/Navigation/Pagination/page';
import AcintDataSection from './_AcintData/page';
import ExerciseDataSection from './_ExerciseData/page';
import { AlertSizes, useAlertStore } from '@/app/store/stores/useAlertStore';
import { useCreateExerciseStore } from '@/app/store/stores/useCreateExerciseStore';
import { createFSA } from '@/app/API/classes-service/exercises/FSA/functions';

const NewExercise: React.FC = () => {
  const router = useRouter();
  const addAlert = useAlertStore.getState().addAlert;

  const exerciseToSubmit = {
    recordId: useStore(useCreateExerciseStore, (state) => state.recordId),
    recordName: useStore(useCreateExerciseStore, (state) => state.recordName),
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
    records: AcintDataSection, // Import your components
    exercise: ExerciseDataSection,
  };

  const onNextFuncs = {
    records: () => {
      console.log(
        'exerciseToSubmit - acint section',
        exerciseToSubmit.recordName,
        exerciseToSubmit.recordLength,
        exerciseToSubmit.sonolistFiles,
        exerciseToSubmit.answersList
      );
      return (
        !!exerciseToSubmit.recordId &&
        !!exerciseToSubmit.recordName &&
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
      const res = await createFSA({
        relevant: exerciseToSubmit.relevant,
        answersList: exerciseToSubmit.answersList,
        //   acceptableAnswers: exerciseToSubmit.acceptableAnswers,
        timeBuffers: exerciseToSubmit.timeBuffers,
        description: exerciseToSubmit.description,
        recordKey: exerciseToSubmit.recordId,
      });
      if (res === 'created successfully') {
        location.reload();
      } else {
        addAlert('propblem while creating the exercise', AlertSizes.small);
      }
      return;
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className='h-full w-full overflow-x-hidden px-10 2xl:px-16 3xl:pt-4'>
      <Pagination
        header={'create new exercise'}
        components={components}
        onNext={onNextFuncs}
        onSubmit={submitExercise}
      />
    </div>
  );
};
export default NewExercise;
