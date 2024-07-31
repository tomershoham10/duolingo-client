'use client';
import { lazy } from 'react';
import useStore from '@/app/store/useStore';
import { useUserStore } from '@/app/store/stores/useUserStore';
import { usePathname } from 'next/navigation';
import CreateExerciseInfo from './createExerciseInfo/page';
import { ExercisesTypes } from '@/app/API/classes-service/exercises/functions';
const SyllabusInfo = lazy(() => import('./syllabusInfo/page'));
// const CreateExerciseInfo = lazy(() => import('./CreateExerciseInfo/page'));
const RecordsInfo = lazy(() => import('./RecordsInfo/page'));

const InfoBar: React.FC = () => {
  const pathname = usePathname();
  const userName = useStore(useUserStore, (state) => state.userName);

  return (
    <div className='flex h-full w-full flex-col items-center justify-start border-l-2 border-duoGray-light font-extrabold tracking-wide text-duoGray-darkest dark:border-duoGrayDark-light dark:text-duoGrayDark-lightest 2xl:text-lg 3xl:text-xl'>
      {pathname.includes('syllabus') ? (
        <SyllabusInfo />
      ) : pathname.includes('new-exercise') ? (
        <CreateExerciseInfo
          exerciseType={
            pathname.split('/').filter(Boolean).pop() as ExercisesTypes
          }
        />
      ) : pathname.includes('records') ? (
        <RecordsInfo />
      ) : (
        <ul className='flex-grow'>
          <li className='text-xl uppercase'>hello {userName}!</li>
        </ul>
      )}
    </div>
  );
};

export default InfoBar;
