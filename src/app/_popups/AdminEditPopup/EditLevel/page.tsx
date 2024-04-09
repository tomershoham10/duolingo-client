'use client';
import { useCallback, useEffect, useReducer, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { getLevelById } from '@/app/API/classes-service/levels/functions';
import { draggingAction, draggingReducer } from '@/reducers/dragReducer';
import DraggbleList, { Diractions } from '@/components/DraggableList/page';

library.add(faXmark);

interface EditLevelProps {
  levelId: string;
  levelIndex: number;
  onClose: () => void;
}

const EditLevel: React.FC<EditLevelProps> = (props) => {
  const [levelData, setLevelData] = useState<LevelType | null>(null);

  const initialLessonsDraggingState = {
    grabbedItemId: 'released',
    itemsList: [],
  };

  const [lessonsDraggingState, lessonsDraggingDispatch] = useReducer(
    draggingReducer,
    initialLessonsDraggingState
  );

  const fetchLevel = useCallback(async () => {
    const response = await getLevelById(props.levelId);
    if (response) {
      console.log(response);
      setLevelData(response);
      lessonsDraggingDispatch({
        type: draggingAction.SET_ITEMS_LIST,
        payload: response.lessons.map((lesson, levelIndex) => ({
          id: lesson,
          name: `lesson ${levelIndex + 1}`,
        })),
      });
    }
  }, [props.levelId]);

  // Call fetchLevel when the component mounts or props.levelId changes
  useEffect(() => {
    fetchLevel();
  }, []);

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
      </div>
    </section>
  );
};

export default EditLevel;
