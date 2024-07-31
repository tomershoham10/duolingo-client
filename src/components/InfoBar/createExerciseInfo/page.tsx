'use client';
import { useEffect } from 'react';
import useStore from '@/app/store/useStore';
import { useInfoBarStore } from '@/app/store/stores/useInfoBarStore';
import FileData from '../FileData/page';
import { ExercisesTypes } from '@/app/API/classes-service/exercises/functions';
import SpotreccFiles from './SpotreccFiles/page';

interface CreateExerciseInfoProps {
  exerciseType: ExercisesTypes;
}

const CreateExerciseInfo: React.FC<CreateExerciseInfoProps> = (props) => {
  //   const infoBarStore = {
  const syllabusFieldType = useStore(
    useInfoBarStore,
    (state) => state.syllabusFieldType
  );
  const syllabusFieldId = useStore(
    useInfoBarStore,
    (state) => state.syllabusFieldId
  );
  const selectedFile = useStore(useInfoBarStore, (state) => state.selectedFile);
  //   };

  useEffect(() => {
    selectedFile ? console.log('infobar - selectedFile', selectedFile) : null;
  }, [selectedFile]);

  const regexFilesEnding = new RegExp('.wav|\\.jpg|\\.jpeg', 'g');

  return (
    <>
      {props.exerciseType === ExercisesTypes.SPOTRECC ? (
        <SpotreccFiles />
      ) : !!selectedFile ? (
        <FileData />
      ) : null}
    </>
  );
};

export default CreateExerciseInfo;
