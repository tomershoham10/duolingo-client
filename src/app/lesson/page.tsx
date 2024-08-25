'use client';

import pRetry from 'p-retry';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useStore } from 'zustand';
import { useUserStore } from '../store/stores/useUserStore';
import { getExercisesData } from '../API/classes-service/lessons/functions';
import ProgressBar from '@/components/(lessonComponents)/ProgressBar/page';
import { ExercisesTypes } from '../API/classes-service/exercises/functions';
import SpotreccPage from './(exercises)/_spotrecc/page';
import LessonInfo from '@/components/InfoBar/LessonInfo/page';
import LessonFooter from '@/components/(lessonComponents)/lessonFooter/page';
import { TimeType } from '@/reducers/studentView/(exercises)/fsaReducer';
import { formatNumberToMinutes } from '../_utils/functions/formatNumberToMinutes';

const Lesson: React.FC = () => {
  const nextLessonId = useStore(useUserStore, (state) => state.nextLessonId);
  const userId = useStore(useUserStore, (state) => state.userId);
  const infoBarRef = useRef<HTMLDivElement | null>(null);
  const [exercisesData, setExercisesData] = useState<
    (FsaType | SpotreccType)[] | null
  >(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number>(0);

  const [currentSpotreccSubIndex, setCurrentSpotreccSubIndex] =
    useState<number>(0);

  const [isExerciseStarted, setIsExerciseStarted] = useState<boolean>(false);
  const [isExerciseFinished, setIsExerciseFinished] = useState<boolean>(false);

  const [timeRemaining, setTimeRemaining] = useState<TimeType>({
    minutes: 0,
    seconds: 0,
  });

  const currentExercise = exercisesData
    ? exercisesData[currentExerciseIndex]
    : null;

  useEffect(() => {
    console.log('currentExercise', currentExercise);
  }, [currentExercise]);

  const fetchData = useCallback(async () => {
    const response = await pRetry(
      () => (nextLessonId ? getExercisesData(nextLessonId) : null),
      {
        retries: 5,
      }
    );
    console.log('SET_EXERCISES_DATA', response);
    if (response) {
      setExercisesData(response.exercises);
    }
  }, [nextLessonId]);

  useEffect(() => {
    fetchData();
  }, [fetchData, nextLessonId]);

  const handleExerciseStarted = useCallback(() => {
    setIsExerciseStarted(true);
  }, []);

  const updateTimer = useCallback((time: number) => {
    console.log('handleSpotrecc', time);
    if (time > 60) {
      const minues= formatNumberToMinutes(time);
      setTimeRemaining({ minutes: 0, seconds: time });
    }
  }, []);

  const finishMainExercise = useCallback(() => {
    console.log('finish');
  }, []);

  const handleSubmit = useCallback(() => {
    if (currentExercise) {
      if (currentExercise.type === ExercisesTypes.FSA) {
      }
      if (currentExercise.type === ExercisesTypes.SPOTRECC) {
        const spotreccExer = currentExercise as SpotreccType;
        console.log(currentSpotreccSubIndex, spotreccExer.subExercises.length);
        if (currentSpotreccSubIndex < spotreccExer.subExercises.length - 1) {
          setCurrentSpotreccSubIndex((prev) => prev + 1);
        } else {
          console.log('finish');
        }
      }
    }
  }, [currentExercise, currentSpotreccSubIndex]);

  return (
    <section
      className='relative h-screen w-full dark:text-duoGrayDark-lightest'
      id='lesson-grid'
    >
      <section className='h-full' id='exercise-section'>
        <ProgressBar
          totalNumOfExercises={exercisesData?.length || 1}
          numOfExercisesMade={currentExerciseIndex}
        />
        {exercisesData &&
          currentExercise &&
          (currentExercise.type === ExercisesTypes.FSA ? (
            <>{ExercisesTypes.FSA}</>
          ) : currentExercise.type === ExercisesTypes.SPOTRECC ? (
            <SpotreccPage
              exercise={currentExercise as SpotreccType}
              isExerciseStarted={isExerciseStarted}
              updateTimer={updateTimer}
              finishMainExercise={finishMainExercise}
              currentSubExerciseIndex={currentSpotreccSubIndex}
            />
          ) : (
            <>error</>
          ))}
      </section>
      <section id='info-bar-section'>
        <LessonInfo
          infoRef={infoBarRef}
          exerciseType={currentExercise?.type || ExercisesTypes.FSA}
          timeRemaining={timeRemaining}
          isExerciseStarted={isExerciseStarted}
          isExerciseFinished={isExerciseFinished}
          targetsToSubmit={[]}
        />
      </section>
      <section id='footer-section'>
        <LessonFooter
          exerciseType={currentExercise?.type || ExercisesTypes.SPOTRECC}
          fileName={
            currentExercise?.type === ExercisesTypes.FSA
              ? (currentExercise as FsaType).fileName
              : undefined
          }
          isExerciseStarted={isExerciseStarted}
          isExerciseFinished={isExerciseFinished}
          onStartExercise={() => handleExerciseStarted()}
          onSubmit={handleSubmit}
          updatePassword={(password) => console.log('zip', password)}
        />
      </section>
    </section>
  );
};
export default Lesson;
