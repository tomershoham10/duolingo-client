'use client';
import { useStore } from 'zustand';
import { useCreateExerciseStore } from '@/app/store/stores/useCreateExerciseStore';
import Pagination2 from '@/components/Navigation/Pagination2/page';
import AcintDataSection from './_AcintData/page';
import ExerciseDataSection from './_ExerciseData/page';

const NewExercise: React.FC = () => {
  const components = {
    records: AcintDataSection, // Import your components
    exercise: ExerciseDataSection,
  };
  return (
    <div className='h-full w-full overflow-auto'>
      <Pagination2 header={'create new exercise'} components={components} />
    </div>
  );
};
export default NewExercise;
