
import Pagination, {
  PaginationItems,
} from '@/components/Navigation/Pagination/page';
import AcintDataSection from './_AcintDataSection/page';

const NewExercise: React.FC = () => {
  const pageContent: PaginationItems[] = [
    { label: 'records', component: <AcintDataSection /> },
    { label: 'exercise data', component: <AcintDataSection /> },
    { label: 'preview', component: <AcintDataSection /> },
    // { number: 2, component: <ExerciseDataSection /> },
    // { number: 3, component: <Preview /> },
  ];
  return (
    <div className='relative h-full  w-full flex-col  overflow-auto mx-4'>
      <Pagination header={'create new exercise'} paginationItems={pageContent} />
    </div>
  );
};
export default NewExercise;
