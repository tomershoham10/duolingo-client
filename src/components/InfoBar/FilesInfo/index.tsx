import { useCallback, useState } from 'react';
import { useStore } from 'zustand';
import { useInfoBarStore } from '@/app/store/stores/useInfoBarStore';
import Button, { ButtonColors } from '@/components/(buttons)/Button/page';
import { PopupsTypes, usePopupStore } from '@/app/store/stores/usePopupStore';
import pRetry from 'p-retry';
import { deleteFile } from '@/app/API/files-service/functions';
import MetadataSection from '../(utils)/MetadataSection';

const FilesInfo = () => {
  const selectedFile = useStore(useInfoBarStore, (state) => state.selectedFile);

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
  const updateSelectedPopup = usePopupStore.getState().updateSelectedPopup;

  const [isDeletingLoading, setIsDeletingLoading] = useState<boolean>(false);

  const deleteSelectedFile = useCallback(async () => {
    setIsDeletingLoading(true);
    const fileType = selectedFile?.name?.endsWith('.wav')
      ? 'records'
      : 'images';
    const response = await pRetry(
      () => {
        selectedMainTypeId &&
        selectedSubTypeId &&
        selectedModel &&
        selectedFile &&
        selectedFile.name
          ? deleteFile(
              selectedMainTypeId,
              selectedSubTypeId,
              selectedModel._id,
              fileType,
              selectedFile.name
            )
          : null;
      },
      {
        retries: 5,
      }
    );
    setIsDeletingLoading(false);
  }, [selectedFile, selectedMainTypeId, selectedModel, selectedSubTypeId]);

  return (
    <div className='h-full w-[90%] overflow-hidden py-5'>
      {selectedModel === null ? (
        <section>Please select a model</section>
      ) : (
        <section className='flex h-full w-full flex-col'>
          <p className='mx-auto text-2xl font-extrabold'>
            {selectedModel.name}
          </p>
          {selectedFile && (
            <MetadataSection
              fileName={selectedFile.name || 'file'}
              metadata={selectedFile.metadata || Object.create(null)}
            >
              <section className='mx-auto mb-6 flex w-[90%] flex-col gap-4'>
                <Button
                  label={'Edit'}
                  color={ButtonColors.BLUE}
                  onClick={() => updateSelectedPopup(PopupsTypes.EDIT_METADATA)}
                />

                <Button
                  label={'DELETE'}
                  color={ButtonColors.RED}
                  onClick={deleteSelectedFile}
                  isLoading={isDeletingLoading}
                  loadingLabel='Deleting...'
                />
              </section>
            </MetadataSection>
          )}
        </section>
      )}
    </div>
  );
};

export default FilesInfo;
