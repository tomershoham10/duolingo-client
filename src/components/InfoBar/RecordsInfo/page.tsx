'use client';
import { useCallback } from 'react';
import pRetry from 'p-retry';
import useStore from '@/app/store/useStore';
import { useInfoBarStore } from '@/app/store/stores/useInfoBarStore';
import FileData from '../FileData/page';
import Button, { ButtonColors } from '@/components/Button/page';
import { PopupsTypes, usePopupStore } from '@/app/store/stores/usePopupStore';
import { BucketsNames, deleteFile } from '@/app/API/files-service/functions';
import { useAlertStore } from '@/app/store/stores/useAlertStore';

const RecordsInfo: React.FC = () => {
  const selectedFile = useStore(useInfoBarStore, (state) => state.selectedFile);
  const updateSelectedPopup = usePopupStore.getState().updateSelectedPopup;
  const addAlert = useAlertStore.getState().addAlert;
  const deleteRecord = useCallback(async () => {
    try {
      if (selectedFile && selectedFile.name) {
        const response = await pRetry(
          () =>
            selectedFile && selectedFile.name
              ? deleteFile(selectedFile.name, BucketsNames.RECORDS)
              : null,
          {
            retries: 5,
          }
        );

        if (response) {
          addAlert('record deleted', AlertSizes.small);
        }
      }
    } catch (error) {
      console.error(error);
      addAlert(`error while deleting file: ${error}`, AlertSizes.small);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFile]);

  return (
    <>
      {!!selectedFile ? (
        <section className='flex h-full flex-col justify-between'>
          <FileData />
          <section className='mx-auto mb-6 flex w-[90%] flex-col gap-4'>
            <Button
              label={'Edit'}
              color={ButtonColors.BLUE}
              onClick={() => {
                updateSelectedPopup(PopupsTypes.EDIT_METADATA);
              }}
            />

            <Button
              label={'DELETE'}
              color={ButtonColors.RED}
              onClick={deleteRecord}
            />
          </section>
        </section>
      ) : null}
    </>
  );
};

export default RecordsInfo;
