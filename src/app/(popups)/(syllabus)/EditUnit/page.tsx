'use client';
import { useCallback, useEffect, useReducer } from 'react';
import pRetry from 'p-retry';
import {
  getUnitById,
  updateUnit,
} from '@/app/API/classes-service/units/functions';
import {
  EditUnitAction,
  editUnitReducer,
} from '@/reducers/adminView/(popups)/editUnitReducer';
import Textbox, { FontSizes } from '@/components/Textbox/page';
import DraggbleList, { Diractions } from '@/components/DraggableList/page';
import { draggingAction, draggingReducer } from '@/reducers/dragReducer';
import Button, { ButtonColors } from '@/components/(buttons)/Button/page';
import { AlertSizes, useAlertStore } from '@/app/store/stores/useAlertStore';
import PopupHeader, { PopupSizes } from '../../PopupHeader/page';
import { PopupsTypes } from '@/app/store/stores/usePopupStore';
import { useStore } from 'zustand';
import { useInfoBarStore } from '@/app/store/stores/useInfoBarStore';

const EditUnit: React.FC = () => {
  const addAlert = useAlertStore.getState().addAlert;

  const unitId = useStore(useInfoBarStore, (state) => state.syllabusFieldId);
  const unitIndex = useStore(
    useInfoBarStore,
    (state) => state.syllabusFieldIndex
  );

  const initialUnitDataState = {
    unitId: null,
    description: undefined,
    levels: [],
    suspendedLevels: [],
  };

  useEffect(() => {
    if (unitId) {
      editUnitDispatch({
        type: EditUnitAction.SET_UNIT_ID,
        payload: unitId,
      });
    }
  }, [unitId]);

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
      type: EditUnitAction.SET_LEVELS,
      payload: levelsDraggingState.itemsList.map((item) => item.id),
    });
  }, [levelsDraggingState.itemsList]);

  useEffect(() => {
    setDragLevelsList();
  }, [setDragLevelsList]);

  const fetchUnit = useCallback(async (unitId: string) => {
    try {
      // const response = await getUnitById(unitId);
      const response = await pRetry(() => getUnitById(unitId), {
        retries: 5,
      });
      if (response) {
        editUnitDispatch({
          type: EditUnitAction.SET_DESCRIPTION,
          payload: response.description,
        });

        editUnitDispatch({
          type: EditUnitAction.SET_LEVELS,
          payload: response.levelsIds,
        });
        editUnitDispatch({
          type: EditUnitAction.SET_SUSPENDED_LEVELS,
          payload: response.suspendedLevelsIds,
        });

        levelsDraggingDispatch({
          type: draggingAction.SET_ITEMS_LIST,
          payload: response.levelsIds.map((levelId, levelIndex) => ({
            id: levelId,
            name: `level ${levelIndex + 1}`,
          })),
        });
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    editUnitState.unitId && fetchUnit(editUnitState.unitId);
  }, [editUnitState.unitId, fetchUnit]);

  useEffect(() => {
    console.log('editUnitState', editUnitState);
  }, [editUnitState]);

  const sumbitUpdate = async () => {
    try {
      if (editUnitState.unitId) {
        const updatedUnit = {
          _id: editUnitState.unitId,
          description: editUnitState.description,
          levels: editUnitState.levels,
        };
        //   const res = await updateUnit(updatedUnit);
        const response = await pRetry(() => updateUnit(updatedUnit), {
          retries: 5,
        });
        response
          ? addAlert('updated successfully', AlertSizes.small)
          : addAlert('error upadting unit', AlertSizes.small);
        response ? location.reload() : null;
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <PopupHeader
      popupType={PopupsTypes.EDIT_UNIT}
      size={PopupSizes.MEDIUM}
      header={`Unit no. ${unitIndex + 1}`}
      onClose={() => {}}
    >
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
                type: EditUnitAction.SET_DESCRIPTION,
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
      <section className='absolute bottom-8 left-1/2 mx-auto w-44 flex-none -translate-x-1/2'>
        <Button
          label={'SUBMIT'}
          color={ButtonColors.BLUE}
          onClick={sumbitUpdate}
        />
      </section>
    </PopupHeader>
  );
};

export default EditUnit;
