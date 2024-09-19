'use client';
import { useCallback, useState } from 'react';

import pRetry from 'p-retry';
import { useStore } from 'zustand';

import UploadFiles from '../Upload';
import PopupHeader, { PopupSizes } from '../../PopupHeader/page';
import { useInfoBarStore } from '@/app/store/stores/useInfoBarStore';
import Button, { ButtonColors, ButtonTypes } from '@/components/(buttons)/Button/page';
import { AlertSizes, useAlertStore } from '@/app/store/stores/useAlertStore';
import { PopupsTypes, usePopupStore } from '@/app/store/stores/usePopupStore';

import { uploadFilesArray } from '@/app/API/files-service/functions';

const UploadFilesPopup: React.FC = () => {
  const addAlert = useAlertStore.getState().addAlert;
  const updateSelectedPopup = usePopupStore.getState().updateSelectedPopup;

  const mainId = useStore(useInfoBarStore, (state) => state.selectedMainTypeId);
  const subTypeId = useStore(
    useInfoBarStore,
    (state) => state.selectedSubTypeId
  );
  const model = useStore(useInfoBarStore, (state) => state.selectedModel);

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [filesList, setFilesList] = useState<File[]>([]);

  const handleFilesChanged = (files: File[]) => {
    setFilesList(files);
  };

  const uploadFiles = useCallback(async () => {
    try {
      console.log('uploadFiles filesList', filesList);
      if (filesList.length > 0) {
        setIsUploading(true);
        const status = await pRetry(
          () =>
            mainId && subTypeId && model?._id && filesList.length > 0
              ? uploadFilesArray(mainId, subTypeId, model._id, filesList)
              : null,
          {
            retries: 5,
          }
        );
        if (status) {
          addAlert('files uploaded successfully', AlertSizes.small);
          resetState();
          updateSelectedPopup(PopupsTypes.CLOSED);
        } else {
          addAlert('error while uploading files', AlertSizes.small);
        }
        setIsUploading(false);
      }
    } catch (e) {
      console.error(e);
    }
  }, [addAlert, filesList, mainId, model, subTypeId, updateSelectedPopup]);

  const resetState = () => {
    setIsUploading(false);
    setFilesList([]);
  };

  return (
    <PopupHeader
      popupType={PopupsTypes.UPLOAD_FILES}
      header={'upload'}
      size={PopupSizes.LARGE}
      onClose={resetState}
    >
      <UploadFiles onFilesChanged={handleFilesChanged} />

      <section className='absolute bottom-4 left-0 flex w-full flex-row justify-between px-9'>
        <Button
          label={'Upload'}
          buttonType={ButtonTypes.SUBMIT}
          isDisabled={filesList.length === 0}
          color={filesList.length > 0 ? ButtonColors.BLUE : ButtonColors.GRAY}
          isLoading={isUploading}
          loadingLabel={'Uploading...'}
          onClick={uploadFiles}
        />
      </section>
    </PopupHeader>
  );
};

export default UploadFilesPopup;
