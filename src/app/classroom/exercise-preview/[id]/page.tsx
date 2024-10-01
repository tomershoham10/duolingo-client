'use client';
import {
  ExercisesTypes,
  getExerciseById,
} from '@/app/API/classes-service/exercises/functions';
import FsaPage from '@/app/lesson/(exercises)/_fsa/page';

const fetchData = async (exerciseId: string): Promise<ExerciseType | null> => {
  try {
    const results = await getExerciseById(exerciseId);
    return results;
  } catch (err) {
    throw new Error(`fetchData error: ${err}`);
  }
};
export const ExercisePreview = async ({
  params,
}: {
  params: { id: string };
}) => {
  const exerciseId = params.id.toString();

  const exreciseData = await fetchData(exerciseId);

  if (exreciseData === null) {
    return <h1>unable to fetch exercise data</h1>;
  }

  return (
    <>
      {exreciseData && (
        <>
          {exreciseData.type === ExercisesTypes.FSA ? (
            <FsaPage
              currentExercise={
                {
                  ...exreciseData,
                  description:
                    'aaaaaaaaaaaaaaaaa aaaaaaaaaaaaaa aaaaaaaaaaa aaaaaaaaaaaaaaaaa aaaaaaaaaaaaaa aaaaaaaaaaa aaaaaaaaaaaaaaaaa aaaaaaaaaaaaaa aaaaaaaaaaa aaaaaaaaaaaaaaaaa aaaaaaaaaaaaaa aaaaaaaaaaa',
                } as FsaType
              }
              relevant={[]}
              isExerciseStarted={false}
              isExerciseSubmitted={false}
              selectedTargetIndex={0}
              showPlaceholder={false}
              targetFromDropdown={null}
              targetsList={undefined}
              setSelectedTargerIndex={() => {}}
              setTargetFromDropdown={() => {}}
              handleTargetsDropdown={() => {}}
            />
          ) : exreciseData.type === ExercisesTypes.SPOTRECC ? (
            <></>
          ) : null}
        </>
      )}
    </>
  );
};

export default ExercisePreview;
