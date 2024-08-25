'use client';
import { useCallback, useEffect, useReducer, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import {
  getLevelById,
  updateLevel,
} from '@/app/API/classes-service/levels/functions';
import { draggingAction, draggingReducer } from '@/reducers/dragReducer';
import DraggbleList, { Diractions } from '@/components/DraggableList/page';
import Button, { ButtonColors } from '@/components/Button/page';
import { useAlertStore } from '@/app/store/stores/useAlertStore';
import pRetry from 'p-retry';

library.add(faXmark);

interface EditLevelProps {
  levelId: string;
  levelIndex: number;
  onClose: () => void;
}

const EditLevel: React.FC<EditLevelProps> = (props) => {
  //   const [levelData, setLevelData] = useState<LevelType | null>(null);
  const addAlert = useAlertStore.getState().addAlert;

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
      const response = await pRetry(() => getLevelById(props.levelId), {
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
    } catch (err) {
      console.error('fetchLevel error:', err);
    }
  }, [props.levelId]);

  useEffect(() => {
    fetchLevel();
  }, [fetchLevel, props.levelId]);

  const sumbitUpdate = useCallback(async () => {
    try {
      const updatedLevel = {
        _id: props.levelId,
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
  }, [addAlert, lessonsDraggingState.itemsList, props.levelId]);

  return (
    <section className='relative m-5 flex h-[15rem] w-[40rem] rounded-md bg-white p-5 dark:bg-duoGrayDark-darkest xl:h-[20rem] xl:w-[55rem] 2xl:h-[30rem] 2xl:w-[78.5rem] 3xl:h-[30rem] 3xl:w-[110rem]'>
      <button
        onClick={props.onClose}
        className='absolute z-50 h-fit w-fit flex-none rounded-md text-duoGray-dark'
      >
        <FontAwesomeIcon className='fa-lg fa-solid flex-none' icon={faXmark} />
      </button>

      <div className='absolute left-0 flex h-10 w-full justify-center border-b-2 dark:border-duoBlueDark-text'>
        <span className='text-xl font-extrabold tracking-widest text-duoGray-dark dark:text-duoBlueDark-text'>
          level #{props.levelIndex + 1}
        </span>
      </div>

      <div className='mt-16 flex h-full w-full flex-col gap-6 px-4'>
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
      </div>
    </section>
  );
};

export default EditLevel;
