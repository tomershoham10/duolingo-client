'use client';
import { useState, useEffect, useRef } from 'react';
import { RecordType, getAllRecords } from '@/app/API/files-service/functions';
import Table from '@/components/Table/page';
import Upload, { UploadRef } from '@/components/Upload/page';
import MetadataPopup from '@/app/popups/MetadataPopup/page';
import Button, { Color } from '@/components/Button/page';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faArrowUpFromBracket } from '@fortawesome/free-solid-svg-icons';

library.add(faArrowUpFromBracket);

const AcintDataSection: React.FC = () => {
  const [recordsData, setRecordsData] = useState<RecordType[]>([]);
  const [recordFile, setRecordFile] = useState<File>();
  const [recordLength, setRecordLength] = useState<number>(0);
  const [sonolistFiles, setSonolistFiles] = useState<FileList>();

  const uploadRef = useRef<UploadRef>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getAllRecords();
      !!res ? setRecordsData(res) : null;
    };
    fetchData();
  }, []);

  useEffect(() => {
    console.log(
      'recordsData',
      recordsData,
      recordsData.map(({ name, id, metadata }) => ({
        name,
        id,
        ...metadata,
      }))
    );
  }, [recordsData]);

  const recordsHeaders: string[] = [
    'name',
    'difficulty_level',
    'targetsIds_list',
    'is_in_italy',
  ];

  const handleFileChange = (files: File | FileList | null) => {
    if (files instanceof FileList) {
      console.log('sonolist');
      files ? setSonolistFiles(files as FileList) : null;
    } else {
      files ? setRecordFile(files as File) : null;
    }
  };

  const handleFileLength = (time: number | null) => {
    console.log('file length:', time);
    time ? setRecordLength(time) : null;
  };

  return (
    <section className='h-full w-full text-duoGray-darkest'>
      <MetadataPopup
        prevData={undefined}
        onSave={(data) => console.log('metadata', data)}
      />
      <span className='my-3 text-2xl font-bold'>Select \ upload record:</span>
      <Table
        headers={recordsHeaders}
        data={recordsData.map(({ name, id, metadata }) => ({
          name,
          id,
          ...metadata,
        }))}
        isSelectable={true}
      />

      <div className='relative my-3 flex w-full flex-row items-start justify-between gap-5 3xl:w-[55%]'>
        <div className='relative flex w-full flex-col justify-between 3xl:w-[45%]'>
          <Upload
            label={'Choose a .wav file'}
            filesTypes={'.wav'}
            isMultiple={false}
            ref={uploadRef}
            onFileChange={handleFileChange}
            fileLength={handleFileLength}
          />
        </div>

        <div className='relative w-full 3xl:w-[45%]'>
          <Upload
            label={'Sonolist'}
            filesTypes={'image/*'}
            isMultiple={true}
            ref={uploadRef}
            onFileChange={handleFileChange}
          />
        </div>
      </div>
      <div className='relative flex items-center justify-center py-8'>
        <div className='absolute left-0 w-[10rem]'>
          <Button
            label={'UPLOAD'}
            color={Color.BLUE}
            icon={faArrowUpFromBracket}
          />
        </div>
      </div>
    </section>
  );
};
export default AcintDataSection;
