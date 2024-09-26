import CreateFsaInfo from './_CreateFsaInfo';
import CreateSpotreccInfo from './_CreateSpotreccInfo';
import { useInfoBarStore } from '@/app/store/stores/useInfoBarStore';
import { ExercisesTypes } from '@/app/API/classes-service/exercises/functions';
import useResetStoreOnRouteChange from '@/app/_utils/hooks/useResetStoreOnRouteChange';

interface CreateExerciseInfoProps {
  exerciseType: ExercisesTypes;
}

const CreateExerciseInfo: React.FC<CreateExerciseInfoProps> = (props) => {
  const { exerciseType } = props;

  const resetInfoBarStore = useInfoBarStore().resetStore;

  useResetStoreOnRouteChange(resetInfoBarStore);

  const components = {
    [ExercisesTypes.FSA]: <CreateFsaInfo />,

    [ExercisesTypes.SPOTRECC]: <CreateSpotreccInfo />,
  };

  return (
    <section className='h-full w-full overflow-hidden'>
      <div className='h-full w-full overflow-auto'>
        {components[exerciseType]}
      </div>
    </section>
  );
};

export default CreateExerciseInfo;
