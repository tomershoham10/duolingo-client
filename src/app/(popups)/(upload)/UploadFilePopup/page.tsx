'use client';

import { useCallback, useReducer, useState } from 'react';
import PopupHeader, { PopupSizes } from '../../PopupHeader/page';
import { PopupsTypes } from '@/app/store/stores/usePopupStore';
import Button, { ButtonColors, ButtonTypes } from '@/components/Button/page';
import UploadFiles from '../(subPages)/Upload/page';
import SelectModel from '../(subPages)/SelectModel/page';
import {
  uploadFilesAction,
  uploadFilesDataType,
  uploadFilesReducer,
} from '@/reducers/adminView/(popups)/uploadFilesReducer';

const UploadFilePopup: React.FC = () => {
  const [inMetadataPage, setInMetadataPage] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const initialUploadFilesState: uploadFilesDataType = {
    mainId: null,
    subtypeId: null,
    modelId: null,

    files: [],
  };

  const [UploadFilesState, submitFileDispatch] = useReducer(
    uploadFilesReducer,
    initialUploadFilesState
  );

  const handleFilesChanged = useCallback((files: File[]) => {
    submitFileDispatch({
      type: uploadFilesAction.SET_FILES,
      payload: files,
    });
  }, []);

  const nextPage = useCallback(() => {
    setInMetadataPage(true);
  }, []);
  const prevPage = useCallback(() => {
    submitFileDispatch({
      type: uploadFilesAction.RESET_FILES_STATE,
    });
    setInMetadataPage(false);
  }, []);

  //   const uploadRecord = useCallback(async () => {
  //     try {
  //       //   if (
  //       //     UploadFilesState.fileType &&
  //       //     UploadFilesState.exerciseType &&
  //       //     UploadFilesState.file
  //       //   ) {
  //       //     setIsUploading(true);
  //       //     const status = await pRetry(
  //       //       () =>
  //       //         UploadFilesState.fileType &&
  //       //         UploadFilesState.exerciseType &&
  //       //         UploadFilesState.file
  //       //           ? uploadFile(
  //       //               UploadFilesState.fileType,
  //       //               UploadFilesState.exerciseType,
  //       //               UploadFilesState.file,
  //       //               UploadFilesState.metadata
  //       //             )
  //       //           : null,
  //       //       {
  //       //         retries: 5,
  //       //       }
  //       //     );
  //       //     if (status) {
  //       //       addAlert(
  //       //         'uploaded record and sonolist successfully',
  //       //         AlertSizes.small
  //       //       );
  //       //     }
  //       //     setIsUploading(false);
  //       //   }
  //     } catch (error) {
  //       console.error(error);
  //       setIsUploading(false);
  //       addAlert(`error while uploading file: ${error}`, AlertSizes.small);
  //     }
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, [UploadFilesState.file, UploadFilesState.fileType]);

  const uploadFiles = useCallback(() => {
    console.log(UploadFilesState.files);
  }, [UploadFilesState]);

  return (
    <PopupHeader
      popupType={PopupsTypes.UPLOAD_RECORD}
      header='Upload file'
      size={inMetadataPage ? PopupSizes.LARGE : PopupSizes.SMALL}
    >
      {!inMetadataPage ? (
        <SelectModel
          handleMainId={(mainId) => console.log(mainId)}
          handleSubTypeId={(subTypeId) => console.log(subTypeId)}
          handleModelId={(modelId) => console.log(modelId)}
        />
      ) : (
        <UploadFiles onFilesChanged={handleFilesChanged} />
      )}
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
            inMetadataPage && UploadFilesState.files.length > 0
              ? ButtonColors.BLUE
              : ButtonColors.BLUE
          }
          isLoading={isUploading}
          loadingLabel={'Uploading...'}
          onClick={() => {
            inMetadataPage ? uploadFiles() : nextPage();
          }}
        />
      </section>
    </PopupHeader>
  );
};

export default UploadFilePopup;
