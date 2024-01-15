'use client';
import { PaginationItems } from '@/_archive/Pagination/page';
import AcintDataSection from './acint-data/page';
import ExerciseDataSection from './exercise-data/page';
import { useStore } from 'zustand';
import { useCreateExerciseStore } from '@/app/store/stores/useCreateExerciseStore';

const NewExercise: React.FC = () => {
  const recordName = useStore(useCreateExerciseStore, (state) => state.recordName);


  return (
    <div className='relative mx-4  h-full w-full  flex-col overflow-auto'>
      {/* <Pagination
        header={'create new exercise'}
        paginationItems={pageContent}
      /> */}
      try
    </div>
  );
};
export default NewExercise;
