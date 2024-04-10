'use client';
import { useCallback, useEffect, useReducer } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { getUnitById } from '@/app/API/classes-service/units/functions';
import {
  editUnitAction,
  editUnitReducer,
} from '@/reducers/adminEditPopup/editUnitReducer';
import Textbox, { FontSizes } from '@/components/Textbox/page';
import DraggbleList, { Diractions } from '@/components/DraggableList/page';
import { draggingAction, draggingReducer } from '@/reducers/dragReducer';
import Button, { ButtonColors } from '@/components/Button/page';
import { AlertSizes, useAlertStore } from '@/app/store/stores/useAlertStore';

library.add(faXmark);

interface EditUnitProps {
  unitId: string;
  unitIndex: number;
  onClose: () => void;
}

const EditUnit: React.FC<EditUnitProps> = (props) => {
  const addAlert = useAlertStore.getState().addAlert;
  const initialUnitDataState = {
    unitId: props.unitId,
    description: undefined,
    levels: [],
    suspendedLevels: [],
  };

  const initialLevelsDraggingState = {
    grabbedItemId: 'released',
    itemsList: [],
  };

  const [editUnitState, editUnitDispatch] = useReducer(
    editUnitReducer,
    initialUnitDataState
  );

  const [levelsDraggingState, levelsDraggingDispatch] = useReducer(
    draggingReducer,
    initialLevelsDraggingState
  );

  const setDragLevelsList = useCallback(() => {
    editUnitDispatch({
      type: editUnitAction.SET_LEVELS,
      payload: levelsDraggingState.itemsList.map((item) => item.id),
    });
  }, [levelsDraggingState.itemsList]);

  useEffect(() => {
    setDragLevelsList();
  }, [setDragLevelsList]);

  const fetchUnit = useCallback(
    async (unitId: string) => {
      try {
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

          levelsDraggingDispatch({
            type: draggingAction.SET_ITEMS_LIST,
            payload: response.levels.map((level, levelIndex) => ({
              id: level,
              name: `level ${levelIndex + 1}`,
            })),
          });
        }
      } catch (err) {
        console.error(err);
      }
    },
    [editUnitState.unitId]
  );

  useEffect(() => {
    fetchUnit(editUnitState.unitId);
  }, [editUnitState.unitId]);

  useEffect(() => {
    console.log('editUnitState', editUnitState);
  }, [editUnitState]);

  return (
    <section className='relative m-5 flex h-[30rem] w-[40rem] rounded-md bg-white p-5 dark:bg-duoGrayDark-darkest xl:h-[35rem] xl:w-[55rem] 2xl:h-[50rem] 2xl:w-[78.5rem] 3xl:h-[70rem] 3xl:w-[110rem]'>
      <button
        onClick={props.onClose}
        className='absolute z-50 h-fit w-fit flex-none rounded-md text-duoGray-dark'
      >
        <FontAwesomeIcon className='fa-lg fa-solid flex-none' icon={faXmark} />
      </button>

      <div className='absolute left-0 flex h-10 w-full justify-center border-b-2 dark:border-duoBlueDark-text'>
        <span className='text-xl font-extrabold tracking-widest text-duoGray-dark dark:text-duoBlueDark-text'>
          Unit #{props.unitIndex + 1}
        </span>
      </div>

      <div className='mt-16 flex h-full w-full flex-col gap-6 px-4'>
        <section className='flex h-32 w-full flex-row gap-6'>
          <p className='text-xl font-bold'>Description:</p>
          <section className='h-full w-full'>
            <Textbox
              isEditMode={false}
              fontSizeProps={FontSizes.MEDIUM}
              placeHolder={'Add desription...'}
              value={editUnitState.description}
              onChange={(text: string) => {
                editUnitDispatch({
                  type: editUnitAction.SET_DESCRIPTION,
                  payload: text,
                });
              }}
            />
          </section>
        </section>
        <section className='flex h-32 w-full flex-col gap-2'>
          {/* <div className='flex flex-row items-center justify-start'> */}
          <p className='text-xl font-bold'>Levels list:</p>
          {/* </div> */}
          <DraggbleList
            items={levelsDraggingState.itemsList}
            isDisabled={false}
            draggingState={levelsDraggingState}
            draggingDispatch={levelsDraggingDispatch}
            diraction={Diractions.ROW}
          />
        </section>
        <Button
          label={'SUBMIT'}
          color={ButtonColors.BLUE}
          onClick={() => {
            addAlert('try', AlertSizes.small);
          }}
          style={
            'w-44 flex-none mt-[] mx-auto flex justify-center items-cetnter'
          }
        />
      </div>
    </section>
  );
};

export default EditUnit;
