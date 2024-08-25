import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import pRetry from 'p-retry';

import { ExercisesTypes } from '@/app/API/classes-service/exercises/functions';
import { BucketsNames, getFileByName } from '@/app/API/files-service/functions';
import Countdown from '@/components/(lessonComponents)/Countdown/page';
import AudioPlayer, { AudioPlayerSizes } from '@/components/AudioPlayer/page';

interface SpotreccPageProps {
  exercise: SpotreccType;
  isExerciseStarted: boolean;
  updateTimer: (time: number) => void;
  //   finishSubExercise: () => void;
  finishMainExercise: () => void;
  currentSubExerciseIndex: number;
}
const SpotreccPage: React.FC<SpotreccPageProps> = (props) => {
  const {
    exercise,
    isExerciseStarted,
    updateTimer,
    // finishSubExercise,
    finishMainExercise,
    currentSubExerciseIndex,
  } = props;

  const currentSubExercise = exercise.subExercises[currentSubExerciseIndex];

  const [url, setUrl] = useState<string | null>(null);

  const [showCountdown, setShowCountdown] = useState<boolean>(false);

  const [timeLeft, setTimeLeft] = useState<number>(currentSubExercise.time);

  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);

  const handleCountdownComplete = useCallback(() => {
    setShowCountdown(false);
  }, []);

  useEffect(() => {
    if (isExerciseStarted) {
      setShowCountdown(true);
    }
  }, [handleCountdownComplete, isExerciseStarted]);

  const setWavLength = useCallback(async (responseUrl: string) => {
    const audio = new Audio(responseUrl);
    length = await new Promise((resolve) => {
      audio.addEventListener('loadedmetadata', () => {
        resolve(audio.duration);
      });
    });
    console.log('setWavLength', length);
    setTimeLeft(length);
  }, []);

  const getFile = useCallback(
    async (fileName: string) => {
      const responseUrl = await pRetry(
        () =>
          fileName.endsWith('.wav')
            ? getFileByName(
                BucketsNames.RECORDS,
                ExercisesTypes.SPOTRECC,
                fileName
              )
            : getFileByName(
                BucketsNames.IMAGES,
                ExercisesTypes.SPOTRECC,
                fileName
              ),
        {
          retries: 5,
        }
      );
      setUrl(responseUrl);
      fileName.endsWith('.wav') && responseUrl && setWavLength(responseUrl);
    },
    [setWavLength]
  );

  useEffect(() => {
    setUrl(null);
    getFile(currentSubExercise.fileName);
    !currentSubExercise.fileName.endsWith('.wav') &&
      setTimeLeft(currentSubExercise.time);
  }, [currentSubExercise, getFile]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (
      isExerciseStarted &&
      !showCountdown &&
      (currentSubExercise.fileName.endsWith('.wav') ? isAudioPlaying : true)
    ) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          const newTime = prevTime > 0 ? prevTime - 1 : 0;
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [
    currentSubExercise.fileName,
    currentSubExerciseIndex,
    exercise.subExercises.length,
    finishMainExercise,
    isAudioPlaying,
    isExerciseStarted,
    showCountdown,
  ]);

  useEffect(() => {
    if (timeLeft >= 0) {
      updateTimer(timeLeft);
    } else if (
      timeLeft === 0 &&
      currentSubExerciseIndex === exercise.subExercises.length - 1
    ) {
      finishMainExercise();
    }
  }, [
    timeLeft,
    updateTimer,
    currentSubExerciseIndex,
    exercise.subExercises.length,
    finishMainExercise,
  ]);

  return (
    <section className='flex flex-col items-center justify-center'>
      {isExerciseStarted ? (
        url ? (
          showCountdown ? (
            <Countdown onComplete={handleCountdownComplete} />
          ) : currentSubExercise.fileName.endsWith('.wav') ? (
            <AudioPlayer
              src={url}
              size={AudioPlayerSizes.MEDIUM}
              isPauseable={false}
              isDisabled={!isExerciseStarted}
              onPlay={() => setIsAudioPlaying(true)}
            />
          ) : (
            <>
              {timeLeft > 0 ? (
                <Image src={url} alt='spotrecc img' width={500} height={300} />
              ) : (
                <p>selecet a target</p>
              )}
            </>
          )
        ) : (
          <p>loading...</p>
        )
      ) : (
        <p>SPOTRECC</p>
      )}
      {/* <button
        onClick={() =>
          setCurrentSubExerciseIndex((prev) => {
            return prev + 1 < exercise.subExercises.length ? prev + 1 : prev;
          })
        }
      > 
        next
      </button> */}
    </section>
  );
};

export default SpotreccPage;
