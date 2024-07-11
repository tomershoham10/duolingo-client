'use client';
import { PopupsTypes, usePopupStore } from '@/app/store/stores/usePopupStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { ExercisesTypes } from '@/app/API/classes-service/exercises/functions';
import { RecordMetaEditProps } from '../page';
library.add(faXmark);

const SpotreccRecMetaPopup: React.FC<RecordMetaEditProps> = (props) => {
  const updateSelectedPopup = usePopupStore.getState().updateSelectedPopup;
  return (
    <>
      <button
        onClick={() => {
          updateSelectedPopup(PopupsTypes.CLOSED);
        }}
        className='z-50 h-fit w-fit flex-none rounded-md text-duoGray-dark'
      >
        <FontAwesomeIcon className='fa-lg fa-solid flex-none' icon={faXmark} />
      </button>
      <div className='w-full items-start justify-start'>
        <div className='absolute left-0 flex h-10 w-full justify-center border-b-2 text-xl font-extrabold dark:border-duoBlueDark-text 3xl:h-12 3xl:text-2xl'>
          Add Metadata - {ExercisesTypes.SPOTRECC.toLocaleUpperCase()}
        </div>
      </div>
    </>
  );
};

export default SpotreccRecMetaPopup;
