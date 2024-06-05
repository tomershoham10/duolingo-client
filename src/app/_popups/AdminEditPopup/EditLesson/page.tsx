'use client';
import { useEffect, useReducer } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { getAllFSAs } from '@/app/API/classes-service/exercises/FSA/functions';
import {
  editLessonAction,
  editLessonReducer,
  editLessonType,
} from '@/reducers/adminEditPopup/editLessonReducer';
import Table, { TableRow } from '@/components/Table/page';
import {
  BUCKETS_NAMES,
  getFileMetadataByETag,
} from '@/app/API/files-service/functions';
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
  const headers = [
    { key: 'answersList', label: 'target name' },
    { key: 'difficultyLevel', label: 'difficulty level' },
    { key: 'isInItalkia', label: 'is in italkia' },
    { key: 'signature_type', label: 'signature type' },
    { key: 'isInLessons', label: 'is in other lessons' },
    { key: 'sonolist', label: 'sonolist' },
  ];

  const initialEditLessonState: editLessonType = {
    fsasList: [],
    selectedFSA: undefined,
    tableHeaders: headers,
    tableData: [],
  };

  const [editLessonState, editLessonDispatch] = useReducer(
    editLessonReducer,
    initialEditLessonState
  );

  useEffect(() => {
    const fetchFSA = async () => {
      //   const res = await getAllFSAs();

      const res = await pRetry(getAllFSAs, {
        retries: 5,
      });
      console.log('fetch FSA', res);
      editLessonDispatch({ type: editLessonAction.SET_FSAS, payload: res });
    };
    fetchFSA();
  }, []);

  useEffect(() => {
    const fetchRecords = async () => {
      const fetchPromises = editLessonState.fsasList.map(async (fsa) => {
        try {
          const fsaRecName = fsa.recordName;
          console.log('fsa loop - fsaRecName', fsaRecName);

          const recData = (await pRetry(
            () => getFileMetadataByETag(BUCKETS_NAMES.RECORDS, fsaRecName),
            {
              retries: 5,
            }
          )) as {
            name: string;
            id: string;
            metadata: Partial<RecordMetadataType>;
          };
          //   const recData = (await getFileMetadataByETag(
          //     'records',
          //     fsaRecName
          //   )) as {
          //     name: string;
          //     id: string;
          //     metadata: Partial<RecordMetadataType>;
          //   };

          //   const recData = (await getFileMetadataByETag(
          //     'records',
          //     fsaRecName
          //   )) as {
          //     name: string;
          //     id: string;
          //     metadata: Partial<RecordMetadataType>;
          //   };
          console.log('recData', recData);
          if (!recData) {
            return null;
          }
          const newRow = {
            _id: fsa._id,
            answersList: fsa.answersList,
            difficultyLevel: recData.metadata.difficulty_level,
            is_in_italy: recData.metadata.is_in_italy,
            signature_type: recData.metadata.signature_type,
            sonolist: recData.metadata.sonograms_ids,
          };
          console.log('newRow', newRow);
          return newRow;
        } catch (error) {
          console.error('Error fetching record:', error);
          return null;
        }
      });
      const tableRows = await Promise.all(fetchPromises);
      const filteredRows = tableRows.filter(
        (row) => row !== null
      ) as TableRow[];
      editLessonDispatch({
        type: editLessonAction.SET_TABLE_DATA,
        payload: filteredRows,
      });
    };
    if (editLessonState.fsasList.length > 0) {
      fetchRecords();
    }
  }, [editLessonState.fsasList]);

  useEffect(() => {
    console.log('editLessonState.tableData', editLessonState.tableData);
  }, [editLessonState.tableData]);

  const addFsaToLesson = async () => {
    // if (!!editLessonState.selectedFSA) {
    const status = await pRetry(
      () =>
        !!editLessonState.selectedFSA
          ? updateLesson(props.lessonId, {
              exercises: [...props.exercisesList, editLessonState.selectedFSA],
            })
          : null,
      {
        retries: 5,
      }
    );
    //   const status = await updateLesson(props.lessonId, {
    //     exercises: [...props.exercisesList, editLessonState.selectedFSA],
    //   });
    alert(status);
    // }
  };

  return (
    <div className='relative m-5 flex h-[30rem] w-[40rem] rounded-md bg-white p-5 dark:bg-duoGrayDark-darkest xl:h-[35rem] xl:w-[55rem] 2xl:h-[50rem] 2xl:w-[78.5rem] 3xl:h-[70rem] 3xl:w-[110rem]'>
      <button
        onClick={props.onClose}
        className='absolute z-50 h-fit w-fit flex-none rounded-md text-duoGray-dark'
      >
        <FontAwesomeIcon className='fa-lg fa-solid flex-none' icon={faXmark} />
      </button>
      <div className='absolute left-0 flex h-10 w-full justify-center border-b-2 dark:border-duoBlueDark-text'>
        <span className='text-xl font-extrabold tracking-widest text-duoGray-dark dark:text-duoBlueDark-text'>
          lesson #{props.lessonIndex + 1}
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
              type: editLessonAction.SET_SELECTED_FSA,
              payload: row._id,
            });
          }}
          selectedRowIndex={
            !!editLessonState.selectedFSA
              ? editLessonState.fsasList
                  .map((fsa) => fsa._id)
                  .indexOf(editLessonState.selectedFSA)
              : undefined
          }
        />
        <div className='mx-auto mt-4 w-32'>
          <Button
            label={'Add exercise'}
            buttonType={ButtonTypes.SUBMIT}
            color={ButtonColors.BLUE}
            onClick={addFsaToLesson}
          />
        </div>
      </div>
    </div>
  );
};

export default EditLesson;
