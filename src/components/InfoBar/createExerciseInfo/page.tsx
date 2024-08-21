'use client';
import { useCallback, useEffect, useState } from 'react';
import { ExercisesTypes } from '@/app/API/classes-service/exercises/functions';
import { useCreateSpotreccStore } from '@/app/store/stores/(createExercises)/useCreateSpotreccStore';
import pRetry from 'p-retry';
import {
  BucketsNames,
  getFileByBucketAndType,
} from '@/app/API/files-service/functions';
import Link from 'next/link';
import { formatNumberToMinutes } from '@/app/_utils/functions/formatNumberToMinutes';
import { useCreateFsaStore } from '@/app/store/stores/(createExercises)/useCreateFsaStore';

interface CreateExerciseInfoProps {
  exerciseType: ExercisesTypes;
}

const CreateExerciseInfo: React.FC<CreateExerciseInfoProps> = (props) => {
  const { exerciseType } = props;
  const setFileName = useCreateFsaStore.getState().setFileName;

  const updateRecordLength = useCreateFsaStore.getState().updateRecordLength;
  const addSubExercise = useCreateSpotreccStore.getState().addSubExercise;
  const [recordsData, setRecordsData] = useState<FileType[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileType | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = (await pRetry(
        () => getFileByBucketAndType(BucketsNames.RECORDS, exerciseType),
        { retries: 5 }
      )) as FileType[];
      //   console.log('SpotreccFiles', res);
      setRecordsData(res);
    } catch (error) {
      console.error('Failed to fetch records:', error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const handleFileSelected = useCallback(
    (selectedFileName: string, recordLength?: number) => {
      console.log(
        'handleFileSelected',
        recordsData,
        exerciseType === ExercisesTypes.FSA
      );
      setSelectedFile(
        recordsData.filter((item) => item.name === selectedFileName)[0]
      );
      if (exerciseType === ExercisesTypes.FSA) {
        console.log('fsa - setFileName', selectedFileName);
        setFileName(selectedFileName);
        updateRecordLength(recordLength || 0);
      }
    },
    []
  );

  useEffect(() => {
    console.log('CreateExerciseInfo - recordsData', recordsData);
  }, [recordsData]);

  useEffect(() => {
    console.log('CreateExerciseInfo - selectedFile', selectedFile);
  }, [selectedFile]);

  return (
    <div className='flex h-full w-[90%] flex-col gap-3 px-6 py-4'>
      <h1>{exerciseType} Files</h1>
      <ul className='max-h-[33%] w-full cursor-pointer overflow-hidden rounded-md border-2 border-duoGrayDark-light px-2 py-2 hover:overflow-y-auto'>
        {recordsData.map((file, index) => (
          <li
            key={file.name}
            className={`w-full border-duoGrayDark-dark text-lg ${
              index === Object.values(recordsData).length - 1 ||
              Object.values(recordsData).length === 1
                ? 'border-0'
                : 'border-b-2'
            }`}
          >
            <p
              className='w-full overflow-hidden text-ellipsis whitespace-nowrap p-1 hover:rounded-md hover:bg-duoGrayDark-light'
              onClick={() => {
                if (exerciseType === ExercisesTypes.FSA) {
                  const fileMetadata = file.metadata as FSAMetadata;
                  handleFileSelected(file.name, fileMetadata.record_length);
                } else {
                  handleFileSelected(file.name);
                }
              }}
            >
              {file.name}
            </p>
          </li>
        ))}
      </ul>

      {selectedFile && (
        <section>
          <div className='mx-auto flex w-full flex-col'>
            <ul className='my-4 rounded-lg border-2 px-6 py-4 dark:border-duoGrayDark-light'>
              <li className='w-full border-b-2 text-center text-duoGreen-default dark:border-duoGrayDark-light dark:text-duoBlueDark-text'>
                INFORMATION
              </li>
              <li className='my-1 scale-105 text-center font-extrabold opacity-70 dark:text-duoBlueDark-text'>
                {selectedFile.name}
              </li>

              {Object.keys(selectedFile.metadata).map((metaKey, metaIndex) => (
                <li className='my-1' key={metaKey}>
                  {Object.keys(selectedFile.metadata)[metaIndex] !==
                    'content-type' && (
                    <>
                      {`${Object.keys(selectedFile.metadata)[metaIndex]}: `}
                      {Object.keys(selectedFile.metadata)[metaIndex] ===
                      'record_length'
                        ? formatNumberToMinutes(
                            Number(
                              Object.values(selectedFile.metadata)[metaIndex]
                            )
                          )
                        : Object.values(selectedFile.metadata)[metaIndex] ||
                          'false'}
                    </>
                  )}
                </li>
              ))}
              <li>
                <Link href='' target='_blank'>
                  preview
                </Link>
              </li>
            </ul>
          </div>
          <button
            onClick={() => {
              console.log('add sub exercise', {
                fileName: selectedFile.name,
                description: null,
                time: 15,
              });
              addSubExercise({
                fileName: selectedFile.name,
                description: null,
                time: 15, //secs
              });
            }}
          >
            addSubExercise
          </button>
        </section>
      )}
    </div>
  );
};

export default CreateExerciseInfo;
