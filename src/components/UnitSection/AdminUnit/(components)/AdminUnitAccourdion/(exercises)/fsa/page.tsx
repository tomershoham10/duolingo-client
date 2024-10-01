import Link from 'next/link';

interface FsaAccourdionProps {
  exercise: FsaType;
  targetsList: TargetType[] | undefined;
}
const FsaAccourdion: React.FC<FsaAccourdionProps> = (props) => {
  const { exercise, targetsList } = props;
  return (
    <div>
      <div className='flex flex-row gap-2'>
        <span className='font-bold'>Exercise type:</span>
        <span>{exercise.type}</span>
      </div>
      {exercise.description && (
        <div className='flex flex-row gap-2'>
          <span className='font-bold'>description:</span>
          <span>{exercise.description}</span>
        </div>
      )}
      {targetsList && (
        <div className='flex flex-row gap-2'>
          <span className='font-bold'>Target:</span>
          <span className='flex flex-row gap-2'>
            {targetsList.find(
              (target) => target._id === exercise.fileRoute.mainId
            ) && (
              <>
                <p>
                  {
                    targetsList.find(
                      (target) => target._id === exercise.fileRoute.mainId
                    )?.name
                  }
                </p>
                /
              </>
            )}
            {targetsList.find(
              (target) => target._id === exercise.fileRoute.subTypeId
            ) && (
              <>
                <p>
                  {
                    targetsList.find(
                      (target) => target._id === exercise.fileRoute.subTypeId
                    )?.name
                  }
                </p>
                /
              </>
            )}
            {targetsList.find(
              (target) => target._id === exercise.fileRoute.modelId
            ) && (
              <p>
                {
                  targetsList.find(
                    (target) => target._id === exercise.fileRoute.modelId
                  )?.name
                }
              </p>
            )}
          </span>
        </div>
      )}
      <div className='flex flex-row gap-2'>
        <span className='font-bold'>Record name:</span>
        <span>{exercise.fileRoute.objectName}</span>
      </div>
      {targetsList &&
      exercise.relevant !== undefined &&
      exercise.relevant.length > 0 ? (
        <div className='flex flex-col'>
          <span className='text-lg font-extrabold'>relevant</span>
          <span>
            {
              targetsList.filter((target) =>
                exercise.relevant ? target._id === exercise.relevant[0] : null
              )[0].name
            }
          </span>
        </div>
      ) : null}
      <Link
        className='flex w-fit cursor-pointer flex-row items-center justify-start gap-2 text-duoBlue-default hover:text-duoBlue-default dark:text-duoPurpleDark-default dark:hover:opacity-90'
        href={`${`/classroom/exercise-preview/${exercise._id}`}`}
        target='_blank'
      >
        preview
      </Link>
    </div>
  );
};

export default FsaAccourdion;
