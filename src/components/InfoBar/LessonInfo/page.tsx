'use client';

import { ExercisesTypes } from '@/app/API/classes-service/exercises/functions';
import {
  TargetToSubmitType,
  TimeType,
} from '@/reducers/studentView/lessonReducer';
import { MutableRefObject } from 'react';
import { TbClockHour12 } from 'react-icons/tb';
import FsaInfoBar from './fsa/page';
import { DraggingAction, draggingType } from '@/reducers/dragReducer';

interface LessonInfoProps {
  infoRef: MutableRefObject<HTMLDivElement | null>;
  exerciseType: ExercisesTypes;
  timeRemaining: TimeType;
  isExerciseStarted: boolean;
  isExerciseFinished: boolean;
  targetsToSubmit: TargetToSubmitType[];

  zipPassword?: number | null; // fsa
  targetsDraggingState?: draggingType;
}

const LessonInfo: React.FC<LessonInfoProps> = (props) => {
  const {
    infoRef,
    exerciseType,
    timeRemaining,
    isExerciseStarted,
    isExerciseFinished,
    targetsToSubmit,

    zipPassword,
    targetsDraggingState,
  } = props;
  return (
    <div
      ref={infoRef}
      className='right-0 mx-auto flex flex-col items-center justify-start'
    >
      <div className='mb-3 mt-5 flex flex-col rounded-2xl border-2 text-center text-duoGray-darker dark:border-duoGrayDark-light dark:text-duoGrayDark-lightest sm:px-1 sm:py-2 xl:px-4 xl:py-6 3xl:mb-5'>
        <span className='font-extrabold sm:hidden md:text-xl lg:block xl:mb-6 xl:text-2xl 3xl:mb-12 3xl:text-4xl'>
          Unit 1 - Level 1
          <br className='3xl:text-4xl' />
          Lesson 1
        </span>
        <div className='flex flex-row items-center justify-center font-bold sm:text-xl xl:text-2xl 3xl:text-4xl'>
          <TbClockHour12
            className={
              timeRemaining.minutes === 0 && timeRemaining.seconds === 0
                ? 'mx-2 fill-duoRed-light text-duoRed-default opacity-100 sm:text-3xl xl:text-4xl'
                : isExerciseStarted && !isExerciseFinished
                  ? 'mx-2 animate-spin fill-duoPurple-lighter text-duoPurple-default opacity-100 sm:text-3xl xl:text-4xl'
                  : 'mx-2 fill-duoPurple-lighter text-duoPurple-default opacity-100 sm:text-3xl xl:text-4xl'
            }
          />
          {isExerciseFinished ? (
            <span className='font-extrabold'>00:00</span>
          ) : (
            <span className='font-extrabold'>
              {timeRemaining.minutes < 10
                ? `0${timeRemaining.minutes}`
                : timeRemaining.minutes}
              :
              {timeRemaining.seconds < 10
                ? `0${timeRemaining.seconds}`
                : timeRemaining.seconds}
            </span>
          )}
        </div>
      </div>
      {isExerciseStarted && (
        <>
          {exerciseType === ExercisesTypes.FSA ? (
            <FsaInfoBar
              zipPassword={zipPassword || null}
              targetsToSubmit={[]}
              targetsDraggingState={targetsDraggingState || null}
              targetsDraggingDispatch={function (value: DraggingAction): void {
                throw new Error('Function not implemented.');
              }}
            />
          ) : exerciseType === ExercisesTypes.SPOTRECC ? (
            <></>
          ) : null}
        </>
      )}
    </div>
  );
};

export default LessonInfo;
