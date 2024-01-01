'use client';
import React, {
  useImperativeHandle,
  forwardRef,
  useRef,
  ChangeEvent,
  useState,
} from 'react';
import Button, { ButtonTypes, Color } from '../Button/page';
import {
  FaRegFileAudio,
  FaRegTrashAlt,
  FaRegFileImage,
  FaExpandAlt,
} from 'react-icons/fa';
import { BsClipboard2Data } from 'react-icons/bs';
import { PopupsTypes, usePopupStore } from '@/app/store/stores/usePopupStore';
import { Themes, useThemeStore } from '@/app/store/stores/useThemeStore';
import { useStore } from 'zustand';

interface UploadProps {
  label: string;
  inputName?: string;
  isMultiple: boolean;
  errorMode?: boolean;
  filesTypes: string;
  onFileChange: (files: File | FileList | null) => void;
  fileLength?: (size: number | null) => void;
}

export interface UploadRef {
  focus: () => void;
  clear: () => void;
}

const Upload = forwardRef<UploadRef, UploadProps>((props: UploadProps, ref) => {
  const updateSelectedPopup = usePopupStore.getState().updateSelectedPopup;
  const theme = useStore(useThemeStore, (state) => state.theme);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [isFilesListOpen, setIsFilesListOpen] = useState<boolean>(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    const audioContext = new window.AudioContext();
    if (files) {
      if (props.filesTypes === '.wav') {
        const file = files[0];
        const reader = new FileReader();
        console.log('reader', reader);
        reader.onload = async (event) => {
          console.log('reader2', reader);
          if (event && event.target) {
            const arrayBuffer = event.target.result as ArrayBuffer;
            if (file.type.includes('audio') && arrayBuffer) {
              try {
                const audioBuffer =
                  await audioContext.decodeAudioData(arrayBuffer);

                const durationInSeconds = audioBuffer.duration;
                console.log('Duration:', durationInSeconds, 'seconds');
                props.fileLength
                  ? props.fileLength(durationInSeconds / 60)
                  : null;
              } catch (error) {
                console.error('Error decoding audio data:', error);
              }
            }
          }
        };
        reader.readAsArrayBuffer(file);
        props.onFileChange(file);
        setUploadedFiles((prevFiles) => [...prevFiles, file.name]);
      } else {
        console.log('files uploaded', files);
        const newFiles = Array.from(files);
        Promise.all(
          newFiles.map(async (file) => {
            const reader = new FileReader();
            return new Promise<string>((resolve) => {
              reader.onload = (e) => {
                if (e.target) {
                  resolve(e.target.result as string);
                }
              };
              reader.readAsArrayBuffer(file);
            });
          })
        )
          .then((fileBuffers) => {
            console.log('File buffers:', fileBuffers);
          })
          .catch((error) => {
            console.error('Error processing files:', error);
          });
        console.log('upload - files', files);
        props.onFileChange(files);
        setUploadedFiles((prevFiles) => [
          ...prevFiles,
          ...newFiles.map((file) => file.name),
        ]);
      }
    }
  };

  useImperativeHandle(ref, () => ({
    focus: () => {
      if (inputRef && inputRef.current) {
        inputRef.current.focus();
      }
    },
    clear: () => {
      if (inputRef && inputRef.current) {
        inputRef.current.value = '';
        setUploadedFiles([]);
      }
    },
  }));

  return (
    <div className='h-fit w-full'>
      <div className='relative flex h-16 w-full flex-row items-center gap-4'>
        <Button
          label={props.label}
          color={
            props.errorMode
              ? Color.ERROR
              : theme === Themes.LIGHT
                ? Color.GRAY
                : Color.WHITE
          }
          onClick={() => inputRef.current?.click()}
          isDisabled={!props.isMultiple && uploadedFiles.length > 0}
          buttonType={ButtonTypes.BUTTON}
        />
        {uploadedFiles.length > 0 ? (
          <button
            className='right-0 flex h-8 w-8 items-center justify-center rounded-full bg-duoGray-lighter text-lg hover:bg-duoGray-hover'
            onClick={() => setIsFilesListOpen(!isFilesListOpen)}
          >
            <FaExpandAlt />
          </button>
        ) : null}
      </div>
      {isFilesListOpen && uploadedFiles.length > 0 ? (
        <div className='w-full rounded-md border-2'>
          <ul
            className='flex flex-col font-bold'
            style={{ borderRadius: '24px' }}
          >
            {isFilesListOpen &&
              uploadedFiles.map((file, fileIndex) => (
                <>
                  <li
                    key={fileIndex}
                    className={`flex flex-row items-center justify-between px-3 py-2 hover:bg-duoBlue-lightest hover:text-duoBlue-light`}
                    style={
                      fileIndex === uploadedFiles.length - 1
                        ? fileIndex === 0
                          ? {
                              borderTopLeftRadius: '4px 4px',
                              borderTopRightRadius: '4px 4px',
                              borderBottomLeftRadius: '4px 4px',
                              borderBottomRightRadius: '4px 4px',
                            }
                          : {
                              borderBottomLeftRadius: '4px 4px',
                              borderBottomRightRadius: '4px 4px',
                            }
                        : fileIndex === 0
                          ? {
                              borderTopLeftRadius: '4px 4px',
                              borderTopRightRadius: '4px 4px',
                            }
                          : {}
                    }
                  >
                    <div className='flex w-full flex-row'>
                      {file.endsWith('.wav') ? (
                        <FaRegFileAudio className='mr-2 text-xl 3xl:text-2xl' />
                      ) : (
                        <FaRegFileImage className='mr-2 text-xl 3xl:text-2xl' />
                      )}
                      <span className='w-[80%]'>{file}</span>
                    </div>
                    <button
                      onClick={() =>
                        setUploadedFiles((prev) =>
                          prev.filter((_, itemIndex) => itemIndex !== fileIndex)
                        )
                      }
                    >
                      <FaRegTrashAlt />
                    </button>
                  </li>
                  {file.endsWith('.wav') ? (
                    <li
                      className={`flex flex-row items-center justify-between px-3 py-2`}
                    >
                      <button
                        className='flex w-fit flex-row hover:text-duoBlue-default'
                        onClick={() => {
                          updateSelectedPopup(PopupsTypes.METADATA);
                        }}
                      >
                        <BsClipboard2Data className='mr-2 text-xl 3xl:text-2xl' />
                        <span>add metadata</span>
                      </button>
                    </li>
                  ) : null}
                </>
              ))}
          </ul>
        </div>
      ) : null}
      <input
        id='upload-input'
        type='file'
        name={props.inputName}
        ref={inputRef}
        onChange={handleFileChange}
        multiple={props.isMultiple}
        accept={props.filesTypes}
        className='hidden'
      />
    </div>
  );
});

// Add display name to the component
Upload.displayName = 'Upload';

export default Upload;
