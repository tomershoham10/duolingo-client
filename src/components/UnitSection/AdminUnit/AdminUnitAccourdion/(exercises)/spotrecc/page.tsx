interface SpotreccAccourdionProps {
  exercise: SpotreccType;
  //   targetsList: TargetType[] | undefined;
}

const SpotreccAccourdion: React.FC<SpotreccAccourdionProps> = (props) => {
  const { exercise } = props;
  return (
    <div className='dark:text-duoGrayDark-lightest'>
      <span>EXERCISE ID :{exercise._id}</span>
      <div className='flex flex-col'>
        <span className='font-bold'>description</span>
        <span>{String(exercise.dateCreated)}</span>
      </div>
    </div>
  );
};

export default SpotreccAccourdion;
