'use client';
import { useStore } from 'zustand';
import { useInfoBarStore } from '@/app/store/stores/useInfoBarStore';
import FilesTable from './_FilesTable';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { TableRow } from '@/components/Table/page';
import pRetry from 'p-retry';
import {
  BucketsNames,
  getFileByBucketName,
} from '@/app/API/files-service/functions';

const Records: React.FC = () => {
  console.log('records');
  const selectedFile = useStore(useInfoBarStore, (state) => state.selectedFile);
  const updateSelectedFile = useInfoBarStore.getState().updateSelectedFile;

  const [recordsData, setRecordsData] = useState<FileType[]>([]);

  const [tableData, setTableData] = useState<TableRow[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const res = (await pRetry(
        () => getFileByBucketName(BucketsNames.RECORDS),
        { retries: 5 }
      )) as FileType[];
      setRecordsData(res || []);
    } catch (error) {
      console.error('Failed to fetch records:', error);
    }
  }, []);

  useEffect(() => {
    console.log('records fetchData');
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    console.log('recordsData triggered', recordsData);
    setTableData(
      recordsData.map((data) => {
        return {
          ...data,
          fileType: data.name.endsWith('wav')
            ? BucketsNames.RECORDS
            : BucketsNames.IMAGES,
        };
      })
    );
  }, [recordsData]);

  const handleSelectTableRow = useCallback(
    (item: any) => {
      console.log('item', item);

      const modifiedRecord = {
        id: item.id,
        name: item.name,
        exerciseType: item.exerciseType,
        metadata: { ...item.metadata },
      };

      console.log('modifiedRecord', modifiedRecord);
      updateSelectedFile(modifiedRecord);
    },
    [updateSelectedFile]
  );

  const selectedRowIndex = useMemo(() => {
    return undefined;
  }, []);
  return (
    <section className='h-full p-6 text-duoGray-darkest dark:text-duoGrayDark-lightest'>
      <FilesTable
        tableData={tableData}
        onSelect={handleSelectTableRow}
        selectedRowIndex={selectedRowIndex}
      />
    </section>
  );
};
export default Records;
