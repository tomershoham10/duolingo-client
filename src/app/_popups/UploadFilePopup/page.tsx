'use client';

import { lazy, useCallback, useReducer, useState } from 'react';
import pRetry from 'p-retry';
import PopupHeader from '../PopupHeader/page';
import { PopupsTypes } from '@/app/store/stores/usePopupStore';
import { ExercisesTypes } from '@/app/API/classes-service/exercises/functions';
import { BucketsNames, uploadFile } from '@/app/API/files-service/functions';
import { useAlertStore } from '@/app/store/stores/useAlertStore';
import Button, { ButtonColors, ButtonTypes } from '@/components/Button/page';
import {
  submitFileAction,
  submitFileDataType,
  submitFileReducer,
} from '@/reducers/adminPopups/submitFileReducer';
import { isRecordMetadata } from '@/app/utils/functions/filesMetadata/functions';

const UploadFileSection = lazy(() => import('./UploadFileSection/page'));
const FSAMetadata = lazy(() => import('./Metadatas/Records/FSA/page'));
const FSASonogramMetadata = lazy(() => import('./Metadatas/Images/FSA/page'));
const SoptreccRecordMetadata = lazy(
  () => import('./Metadatas/Records/Spotrecc/page')
);
const SpotreccImageMetadata = lazy(
  () => import('./Metadatas/Images/Spotrecc/page')
);

const UploadFilePopup: React.FC = () => {
  const addAlert = useAlertStore.getState().addAlert;

  const [inMetadataPage, setInMetadataPage] = useState<boolean>(false);

  const initialsubmitFileState: submitFileDataType = {
    file: null,
    fileType: null,
    exerciseType: null,
    metadata: {},

    // file: { metadata: {} },
    // fileType: null,
  };

  const [submitFileState, submitFileDispatch] = useReducer(
    submitFileReducer,
    initialsubmitFileState
  );

  const handleExerciseType = useCallback((value: string) => {
    submitFileDispatch({
      type: submitFileAction.SET_EXERCISE_TYPE,
      payload: value as ExercisesTypes,
    });
  }, []);

  const handleFileType = useCallback((value: string) => {
    submitFileDispatch({
      type: submitFileAction.SET_FILE_TYPE,
      payload: value as BucketsNames,
    });
  }, []);

  const handleFileChange = useCallback((files: File | File[] | null) => {
    // if (Array.isArray(files)) {
    submitFileDispatch({
      type: submitFileAction.SET_FILE,
      payload: Array.isArray(files)
        ? files[0] !== null
          ? files[0]
          : null
        : files !== null
          ? files
          : null,
    });
  }, []);

  const handleFileLength = useCallback((time: number | null) => {
    console.log('file length:', time);
    if (!!time) {
      //   setRecordLength(time);
      submitFileDispatch({
        type: submitFileAction.UPDATE_METADATA,
        payload: { record_length: time },
      });
    }
  }, []);

  const handleFileRemoved = useCallback(() => {
    submitFileDispatch({
      type: submitFileAction.REMOVE_FILE,
    });
  }, []);

  const nextPage = useCallback(() => {
    setInMetadataPage(true);
  }, []);
  const prevPage = useCallback(() => {
    submitFileDispatch({
      type: submitFileAction.REMOVE_FILE,
    });
    setInMetadataPage(false);
  }, []);

  const uploadRecord = useCallback(async () => {
    try {
      if (
        submitFileState.fileType &&
        submitFileState.exerciseType &&
        submitFileState.file
      ) {
        const status = await pRetry(
          () =>
            submitFileState.fileType &&
            submitFileState.exerciseType &&
            submitFileState.file
              ? uploadFile(
                  submitFileState.fileType,
                  submitFileState.exerciseType,
                  submitFileState.file,
                  submitFileState.metadata
                )
              : null,
          {
            retries: 5,
          }
        );

        if (status) {
          addAlert(
            'uploaded record and sonolist successfully',
            AlertSizes.small
          );
        }
      }
    } catch (error) {
      console.error(error);
      addAlert(`error while uploading file: ${error}`, AlertSizes.small);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitFileState.file, submitFileState.fileType]);

  const metadataComponents = {
    [ExercisesTypes.FSA]: {
      [BucketsNames.RECORDS]: FSAMetadata,
      [BucketsNames.IMAGES]: FSASonogramMetadata,
    },
    [ExercisesTypes.SPOTRECC]: {
      [BucketsNames.RECORDS]: SoptreccRecordMetadata,
      [BucketsNames.IMAGES]: SpotreccImageMetadata,
    },
  };
  const MetadataComponent =
    inMetadataPage && submitFileState.exerciseType && submitFileState.fileType
      ? metadataComponents[submitFileState.exerciseType]?.[
          submitFileState.fileType
        ]
      : null;

  return (
    <PopupHeader popupType={PopupsTypes.UPLOAD_RECORD} header='Upload file'>
      {!inMetadataPage ? (
        <UploadFileSection
          handleExerciseType={handleExerciseType}
          handleFileType={handleFileType}
        />
      ) : MetadataComponent &&
        submitFileState.exerciseType &&
        submitFileState.file ? (
        <MetadataComponent
          file={submitFileState.file}
          fileType={submitFileState.fileType || BucketsNames.RECORDS}
          handleFileChange={handleFileChange}
          handleFileRemoved={handleFileRemoved}
          handleFileLength={handleFileLength}
          exerciseType={submitFileState.exerciseType}
          updateMetadata={(val) => {
            submitFileDispatch({
              type: submitFileAction.UPDATE_METADATA,
              payload: val,
            });
          }}
        />
      ) : null}
      <section className='flex w-full flex-row justify-between'>
        <Button
          label={'Back'}
          buttonType={ButtonTypes.SUBMIT}
          color={ButtonColors.WHITE}
          onClick={prevPage}
        />
        <Button
          label={inMetadataPage ? 'Upload' : 'Add metadata'}
          buttonType={ButtonTypes.SUBMIT}
          color={
            inMetadataPage && submitFileState.file
              ? submitFileState.file.name
                ? ButtonColors.BLUE
                : ButtonColors.GRAY
              : ButtonColors.BLUE
          }
          loadingLabel={'Uploading...'}
          onClick={() => {
            inMetadataPage ? nextPage() : uploadRecord();
          }}
        />
      </section>
    </PopupHeader>
  );
};

export default UploadFilePopup;
