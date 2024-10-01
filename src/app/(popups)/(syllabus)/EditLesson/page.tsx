'use client';
import { useCallback, useEffect, useReducer } from 'react';
import pRetry from 'p-retry';
import { getAllExercises } from '@/app/API/classes-service/exercises/functions';
import {
  EditLessonAction,
  editLessonReducer,
} from '@/reducers/adminView/(popups)/editLessonReducer';
import Table from '@/components/Table/page';
import Button, {
  ButtonColors,
  ButtonTypes,
} from '@/components/(buttons)/Button/page';
import { updateLesson } from '@/app/API/classes-service/lessons/functions';
import PopupHeader, { PopupSizes } from '../../PopupHeader/page';
import { PopupsTypes } from '@/app/store/stores/usePopupStore';
import { useStore } from 'zustand';
import { useInfoBarStore } from '@/app/store/stores/useInfoBarStore';

const EditLesson: React.FC = () => {
  const lessonId = useStore(useInfoBarStore, (state) => state.syllabusFieldId);
  const lessonIndex = useStore(
    useInfoBarStore,
    (state) => state.syllabusFieldIndex
  );

  const exercisesList = useStore(
    useInfoBarStore,
    (state) => state.syllabusSubIdsListField
  );

  console.log('EditLesson popup', exercisesList);
  const headers = [
    { key: 'type', label: 'exercise type' },
    { key: 'dateCreated', label: 'date created' },
  ];

  const initialEditLessonState = {
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
      try {
        const res = await pRetry(getAllExercises, {
          retries: 5,
        });
        console.log('fetch exercises', res);
        editLessonDispatch({
          type: EditLessonAction.SET_TABLE_DATA,
          payload: res,
        });
        editLessonDispatch({
          type: EditLessonAction.SET_EXERCISES,
          payload: res,
        });
      } catch (err) {
        console.error('fetchExercises error:', err);
      }
    };
    fetchExercises();
  }, []);

  useEffect(() => {
    console.log('editLessonState.tableData', editLessonState.tableData);
  }, [editLessonState.tableData]);

  const addExerciseToLesson = useCallback(async () => {
    try {
      if (lessonId && editLessonState.selectedExercise) {
        const status = await pRetry(
          () =>
            updateLesson(lessonId, {
              exercisesIds: [
                ...exercisesList!,
                editLessonState.selectedExercise!,
              ],
            }),
          {
            retries: 5,
          }
        );
        alert(status);
      }
    } catch (err) {
      console.error('addExerciseToLesson error:', err);
    }
  }, [editLessonState.selectedExercise, exercisesList, lessonId]);

  return (
    <PopupHeader
      popupType={PopupsTypes.EDIT_LESSON}
      size={PopupSizes.MEDIUM}
      header={`lesson no. ${lessonIndex + 1}`}
      onClose={() => {}}
    >
      <p className='mb-2 text-xl font-bold'>Add an exercise:</p>
      <Table
        headers={editLessonState.tableHeaders}
        rows={editLessonState.tableData}
        onSelect={(row) => {
          console.log(row._id);
          editLessonDispatch({
            type: EditLessonAction.SET_SELECTED_EXERCISES,
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
        isLoading={false}
      />
      <div className='mx-auto mt-4 w-32'>
        <Button
          label={'Add exercise'}
          buttonType={ButtonTypes.SUBMIT}
          color={ButtonColors.BLUE}
          onClick={addExerciseToLesson}
        />
      </div>
    </PopupHeader>
  );
};

export default EditLesson;
