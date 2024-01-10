import Pagination, {
  PaginationItems,
} from '@/components/Navigation/Pagination/page';
import AcintDataSection from './_AcintDataSection/page';
import ExerciseDataSection from './_ExerciseDataSection/page';

const NewExercise: React.FC = () => {
  const pageContent: PaginationItems[] = [
    { label: 'records', component: <AcintDataSection /> },
    { label: 'exercise data', component: <ExerciseDataSection /> },
    { label: 'preview', component: <AcintDataSection /> },
    // { number: 2, component: <ExerciseDataSection /> },
    // { number: 3, component: <Preview /> },
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
