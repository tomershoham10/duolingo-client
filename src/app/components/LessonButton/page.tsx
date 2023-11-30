'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faLock, faStar, faCheck } from '@fortawesome/free-solid-svg-icons';

import CircleGenerator from './CircleGenerator/page';
library.add(faLock, faStar, faCheck);

export enum Status {
  DONE = 'done',
  PROGRESS = 'progress',
  LOCKED = 'locked',
}

interface LessonButtonProps {
  status: Status;
  numberOfTotalLessons?: number;
  numberOfLessonsMade?: number;
  onClick?: () => void;
  buttonRef?: React.RefObject<HTMLButtonElement>;
}

const LessonButton: React.FC<LessonButtonProps> = ({
  status,
  numberOfTotalLessons,
  numberOfLessonsMade,
  onClick,
  buttonRef,
}) => {
  return (
    <div className='relative z-10 h-[98px] w-[102px]'>
      {status === Status.PROGRESS &&
      numberOfTotalLessons !== undefined &&
      numberOfLessonsMade !== undefined ? (
        <>
          <CircleGenerator
            numberOfTotalLessons={numberOfTotalLessons}
            numberOfLessonsMade={numberOfLessonsMade}
          />
        </>
      ) : null}

      {status === Status.LOCKED && (
        <button
          disabled
          className='lesson-button absolute left-0 top-0 ml-[18px] mt-[19px] h-[57px] w-[70px] cursor-pointer items-center justify-center rounded-[50%] bg-duoGray-default text-2xl text-duoGray-dark active:translate-y-[8px] active:shadow-none'
        >
          <FontAwesomeIcon icon={faLock} className='text-md' />
        </button>
      )}
      {status === Status.PROGRESS && (
        <button
          ref={buttonRef}
          onClick={() => {
            if (onClick) {
              onClick();
            }
          }}
          className='lesson-button absolute left-0 top-0 ml-[16px] mt-[17px] h-[57px] w-[70px] cursor-pointer items-center justify-center rounded-[50%] bg-duoGreen-default text-3xl text-white active:translate-y-[8px] active:shadow-none'
        >
          <FontAwesomeIcon icon={faStar} className='text-md' />
        </button>
      )}

      {status === Status.DONE && (
        <button className='lesson-button active:translate-y-[8px]text-white absolute left-0 top-0 ml-[16px] mt-[17px] h-[57px] w-[70px] cursor-pointer items-center justify-center rounded-[50%] bg-duoGreen-default text-3xl text-white active:shadow-none'>
          <FontAwesomeIcon icon={faCheck} className='text-md' />
        </button>
      )}
    </div>
  );
};

export default LessonButton;
