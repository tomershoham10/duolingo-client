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
import { getLessonById, updateLesson } from '@/app/API/classes-service/lessons/functions';
import PopupHeader, { PopupSizes } from '../../PopupHeader/page';
import { PopupsTypes } from '@/app/store/stores/usePopupStore';
import { useStore } from 'zustand';
import { useInfoBarStore } from '@/app/store/stores/useInfoBarStore';
import { useAlertStore, AlertSizes } from '@/app/store/stores/useAlertStore';
import Input, { InputTypes } from '@/components/Input/page';

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
    lesson: undefined,
    name: '',
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

  useEffect(() => {
    console.log('editLessonState.lesson', editLessonState.lesson);
    const fetchLesson = async () => {
      try {
        const lesson = await pRetry(
          () =>
            getLessonById(lessonId),
          {
            retries: 5,
          }
        );
        console.log('fetch lesson', lesson);
        if (lesson) {
          editLessonDispatch({
            type: EditLessonAction.SET_LESSON,
            payload: lesson
          });
          editLessonDispatch({
            type: EditLessonAction.SET_NAME,
            payload: lesson.name
          });
        }
      } catch (err) {
        console.error('fetchExercises error:', err);
      }
    };
    fetchLesson();

  }, [lessonId]);

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


  const addAlert = useAlertStore.getState().addAlert;

  const sumbitUpdate = async () => {
    try {
      if (lessonId) {
        const lessonUpdate = {
          _id: lessonId,
          name: editLessonState.name,
        };
        const response = await pRetry(() => updateLesson(lessonId, lessonUpdate), {
          retries: 5,
        });
        response
          ? addAlert('updated successfully', AlertSizes.small)
          : addAlert('error upadting lesson', AlertSizes.small);
        response ? location.reload() : null;
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <PopupHeader
      popupType={PopupsTypes.EDIT_LESSON}
      size={PopupSizes.MEDIUM}
      header={`${editLessonState?.name}`}
      onClose={() => { }}
    >
      <>
        <p className='col-span-1 flex-none text-lg font-bold text-duoGray-darkest dark:text-duoGrayDark-lightest'>
          Name:
        </p>
        <div className='col-span-3 mx-4 flex flex-none flex-col items-center justify-center'>
          <Input
            type={InputTypes.TEXT}
            placeholder={'Name'}
            value={editLessonState?.name}
            onChange={(text: string) => {
              editLessonDispatch({
                type: EditLessonAction.SET_NAME,
                payload: text,
              });
            }}
          />
        </div>
      </>
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

export default EditLesson;
