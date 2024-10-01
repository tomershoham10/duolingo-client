'use client';
import { useCallback, useEffect, useReducer } from 'react';
import {
  getLevelById,
  updateLevel,
} from '@/app/API/classes-service/levels/functions';
import { draggingAction, draggingReducer } from '@/reducers/dragReducer';
import DraggbleList, { Diractions } from '@/components/DraggableList/page';
import Button, { ButtonColors } from '@/components/(buttons)/Button/page';
import { useAlertStore } from '@/app/store/stores/useAlertStore';
import pRetry from 'p-retry';
import { useStore } from 'zustand';
import { useInfoBarStore } from '@/app/store/stores/useInfoBarStore';
import PopupHeader, { PopupSizes } from '../../PopupHeader/page';
import { PopupsTypes } from '@/app/store/stores/usePopupStore';

const EditLevel: React.FC = () => {
  const addAlert = useAlertStore.getState().addAlert;

  const levelId = useStore(useInfoBarStore, (state) => state.syllabusFieldId);
  const levelIndex = useStore(
    useInfoBarStore,
    (state) => state.syllabusFieldIndex
  );

  const initialLessonsDraggingState = {
    grabbedItemId: 'released',
    itemsList: [],
  };

  const [lessonsDraggingState, lessonsDraggingDispatch] = useReducer(
    draggingReducer,
    initialLessonsDraggingState
  );

  useEffect(() => {
    lessonsDraggingState;
  }, [lessonsDraggingState]);

  const fetchLevel = useCallback(async () => {
    try {
      if (levelId) {
        const response = await pRetry(() => getLevelById(levelId!), {
          retries: 5,
        });
        if (response) {
          console.log(response);
          lessonsDraggingDispatch({
            type: draggingAction.SET_ITEMS_LIST,
            payload: response.lessonsIds.map((lessonId, levelIndex) => ({
              id: lessonId,
              name: `lesson ${levelIndex + 1}`,
            })),
          });
        }
      }
    } catch (err) {
      console.error('fetchLevel error:', err);
    }
  }, [levelId]);

  useEffect(() => {
    fetchLevel();
  }, [fetchLevel, levelId]);

  const sumbitUpdate = useCallback(async () => {
    try {
      const updatedLevel = {
        _id: levelId,
        lessons: lessonsDraggingState.itemsList.map((item) => item.id),
      };
      //   const res = await updateLevel(updatedLevel);
      const res = await pRetry(() => updateLevel(updatedLevel), {
        retries: 5,
      });
      res
        ? addAlert('updated successfully', AlertSizes.small)
        : addAlert('error upadting unit', AlertSizes.small);
      res ? location.reload() : null;
    } catch (err) {
      console.error('sumbitUpdate error: ', err);
    }
  }, [addAlert, lessonsDraggingState.itemsList, levelId]);

  return (
    <PopupHeader
      popupType={PopupsTypes.EDIT_LEVEL}
      size={PopupSizes.MEDIUM}
      header={`level no. ${levelIndex + 1}`}
      onClose={() => {}}
    >
      <DraggbleList
        items={lessonsDraggingState.itemsList}
        isDisabled={false}
        draggingState={lessonsDraggingState}
        draggingDispatch={lessonsDraggingDispatch}
        diraction={Diractions.ROW}
      />
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

export default EditLevel;
