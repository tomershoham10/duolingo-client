'use client';

import pRetry from 'p-retry';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useStore } from 'zustand';
import { useUserStore } from '../store/stores/useUserStore';
import { getExercisesData } from '../API/classes-service/lessons/functions';
import ProgressBar from '@/components/(lessonComponents)/ProgressBar/page';
import { ExercisesTypes } from '../API/classes-service/exercises/functions';
import SpotreccPage from './(exercises)/_spotrecc/page';
import LessonInfo from '@/components/InfoBar/LessonInfo/page';
import LessonFooter from '@/components/(lessonComponents)/lessonFooter/page';
import { TimeType } from '@/reducers/studentView/(exercises)/fsaReducer';
import LessonComplete from './_lessonComplete/page';

const Lesson: React.FC = () => {
  //#region init page

  const nextLessonId = useStore(useUserStore, (state) => state.nextLessonId);
  const userId = useStore(useUserStore, (state) => state.userId);
  const infoBarRef = useRef<HTMLDivElement | null>(null);
  const [exercisesData, setExercisesData] = useState<
    (FsaType | SpotreccType)[] | null
  >(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number>(0);

  const [currentSpotreccSubIndex, setCurrentSpotreccSubIndex] =
    useState<number>(0);

  const [spotreccPauseClock, setSpotreccPauseClock] = useState<boolean>(false);

  const [isExerciseStarted, setIsExerciseStarted] = useState<boolean>(false);
  const [isExerciseFinished, setIsExerciseFinished] = useState<boolean>(false);
  const [isLessonFinished, setIsLessonFinished] = useState<boolean>(false);

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

  useEffect(() => {
    exercisesData &&
      setIsLessonFinished(currentExerciseIndex === exercisesData.length);
  }, [currentExerciseIndex, exercisesData]);

  const fetchData = useCallback(async () => {
    try {
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
    } catch (err) {
      console.error('fetchData error:', err);
    }
  }, [nextLessonId]);

  useEffect(() => {
    fetchData();
  }, [fetchData, nextLessonId]);

  // #endregion

  const handleExerciseStarted = useCallback(() => {
    setSpotreccPauseClock(false);

    setIsExerciseStarted(true);
  }, []);

  const updateTimer = useCallback((time: number) => {
    console.log('handleSpotrecc', time);
    if (time > 60) {
      let minutes: number = Math.floor(time / 60);
      let seconds: number = Math.floor(time - 60 * minutes);
      console.log('updateTimer minutes', minutes, seconds);
      setTimeRemaining({ minutes: minutes, seconds: seconds });
    } else {
      setTimeRemaining({ minutes: 0, seconds: time });
    }
  }, []);

  const pauseClock = useCallback(() => {
    setSpotreccPauseClock(true);
  }, []);

  const finishMainExercise = useCallback(() => {
    console.log('finish');
  }, []);

  const handleSubmit = useCallback(() => {
    setSpotreccPauseClock(true);

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

          setCurrentExerciseIndex((prev) => prev + 1);
          setIsExerciseStarted(false);
          setIsExerciseFinished(true);
        }
      }
    }
  }, [currentExercise, currentSpotreccSubIndex]);

  return (
    <>
      <section
        className='relative inline-block h-screen w-full dark:text-duoGrayDark-lightest'
        // id='lesson-grid'
        id={`${!isLessonFinished ? 'lesson-grid' : 'finished-lesson-grid'}`}
      >
        {/* {false ? ( */}
        {!isLessonFinished ? (
          <>
            <section className='flex h-full flex-col' id='exercise-section'>
              <section className='basis-[5%]'>
                <ProgressBar
                  totalNumOfExercises={exercisesData?.length || 1}
                  numOfExercisesMade={currentExerciseIndex}
                />
              </section>
              <section className='basis-[95%]'>
                {exercisesData &&
                  currentExercise &&
                  (currentExercise.type === ExercisesTypes.FSA ? (
                    <>{ExercisesTypes.FSA}</>
                  ) : currentExercise.type === ExercisesTypes.SPOTRECC ? (
                    <SpotreccPage
                      exercise={currentExercise as SpotreccType}
                      isExerciseStarted={isExerciseStarted}
                      updateTimer={updateTimer}
                      pauseClock={pauseClock}
                      finishMainExercise={finishMainExercise}
                      currentSubExerciseIndex={currentSpotreccSubIndex}
                    />
                  ) : (
                    <>error</>
                  ))}
              </section>
            </section>
            <section id='info-bar-section'>
              <LessonInfo
                infoRef={infoBarRef}
                exerciseType={currentExercise?.type || ExercisesTypes.FSA}
                timeRemaining={timeRemaining}
                isExerciseStarted={
                  spotreccPauseClock ? false : isExerciseStarted
                }
                isExerciseFinished={isExerciseFinished}
                targetsToSubmit={[]}
              />
            </section>
          </>
        ) : (
          <LessonComplete score={85} />
        )}
        <section id='footer-section'>
          <LessonFooter
            exerciseType={currentExercise?.type || ExercisesTypes.SPOTRECC}
            fileName={
              currentExercise?.type === ExercisesTypes.FSA
                ? (currentExercise as FsaType).fileRoute.objectName
                : undefined
            }
            isExerciseStarted={isExerciseStarted}
            isExerciseFinished={isExerciseFinished}
            isLessonFinished={isLessonFinished}
            onStartExercise={handleExerciseStarted}
            onSubmit={handleSubmit}
            updatePassword={(password) => console.log('zip', password)}
          />
        </section>
      </section>
    </>
  );
};
export default Lesson;
