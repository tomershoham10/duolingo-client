import { ExercisesTypes } from '@/app/API/classes-service/exercises/functions';
import CreateSpotreccInfo from './_CreateSpotreccInfo';
import CreateFsaInfo from './_CreateFsaInfo';

interface CreateExerciseInfoProps {
  exerciseType: ExercisesTypes;
}

const CreateExerciseInfo: React.FC<CreateExerciseInfoProps> = (props) => {
  const { exerciseType } = props;
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
