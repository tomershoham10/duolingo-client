import { ExercisesTypes } from '@/app/API/classes-service/exercises/functions';
import CreateFsa from './_CreateFsa/page';
import CreateSpotrecc from './_CreateSpotrecc/page';

const NewExercise = ({ params }: { params: { exercise: ExercisesTypes } }) => {
  console.log('params.exercise', params.exercise);

  const components = {
    [ExercisesTypes.FSA]: <CreateFsa />,

    [ExercisesTypes.SPOTRECC]: <CreateSpotrecc />,
  };

  return (
    <section className='flex h-full w-full flex-col overflow-x-hidden px-10 justify-start'>
      <section className='flex items-center gap-3 text-4xl font-extrabold mt-6 uppercase'>
        <p> create</p>
        <p className='text-duoGrayDark-lighter'> {params.exercise}</p>
      </section>

      <section className='h-full'>{components[params.exercise]}</section>
    </section>
  );
};
export default NewExercise;
