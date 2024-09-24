'use client';
import { useCallback, useEffect, useState } from 'react';
import { useCreateSpotreccStore } from '@/app/store/stores/(createExercises)/useCreateSpotreccStore';
import MetadataSection from '../../(utils)/MetadataSection';
import { useStore } from 'zustand';
import { useInfoBarStore } from '@/app/store/stores/useInfoBarStore';
import { useFetchModelFiles } from '@/app/_utils/hooks/useFetchModelFiles';
import PlusButton from '@/components/PlusButton/page';

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
    <div className='flex h-full w-full flex-col gap-3 p-4'>
      <h1>Files</h1>
      <ul className='max-h-[33%] w-full cursor-pointer overflow-hidden rounded-md border-2 border-duoGrayDark-light px-2 py-2 hover:overflow-y-auto'>
        {filesData.map((file, index) => (
          <li
            key={file.name}
            className={`grid w-full border-duoGrayDark-dark text-lg ${
              index === Object.values(CreateSpotreccInfo).length - 1 ||
              Object.values(CreateSpotreccInfo).length === 1
                ? 'border-0'
                : 'border-b-2'
            }`}
          >
            <div
              className='w-full overflow-hidden text-ellipsis whitespace-nowrap p-1 hover:rounded-md hover:bg-duoGrayDark-light'
              onClick={() => {
                handleFileSelected(file.name);
              }}
              title={file.name} // Tooltip for long names
            >
              {file.name}
            </div>
          </li>
        ))}
      </ul>

      {selectedFile && (
        <MetadataSection
          mainId={selectedMainTypeId || ''}
          subtypeId={selectedSubTypeId || ''}
          modelId={selectedModel?._id || ''}
          fileType={
            selectedFile.name?.endsWith('.wav')
              ? FileTypes.RECORDS
              : FileTypes.IMAGES
          }
          fileName={selectedFile.name}
          metadata={selectedFile.metadata}
        >
          <PlusButton
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
          />
        </MetadataSection>
      )}
    </div>
  );
};

export default CreateSpotreccInfo;
