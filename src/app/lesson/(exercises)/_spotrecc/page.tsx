import { ExercisesTypes } from '@/app/API/classes-service/exercises/functions';
import { BucketsNames, getFileByName } from '@/app/API/files-service/functions';
import AudioPlayer, { AudioPlayerSizes } from '@/components/AudioPlayer/page';
import pRetry from 'p-retry';
import { useCallback, useEffect, useState } from 'react';

interface SpotreccPageProps {
  exercise: SpotreccType;
}

const SpotreccPage: React.FC<SpotreccPageProps> = (props) => {
  const [currentSubExerciseIndex, setCurrentSubExerciseIndex] =
    useState<number>(0);
  const { exercise } = props;
  const currentSubExercise = exercise.subExercises[currentSubExerciseIndex];

  const [url, setUrl] = useState<string | null>(null);

  const getFile = useCallback(async (fileName: string) => {
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
  }, []);

  useEffect(() => {
    getFile(currentSubExercise.fileName);
  }, [currentSubExercise, getFile]);

  return (
    <section className='flex h-full flex-col items-center justify-center'>
      {url ? (
        currentSubExercise.fileName.endsWith('.wav') ? (
          <AudioPlayer
            src={url}
            size={AudioPlayerSizes.MEDIUM}
            isPauseable={true}
          />
        ) : (
          <p>image</p>
        )
      ) : (
        <p>loading...</p>
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
