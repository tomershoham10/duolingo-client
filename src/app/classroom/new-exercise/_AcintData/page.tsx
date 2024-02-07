'use client';
import { useState, useReducer, useEffect, useRef } from 'react';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faArrowUpFromBracket } from '@fortawesome/free-solid-svg-icons';

import { useInfoBarStore } from '@/app/store/stores/useInfoBarStore';

import { getAllRecords, uploadFile } from '@/app/API/files-service/functions';
import Table, { TableHead, TableRow } from '@/components/Table/page';
import Upload from '@/components/Upload/page';
import MetadataPopup, { FilesTypes } from '@/app/popups/MetadataPopup/page';
import Button, { ButtonColors, ButtonTypes } from '@/components/Button/page';
import { useCreateExerciseStore } from '@/app/store/stores/useCreateExerciseStore';
import { useStore } from 'zustand';
import { PopupsTypes } from '@/app/store/stores/usePopupStore';
import {
  submitRecordAction,
  submitRecordReducer,
  submitRecordDataType,
} from '@/reducers/submitRecordReducer';
import { useTargetStore } from '@/app/store/stores/useTargetStore';
import { AlertSizes, useAlertStore } from '@/app/store/stores/useAlertStore';
import { getTargetsList } from '@/app/API/classes-service/targets/functions';
import { useSourceStore } from '@/app/store/stores/useSourceStore';
import { getSourcesList } from '@/app/API/classes-service/sources/functions';

library.add(faArrowUpFromBracket);

const AcintDataSection: React.FC = () => {
  const updateSelectedFile = useInfoBarStore.getState().updateSelectedFile;
  const targetsListDB = useStore(useTargetStore, (state) => state.targets);
  const sourcesListDB = useStore(useSourceStore, (state) => state.sources);

  useEffect(() => {
    const fetchTargets = async () => {
      await getTargetsList();
    };

    const fetchSources = async () => {
      await getSourcesList();
    };

    if (!!!targetsListDB) {
      fetchTargets();
    }

    if (!!!sourcesListDB) {
      fetchSources();
    }
  }, []);

  const addAlert = useAlertStore.getState().addAlert;

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
  const selectedFile = useStore(useInfoBarStore, (state) => state.selectedFile);

  const initialsubmitRecordState: submitRecordDataType = {
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
  const [tableData, setTableData] = useState<TableRow[]>([]);

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
      updateSelectedFile(
        recordsData[
          recordsData.map((record) => record.name).indexOf(recordName)
        ]
      );
    }
    setTableData(
      recordsData.map(({ name, id, metadata }) => ({
        name,
        id,
        ...metadata,
      }))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recordName, recordsData]);

  useEffect(() => {
    console.log('tableData1', tableData);
    tableData.map((row) => {
      row.targets_list = row.targets_ids_list;
      if (row.targets_list) {
        console.log('check2', row.targets_list);

        // for (let i: number = 0; i < row.targets_list.length; i++) {
        //   console.log('row.targets_list[i]', row.targets_list[i]);
        //   row.targets_list[i] = targetsListDB.map(
        //     (target) => target._id === row.targets_list[i]
        //   );
        // }
        delete row.targetsids_list;
      }
    });
    console.log('tableData2', tableData);
  }, [tableData, targetsListDB]);

  //   const handleFileChange = (files: File | FileList | null) => {
  const handleFileChange = (files: File | File[] | null) => {
    // if (files instanceof FileList) {
    if (Array.isArray(files)) {
      console.log('sonolist');
      files
        ? submitRecordDispatch({
            type: submitRecordAction.SET_SONOLIST,
            // payload: files as FileList,
            payload: files as File[],
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

  const handleFileRemoved = (fileIndex: number | undefined) => {
    if (!!!fileIndex) {
      submitRecordDispatch({
        type: submitRecordAction.REMOVE_RECORD_FILE,
      });
    } else {
      submitRecordDispatch({
        type: submitRecordAction.REMOVE_SONOGRAM,
        payload: fileIndex,
      });

      submitRecordDispatch({
        type: submitRecordAction.REMOVE_SONOGRAM_META,
        payload: fileIndex,
      });
    }
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
    updateSelectedFile(record);
  };

  const uploadRecord = async () => {
    try {
      await new Promise((res) => setTimeout(res, 2000));
      if (
        !!submitRecordState.record &&
        !!submitRecordState.sonograms &&
        submitRecordState.recordMetadata &&
        submitRecordState.sonogramsMetadata
      ) {
        const sonolistResponse = await uploadFile(
          'sonograms',
          submitRecordState.sonograms,
          submitRecordState.sonogramsMetadata
        );
        console.log('sonolistResponse', sonolistResponse);
        if (sonolistResponse) {
          const recordResponse = await uploadFile(
            'records',
            submitRecordState.record,
            submitRecordState.recordMetadata
          );
          if (recordResponse) {
            addAlert(
              'uploaded record and sonolist successfully',
              AlertSizes.small
            );
            return;
          } else {
            addAlert('error while uploading record', AlertSizes.small);
            return;
          }
        } else {
          addAlert('error while uploading sonograms', AlertSizes.small);
          return;
        }
      }
    } catch (error) {
      addAlert(`${error}`, AlertSizes.small);
    }
  };

  useEffect(() => {
    if (selectedFile && selectedFile.name.endsWith('wav')) {
      const metadata = selectedFile.metadata as Partial<RecordMetadataType>;
      updateExerciseToSubmit.updateRecordName(selectedFile.name);
      updateExerciseToSubmit.updateRecordLength(Number(metadata.record_length));
      updateExerciseToSubmit.updateSonolistFiles(metadata.sonograms_ids);
      updateExerciseToSubmit.updateAnswersList(
        Array.isArray(metadata.targets_ids_list)
          ? metadata.targets_ids_list
          : !!metadata.targets_ids_list
            ? [metadata.targets_ids_list]
            : []
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFile]);

  //   const recordsHeaders: string[] = [
  //     'name',
  //     'difficulty_level',
  //     'targets_ids_list',
  //     'is_in_italy',
  //   ];

  const TABLE_HEAD: TableHead[] = [
    { key: 'name', label: 'Name' },
    { key: 'difficulty_level', label: 'Difficulty level' },
    { key: 'targets_ids_list', label: 'Targets list' },
    { key: 'is_in_italy', label: 'is in italy' },
    // Add more headers as needed
  ];

  return (
    <section className='h-full  text-duoGray-darkest dark:text-duoGrayDark-lightest'>
      <MetadataPopup
        onSave={(type, data) =>
          PopupsTypes.RECORDMETADATA
            ? type === FilesTypes.RECORD
              ? submitRecordDispatch({
                  type: submitRecordAction.SET_RECORD_METADATA,
                  payload: data,
                })
              : null
            : null
        }
      />
      <span className='my-3 text-2xl font-bold'>Select \ upload record:</span>
      <section className='my-5 flex justify-start'>
        <Table
          head={TABLE_HEAD}
          rows={tableData}
          onSelect={handleSelectTableRow}
          selectedRowIndex={
            recordName
              ? recordsData.map((record) => record.name).indexOf(recordName)
              : undefined
          }
          isSelectable={
            selectedFile
              ? recordsData
                  .map((record) => record.name)
                  .includes(selectedFile.name)
              : true
          }
        />
      </section>

      <div className='relative my-3 flex w-full flex-row items-start justify-between gap-5 3xl:w-[55%]'>
        <div className='relative flex w-full flex-col justify-between 3xl:w-[45%]'>
          <Upload
            label={'Choose a .wav file'}
            filesTypes={'.wav'}
            isMultiple={false}
            ref={uploadRef}
            files={
              submitRecordState.record
                ? ({
                    name: submitRecordState.record.name,
                    metadata: submitRecordState.recordMetadata,
                  } as RecordType)
                : undefined
            }
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
            files={
              submitRecordState.sonograms
                ? Array.from(submitRecordState.sonograms).map(
                    (sonogram, sonoIndex) => {
                      return {
                        name: sonogram.name,
                        metadata:
                          submitRecordState.sonogramsMetadata[sonoIndex],
                      };
                    }
                  )
                : undefined
            }
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