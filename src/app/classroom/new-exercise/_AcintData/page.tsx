'use client';
import { useState, useReducer, useEffect, useRef } from 'react';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faArrowUpFromBracket } from '@fortawesome/free-solid-svg-icons';

import { useInfoBarStore } from '@/app/store/stores/useInfoBarStore';

import { getAllRecords, uploadFile } from '@/app/API/files-service/functions';
import Table from '@/components/Table/page';
import Upload from '@/components/Upload/page';
import MetadataPopup from '@/app/popups/MetadataPopup/page';
import Button, { ButtonColors, ButtonTypes } from '@/components/Button/page';
import { useCreateExerciseStore } from '@/app/store/stores/useCreateExerciseStore';
import { useStore } from 'zustand';
import { PopupsTypes } from '@/app/store/stores/usePopupStore';
import {
  submitRecordAction,
  submitRecordReducer,
  submitDataType,
} from '@/reducers/submitRecordReducer';

library.add(faArrowUpFromBracket);

const AcintDataSection: React.FC = () => {
  const updateSelectedRecord = useInfoBarStore.getState().updateSelectedRecord;

  const updateExerciseToSubmit = {
    updateRecordName: useCreateExerciseStore.getState().updateRecordName,
    updateRecordLength: useCreateExerciseStore.getState().updateRecordLength,
    updateSonolistFiles: useCreateExerciseStore.getState().updateSonolistFiles,
    updateAnswersList: useCreateExerciseStore.getState().updateAnswersList,
  };

  const recordName = useStore(
    useCreateExerciseStore,
    (state) => state.recordName
  );
  const selectedRecord = useStore(
    useInfoBarStore,
    (state) => state.selectedRecord
  );

  const initialsubmitRecordState: submitDataType = {
    record: undefined,
    recordMetadata: {},
    sonograms: undefined,
    sonogramsMetadata: [],
  };

  const [submitRecordState, submitRecordDispatch] = useReducer(
    submitRecordReducer,
    initialsubmitRecordState
  );

  const [recordsData, setRecordsData] = useState<RecordType[]>([]);
  const [recordLength, setRecordLength] = useState<number>(0);

  const uploadRef = useRef<UploadRef>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getAllRecords();
      !!res ? setRecordsData(res) : null;
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (recordName) {
      updateSelectedRecord(
        recordsData[
          recordsData.map((record) => record.name).indexOf(recordName)
        ]
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recordName, recordsData]);

  const recordsHeaders: string[] = [
    'name',
    'difficulty_level',
    'targets_ids_list',
    'is_in_italy',
  ];

  const handleFileChange = (files: File | FileList | null) => {
    if (files instanceof FileList) {
      console.log('sonolist');
      files
        ? submitRecordDispatch({
            type: submitRecordAction.SET_SONOLIST,
            payload: files as FileList,
          })
        : null;
    } else {
      files
        ? submitRecordDispatch({
            type: submitRecordAction.SET_RECORD_FILE,
            payload: files as File,
          })
        : null;
    }
  };

  const handleFileRemoved = (fileIndex: number) => {
    submitRecordDispatch({
      type: submitRecordAction.REMOVE_SONOGRAM,
      payload: fileIndex,
    });
  };

  useEffect(() => {
    console.log('sonolist', submitRecordState.sonograms);
  }, [submitRecordState.sonograms]);

  const handleFileLength = (time: number | null) => {
    console.log('file length:', time);
    if (!!time) {
      setRecordLength(time);
      updateExerciseToSubmit.updateRecordLength(time);
    }
  };

  const handleSelectTableRow = (item: any) => {
    const record = recordsData.filter((record) => record.name === item.name)[0];
    console.log('handleSelectTableRow', record);
    updateSelectedRecord(record);
  };

  const uploadRecord = async () => {
    await new Promise((res) => setTimeout(res, 2000));
    if (
      !!submitRecordState.record &&
      !!submitRecordState.sonograms &&
      submitRecordState.recordMetadata &&
      submitRecordState.sonogramsMetadata
    ) {
      const sonolistResponse = await uploadFile(
        'sonolist',
        submitRecordState.sonograms,
        submitRecordState.sonogramsMetadata
      );
      if (sonolistResponse) {
        const recordResponse = await uploadFile(
          'records',
          submitRecordState.record,
          submitRecordState.recordMetadata
        );
      }
    }
  };

  useEffect(() => {
    if (selectedRecord) {
      updateExerciseToSubmit.updateRecordName(selectedRecord.name);
      updateExerciseToSubmit.updateRecordLength(
        selectedRecord.metadata.record_length
      );
      updateExerciseToSubmit.updateSonolistFiles(
        selectedRecord.metadata.sonograms_ids
      );
      updateExerciseToSubmit.updateAnswersList(
        selectedRecord.metadata.targets_ids_list
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRecord]);

  return (
    <section className='mx-auto h-full w-[90%] text-duoGray-darkest dark:text-duoGrayDark-lightest'>
      <MetadataPopup
        onSave={(data) =>
          PopupsTypes.RECORDMETADATA ? console.log('metadata', data) : null
        }
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
        selectedRowIndex={
          recordName
            ? recordsData.map((record) => record.name).indexOf(recordName)
            : undefined
        }
        onSelect={handleSelectTableRow}
      />

      <div className='relative my-3 flex w-full flex-row items-start justify-between gap-5 3xl:w-[55%]'>
        <div className='relative flex w-full flex-col justify-between 3xl:w-[45%]'>
          <Upload
            label={'Choose a .wav file'}
            filesTypes={'.wav'}
            isMultiple={false}
            ref={uploadRef}
            onFileChange={handleFileChange}
            onFileRemoved={handleFileRemoved}
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
            onFileRemoved={handleFileRemoved}
          />
        </div>
      </div>
      <div className='relative flex items-center justify-center py-8'>
        <form className='absolute left-0 w-[10rem]' action={uploadRecord}>
          <Button
            label={'UPLOAD'}
            isDisabled={
              !!!submitRecordState.record || !!!submitRecordState.sonograms
            }
            buttonType={ButtonTypes.SUBMIT}
            color={
              !!!submitRecordState.record || !!!submitRecordState.sonograms
                ? ButtonColors.GRAY
                : ButtonColors.BLUE
            }
            icon={faArrowUpFromBracket}
            loadingLabel={'Uploading...'}
            onClick={uploadRecord}
          />
        </form>
      </div>
    </section>
  );
};
export default AcintDataSection;
