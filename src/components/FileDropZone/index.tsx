'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FaCloudUploadAlt } from 'react-icons/fa';

import { useDroppable } from '@dnd-kit/core';
// import Button, { ButtonColors, ButtonTypes } from '../Button/page';

interface FileDropZoneProps {
  onFilesChanged: (files: File[]) => void;
}

const FileDropZone: React.FC<FileDropZoneProps> = (props) => {
  const { onFilesChanged } = props;
  const { setNodeRef } = useDroppable({ id: 'file-drop-zone' });
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files) {
        setFiles([...event.target.files]);
      }
    },
    []
  );

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    if (event.dataTransfer.files) {
      setFiles((prev) => [...prev, ...event.dataTransfer.files]);
    }
  }, []);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  useEffect(() => {
    onFilesChanged(files);
  }, [files, onFilesChanged]);

  return (
    <section
      ref={setNodeRef}
      className='flex h-40 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-duoGrayDark-lightest p-4'
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <section className='text-8xl text-duoGrayDark-lightestOpacity'>
        <FaCloudUploadAlt />
      </section>
      <p className='font-bold text-duoGrayDark-lightestOpacity'>
        Drag & Drop your files here
      </p>
      <input
        type='file'
        ref={fileInputRef}
        className='hidden'
        onChange={handleFileChange}
        multiple
      />
    </section>
  );
};

export default FileDropZone;
