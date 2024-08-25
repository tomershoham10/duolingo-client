'use client';
import { useCallback, useEffect, useState } from 'react';
import pRetry from 'p-retry';
import ProgressBar from '@/components/(lessonComponents)/ProgressBar/page';
import { getExercisesData } from '@/app/API/classes-service/lessons/functions';

export default function Page({ params }: { params: { id: string } }) {
  const lessonId = params.id.toString();
  const [exercises, setExercises] = useState<ExerciseType[] | null>([]);
  const [currentExercise, setCurrentExercise] = useState<ExerciseType>();
  const [totalNumOfExercises, setTotalNumOfExercises] = useState<number>(0);
  const [numOfExercisesMade, setNumOfExercisesMade] = useState<number>(0);

  const fetchData = useCallback(async () => {
    try {
      if (lessonId) {
        // const results = await getExercisesData(lessonId);
        const results = await pRetry(() => getExercisesData(lessonId), {
          retries: 5,
        });
        setExercises(results?.exercises || null);
      }
    } catch (err) {
      console.error('fetchData error:', err);
    }
  }, [lessonId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    exercises ? setTotalNumOfExercises(exercises.length) : null;
  }, [exercises]);

  useEffect(() => {
    exercises
      ? console.log(
          Object.values(exercises)[numOfExercisesMade],
          numOfExercisesMade
        )
      : null;
    exercises ? setCurrentExercise(exercises[numOfExercisesMade]) : null;
  }, [exercises, numOfExercisesMade]);

  return exercises === null ? (
    <h1>ERROR FETCHING THE LESSON!</h1>
  ) : (
    <div className='flex w-full flex-col'>
      <ProgressBar
        totalNumOfExercises={totalNumOfExercises}
        numOfExercisesMade={numOfExercisesMade}
      />
      {/* {currentExercise && <div>{currentExercise.description}</div>} */}
    </div>
  );
}
