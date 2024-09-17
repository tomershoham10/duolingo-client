'use client';
import { useCallback, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import Table, { TableHead, TableRow } from '@/components/Table/page';
import pRetry from 'p-retry';
import {
  BucketsNames,
  getFileByBucketAndType,
} from '@/app/API/files-service/functions';
import { ExercisesTypes } from '@/app/API/classes-service/exercises/functions';
library.add(faXmark);

interface FSASongramsProps {
  onClose: () => void;
}

const Sonograms: React.FC<FSASongramsProps> = (props) => {
  const [tableData, setTableData] = useState<TableRow[]>([]);
  const TABLE_HEAD: TableHead[] = [
    { key: 'name', label: 'Name' },
    { key: 'metadata.sonogram_type', label: 'type' },
    { key: 'metadata.fft', label: 'fft' },
    { key: 'metadata.bw', label: 'bw' },
  ];

  const fetchData = useCallback(async () => {
    try {
      const res = (await pRetry(
        () => getFileByBucketAndType(BucketsNames.IMAGES, ExercisesTypes.FSA),
        {
          retries: 5,
        }
      )) as FileType[];

      !!res && setTableData(res);
    } catch (err) {
      console.error('fetchData error:', err);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  const handleSelectTableRow = (item: any) => {};
  return (
    <div className='fixed left-0 top-0 z-20 flex h-full w-screen items-center justify-center overflow-hidden bg-[rgb(0,0,0)] bg-[rgba(0,0,0,0.4)] transition duration-200 ease-out'>
      <div className='relative m-5 flex h-[30rem] w-[35rem] justify-center rounded-md bg-white p-5 dark:bg-duoGrayDark-darkest md:h-[30rem] xl:h-[30rem] xl:w-[50rem] 2xl:w-[52.5rem] 3xl:w-[60rem]'>
        <button
          onClick={() => {
            props.onClose();
            // updateSelectedPopup(PopupsTypes.CLOSED);
          }}
          className='z-50 h-fit w-fit flex-none rounded-md text-duoGray-dark'
        >
          <FontAwesomeIcon
            className='fa-lg fa-solid flex-none'
            icon={faXmark}
          />
        </button>
        <div className='w-full items-start justify-start'>
          <div className='absolute left-0 flex h-10 w-full justify-center border-b-2 text-xl font-extrabold dark:border-duoBlueDark-text 3xl:h-12 3xl:text-2xl'>
            Select Sonogram
          </div>
          <div className='mx-auto mt-14 w-fit'>
            <Table
              headers={TABLE_HEAD}
              rows={tableData}
              onSelect={handleSelectTableRow}
              isLoading={false}
              //   selectedRowIndex={
              //     tableData && tableData.length > 0
              //       ? tableData
              //           .map((image) => image.name)
              //           .indexOf(filesList[0].fileName)
              //       : undefined
              //   }
              //   isSelectable={
              //     selectedFile
              //       ? recordsData
              //           .map((record) => record.name)
              //           .includes(selectedFile.name)
              //       : true
              //   }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sonograms;
