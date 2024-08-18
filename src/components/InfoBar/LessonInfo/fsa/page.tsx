import { Dispatch } from 'react';
import DraggbleList, { Diractions } from '@/components/DraggableList/page';
import { DraggingAction, draggingType } from '@/reducers/dragReducer';
import { TargetToSubmitType } from '@/reducers/studentView/lessonReducer';
import { FaCopy } from 'react-icons/fa';

interface FsaInfoBarProps {
  zipPassword: number | null;
  targetsToSubmit: TargetToSubmitType[];
  targetsDraggingState: draggingType | null;
  targetsDraggingDispatch: Dispatch<DraggingAction>;
}

const FsaInfoBar: React.FC<FsaInfoBarProps> = (props) => {
  const {
    zipPassword,
    targetsToSubmit,
    targetsDraggingState,
    targetsDraggingDispatch,
  } = props;
  return (
    <section className='flex w-full flex-row items-center justify-center gap-3'>
      <p className='text-base font-extrabold opacity-75'>Password:</p>
      <button
        className='flex flex-row items-center gap-1 leading-5 opacity-75 hover:opacity-95'
        onClick={() => {
          zipPassword
            ? navigator.clipboard.writeText(zipPassword.toString())
            : null;
        }}
      >
        <FaCopy />
        <p>{zipPassword}</p>
      </button>
      {targetsDraggingState && targetsToSubmit.length > 0 ? (
        <div className='mx-auto w-full'>
          <DraggbleList
            items={targetsDraggingState.itemsList}
            isDisabled={false}
            draggingState={targetsDraggingState}
            draggingDispatch={targetsDraggingDispatch}
            diraction={Diractions.COL}
          />
        </div>
      ) : null}
    </section>
  );
};

export default FsaInfoBar;
