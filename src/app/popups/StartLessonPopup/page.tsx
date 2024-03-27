'use client';
import { LegacyRef, useEffect, useState } from 'react';

import useStore from '@/app/store/useStore';
import { PopupsTypes, usePopupStore } from '@/app/store/stores/usePopupStore';
import Button, { ButtonColors } from '@/components/Button/page';
import { useRouter } from 'next/navigation';

interface StartLessonPopup {
  numberOfLessonsMade: number | undefined;
  numberOfTotalLessons: number | undefined;
  nextLessonId: string | undefined;
  startLessonRef: LegacyRef<HTMLDivElement>;
}

const StartLessonPopup: React.FC<StartLessonPopup> = (props) => {
  const {
    numberOfLessonsMade,
    numberOfTotalLessons,
    nextLessonId,
    startLessonRef,
  } = props;
  console.log('StartLessonPopup', props);
  const router = useRouter();

  const selectedPopup = useStore(usePopupStore, (state) => state.selectedPopup);

  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    selectedPopup === PopupsTypes.STARTLESSON
      ? setIsOpen(true)
      : setIsOpen(false);
  }, [selectedPopup]);

  return (
    <div
      className={`absolute left-1/2 top-[100%] z-20 ${
        isOpen ? 'lesson-popup-open' : 'lesson-popup-closed'
      }`}
      ref={startLessonRef}
      id='start-lesson'
    >
      <div className='relative'>
        {numberOfLessonsMade && numberOfTotalLessons && nextLessonId ? (
          numberOfLessonsMade === numberOfTotalLessons ? (
            <div className='inline-flex'>
              <div className='absolute left-1/2 h-36 w-72 -translate-x-1/2 rounded-2xl bg-duoGreen-default px-4 py-3 text-center font-extrabold uppercase tracking-wider text-white'>
                <div className='absolute pl-1 pt-2 font-black'>level up!</div>
                <Button
                  label={'START'}
                  color={ButtonColors.WHITE}
                  style={'relative inset-x-0 top-16 w-[90%] mx-auto'}
                  onClick={() => router.push('/lesson')}
                />
                <div className='absolute left-1/2 top-full h-4 w-4 origin-center -translate-x-1/2 -translate-y-[945%] rotate-45 transform rounded-sm bg-duoGreen-default text-transparent'>
                  <div className='origin-center'></div>
                </div>
              </div>
            </div>
          ) : (
            <div className='inline-flex'>
              <div className='absolute left-1/2 h-36 w-72 -translate-x-1/2 rounded-2xl bg-duoGreen-default px-4 py-3 text-center font-extrabold uppercase tracking-wider text-white'>
                <div className='absolute pl-1 pt-2 font-black'>
                  {`Lesson ${numberOfLessonsMade} of 
                                    ${numberOfTotalLessons}`}
                </div>
                <Button
                  label={'START'}
                  color={ButtonColors.WHITE}
                  style={'relative inset-x-0 top-16 w-[90%] mx-auto'}
                  onClick={() => router.push('/lesson')}
                />
                <div className='absolute left-1/2 top-full h-4 w-4 origin-center -translate-x-1/2 -translate-y-[945%] rotate-45 transform rounded-sm bg-duoGreen-default text-transparent'>
                  <div className='origin-center'></div>
                </div>
              </div>
            </div>
          )
        ) : null}
      </div>
    </div>
  );
};

export default StartLessonPopup;
