'use client';
import { useEffect, useReducer } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { getAllExercises } from '@/app/API/classes-service/exercises/functions';
import {
  editLessonAction,
  editLessonReducer,
  editLessonType,
} from '@/reducers/adminView/popups/editLessonReducer';
import Table from '@/components/Table/page';
import Button, { ButtonColors, ButtonTypes } from '@/components/Button/page';
import { updateLesson } from '@/app/API/classes-service/lessons/functions';
import pRetry from 'p-retry';

library.add(faXmark);

interface EditLessonProps {
  lessonId: string;
  lessonIndex: number;
  exercisesList: string[];

  onClose: () => void;
}

const EditLesson: React.FC<EditLessonProps> = (props) => {
  const { lessonId, lessonIndex, exercisesList, onClose } = props;
  console.log('EditLesson popup', exercisesList);
  const headers = [
    { key: 'type', label: 'exercise type' },
    { key: 'dateCreated', label: 'date created' },
  ];

  const initialEditLessonState: editLessonType = {
    exercisesList: [],
    selectedExercise: undefined,
    tableHeaders: headers,
    tableData: [],
  };

  const [editLessonState, editLessonDispatch] = useReducer(
    editLessonReducer,
    initialEditLessonState
  );

  useEffect(() => {
    const fetchExercises = async () => {
      const res = await pRetry(getAllExercises, {
        retries: 5,
      });
      console.log('fetch exercises', res);
      editLessonDispatch({
        type: editLessonAction.SET_TABLE_DATA,
        payload: res,
      });
      editLessonDispatch({
        type: editLessonAction.SET_EXERCISES,
        payload: res,
      });
    };
    fetchExercises();
  }, []);

  useEffect(() => {
    console.log('editLessonState.tableData', editLessonState.tableData);
  }, [editLessonState.tableData]);

  const addExerciseToLesson = async () => {
    const status = await pRetry(
      () =>
        !!editLessonState.selectedExercise
          ? updateLesson(lessonId, {
              exercisesIds: [
                ...exercisesList,
                editLessonState.selectedExercise,
              ],
            })
          : null,
      {
        retries: 5,
      }
    );
    alert(status);
  };

  return (
    <div className='relative m-5 flex h-[30rem] w-[40rem] rounded-md bg-white p-5 dark:bg-duoGrayDark-darkest xl:h-[35rem] xl:w-[55rem] 2xl:h-[50rem] 2xl:w-[78.5rem] 3xl:h-[70rem] 3xl:w-[110rem]'>
      <button
        onClick={onClose}
        className='absolute z-50 h-fit w-fit flex-none rounded-md text-duoGray-dark'
      >
        <FontAwesomeIcon className='fa-lg fa-solid flex-none' icon={faXmark} />
      </button>
      <div className='absolute left-0 flex h-10 w-full justify-center border-b-2 dark:border-duoBlueDark-text'>
        <span className='text-xl font-extrabold tracking-widest text-duoGray-dark dark:text-duoBlueDark-text'>
          lesson #{lessonIndex + 1}
        </span>
      </div>
      <div className='mx-auto mt-16 h-[25rem] w-[90%]'>
        <p className='mb-2 text-xl font-bold'>Add an exercise:</p>
        <Table
          headers={editLessonState.tableHeaders}
          rows={editLessonState.tableData}
          onSelect={(row) => {
            console.log(row._id);
            editLessonDispatch({
              type: editLessonAction.SET_SELECTED_EXERCISES,
              payload: row._id,
            });
          }}
          selectedRowIndex={
            !!editLessonState.selectedExercise
              ? editLessonState.exercisesList
                  .map((exercise) => exercise._id)
                  .indexOf(editLessonState.selectedExercise)
              : undefined
          }
        />
        <div className='mx-auto mt-4 w-32'>
          <Button
            label={'Add exercise'}
            buttonType={ButtonTypes.SUBMIT}
            color={ButtonColors.BLUE}
            onClick={addExerciseToLesson}
          />
        </div>
      </div>
    </div>
  );
};

export default EditLesson;
