import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import FsaAccourdion from './(exercises)/fsa/page';
import SpotreccAccourdion from './(exercises)/spotrecc/page';
import { ExercisesTypes } from '@/app/API/classes-service/exercises/functions';
library.add(faChevronUp, faChevronDown);

interface AdminUnitAccourdionProps {
  exercise: ExerciseType;
  exerciseIndex: number;
  isOpen: boolean;
  targetsList: TargetType[] | undefined;
  toggleAccordion: (exerciseId: string) => void;
}

const AdminUnitAccourdion: React.FC<AdminUnitAccourdionProps> = (props) => {
  const { exercise, exerciseIndex, isOpen, targetsList, toggleAccordion } =
    props;
  return (
    <div
      className={`accordion-item relative my-2 flex w-full cursor-pointer flex-col rounded-md p-2 text-lg text-duoGray-darkest hover:rounded-md hover:bg-duoGray-lighter dark:text-duoGrayDark-lightest dark:hover:bg-duoGrayDark-dark ${isOpen && 'open'}`}
      onClick={() => {
        toggleAccordion(exercise._id);
      }}
    >
      {isOpen ? (
        <section>
          {exercise.type === ExercisesTypes.FSA ? (
            <FsaAccourdion
              exercise={exercise as FsaType}
              targetsList={targetsList}
            />
          ) : exercise.type === ExercisesTypes.SPOTRECC ? (
            <SpotreccAccourdion exercise={exercise as SpotreccType} />
          ) : null}
        </section>
      ) : (
        <p className='h-fit w-full'>exercise no. {exerciseIndex + 1}</p>
      )}

      <div className='absolute right-2 top-2'>
        {isOpen ? (
          <FontAwesomeIcon icon={faChevronUp} />
        ) : (
          <FontAwesomeIcon icon={faChevronDown} />
        )}
      </div>
    </div>
  );
};

export default AdminUnitAccourdion;
