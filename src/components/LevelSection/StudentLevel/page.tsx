'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faStar, faPlay, faLock } from '@fortawesome/free-solid-svg-icons';
import { useUserStore } from '@/app/store/stores/useUserStore';
import { useStore } from 'zustand';
import { useRouter } from 'next/navigation';
import LessonButton, { Status } from '../../LessonButton/page';
import { possitionByModularAddition } from '@/app/_utils/functions/possitionByModularAddition';
import Tooltip, { TooltipColors } from '../../Tooltip/page';
import { PopupsTypes, usePopupStore } from '@/app/store/stores/usePopupStore';
import StartLessonPopup from '@/app/(popups)/StartLessonPopup/page';
import { LevelType, ExerciseType } from '@/app/types.d';

library.add(faBook, faStar, faPlay, faLock);

interface StudentLevelSectionProps {
  level: LevelType;
  levelIndex: number;
  exercises?: ExerciseType[];
  isLocked?: boolean;
  isFinished?: boolean;
  isCurrentLevel?: boolean;
  completedExercises?: string[]; // Array of completed exercise IDs
  currentExerciseId?: string; // ID of the current exercise student should do
}

const StudentLevelSection: React.FC<StudentLevelSectionProps> = ({
  level,
  levelIndex,
  exercises = [],
  isLocked = false,
  isFinished = false,
  isCurrentLevel = false,
  completedExercises = [],
  currentExerciseId,
}) => {
  const nextLessonId = useStore(useUserStore, (state) => state.nextLessonId);
  const updateSelectedPopup = usePopupStore.getState().updateSelectedPopup;
  const router = useRouter();

  const [isStartLevelPopupVisible, setIsStartLevelPopupVisible] = useState(false);
  const [numOfExercisesMade, setNumOfExercisesMade] = useState(0);
  const [lockedExercises, setLockedExercises] = useState<string[]>([]);

  const startLevelRef = useRef<HTMLDivElement>(null);
  const levelButtonRef = useRef<HTMLButtonElement>(null);

  // Calculate progress based on exercises
  useEffect(() => {
    if (exercises.length > 0) {
      setNumOfExercisesMade(completedExercises.length);
    }
  }, [exercises, completedExercises]);

  // Determine which exercises are accessible
  const getExerciseStatus = (exerciseId: string, exerciseIndex: number) => {
    if (completedExercises.includes(exerciseId)) {
      return 'completed';
    }
    
    // First exercise is always accessible if level is current
    if (exerciseIndex === 0 && isCurrentLevel) {
      return 'current';
    }
    
    // Exercise is accessible if previous exercise is completed
    if (exerciseIndex > 0 && completedExercises.includes(exercises[exerciseIndex - 1]._id)) {
      return 'current';
    }
    
    // If this is the current exercise ID from user progress
    if (currentExerciseId === exerciseId) {
      return 'current';
    }
    
    return 'locked';
  };

  const handleExerciseClick = (exerciseId: string, exerciseIndex: number) => {
    const status = getExerciseStatus(exerciseId, exerciseIndex);
    
    if (status === 'current') {
      router.push(`/exercise/${exerciseId}`);
    }
  };

  const handleOutsideClick = useCallback(
    (event: MouseEvent) => {
      if (
        startLevelRef.current &&
        !startLevelRef.current.contains(event.target as Node) &&
        levelButtonRef.current &&
        !levelButtonRef.current.contains(event.target as Node)
      ) {
        setIsStartLevelPopupVisible(false);
        updateSelectedPopup(PopupsTypes.CLOSED);
      }
    },
    [levelButtonRef, startLevelRef, updateSelectedPopup]
  );

  useEffect(() => {
    if (isStartLevelPopupVisible) {
      document.addEventListener('mousedown', handleOutsideClick);
      updateSelectedPopup(PopupsTypes.START_LESSON);
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
      updateSelectedPopup(PopupsTypes.CLOSED);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [handleOutsideClick, isStartLevelPopupVisible, updateSelectedPopup]);

  const handleStartLevel = () => {
    setIsStartLevelPopupVisible(!isStartLevelPopupVisible);
  };

  return (
    <div className='flex h-full w-full flex-col items-center justify-center px-3 py-6'>
      {/* Level Header */}
      <section className='w-full'>
        <div className='grid-col-3 mx-auto grid h-[7rem] w-[38rem] grid-flow-col grid-rows-2 rounded-xl bg-duoBlue-default text-white mb-6'>
          <label className='col-span-2 flex items-center justify-start pl-4 pt-4 text-2xl font-extrabold'>
            Level {levelIndex + 1}
          </label>
          <label className='col-span-2 flex items-center justify-start px-4 pb-3 text-sm'>
            {exercises.length} exercise{exercises.length !== 1 ? 's' : ''} in this level
          </label>
          <div className='row-span-2 mr-4 flex cursor-pointer items-center justify-end'>
            <button className='hover:border-duoBlue-borderHover flex w-40 flex-row items-center justify-start rounded-2xl border-[2.5px] border-b-[4px] border-duoBlue-darker bg-duoBlue-button p-3 text-sm font-bold hover:bg-duoBlue-default hover:text-duoBlue-textHover active:border-[2.5px]'>
              <FontAwesomeIcon className='ml-2 mr-2 h-6 w-6' icon={faBook} />
              <label className='text-md cursor-pointer items-center justify-center text-center font-extrabold'>
                GUIDEBOOK
              </label>
            </button>
          </div>
        </div>

        {/* Level Content */}
        <div className='flex flex-col items-center space-y-6'>
          {/* Main Level Button */}
          <div className='flex flex-col items-center'>
            {isLocked ? (
              <div className={`relative flex mt-2 h-fit w-fit`}>
                <LessonButton status={Status.LOCKED} />
              </div>
            ) : isFinished ? (
              <div className={`relative flex mt-2 h-fit w-fit`}>
                <LessonButton status={Status.DONE} />
              </div>
            ) : isCurrentLevel ? (
              <div className={`relative flex mt-2 h-fit w-fit`}>
                <>
                  <section className='absolute left-1/2 z-50'>
                    <Tooltip isFloating={true} color={TooltipColors.GREEN} />
                  </section>
                  <LessonButton
                    status={Status.PROGRESS}
                    numberOfLessonsMade={numOfExercisesMade}
                    numberOfTotalLessons={exercises.length}
                    onClick={handleStartLevel}
                    buttonRef={levelButtonRef}
                  />
                  {isStartLevelPopupVisible && (
                    <StartLessonPopup
                      numberOfLessonsMade={numOfExercisesMade + 1}
                      numberOfTotalLessons={exercises.length}
                      nextLessonId={nextLessonId}
                      startLessonRef={startLevelRef}
                    />
                  )}
                </>
              </div>
            ) : (
              <div className={`relative flex mt-2 h-fit w-fit`}>
                <LessonButton status={Status.LOCKED} />
              </div>
            )}

            {/* Level Status Text */}
            <div className='mt-4 text-center'>
              <h3 className='text-xl font-bold text-duoGray-darkest dark:text-duoGrayDark-lightest mb-2'>
                {isLocked ? 'Level Locked' : isFinished ? 'Level Complete!' : isCurrentLevel ? 'Start Level' : 'Level Locked'}
              </h3>
              <p className='text-sm text-duoGray-dark dark:text-duoGrayDark-light'>
                {isLocked 
                  ? 'Complete previous levels to unlock'
                  : isFinished 
                    ? `All ${exercises.length} exercises completed`
                    : isCurrentLevel 
                      ? `${exercises.length} exercise${exercises.length !== 1 ? 's' : ''} to complete`
                      : 'Complete previous levels to unlock'
                }
              </p>
            </div>
          </div>

          {/* Exercises Preview (only show if current level) */}
          {isCurrentLevel && exercises.length > 0 && (
            <div className='w-full max-w-md'>
              <h4 className='text-lg font-semibold text-duoGray-darkest dark:text-duoGrayDark-lightest mb-4 text-center'>
                Exercises in this level:
              </h4>
              <div className='space-y-2'>
                {exercises.slice(0, 5).map((exercise, exerciseIndex) => {
                  const status = getExerciseStatus(exercise._id, exerciseIndex);
                  const isClickable = status === 'current';
                  
                  return (
                    <div 
                      key={exercise._id} 
                      className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                        isClickable 
                          ? 'bg-duoGreen-lightest dark:bg-duoGreen-darker cursor-pointer hover:bg-duoGreen-light dark:hover:bg-duoGreen-dark border-2 border-duoGreen-default' 
                          : status === 'completed'
                            ? 'bg-duoBlue-lightest dark:bg-duoBlue-darker border-2 border-duoBlue-default'
                            : 'bg-duoGray-lightest dark:bg-duoGrayDark-dark border-2 border-duoGray-light'
                      }`}
                      onClick={() => handleExerciseClick(exercise._id, exerciseIndex)}
                    >
                      <div className='flex items-center gap-3'>
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          status === 'completed' 
                            ? 'bg-duoBlue-default text-white'
                            : status === 'current'
                              ? 'bg-duoGreen-default text-white'
                              : 'bg-duoGray-dark text-white'
                        }`}>
                          {status === 'completed' ? '✓' :`${levelIndex + 1}/${exerciseIndex + 1}`}
                        </span>
                        <div className='flex flex-col'>
                          <span className='font-medium text-duoGray-darkest dark:text-duoGrayDark-lightest'>
                            Exercise {exerciseIndex + 1}
                          </span>
                          <span className='text-xs text-duoGray-dark dark:text-duoGrayDark-light'>
                            {exercise.type.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className='flex items-center gap-2'>
                        {status === 'completed' && (
                          <span className='text-duoBlue-default text-sm font-medium'>Completed</span>
                        )}
                        {status === 'current' && (
                          <div className='flex items-center gap-1'>
                            <FontAwesomeIcon icon={faPlay} className='w-3 h-3 text-duoGreen-default' />
                            <span className='text-duoGreen-default text-sm font-medium'>Start</span>
                          </div>
                        )}
                        {status === 'locked' && (
                          <FontAwesomeIcon icon={faLock} className='w-4 h-4 text-duoGray-default' />
                        )}
                      </div>
                    </div>
                  );
                })}
                {exercises.length > 5 && (
                  <div className='text-center text-sm text-duoGray-dark dark:text-duoGrayDark-light'>
                    +{exercises.length - 5} more exercise{exercises.length - 5 !== 1 ? 's' : ''}
                  </div>
                )}
              </div>
              
              {/* Progress Summary */}
              <div className='mt-4 p-4 bg-duoGray-lightest dark:bg-duoGrayDark-dark rounded-lg'>
                <div className='flex justify-between items-center mb-2'>
                  <span className='text-sm font-medium text-duoGray-darkest dark:text-duoGrayDark-lightest'>
                    Progress
                  </span>
                  <span className='text-sm text-duoGray-dark dark:text-duoGrayDark-light'>
                    {completedExercises.length} / {exercises.length}
                  </span>
                </div>
                <div className='w-full bg-duoGray-light dark:bg-duoGrayDark-light rounded-full h-2'>
                  <div
                    className='bg-duoGreen-default h-2 rounded-full transition-all duration-300'
                    style={{ width: `${exercises.length > 0 ? (completedExercises.length / exercises.length) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default StudentLevelSection; 