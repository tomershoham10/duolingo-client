'use client';
import { useEffect } from 'react';
import useStore from '@/app/store/useStore';
import { useInfoBarStore } from '@/app/store/stores/useInfoBarStore';
import { FaRegImages } from 'react-icons/fa';
import Link from 'next/link';
import { formatNumberToMinutes } from '@/app/utils/functions/formatNumberToMinutes';
import FileData from '../FileData/page';

const CreateExerciseInfo: React.FC = () => {
  const infoBarStore = {
    syllabusFieldType: useStore(
      useInfoBarStore,
      (state) => state.syllabusFieldType
    ),
    syllabusFieldId: useStore(
      useInfoBarStore,
      (state) => state.syllabusFieldId
    ),
    selectedFile: useStore(useInfoBarStore, (state) => state.selectedFile),
  };

  useEffect(() => {
    infoBarStore.selectedFile
      ? console.log('infobar - selectedFile', infoBarStore.selectedFile)
      : null;
  }, [infoBarStore.selectedFile]);
  const regexFilesEnding = new RegExp('.wav|\\.jpg|\\.jpeg', 'g');

  return <>{!!infoBarStore.selectedFile ? <FileData /> : null}</>;
};

export default CreateExerciseInfo;
