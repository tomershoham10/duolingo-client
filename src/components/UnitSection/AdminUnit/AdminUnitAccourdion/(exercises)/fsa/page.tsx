interface FsaAccourdionProps {
  exercise: FsaType;
  targetsList: TargetType[] | undefined;
}
const FsaAccourdion: React.FC<FsaAccourdionProps> = (props) => {
  const { exercise, targetsList } = props;
  return (
    <div className='dark:text-duoGrayDark-lightest'>
      <span>EXERCISE ID :{exercise._id}</span>
      <div className='flex flex-col'>
        <span className='font-bold'>description</span>
        <span>{exercise.description}</span>
      </div>
      <div className='flex flex-col'>
        <span className='font-bold'>difficulty Level</span>
        <span>
          {/* {
                    exercise.difficultyLevel
                  } */}
          get from record
        </span>
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
    </div>
  );
};

export default FsaAccourdion;
