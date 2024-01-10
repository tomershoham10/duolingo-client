'use client';
import Pagination, {
  PaginationItems,
} from '@/components/Navigation/Pagination/page';
import AcintDataSection from './_AcintDataSection/page';
import ExerciseDataSection from './_ExerciseDataSection/page';

const NewExercise: React.FC = () => {
  const pageContent: PaginationItems[] = [
    {
      label: 'records',
      component: <AcintDataSection />,
      onNext: () => console.log('Next for records'),
    },
    {
      label: 'exercise data',
      component: <ExerciseDataSection record={'record'}  />,
      onNext: (a) => console.log(a),
    },
    {
      label: 'preview',
      component: <AcintDataSection />,
      onNext: () => console.log('Next for preview'),
    },
  ];
  return (
    <div className='relative mx-4  h-full w-full  flex-col overflow-auto'>
      <Pagination
        header={'create new exercise'}
        paginationItems={pageContent}
      />
    </div>
  );
};
export default NewExercise;
