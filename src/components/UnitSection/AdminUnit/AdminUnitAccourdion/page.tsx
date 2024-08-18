import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import FsaAccourdion from './(exercises)/fsa/page';
import SpotreccAccourdion from './(exercises)/spotrecc/page';
import { ExercisesTypes } from '@/app/API/classes-service/exercises/functions';
library.add(faChevronDown);

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
    <>
      <div
        key={exercise._id}
        className={`accordion-item flex w-full flex-col ${isOpen && 'open'}`}
        onClick={() => {
          toggleAccordion(exercise._id);
        }}
      >
        {isOpen}
        {isOpen ? (
          exercise.type === ExercisesTypes.FSA ? (
            <FsaAccourdion
              exercise={exercise as FsaType}
              targetsList={targetsList}
            />
          ) : exercise.type === ExercisesTypes.SPOTRECC ? (
            <SpotreccAccourdion exercise={exercise as SpotreccType} />
          ) : null
        ) : (
          <div className='my-1 flex h-fit w-full cursor-pointer items-center justify-between p-2 text-duoGray-darkest hover:rounded-md hover:bg-duoGray-lighter dark:text-duoGrayDark-lightest dark:hover:bg-duoGrayDark-dark'>
            <label className='cursor-pointer'>
              exercise #{exerciseIndex + 1}
            </label>
            <FontAwesomeIcon icon={faChevronDown} />
          </div>
        )}
      </div>
    </>
  );
};

export default AdminUnitAccourdion;

// {exerciseObject.fatherId ===
//     lesson._id
//       ? exerciseObject
//           .data
//           .length >
//         0
//         ? exerciseObject.data.map(
//             (
//               exercise,
//               exerciseIndex
//             ) => (
//               <div
//                 key={
//                   exercise._id
//                 }
//                 className={`accordion-item flex w-full flex-col ${
//                   exerciseAccordion.includes(
//                     exercise._id
//                   )
//                     ? 'open'
//                     : ''
//                 }`}
//                 onClick={() => {
//                   toggleAccordion(
//                     exercise._id
//                   );
//                 }}
//               >
//                 {exerciseAccordion.includes(
//                   exercise._id
//                 ) ? (
//                   <div className='dark:text-duoGrayDark-lightest'>
//                     <span>
//                       EXERCISE
//                       ID
//                       :
//                       {
//                         exercise._id
//                       }
//                     </span>
//                     <div className='flex flex-col'>
//                       <span className='font-bold'>
//                         description
//                       </span>
//                       <span>
//                         {
//                           exercise.description
//                         }
//                       </span>
//                     </div>
//                     <div className='flex flex-col'>
//                       <span className='font-bold'>
//                         difficulty
//                         Level
//                       </span>
//                       <span>
//                         {/* {
//                           exercise.difficultyLevel
//                         } */}
//                         get
//                         from
//                         record
//                       </span>
//                     </div>
//                     {targetsList &&
//                     exercise.relevant !==
//                       undefined &&
//                     exercise
//                       .relevant
//                       .length >
//                       0 ? (
//                       <div className='flex flex-col'>
//                         <span className='text-lg font-extrabold'>
//                           relevant
//                         </span>
//                         <span>
//                           {
//                             targetsList.filter(
//                               (
//                                 target
//                               ) =>
//                                 exercise.relevant
//                                   ? target._id ===
//                                     exercise
//                                       .relevant[0]
//                                   : null
//                             )[0]
//                               .name
//                           }
//                         </span>
//                       </div>
//                     ) : null}
//                     {/* <div className='flex flex-col'>
//                       {exercise.timeBuffers.map(
//                         (
//                           timeBuffer,
//                           timeBufferIndex
//                         ) => (
//                           <div
//                             key={
//                               timeBufferIndex
//                             }
//                           >
//                             {
//                               timeBuffer.timeBuffer
//                             }
//                           </div>
//                         )
//                       )}
//                     </div> */}
//                   </div>
//                 ) : (
//                   <div className='my-1 flex h-fit w-full cursor-pointer items-center justify-between p-2 text-duoGray-darkest hover:rounded-md hover:bg-duoGray-lighter dark:text-duoGrayDark-lightest dark:hover:bg-duoGrayDark-dark'>
//                     <label className='cursor-pointer'>
//                       exercise
//                       #
//                       {exerciseIndex +
//                         1}
//                     </label>
//                     <FontAwesomeIcon
//                       icon={
//                         faChevronDown
//                       }
//                     />
//                   </div>
//                 )}
//               </div>
//             )
//           )
//         : null
//       : null}
