import { useDropdownSelections } from '@/app/_utils/hooks/(dropdowns)/useDropdownSelections';
// import { useFetchTargets } from '@/app/_utils/hooks/(dropdowns)/useFechTargets';
import { useFetchModelFiles } from '@/app/_utils/hooks/useFetchModelFiles';
import { useInfoBarStore } from '@/app/store/stores/useInfoBarStore';
import Table, { TableHead } from '@/components/Table/page';
import TargetsDropdowns from '@/components/TargetsDropdowns';
import { useCallback, useEffect, useState } from 'react';
import { useStore } from 'zustand';

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
    selectedModel?._id || null
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
        />
      </div>
      {selectedMainTypeId &&
        selectedSubTypeId &&
        selectedModel &&
        filesData.length > 0 && (
          <div className='flex w-fit flex-col gap-3'>
            <span className='text-xl font-bold opacity-70'>Files table</span>
            <Table
              headers={filesTableHead}
              rows={filesData}
              onSelect={handleSelectFilesRow}
              selectedRowIndex={selectedFilesRowIndex}
              maxHight={'max-h-[306px]'}
              isLoading={false}
            />
          </div>
        )}
    </section>
  );
};

export default FilesSelection;
