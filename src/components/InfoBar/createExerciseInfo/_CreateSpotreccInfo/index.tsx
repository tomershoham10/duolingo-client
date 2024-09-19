'use client';
import { useCallback, useEffect, useState } from 'react';
import { useCreateSpotreccStore } from '@/app/store/stores/(createExercises)/useCreateSpotreccStore';
import MetadataSection from '../../(utils)/MetadataSection';
import { useStore } from 'zustand';
import { useInfoBarStore } from '@/app/store/stores/useInfoBarStore';
import { useFetchModelFiles } from '@/app/_utils/hooks/useFetchModelFiles';

const CreateSpotreccInfo: React.FC = () => {
  const addSubExercise = useCreateSpotreccStore.getState().addSubExercise;
  const [selectedFile, setSelectedFile] = useState<FileType | null>(null);

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

  const { filesData, fetchData } = useFetchModelFiles(
    selectedMainTypeId,
    selectedSubTypeId,
    selectedModel?._id || null
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFileSelected = useCallback(
    (selectedFileName: string, recordLength?: number) => {
      console.log('handleFileSelected', CreateSpotreccInfo);
      setSelectedFile(
        filesData.filter((item) => item.name === selectedFileName)[0]
      );
    },
    [filesData]
  );

  useEffect(() => {
    console.log('CreateSpotreccInfo - CreateSpotreccInfo', filesData);
  }, [filesData]);

  useEffect(() => {
    console.log('CreateSpotreccInfo - selectedFile', selectedFile);
  }, [selectedFile]);

  return (
    <div className='flex h-full w-[90%] flex-col gap-3 px-6 py-4'>
      <h1>Files</h1>
      <ul className='max-h-[33%] w-full cursor-pointer overflow-hidden rounded-md border-2 border-duoGrayDark-light px-2 py-2 hover:overflow-y-auto'>
        {filesData.map((file, index) => (
          <li
            key={file.name}
            className={`w-full border-duoGrayDark-dark text-lg ${
              index === Object.values(CreateSpotreccInfo).length - 1 ||
              Object.values(CreateSpotreccInfo).length === 1
                ? 'border-0'
                : 'border-b-2'
            }`}
          >
            <p
              className='w-full overflow-hidden text-ellipsis whitespace-nowrap p-1 hover:rounded-md hover:bg-duoGrayDark-light'
              onClick={() => {
                handleFileSelected(file.name);
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
                exerciseTime: 15,
                bufferTime: 15,
              });
            }}
          >
            addSubExercise
          </button>
        </MetadataSection>
      )}
    </div>
  );
};

export default CreateSpotreccInfo;
