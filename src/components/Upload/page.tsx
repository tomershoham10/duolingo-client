'use client';
import React, {
  useImperativeHandle,
  forwardRef,
  useRef,
  ChangeEvent,
  useState,
  useEffect,
} from 'react';
import Button, { ButtonTypes, ButtonColors } from '@/components/Button/page';
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

const Upload = forwardRef<UploadRef, UploadProps>((props: UploadProps, ref) => {
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
    RecordType | SonogramType[] | undefined
  >(props.files);

  useEffect(() => {
    console.log('props.files', props.files);
    setUploadedFiles(props.files);
  }, [props.files]);

  useEffect(() => {
    if (selectedFile) {
      const selectedFileName = selectedFile.name;
      !uploadedFilesNames.includes(selectedFileName)
        ? setSelectedFileIndex(-1)
        : null;
    }
  }, [uploadedFilesNames, selectedFile]);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    const audioContext = new window.AudioContext();
    if (files) {
      if (props.filesTypes === '.wav') {
        const file = files[0];
        const isExisted = await isFileExisted(file.name, 'records');
        console.log('isFileExisted', file.name, isExisted);
        if (isExisted) {
          addAlert('Record already existed!', AlertSizes.small);
          return;
        }
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
        setUploadedFilesNames((prevFiles) => [...prevFiles, file.name]);
      } else {
        console.log('files uploaded', files);
        // const newFiles = Array.from(files);
        // Promise.all(
        //   newFiles.map(async (file) => {
        //     const isExisted = await isFileExisted(file.name, 'sonograms');
        //     console.log('fail check', file, file.name, isExisted);
        //     if (isExisted) {
        //       addAlert(
        //         `Sonogram ${file.name} already existed!`,
        //         AlertSizes.small
        //       );
        //       return null;
        //     }
        //     const reader = new FileReader();
        //     return new Promise<string>((resolve) => {
        //       reader.onload = (e) => {
        //         if (e.target) {
        //           resolve(e.target.result as string);
        //         }
        //       };
        //       reader.readAsArrayBuffer(file);
        //     });
        //   })
        // )
        //   .then((fileBuffers) => {
        //     console.log('File buffers:', fileBuffers);
        //   })
        //   .catch((error) => {
        //     console.error('Error processing files:', error);
        //   });

        console.log('files with nulls', files);
        const filesArray: File[] = Array.from(files);

        const isValidFile = async (file: File) => {
          const status = await isFileExisted(file.name, 'sonograms');
          console.log('isFileExisted', file.name, status);

          status
            ? addAlert(
                `Sonogram ${file.name} already existed!`,
                AlertSizes.small
              )
            : null;
          console.log('status', file.name, status);
          return !status;
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

        props.onFileChange(validFilesArray);
        setUploadedFilesNames((prevFiles) => [
          ...prevFiles,
          ...validFilesArray.map((file) => file.name),
        ]);
      }
    }
  };

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
      console.log('selectedFile', selectedFile);
    }
  };

  const handleFileRemoved = (index: number) => {
    console.log('handleFileRemoved', index);
    updateSelectedFile(undefined);
    setUploadedFilesNames((prev) =>
      prev.filter((_, itemIndex) => itemIndex !== index)
    );
    props.onFileRemoved(props.filesTypes.includes('.wav') ? undefined : index);
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
          label={props.label}
          color={
            props.errorMode
              ? ButtonColors.ERROR
              : theme === Themes.LIGHT
                ? ButtonColors.GRAY
                : ButtonColors.WHITE
          }
          onClick={() => inputRef.current?.click()}
          isDisabled={!props.isMultiple && uploadedFilesNames.length > 0}
          buttonType={ButtonTypes.BUTTON}
        />
        {uploadedFilesNames.length > 0 ? (
          <button
            className='right-0 flex h-8 w-8 items-center justify-center rounded-full
            bg-duoGray-lighter text-lg
             hover:bg-duoGray-hover dark:bg-duoGrayDark-light dark:hover:bg-duoGrayDark-lighter'
            onClick={() => setIsFilesListOpen(!isFilesListOpen)}
          >
            <FaExpandAlt />
          </button>
        ) : null}
      </div>
      {isFilesListOpen && uploadedFilesNames.length > 0 ? (
        <div className='w-full rounded-md border-2 dark:border-duoGrayDark-light'>
          <ul
            className='flex flex-col font-bold'
            style={{ borderRadius: '24px' }}
          >
            {isFilesListOpen &&
              uploadedFilesNames.map((file, fileIndex) => (
                <li
                  key={fileIndex}
                  className={`flex cursor-pointer flex-row items-center justify-between px-3 py-2 hover:bg-duoBlue-lightest hover:text-duoBlue-light dark:hover:bg-duoGrayDark-dark
                  ${
                    selectedFileIndex === fileIndex
                      ? 'bg-duoBlue-lightest text-duoBlue-light dark:bg-duoGrayDark-dark'
                      : null
                  }
                  `}
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
                className={`flex w-fit cursor-pointer flex-row hover:text-duoBlue-default dark:text-duoBlueDark-text dark:hover:text-duoBlueDark-textHover
                ${
                  props.filesTypes !== '.wav' && selectedFileIndex === -1
                    ? 'opacity-60 hover:dark:text-duoBlueDark-text'
                    : ''
                }`}
                onClick={() => {
                  props.filesTypes === '.wav'
                    ? updateSelectedPopup(PopupsTypes.RECORDMETADATA)
                    : updateSelectedPopup(PopupsTypes.SONOLISTMETADATA);
                }}
                disabled={
                  props.filesTypes !== '.wav' && selectedFileIndex === -1
                }
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
