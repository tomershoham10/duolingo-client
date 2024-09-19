'use client';

import { useCallback, useEffect, useReducer, useState } from 'react';
import PopupHeader, { PopupSizes } from '@/app/(popups)/PopupHeader/page';
import { PopupsTypes } from '@/app/store/stores/usePopupStore';
import Button, {
  ButtonColors,
  ButtonTypes,
} from '@/components/(buttons)/Button/page';
import UploadFiles from '../(subPages)/Upload/page';
import SelectModel from '../(subPages)/SelectModel/page';
import {
  uploadFilesAction,
  uploadFilesDataType,
  uploadFilesReducer,
} from '@/reducers/adminView/(popups)/uploadFilesReducer';
import pRetry from 'p-retry';
import { uploadFilesArray } from '@/app/API/files-service/functions';
import { AlertSizes, useAlertStore } from '@/app/store/stores/useAlertStore';

const UploadFilesPopup: React.FC = () => {
  const addAlert = useAlertStore.getState().addAlert;

  const [headLine, setHeadLine] = useState<string>('Upload file');
  const [inMetadataPage, setInMetadataPage] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const initialUploadFilesState: uploadFilesDataType = {
    mainId: null,
    subtypeId: null,
    model: null,

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

  const handleMainChanged = useCallback((main: TargetType) => {
    submitFileDispatch({
      type: uploadFilesAction.SET_MAIN_ID,
      payload: main._id,
    });
  }, []);
  const handleSubTypeChanged = useCallback((subType: TargetType) => {
    submitFileDispatch({
      type: uploadFilesAction.SET_SUB_TYPE_ID,
      payload: subType._id,
    });
  }, []);
  const handleModelChanged = useCallback((model: TargetType) => {
    submitFileDispatch({
      type: uploadFilesAction.SET_MODEL,
      payload: model,
    });
  }, []);

  useEffect(() => {
    if (
      inMetadataPage &&
      UploadFilesState.model &&
      UploadFilesState.model.name
    ) {
      setHeadLine(`Upload file - ${UploadFilesState.model.name}`);
    } else {
      setHeadLine('Upload file');
    }
  }, [UploadFilesState.model, inMetadataPage]);

  const nextPage = useCallback(() => {
    setInMetadataPage(true);
  }, []);
  const prevPage = useCallback(() => {
    submitFileDispatch({
      type: uploadFilesAction.RESET_FILES_STATE,
    });
    setInMetadataPage(false);
  }, []);

  const uploadFiles = useCallback(async () => {
    try {
      if (UploadFilesState.files) {
        setIsUploading(true);
        const status = await pRetry(
          () =>
            UploadFilesState.mainId &&
            UploadFilesState.subtypeId &&
            UploadFilesState.model?._id &&
            UploadFilesState.files
              ? uploadFilesArray(
                  UploadFilesState.mainId,
                  UploadFilesState.subtypeId,
                  UploadFilesState.model._id,
                  UploadFilesState.files
                )
              : null,
          {
            retries: 5,
          }
        );
        if (status) {
          addAlert('files uploaded successfully', AlertSizes.small);
        } else {
          addAlert('error while uploading files', AlertSizes.small);
        }
        setIsUploading(false);
      }
    } catch (e) {
      console.error(e);
    }
  }, [
    UploadFilesState.files,
    UploadFilesState.mainId,
    UploadFilesState.model,
    UploadFilesState.subtypeId,
    addAlert,
  ]);

  return (
    <PopupHeader
      popupType={PopupsTypes.UPLOAD_FILES}
      header={headLine}
      size={inMetadataPage ? PopupSizes.LARGE : PopupSizes.SMALL}
      onClose={() => {}}
    >
      {!inMetadataPage ? (
        <SelectModel
          handleMainChanged={handleMainChanged}
          handleSubTypeChanged={handleSubTypeChanged}
          handleModelChanged={handleModelChanged}
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
          isDisabled={
            !inMetadataPage ? UploadFilesState.model?._id === null : false
          }
          color={
            inMetadataPage
              ? UploadFilesState.files.length > 0
                ? ButtonColors.BLUE
                : ButtonColors.GRAY
              : UploadFilesState.model?._id !== null
                ? ButtonColors.BLUE
                : ButtonColors.GRAY
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

export default UploadFilesPopup;
