'use client';
import { useMemo, useReducer, useState } from 'react';
import { useRouter } from 'next/navigation';
import pRetry from 'p-retry';
import { useStore } from 'zustand';
import FsaData from './FsaData/page';
import FilesSelection from './FilesSelection/page';
import Pagination from '@/components/Navigation/Pagination/page';
import { useInfoBarStore } from '@/app/store/stores/useInfoBarStore';
import { fsaDataReducer } from '@/reducers/adminView/(create)/fsaDataReducer';
import {
  createExercise,
  ExercisesTypes,
} from '@/app/API/classes-service/exercises/functions';
import { FileTypes } from '@/app/API/files-service/functions';
import { timeBuffersReducer } from '@/reducers/timeBuffersReducer';
import { AlertSizes, useAlertStore } from '@/app/store/stores/useAlertStore';

const CreateFsa: React.FC = () => {
  const components = { Files: FilesSelection, Create: FsaData };

  const router = useRouter();

  const selectedMainTypeId = useStore(
    useInfoBarStore,
    (state) => state.selectedMainTypeId
  );
  const selectedSubTypeId = useStore(
    useInfoBarStore,
    (state) => state.selectedSubTypeId
  );
  const selectedModel = useStore(
    useInfoBarStore,
    (state) => state.selectedModel
  );

  const selectedFile = useStore(useInfoBarStore, (state) => state.selectedFile);

  const addAlert = useAlertStore.getState().addAlert;

  const recordLength = useMemo(() => {
    if (selectedFile) {
      const metadata = selectedFile.metadata as RecordMetadata;
      return metadata.record_length;
    } else return 0;
  }, [selectedFile]);

  console.log('FsaData - recordLength', recordLength);

  const onNext = {
    Files: () => {
      return selectedFile !== null;
    },
    Create: () => {
      return true;
    },
  };

  const initialFsaDataState = {
    description: undefined,
    adminComments: undefined,
    relevant: [],
    unfilledFields: [],
    showPlaceholder: true,
    targetFromDropdown: null,
  };

  const [fsaDataState, fsaDataDispatch] = useReducer(
    fsaDataReducer,
    initialFsaDataState
  );

  const initialTimeBuffersState = {
    rangeIndex: 1,
    timeBuffersScores: [100],
    timeBufferRangeValues: [recordLength ? recordLength / 2 : 10],
    addedValueLeftPerc: -1,
  };

  const [timeBuffersState, timeBuffersDispatch] = useReducer(
    timeBuffersReducer,
    initialTimeBuffersState
  );

  const onSubmit = async () => {
    try {
      if (
        selectedMainTypeId &&
        selectedSubTypeId &&
        selectedModel &&
        selectedFile &&
        selectedFile.name
      ) {
        const timeBuffersArray: TimeBuffersType[] =
          timeBuffersState.timeBufferRangeValues.map((timeBuffer, index) => ({
            timeBuffer,
            grade: timeBuffersState.timeBuffersScores[index] || 0,
          }));
        const exercise = {
          type: ExercisesTypes.FSA,
          adminComments: fsaDataState.adminComments,
          fileRoute: {
            mainId: selectedMainTypeId,
            subTypeId: selectedSubTypeId,
            modelId: selectedModel._id,
            fileType: FileTypes.RECORDS,
            objectName: selectedFile.name,
          },
          description: fsaDataState.description || undefined,
          timeBuffers: timeBuffersArray,
        };
        console.log('createFsa - exercise', exercise);
        const response = await pRetry(() => createExercise(exercise), {
          retries: 5,
        });
        console.log('create fsa - response', response);
        if (response) {
          addAlert('Exercise added successfully', AlertSizes.small);
          router.push('/classroom');
        } else {
          addAlert('Error while createing an exercise', AlertSizes.small);
        }
      } else {
        addAlert('Please select a file', AlertSizes.small);
      }
    } catch (error) {
      console.error(`error while uploading fsa - ${error}`);
    }
  };

  return (
    <Pagination
      components={components}
      onNext={onNext}
      onSubmit={onSubmit}
      subProps={{
        recordLength,
        fsaDataState,
        fsaDataDispatch,
        timeBuffersState,
        timeBuffersDispatch,
      }}
    />
  );
};

export default CreateFsa;
