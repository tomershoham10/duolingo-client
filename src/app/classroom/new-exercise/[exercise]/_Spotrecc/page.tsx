'use client';

import { useCreateSpotreccStore } from '@/app/store/stores/useCreateSpotreccStore';
import { useStore } from 'zustand';

const Spotrecc: React.FC = () => {
  const subExercises = useStore(
    useCreateSpotreccStore,
    (state) => state.subExercises
  );

  return (
    <div className=''>
      <div className='my-5 flex gap-3 text-4xl font-extrabold uppercase'>
        <p> create</p>
        <p className='text-duoGrayDark-lighter'> spotrecc</p>
      </div>
      <section className='flex flex-col gap-4'>
        {subExercises.map((exercise, index) => (
          <div
            key={index}
            className='w-full cursor-pointer rounded-lg border-2 border-duoGrayDark-lighter px-3 py-2 text-xl hover:bg-duoBlueDark-darker'
          >
            {index} {exercise.fileName}
          </div>
        ))}
      </section>
    </div>
  );
};

export default Spotrecc;
