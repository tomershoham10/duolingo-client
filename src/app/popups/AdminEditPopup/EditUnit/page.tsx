'use client';
import { useEffect, useReducer } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { getUnitById } from '@/app/API/classes-service/units/functions';
import {
  editUnitAction,
  editUnitReducer,
} from '@/reducers/adminEditPopup/editUnitReducer';

library.add(faXmark);

interface EditUnitProps {
  unitId: string;
  unitIndex: number;
  onClose: () => void;
}

const EditUnit: React.FC<EditUnitProps> = (props) => {
  const initialUnitDataState = {
    unitId: props.unitId,
    description: undefined,
    levels: [],
    suspendedLevels: [],
  };

  const [editUnitState, editUnitDispatch] = useReducer(
    editUnitReducer,
    initialUnitDataState
  );

  useEffect(() => {
    const fetchUnit = async (unitId: string) => {
      const response = await getUnitById(unitId);
      if (response) {
        editUnitDispatch({
          type: editUnitAction.SET_DESCRIPTION,
          payload: response.description,
        });
        editUnitDispatch({
          type: editUnitAction.SET_LEVELS,
          payload: response.levels,
        });
        editUnitDispatch({
          type: editUnitAction.SET_SUSPENDED_LEVELS,
          payload: response.suspendedLevels,
        });
      }
    };

    fetchUnit(editUnitState.unitId);
  }, [editUnitState.unitId]);

  useEffect(() => {
    console.log('editUnitState', editUnitState);
  }, [editUnitState]);

  return (
    <section className='relative m-5 flex h-[30rem] w-[40rem] rounded-md bg-white p-5 dark:bg-duoGrayDark-darkest xl:h-[35rem] xl:w-[55rem] 2xl:h-[50rem] 2xl:w-[78.5rem] 3xl:h-[70rem] 3xl:w-[110rem]'>
      <button
        onClick={props.onClose}
        className='z-50 h-fit w-fit flex-none rounded-md text-duoGray-dark'
      >
        <FontAwesomeIcon className='fa-lg fa-solid flex-none' icon={faXmark} />
      </button>
      <div className='absolute left-0 flex h-10 w-full justify-center border-b-2 dark:border-duoBlueDark-text'>
        <span className='text-xl font-extrabold tracking-widest text-duoGray-dark dark:text-duoBlueDark-text'>
          Unit #{props.unitIndex + 1}
        </span>
      </div>
      <div className='mt-12 w-full'>
        <p>description:</p>
      </div>
    </section>
  );
};

export default EditUnit;
