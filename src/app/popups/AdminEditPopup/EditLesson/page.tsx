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
import Table from '@/components/Table/page';

library.add(faXmark);

interface EditLessonProps {
  lessonId: string;
  lessonIndex: number;

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
      const res = await getAllFSAs();
      console.log('fetch FSA', res);
      editLessonDispatch({ type: editLessonAction.SET_FSAS, payload: res });
    };
    fetchFSA();
  }, []);

  useEffect(() => {
    editLessonState.fsasList.forEach((fsa) => {
      const fsaRecKey = fsa.recordKey;
      
      const tableRow = { answersList: fsa.answersList };
    });
  }, [editLessonState.fsasList]);

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

      <div className='mx-auto mt-16 h-full w-[90%] gap-6'>
        <Table
          headers={headers}
          rows={[
            {
              target: 'a',
              difficultyLevel: 'a',
              isInItalkia: 'a',
              signature_type: 'a',
              isInLessons: 'a',
              sonolist: 'a',
            },
          ]}
          isSelectable={true}
        />
      </div>
    </div>
  );
};

export default EditLesson;
