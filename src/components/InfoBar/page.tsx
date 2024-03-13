'use client';
import useStore from '@/app/store/useStore';
import { useUserStore } from '@/app/store/stores/useUserStore';
import { usePathname } from 'next/navigation';
import SyllabusInfo from './syllabusInfo/page';
import CreateExerciseInfo from './createExerciseInfo/page';

const InfoBar: React.FC = () => {
  const pathname = usePathname();
  const userName = useStore(useUserStore, (state) => state.userName);

  return (
    <div className='flex h-full w-full flex-col items-center justify-start border-l-2 border-duoGray-light font-extrabold tracking-wide text-duoGray-darkest dark:border-duoGrayDark-light dark:text-duoGrayDark-lightest 2xl:text-lg 3xl:text-xl'>
      {pathname.includes('syllabus') ? (
        <SyllabusInfo />
      ) : pathname.includes('new-exercise') ? (
        <CreateExerciseInfo />
      ) : (
        <ul className='flex-grow'>
          <li className='text-xl uppercase'>hello {userName}!</li>
        </ul>
      )}
    </div>
  );
};

export default InfoBar;
