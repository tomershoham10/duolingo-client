'use client';
import { useEffect, useState } from 'react';
import pRetry from 'p-retry';
import ProgressBar from '@/components/ProgressBar/page';
import { getExercisesData } from '@/app/API/classes-service/lessons/functions';

export default function Page({ params }: { params: { id: string } }) {
  const lessonId = params.id.toString();
  const [exercises, setExercises] = useState<ExerciseType[] | null>([]);
  const [currentExercise, setCurrentExercise] = useState<ExerciseType>();
  const [totalNumOfExercises, setTotalNumOfExercises] = useState<number>(0);
  const [numOfExercisesMade, setNumOfExercisesMade] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      if (lessonId) {
        // const results = await getExercisesData(lessonId);
        const results = await pRetry(() => getExercisesData(lessonId), {
          retries: 5,
        });
        setExercises(results);
      }
    };
    fetchData();
  }, [lessonId]);

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
      {currentExercise ? <div>{currentExercise.description}</div> : null}
    </div>
  );
}
