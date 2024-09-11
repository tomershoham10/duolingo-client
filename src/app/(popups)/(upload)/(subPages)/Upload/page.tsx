'use client';
import { useCallback, useEffect, useState } from 'react';
import FileDropZone from '@/components/FileDropZone';
import { FaTrashAlt } from 'react-icons/fa';

interface UploadFilesProps {
  onFilesChanged: (files: File[]) => void;
}

const UploadFiles: React.FC<UploadFilesProps> = (props) => {
  const { onFilesChanged } = props;

  const [files, setFiles] = useState<File[]>([]);

  const handleFilesChanged = useCallback((filesList: File[]) => {
    setFiles(filesList);
  }, []);

  const handleFileRemove = useCallback((fileName: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
  }, []);

  useEffect(() => {
    onFilesChanged(files);
  }, [files, onFilesChanged]);

  return (
    <section className='mt-12 flex w-full flex-col gap-y-4 px-4 py-4'>
      <FileDropZone onFilesChanged={handleFilesChanged} />

      {files.length > 0 && (
        <ul className='max-h-52 w-full cursor-pointer overflow-y-auto rounded-md border-2 border-duoGrayDark-light px-2 py-2'>
          {files.map((file, index) => (
            <li
              key={file.name}
              className={`group flex w-full flex-row border-duoGrayDark-dark px-2 text-lg hover:rounded-md hover:bg-duoGrayDark-light ${
                index === files.length - 1 || files.length === 1
                  ? 'border-0'
                  : 'border-b-2'
              }`}
            >
              <p className='w-full overflow-hidden text-ellipsis whitespace-nowrap p-1'>
                {file.name}
              </p>
              <button
                className='hidden group-hover:block'
                onClick={() => handleFileRemove(file.name)}
              >
                <FaTrashAlt />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default UploadFiles;
