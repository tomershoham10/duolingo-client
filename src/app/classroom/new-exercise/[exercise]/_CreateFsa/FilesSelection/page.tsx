import { useCallback, useEffect, useState } from 'react';
import { useStore } from 'zustand';

import Table, { TableHead } from '@/components/Table/page';
import TableSkeleton from '@/components/Table/TableSkeleton';
import TargetsDropdowns from '@/components/TargetsDropdowns';
import { FileTypes } from '@/app/API/files-service/functions';
import { useInfoBarStore } from '@/app/store/stores/useInfoBarStore';
import { useFetchModelFiles } from '@/app/_utils/hooks/useFetchModelFiles';
import { useDropdownSelections } from '@/app/_utils/hooks/(dropdowns)/useDropdownSelections';

const FilesSelection = () => {
  //   const targetsList = useFetchTargets();

  const [selectedFilesRowIndex, setSelectedFilesRowIndex] =
    useState<number>(-1);

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

  const updateSelectedMainTypeId =
    useInfoBarStore.getState().updateSelectedMainTypeId;
  const updateSelectedSubTypeId =
    useInfoBarStore.getState().updateSelectedSubTypeId;
  const updateSelectedModel = useInfoBarStore.getState().updateSelectedModel;

  const updateSelectedFile = useInfoBarStore.getState().updateSelectedFile;

  const { filesData, fetchData } = useFetchModelFiles(
    selectedMainTypeId,
    selectedSubTypeId,
    selectedModel?._id || null,
    FileTypes.RECORDS
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const { handleMainTypeSelected, handleSubTypeSelected, handleModelSelected } =
    useDropdownSelections(
      updateSelectedMainTypeId,
      updateSelectedSubTypeId,
      updateSelectedModel,
      updateSelectedFile,
      selectedSubTypeId
    );

  const filesTableHead: TableHead[] = [
    { key: 'name', label: 'File name' },
    { key: 'type', label: 'File type' },
    { key: 'hasMetadata', label: 'Has metadata' },
  ];

  const handleSelectFilesRow = useCallback(
    (row: any, index: number) => {
      setSelectedFilesRowIndex(index);
      updateSelectedFile(row);
    },
    [updateSelectedFile]
  );

  return (
    <section>
      <div className='flex flex-col gap-3 py-6'>
        <span className='text-3xl font-bold'>Select a model</span>
        <TargetsDropdowns
          onMainSelected={handleMainTypeSelected}
          onSubTypeSelected={handleSubTypeSelected}
          onModelSelected={handleModelSelected}
          excludeFileType={true}
        />
      </div>
      {selectedMainTypeId &&
        selectedSubTypeId &&
        selectedModel &&
        (filesData ? (
          filesData.length > 0 ? (
            <div className='flex w-fit flex-col gap-3'>
              <span className='text-xl font-bold text-duoGrayDark-lightestOpacity'>
                Files table
              </span>
              <Table
                headers={filesTableHead}
                rows={filesData}
                onSelect={handleSelectFilesRow}
                selectedRowIndex={selectedFilesRowIndex}
                maxHight={'max-h-[306px]'}
                isLoading={false}
              />
            </div>
          ) : (
            <p className='mt-2 text-lg text-duoGrayDark-lightestOpacity'>
              The selected model has no records.
            </p>
          )
        ) : (
          <section className='mx-auto w-fit'>
            <TableSkeleton />
          </section>
        ))}
    </section>
  );
};

export default FilesSelection;
