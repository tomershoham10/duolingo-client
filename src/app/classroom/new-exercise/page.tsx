'use client';
import { useStore } from 'zustand';
import { useCreateExerciseStore } from '@/app/store/stores/useCreateExerciseStore';
import Pagination2 from '@/components/Navigation/Pagination/page';
import AcintDataSection from './_AcintData/page';
import ExerciseDataSection from './_ExerciseData/page';

const NewExercise: React.FC = () => {
  const exerciseToSubmit = {
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
    timeBuffers: useStore(useCreateExerciseStore, (state) => state.timeBuffers),
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
      return !!exerciseToSubmit.recordName &&
        !!exerciseToSubmit.recordLength &&
        !!exerciseToSubmit.sonolistFiles &&
        !!exerciseToSubmit.answersList
        ? true
        : false;
    },
    exercise: () => {
      return !!exerciseToSubmit.sonolistFiles && !!exerciseToSubmit.description
        ? true
        : false;
    },
  };
  return (
    <div className='h-full w-full overflow-auto'>
      <Pagination2
        header={'create new exercise'}
        components={components}
        onNext={onNextFuncs}
      />
    </div>
  );
};
export default NewExercise;
