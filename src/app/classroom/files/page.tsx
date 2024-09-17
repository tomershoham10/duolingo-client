'use client';
import { useStore } from 'zustand';
import { useInfoBarStore } from '@/app/store/stores/useInfoBarStore';
import { useCallback, useState } from 'react';
import Table, { TableHead } from '@/components/Table/page';
import pRetry from 'p-retry';
import { useFetchTargets } from '@/app/_utils/hooks/(dropdowns)/useFechTargets';
import useModelsTableData from '@/app/_utils/hooks/useModelsTableData';
import Button, { ButtonColors, ButtonTypes } from '@/components/Button/page';
import { faArrowUpFromBracket } from '@fortawesome/free-solid-svg-icons';
import { PopupsTypes, usePopupStore } from '@/app/store/stores/usePopupStore';
import UploadFilePopup from '@/app/(popups)/(upload)/UploadFilePopup/page';
import { getModelsFiles } from '@/app/API/files-service/functions';

const Files: React.FC = () => {
  const targetsList = useFetchTargets();
  const modelsTableData = useModelsTableData();

  const [selectedModelsRowIndex, setSelectedModelsRowIndex] =
    useState<number>(-1);
  const [selectedFilesRowIndex, setSelectedFilesRowIndex] =
    useState<number>(-1);

  console.log('modelsTableData', modelsTableData);

  const updateSelectedFile = useInfoBarStore.getState().updateSelectedFile;
  const updateSelectedPopup = usePopupStore.getState().updateSelectedPopup;

  const modelsTableHead: TableHead[] = [
    { key: 'country', label: 'Country' },
    { key: 'organization', label: 'Organization' },
    { key: 'mainTypeName', label: 'main type' },
    { key: 'subTypeName', label: 'sub type' },
    { key: 'modelName', label: 'name' },
  ];

  const filesTableHead: TableHead[] = [
    { key: 'name', label: 'File name' },
    { key: 'type', label: 'File type' },
    { key: 'hasMetadata', label: 'Has metadata' },
  ];

  const [filesData, setFilesData] = useState<FileType[]>([]);

  const fetchModelFiles = useCallback(
    async (mainId: string, subTypeId: string, modelId: string) => {
      const res = await pRetry(
        () => getModelsFiles(mainId, subTypeId, modelId),
        {
          retries: 5,
        }
      );
      console.log('fetchModelFiles1', res);
      if (res) {
        if (Object.values(res).length > 0) {
          // else - model has no files
          const imagesData = res[subTypeId][modelId]['images'];
          const recordsData = res[subTypeId][modelId]['records'];
          const comboData = [
            ...recordsData.map((rec) => {
              return { ...rec, type: 'record' };
            }),
            ...imagesData.map((img) => {
              return { ...img, type: 'image' };
            }),
          ];
          setFilesData(
            comboData.map((file) => {
              return {
                ...file,
                hasMetadata:
                  Object.values(file.metadata).length > 0 ? 'yes' : 'no',
              };
            })
          );
          console.log('fetchModelFiles2', imagesData, recordsData, [
            ...recordsData,
            ...imagesData,
          ]);
        } else {
          setFilesData([]);
        }
      } else {
        alert('error');
        setFilesData([]);
      }
    },
    []
  );

  const handleSelectModelsRow = useCallback(
    (row: any, index: number) => {
      console.log('handleSelectModelsRow', row);
      fetchModelFiles(row.mainTypeId, row.subTypeId, row.modelId);
      setSelectedModelsRowIndex(index);
    },
    [fetchModelFiles]
  );

  const handleSelectFilesRow = useCallback((row: any, index: number) => {
    console.log('handleSelectFilesRow', row);
    setSelectedFilesRowIndex(index);
  }, []);

  return (
    <section className='mx-auto flex h-full w-fit flex-col gap-6 p-6 text-duoGray-darkest dark:text-duoGrayDark-lightest'>
      <UploadFilePopup />
      <Table
        headers={modelsTableHead}
        rows={modelsTableData}
        onSelect={handleSelectModelsRow}
        selectedRowIndex={selectedModelsRowIndex}
        maxHight={'max-h-[306px]'}
      />

      <Table
        headers={filesTableHead}
        rows={filesData}
        onSelect={handleSelectFilesRow}
        selectedRowIndex={selectedFilesRowIndex}
        maxHight={'max-h-[306px]'}
      />

      <div className='relative flex items-center justify-start py-8'>
        <Button
          label={'UPLOAD'}
          buttonType={ButtonTypes.SUBMIT}
          color={ButtonColors.BLUE}
          icon={faArrowUpFromBracket}
          //   loadingLabel={'Uploading...'}
          onClick={() => updateSelectedPopup(PopupsTypes.UPLOAD_RECORD)}
        />
      </div>
    </section>
  );
};
export default Files;