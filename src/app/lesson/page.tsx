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

const Lesson: React.FC = () => {
  const nextLessonId = useStore(useUserStore, (state) => state.nextLessonId);
  const userId = useStore(useUserStore, (state) => state.userId);
  const infoBarRef = useRef<HTMLDivElement | null>(null);

  const [currentExercise, setCurrentExercise] = useState<
    FsaType | SpotreccType | null
  >(null);

  const fetchData = useCallback(async () => {
    const response = await pRetry(
      () => (nextLessonId ? getExercisesData(nextLessonId) : null),
      {
        retries: 5,
      }
    );
    console.log('SET_EXERCISES_DATA', response);
    if (response) {
      setCurrentExercise(response.exercises[0]);
    }
  }, [nextLessonId]);

  useEffect(() => {
    console.log('currentExercise', currentExercise);
  }, [currentExercise]);

  useEffect(() => {
    fetchData();
  }, [fetchData, nextLessonId]);

  return (
    <section
      className='relative h-screen w-full dark:text-duoGrayDark-lightest'
      id='lesson-grid'
    >
      <section className='h-full' id='exercise-section'>
        <ProgressBar totalNumOfExercises={5} numOfExercisesMade={2} />
        {currentExercise &&
          (currentExercise.type === ExercisesTypes.FSA ? (
            <>{ExercisesTypes.FSA}</>
          ) : currentExercise.type === ExercisesTypes.SPOTRECC ? (
            <SpotreccPage exercise={currentExercise as SpotreccType} />
          ) : (
            <>error</>
          ))}
      </section>
      <section id='info-bar-section'>
        <LessonInfo
          infoRef={infoBarRef}
          exerciseType={currentExercise?.type || ExercisesTypes.FSA}
          timeRemaining={{ minutes: 0, seconds: 0 }}
          isExerciseStarted={false}
          isExerciseFinished={false}
          targetsToSubmit={[]}
        />
      </section>
      <section id='footer-section'>
        <LessonFooter />
      </section>
    </section>
  );
};
export default Lesson;
