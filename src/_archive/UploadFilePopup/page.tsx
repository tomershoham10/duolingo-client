'use client';

import { lazy, useCallback, useEffect, useReducer, useState } from 'react';
import pRetry from 'p-retry';
import PopupHeader, { PopupSizes } from '../PopupHeader/page';
import { PopupsTypes } from '@/app/store/stores/usePopupStore';
import { ExercisesTypes } from '@/app/API/classes-service/exercises/functions';
import { BucketsNames, uploadFile } from '@/app/API/files-service/functions';
import { AlertSizes, useAlertStore } from '@/app/store/stores/useAlertStore';
import Button, { ButtonColors, ButtonTypes } from '@/components/Button/page';
import {
  submitFileAction,
  submitFileDataType,
  submitFileReducer,
} from '@/reducers/adminView/(popups)/submitFileReducer';

const UploadFileSection = lazy(() => import('./UploadFileSection/page'));
const FSAMetadata = lazy(() => import('./Metadatas/Records/FSA/page'));
const FSASonogramMetadata = lazy(() => import('./Metadatas/Images/FSA/page'));
const SoptreccRecordMetadata = lazy(
  () => import('./Metadatas/Records/Spotrecc/page')
);
const SpotreccImageMetadata = lazy(
  () => import('./Metadatas/Images/Spotrecc/page')
);

// interface MetadataComponentProps {
//   file: File | null;
//   metadata: Partial<Metadata>; // Or use a union of all possible types if more specific
//   fileType: string;
//   handleFileChange: () => void;
//   handleFileRemoved: () => void;
//   handleFileLength: () => void;
//   exerciseType: string;
//   updateMetadata: (val: Partial<Metadata>) => void; // Adjust the type accordingly
// }

const UploadFilePopup: React.FC = () => {
  const addAlert = useAlertStore.getState().addAlert;

  const [inMetadataPage, setInMetadataPage] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const initialsubmitFileState: submitFileDataType = {
    file: null,

    mainId: null,
    subtypeId: null,
    modelId: null,

    fileType: null,
    metadata: {},
  };

  const [submitFileState, submitFileDispatch] = useReducer(
    submitFileReducer,
    initialsubmitFileState
  );

  //   const handleExerciseType = useCallback((value: string) => {
  //     submitFileDispatch({
  //       type: submitFileAction.SET_EXERCISE_TYPE,
  //       payload: value as ExercisesTypes,
  //     });
  //   }, []);

  const handleFileType = useCallback((value: string) => {
    submitFileDispatch({
      type: submitFileAction.SET_FILE_TYPE,
      payload: value as BucketsNames,
    });
  }, []);

  const handleFileChange = useCallback((files: File | File[] | null) => {
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
    if (!!time && time > 0) {
      submitFileDispatch({
        type: submitFileAction.UPDATE_METADATA,
        field: 'record_length',
        value: time,
      });
    }
  }, []);

  const updateMetadata = useCallback(
    (field: string, val: any) => {
      console.log('updateMetadata', val, submitFileState.metadata);
      submitFileDispatch({
        type: submitFileAction.UPDATE_METADATA,
        field: field,
        value: val,
      });
    },
    [submitFileState.metadata]
  );

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

  useEffect(() => {
    console.log('useEffect fileType', submitFileState.fileType);
  }, [submitFileState.fileType]);

  useEffect(() => {
    console.log('useEffect submitFileState', submitFileState.metadata);
  }, [submitFileState.metadata]);

  const uploadRecord = useCallback(async () => {
    try {
      //   if (
      //     submitFileState.fileType &&
      //     submitFileState.exerciseType &&
      //     submitFileState.file
      //   ) {
      //     setIsUploading(true);
      //     const status = await pRetry(
      //       () =>
      //         submitFileState.fileType &&
      //         submitFileState.exerciseType &&
      //         submitFileState.file
      //           ? uploadFile(
      //               submitFileState.fileType,
      //               submitFileState.exerciseType,
      //               submitFileState.file,
      //               submitFileState.metadata
      //             )
      //           : null,
      //       {
      //         retries: 5,
      //       }
      //     );
      //     if (status) {
      //       addAlert(
      //         'uploaded record and sonolist successfully',
      //         AlertSizes.small
      //       );
      //     }
      //     setIsUploading(false);
      //   }
    } catch (error) {
      console.error(error);
      setIsUploading(false);
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
    <PopupHeader
      popupType={PopupsTypes.UPLOAD_RECORD}
      header='Upload file'
      size={inMetadataPage ? PopupSizes.LARGE : PopupSizes.SMALL}
    >
      {!inMetadataPage ? (
        <UploadFileSection
          //   handleExerciseType={handleExerciseType}
          handleFileType={handleFileType}
        />
      ) :
       MetadataComponent && submitFileState.exerciseType ? (
        <MetadataComponent
          file={submitFileState.file}
          metadata={submitFileState.metadata as any}
          fileType={submitFileState.fileType || BucketsNames.RECORDS}
          exerciseType={submitFileState.exerciseType}
          handleFileChange={handleFileChange}
          handleFileRemoved={handleFileRemoved}
          handleFileLength={handleFileLength}
          updateMetadata={(field: string, val: any) => {
            console.log('updateMetadata', val, submitFileState.metadata);
            submitFileDispatch({
              type: submitFileAction.UPDATE_METADATA,
              field: field,
              value: val,
            });
          }}
        />
      )
       : null}
      <section className='absolute bottom-4 left-0 flex w-full flex-row justify-between px-9'>
        <Button
          label={'Back'}
          buttonType={ButtonTypes.SUBMIT}
          color={ButtonColors.WHITE}
          onClick={prevPage}
        />
        <Button
          label={inMetadataPage ? 'Upload' : 'Countinue'}
          buttonType={ButtonTypes.SUBMIT}
          color={
            inMetadataPage && submitFileState.file
              ? submitFileState.file.name
                ? ButtonColors.BLUE
                : ButtonColors.GRAY
              : ButtonColors.BLUE
          }
          isLoading={isUploading}
          loadingLabel={'Uploading...'}
          onClick={() => {
            inMetadataPage ? uploadRecord() : nextPage();
          }}
        />
      </section>
    </PopupHeader>
  );
};

export default UploadFilePopup;
