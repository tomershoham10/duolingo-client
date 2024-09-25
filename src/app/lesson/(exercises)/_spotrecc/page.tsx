import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import pRetry from 'p-retry';

import { ExercisesTypes } from '@/app/API/classes-service/exercises/functions';
import { getFileByName } from '@/app/API/files-service/functions';
import Countdown from '@/components/(lessonComponents)/Countdown/page';
import AudioPlayer, { AudioPlayerSizes } from '@/components/AudioPlayer/page';

// interface ImageDimensions {
//   width: number;
//   height: number;
// }

interface SpotreccPageProps {
  exercise: SpotreccType;
  isExerciseStarted: boolean;
  updateTimer: (time: number) => void;
  pauseClock: () => void;
  finishMainExercise: () => void;
  currentSubExerciseIndex: number;
}
const SpotreccPage: React.FC<SpotreccPageProps> = (props) => {
  //#region init page
  const {
    exercise,
    isExerciseStarted,
    updateTimer,
    pauseClock,
    finishMainExercise,
    currentSubExerciseIndex,
  } = props;

  const currentSubExercise = exercise.subExercises[currentSubExerciseIndex];

  const [url, setUrl] = useState<string | null>(null);

  //   const [imageDimensions, setImageDimensions] = useState<ImageDimensions>({
  //     width: 0,
  //     height: 0,
  //   });

  const [showCountdown, setShowCountdown] = useState<boolean>(false);

  const [exerciseTime, setExerciseTime] = useState<number>(
    currentSubExercise.exerciseTime
  );

  const [bufferTime, setBufferTime] = useState<number>(
    currentSubExercise.bufferTime
  );

  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);

  const handleCountdownComplete = useCallback(() => {
    setShowCountdown(false);
  }, []);

  useEffect(() => {
    if (isExerciseStarted) {
      setShowCountdown(true);
    }
  }, [handleCountdownComplete, isExerciseStarted]);

  const handleContextMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
  }, []);

  // #endregion

  //#region getting file data

  const setWavLength = useCallback(async (responseUrl: string) => {
    try {
      const audio = new Audio(responseUrl);
      length = await new Promise((resolve) => {
        audio.addEventListener('loadedmetadata', () => {
          resolve(audio.duration);
        });
      });
      console.log('setWavLength', length);
      setExerciseTime(length);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const getFile = useCallback(
    async (fileName: string) => {
      try {
        // const responseUrl = await pRetry(
        //   () =>
        //     fileName.endsWith('.wav')
        //       ? getFileByName(
        //           FileTypes.RECORDS,
        //           ExercisesTypes.SPOTRECC,
        //           fileName
        //         )
        //       : getFileByName(
        //           FileTypes.IMAGES,
        //           ExercisesTypes.SPOTRECC,
        //           fileName
        //         ),
        //   {
        //     retries: 5,
        //   }
        // );
        // setUrl(responseUrl);
        // fileName.endsWith('.wav') && responseUrl && setWavLength(responseUrl);
      } catch (err) {
        console.error(err);
      }
    },
    // [setWavLength]
    []
  );

  // #endregion

  //#region handling time

  useEffect(() => {
    setUrl(null);
  }, [currentSubExercise.fileName]);

  useEffect(() => {
    getFile(currentSubExercise.fileName);
    if (!currentSubExercise.fileName.endsWith('.wav')) {
      setExerciseTime(currentSubExercise.exerciseTime);
    }
  }, [currentSubExercise.fileName, currentSubExercise.exerciseTime, getFile]);

  useEffect(() => {
    let exerciseInterval: NodeJS.Timeout | null = null;

    if (
      isExerciseStarted &&
      !showCountdown &&
      (currentSubExercise.fileName.endsWith('.wav') ? isAudioPlaying : true)
    ) {
      exerciseInterval = setInterval(() => {
        setExerciseTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
      }, 1000);
    }

    return () => {
      if (exerciseInterval) clearInterval(exerciseInterval);
    };
  }, [
    isExerciseStarted,
    showCountdown,
    isAudioPlaying,
    currentSubExercise.fileName,
  ]);

  useEffect(() => {
    let bufferInterval: NodeJS.Timeout | null = null;

    if (exerciseTime === 0 && bufferTime >= 0) {
      bufferInterval = setInterval(() => {
        setBufferTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
      }, 1000);
    }

    return () => {
      if (bufferInterval) clearInterval(bufferInterval);
    };
  }, [exerciseTime, bufferTime]);

  useEffect(() => {
    if (exerciseTime > 0 || bufferTime >= 0) {
      updateTimer(exerciseTime > 0 ? exerciseTime : bufferTime);
    }
    if (
      exerciseTime === 0 &&
      bufferTime === 0 &&
      currentSubExerciseIndex < exercise.subExercises.length - 1
    ) {
      console.log('pauseClock');
      pauseClock();
    } else if (
      exerciseTime === 0 &&
      bufferTime === 0 &&
      currentSubExerciseIndex === exercise.subExercises.length - 1
    ) {
      finishMainExercise();
    }
  }, [
    exerciseTime,
    bufferTime,
    updateTimer,
    currentSubExerciseIndex,
    exercise.subExercises.length,
    finishMainExercise,
    pauseClock,
  ]);

  // #endregion

  return (
    <section className='flex h-full flex-col items-center justify-center text-5xl font-bold'>
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
            <section
              className='relative mb-2 flex h-full w-[80%] items-center justify-center pb-2'
              onContextMenu={handleContextMenu}
            >
              {exerciseTime > 0 ? (
                <Image
                  src={url}
                  alt='spotrecc img'
                  fill
                  //   onLoad={handleImageLoad}
                />
              ) : (
                <>
                  {bufferTime > 0 ? <p>selecet a target</p> : <p>time is up</p>}
                </>
              )}
            </section>
          )
        ) : (
          <p>loading...</p>
        )
      ) : (
        <p>SPOTRECC</p>
      )}
    </section>
  );
};

export default SpotreccPage;
