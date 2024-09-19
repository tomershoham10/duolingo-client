'use client';
import { useCallback, useEffect, useState } from 'react';
import pRetry from 'p-retry';
import { ExercisesTypes } from '@/app/API/classes-service/exercises/functions';
import { useCreateSpotreccStore } from '@/app/store/stores/(createExercises)/useCreateSpotreccStore';
import {
  BucketsNames,
  getFileByBucketAndType,
} from '@/app/API/files-service/functions';
import { useCreateFsaStore } from '@/app/store/stores/(createExercises)/useCreateFsaStore';
import MetadataSection from '../(utils)/MetadataSection';

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

  // need to fetch data by model
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
  }, [exerciseType]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
    [exerciseType, recordsData, setFileName, updateRecordLength]
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
        <MetadataSection
          fileName={selectedFile.name}
          metadata={selectedFile.metadata}
        >
          {exerciseType === ExercisesTypes.SPOTRECC && (
            <button
              onClick={() => {
                console.log('add sub exercise', {
                  fileName: selectedFile.name,
                  description: null,
                  exerciseTime: 15,
                  bufferTime: 15,
                });
                addSubExercise({
                  fileName: selectedFile.name,
                  description: null,
                  exerciseTime: 15, //secs
                  bufferTime: 15,
                });
              }}
            >
              addSubExercise
            </button>
          )}
        </MetadataSection>
      )}
    </div>
  );
};

export default CreateExerciseInfo;
