'use client';
import React, {
  useImperativeHandle,
  forwardRef,
  useRef,
  ChangeEvent,
  useState,
  useEffect,
  useCallback,
} from 'react';
import Button, {
  ButtonTypes,
  ButtonColors,
} from '@/components/(buttons)/Button/page';
import {
  FaRegFileAudio,
  FaRegTrashAlt,
  FaRegFileImage,
  FaExpandAlt,
} from 'react-icons/fa';
import { BsClipboard2Data } from 'react-icons/bs';
import { usePopupStore, PopupsTypes } from '@/app/store/stores/usePopupStore';
import { useThemeStore, Themes } from '@/app/store/stores/useThemeStore';
import { useStore } from 'zustand';
import { useInfoBarStore } from '@/app/store/stores/useInfoBarStore';
import { isFileExisted } from '@/app/API/files-service/functions';
import { AlertSizes, useAlertStore } from '@/app/store/stores/useAlertStore';
import pRetry from 'p-retry';

const Upload = forwardRef<UploadRef, UploadProps>((props: UploadProps, ref) => {
  const {
    label,
    inputName,
    isDisabled,
    isMultiple,
    errorMode,
    showMode,
    filesTypes,
    bucketName,
    exerciseType,
    files,
    onFileChange,
    onFileRemoved,
    fileLength,
  } = props;

  const updateSelectedPopup = usePopupStore.getState().updateSelectedPopup;
  const updateSelectedFile = useInfoBarStore.getState().updateSelectedFile;
  const addAlert = useAlertStore.getState().addAlert;

  const selectedFile = useStore(useInfoBarStore, (state) => state.selectedFile);
  const theme = useStore(useThemeStore, (state) => state.theme);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploadedFilesNames, setUploadedFilesNames] = useState<string[]>([]);
  const [isFilesListOpen, setIsFilesListOpen] = useState<boolean>(false);

  const [selectedFileIndex, setSelectedFileIndex] = useState<number>(-1);

  const [uploadedFiles, setUploadedFiles] = useState<
    FileType | FileType[] | undefined
  >(files);

  useEffect(() => {
    console.log('props files', files);
    setUploadedFiles(files);
  }, [files]);

  useEffect(() => {
    if (selectedFile) {
      const selectedFileName = selectedFile.name;
      selectedFileName && !uploadedFilesNames.includes(selectedFileName)
        ? setSelectedFileIndex(-1)
        : null;
    }
  }, [uploadedFilesNames, selectedFile]);

  const handleFileChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      const audioContext = new window.AudioContext();
      if (files) {
        if (filesTypes === '.wav') {
          const file = files[0];
          // const isExisted = await isFileExisted(file.name, 'records');

          const isExisted = await pRetry(
            () => isFileExisted(file.name, exerciseType, bucketName),
            {
              retries: 5,
            }
          );
          console.log('isFileExisted', file.name, isExisted);
          if (isExisted) {
            addAlert('Record already existed!', AlertSizes.small);
            return;
          }
          const reader = new FileReader();
          console.log('reader', reader);
          reader.onload = async (event) => {
            try {
              console.log('reader2', reader);
              if (event && event.target) {
                const arrayBuffer = event.target.result as ArrayBuffer;
                if (file.type.includes('audio') && arrayBuffer) {
                  try {
                    const audioBuffer =
                      await audioContext.decodeAudioData(arrayBuffer);

                    const durationInSeconds = audioBuffer.duration;
                    console.log('Duration:', durationInSeconds, 'seconds');
                    fileLength ? fileLength(durationInSeconds / 60) : null;
                  } catch (error) {
                    console.error('Error decoding audio data:', error);
                  }
                }
              }
            } catch (err) {
              console.error('reader error:', err);
            }
          };
          reader.readAsArrayBuffer(file);
          onFileChange(file);
          setUploadedFilesNames((prevFiles) => [...prevFiles, file.name]);
        } else {
          console.log('files uploaded', files);

          const filesArray: File[] = Array.from(files);

          const isValidFile = async (file: File) => {
            //   const status = await isFileExisted(file.name, BucketsNames.SONOGRAMS);

            try {
              const status = await pRetry(
                () => isFileExisted(file.name, exerciseType, bucketName),
                {
                  retries: 5,
                }
              );
              console.log('isFileExisted', file.name, status);

              status
                ? addAlert(
                    `Sonogram ${file.name} already existed!`,
                    AlertSizes.small
                  )
                : null;
              console.log('status', file.name, status);
              return !status;
            } catch (err) {
              console.error('isValidFile error:', err);
            }
          };

          const validFilesArray: File[] = await Promise.all(
            filesArray.map(async (file) => ({
              file,
              isValid: await isValidFile(file),
            }))
          )
            .then((result) => result.filter(({ isValid }) => isValid))
            .then((filteredFiles) => filteredFiles.map(({ file }) => file));

          console.log('validFilesArray', validFilesArray);

          // const validFilesList: FileList = new FileList();

          onFileChange(validFilesArray);
          setUploadedFilesNames((prevFiles) => [
            ...prevFiles,
            ...validFilesArray.map((file) => file.name),
          ]);
        }
      }
      try {
      } catch (err) {
        console.error('handleFileChange error:', err);
      }
    },
    [addAlert, bucketName, exerciseType, fileLength, filesTypes, onFileChange]
  );

  const handleUploadedFileSelect = (fileIndex: number) => {
    setSelectedFileIndex(fileIndex);
    console.log(1);
    if (!!uploadedFiles) {
      console.log(2);
      if (Array.isArray(uploadedFiles)) {
        console.log(3);

        console.log('check', uploadedFiles);
        updateSelectedFile({
          name: uploadedFiles[fileIndex].name,
          metadata: uploadedFiles[fileIndex].metadata,
        });
      } else {
        console.log(uploadedFiles.name);
        updateSelectedFile({
          name: uploadedFiles.name,
          metadata: uploadedFiles.metadata,
        });
      }
      console.log('upload - selectedFile', selectedFile);
    }
  };

  const handleFileRemoved = (index: number) => {
    console.log('handleFileRemoved', index);
    updateSelectedFile(null);
    setUploadedFilesNames((prev) =>
      prev.filter((_, itemIndex) => itemIndex !== index)
    );
    onFileRemoved(filesTypes.includes('.wav') ? undefined : index);
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
        setUploadedFilesNames([]);
      }
    },
  }));

  return (
    <div className='h-fit w-full'>
      <div className='relative flex h-16 w-full flex-row items-center gap-4'>
        <Button
          label={label}
          color={
            errorMode
              ? ButtonColors.ERROR
              : theme === Themes.LIGHT
                ? ButtonColors.GRAYBLUE
                : ButtonColors.WHITE
          }
          onClick={() => inputRef.current?.click()}
          isDisabled={
            isDisabled || (!isMultiple && uploadedFilesNames.length > 0)
          }
          buttonType={ButtonTypes.BUTTON}
        />
        {showMode && uploadedFilesNames.length > 0 ? (
          <button
            className='right-0 flex h-8 w-8 items-center justify-center rounded-full bg-duoGray-lighter text-lg hover:bg-duoGray-hover dark:bg-duoGrayDark-light dark:hover:bg-duoGrayDark-lighter'
            onClick={() => setIsFilesListOpen(!isFilesListOpen)}
          >
            <FaExpandAlt />
          </button>
        ) : null}
      </div>
      {showMode && isFilesListOpen && uploadedFilesNames.length > 0 ? (
        <div className='w-full rounded-md border-2 dark:border-duoGrayDark-light'>
          <ul
            className='flex flex-col font-bold'
            style={{ borderRadius: '24px' }}
          >
            {isFilesListOpen &&
              uploadedFilesNames.map((file, fileIndex) => (
                <li
                  key={fileIndex}
                  className={`flex cursor-pointer flex-row items-center justify-between px-3 py-2 hover:bg-duoBlue-lightest hover:text-duoBlue-light dark:hover:bg-duoGrayDark-dark ${
                    selectedFileIndex === fileIndex
                      ? 'bg-duoBlue-lightest text-duoBlue-light dark:bg-duoGrayDark-dark'
                      : null
                  } `}
                  style={
                    fileIndex === 0
                      ? {
                          borderTopLeftRadius: '4px 4px',
                          borderTopRightRadius: '4px 4px',
                        }
                      : {}
                  }
                >
                  <div
                    className='flex w-full cursor-pointer flex-row'
                    onClick={() => handleUploadedFileSelect(fileIndex)}
                  >
                    {file.endsWith('.wav') ? (
                      <FaRegFileAudio className='mr-2 text-xl 3xl:text-2xl' />
                    ) : (
                      <FaRegFileImage className='mr-2 text-xl 3xl:text-2xl' />
                    )}
                    <span className='w-[80%]'>{file}</span>
                  </div>
                  <button onClick={() => handleFileRemoved(fileIndex)}>
                    <FaRegTrashAlt />
                  </button>
                </li>
              ))}

            <li
              className={`flex flex-row items-center justify-between px-3 py-2`}
            >
              <button
                className={`flex w-fit cursor-pointer flex-row hover:text-duoBlue-default dark:text-duoBlueDark-text dark:hover:text-duoBlueDark-textHover ${
                  filesTypes !== '.wav' && selectedFileIndex === -1
                    ? 'opacity-60 hover:dark:text-duoBlueDark-text'
                    : ''
                }`}
                onClick={() => {
                  filesTypes === '.wav'
                    ? updateSelectedPopup(PopupsTypes.EDIT_METADATA)
                    : updateSelectedPopup(PopupsTypes.SONOLIST_METADATA);
                }}
                // disabled={selectedFileIndex === -1
                // }
              >
                <BsClipboard2Data className='mr-2 text-xl 3xl:text-2xl' />
                <span>add metadata</span>
              </button>
            </li>
          </ul>
        </div>
      ) : null}
      <input
        id='upload-input'
        type='file'
        name={inputName}
        ref={inputRef}
        onChange={handleFileChange}
        multiple={isMultiple}
        accept={filesTypes}
        className='hidden'
      />
    </div>
  );
});

// Add display name to the component
Upload.displayName = 'Upload';

export default Upload;
