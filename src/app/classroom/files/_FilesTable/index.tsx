'use client';
import { lazy } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';

import Table, { TableHead, TableRow } from '@/components/Table/page';
// import UploadFilePopup from '@/app/(popups)/UploadFilePopup/page';
import Button, { ButtonColors, ButtonTypes } from '@/components/Button/page';
import { faArrowUpFromBracket } from '@fortawesome/free-solid-svg-icons';
import { PopupsTypes, usePopupStore } from '@/app/store/stores/usePopupStore';
const UploadFilePopup = lazy(
  () => import('@/app/(popups)/(upload)/UploadFilesPopup/page')
);

library.add(faArrowUpFromBracket);

interface RecordsTableProps {
  tableData: TableRow[];
  onSelect: (item: any) => void;
  selectedRowIndex: number | undefined;
}

const FilesTable: React.FC<RecordsTableProps> = (props) => {
  const { tableData, onSelect, selectedRowIndex } = props;
  const updateSelectedPopup = usePopupStore.getState().updateSelectedPopup;
  const TABLE_HEAD: TableHead[] = [
    { key: 'name', label: 'Name' },
    { key: 'exerciseType', label: 'Exercise Type' },
    { key: 'fileType', label: 'File Type' },
  ];
  return (
    <section>
      <UploadFilePopup />
      <span className='my-3 text-2xl font-bold'>Select \ upload file:</span>
      <section className='my-5 flex justify-start'>
        <Table
          headers={TABLE_HEAD}
          rows={tableData}
          onSelect={onSelect}
          selectedRowIndex={selectedRowIndex}
          isLoading={false}
        />
      </section>
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

export default FilesTable;
