import { ExercisesTypes } from '@/app/API/classes-service/exercises/functions';
import CreateFsa from './_CreateFsa/page';
import CreateSpotrecc from './_CreateSpotrecc/page';
import TargetsDropdowns from '@/components/TargetsDropdowns/index';

const NewExercise = ({ params }: { params: { exercise: ExercisesTypes } }) => {
  console.log('params.exercise', params.exercise);

  const components = {
    [ExercisesTypes.FSA]: <CreateFsa />,

    [ExercisesTypes.SPOTRECC]: <CreateSpotrecc />,
  };

  return (
    <section className='flex h-full w-full flex-col overflow-x-hidden px-10 2xl:px-16 3xl:pt-4'>
      <section className='flex h-[5.5rem] items-center gap-3 text-4xl font-extrabold uppercase'>
        <p> create</p>
        <p className='text-duoGrayDark-lighter'> {params.exercise}</p>
      </section>

      <section className='h-full'>{components[params.exercise]}</section>
    </section>
  );
};
export default NewExercise;
