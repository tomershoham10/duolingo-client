'use client';
import { useState, useReducer, useEffect, useRef, lazy } from 'react';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faArrowUpFromBracket } from '@fortawesome/free-solid-svg-icons';

import { useInfoBarStore } from '@/app/store/stores/useInfoBarStore';

import {
  getFileByBucketName,
  uploadFile,
} from '@/app/API/files-service/functions';
import Table, { TableHead, TableRow } from '@/components/Table/page';
import Upload from '@/components/Upload/page';
import { FilesTypes } from '@/app/_popups/MetadataPopup/page';
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
import pRetry from 'p-retry';

const MetadataPopup = lazy(() => import('@/app/_popups/MetadataPopup/page'));

library.add(faArrowUpFromBracket);

const AcintDataSection: React.FC = () => {
  const infoBarStore = {
    selectedFile: useStore(useInfoBarStore, (state) => state.selectedFile),
    updateSelectedFile: useInfoBarStore.getState().updateSelectedFile,
  };
  const targetsListDB = useStore(useTargetStore, (state) => state.targets);
  //   console.log('targetsListDB', targetsListDB);
  const sourcesListDB = useStore(useSourceStore, (state) => state.sources);

  useEffect(() => {
    const fetchTargets = async () => {
      try {
        // await getTargetsList();
        await pRetry(getTargetsList, {
          retries: 5,
        });
      } catch (error) {
        console.error(error);
        addAlert(`${error}`, AlertSizes.small);
      }
    };

    const fetchSources = async () => {
      try {
        // await getSourcesList();
        await pRetry(getSourcesList, {
          retries: 5,
        });
      } catch (error) {
        console.error(error);
        addAlert(`${error}`, AlertSizes.small);
      }
    };

    if (targetsListDB.length === 0) {
      fetchTargets();
    }
    if (sourcesListDB.length === 0) {
      fetchSources();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addAlert = useAlertStore.getState().addAlert;

  const updateExerciseToSubmit = {
    // updateRecordId: useCreateExerciseStore.getState().updateRecordId,
    addFile: useCreateExerciseStore.getState().addFile,
    updateRecordLength: useCreateExerciseStore.getState().updateRecordLength,
    updateSonolistFiles: useCreateExerciseStore.getState().updateSonolistFiles,
    updateTargetsList: useCreateExerciseStore.getState().updateTargetsList,
  };

  const filesList = useStore(useCreateExerciseStore, (state) => state.files);

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
      //   const res = await getAllRecords();

      const res = (await pRetry(
        () => getFileByBucketName(BucketsNames.RECORDS),
        {
          retries: 5,
        }
      )) as RecordType[];

      !!res ? setRecordsData(res) : null;
    };
    fetchData();
  }, []);

  useEffect(() => {
    // if (recordName) {
    //   updateSelectedFile(
    //     tableData[
    //         tableData.map((record) => record.name).indexOf(recordName)
    //     ]
    //   );
    // }
    setTableData(
      recordsData.map(({ name, id, metadata }) => {
        const ogMetadata = metadata;

        const targetsIds = ogMetadata.targets_ids_list;
        const sourceId = ogMetadata.source_id;

        const targetsNames: string[] = [];
        let sourceName: string = '';

        if (!!targetsIds) {
          for (let i: number = 0; i < targetsIds.length; i++) {
            targetsNames.push(
              targetsListDB.filter((target) => target._id === targetsIds[i])[0]
                .name
            );
          }
        }

        !!sourceId
          ? (sourceName = sourcesListDB.filter(
              (source) => source._id === sourceId
            )[0]?.name)
          : null;

        const { targets_ids_list, source_id, is_in_italy, ...newMeta } =
          ogMetadata;

        const updatedMeta = {
          ...newMeta,
          targets_list: targetsNames,
          is_in_italy: String(is_in_italy),
          source_name: sourceName,
        };

        return {
          name,
          id,
          ...updatedMeta,
        };
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filesList, recordsData]);

  useEffect(() => {
    console.log('tableData', tableData);
  }, [tableData]);

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
    console.log('submitRecordState.sonograms', submitRecordState.sonograms);
  }, [submitRecordState.sonograms]);

  const handleFileLength = (time: number | null) => {
    console.log('file length:', time);
    if (!!time) {
      setRecordLength(time);
      updateExerciseToSubmit.updateRecordLength(time);
    }
  };

  const handleSelectTableRow = (item: any) => {
    console.log('item', item);
    const record = tableData.filter((record) => record.name === item.name)[0];
    console.log('handleSelectTableRow', record);

    const modifiedRecord = {
      name: record.name,
      id: record.id,
      metadata: {
        record_length: record.record_length,
        sonograms_ids: record.sonograms_ids,
        difficulty_level: record.difficulty_level,
        targets_list: record.targets_list,
        operation: record.operation,
        source_name: record.source_name,
        is_in_italy: record.is_in_italy,
        signature_type: record.signature_type,
        channels_number: record.channels_number,
        sonogram_type: record.sonogram_type,
        is_backround_vessels: record.is_backround_vessels,
        aux: record.aux,
      },
    };

    console.log('modifiedRecord', modifiedRecord);
    infoBarStore.updateSelectedFile(modifiedRecord);
  };

  const uploadRecord = async () => {
    try {
      if (
        !!submitRecordState.record &&
        !!submitRecordState.sonograms &&
        submitRecordState.recordMetadata &&
        submitRecordState.sonogramsMetadata
      ) {
        // const sonolistResponse = await uploadFile(
        //   BucketsNames.SONOGRAMS,
        //   submitRecordState.sonograms,
        //   submitRecordState.sonogramsMetadata
        // );

        const sonolistResponse = await pRetry(
          () =>
            !!submitRecordState.record &&
            !!submitRecordState.sonograms &&
            submitRecordState.recordMetadata &&
            submitRecordState.sonogramsMetadata
              ? uploadFile(
                  BucketsNames.IMAGES,
                  submitRecordState.sonograms,
                  submitRecordState.sonogramsMetadata
                )
              : null,
          {
            retries: 5,
          }
        );

        console.log('sonolistResponse', sonolistResponse);
        if (sonolistResponse) {
          submitRecordState.recordMetadata = {
            ...submitRecordState.recordMetadata,
            sonograms_ids: submitRecordState.sonograms.map((sono) => sono.name),
          };

          //   const recordResponse = await uploadFile(
          //     BucketsNames.RECORDS,
          //     submitRecordState.record,
          //     submitRecordState.recordMetadata
          //   );

          const recordResponse = await pRetry(
            () =>
              submitRecordState.record && submitRecordState.recordMetadata
                ? uploadFile(
                    BucketsNames.RECORDS,
                    submitRecordState.record,
                    submitRecordState.recordMetadata
                  )
                : null,
            {
              retries: 5,
            }
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
    if (
      infoBarStore.selectedFile &&
      infoBarStore.selectedFile.name.endsWith('wav')
    ) {
      const metadata = infoBarStore.selectedFile
        .metadata as Partial<RecordMetadataType>;

      const answersToSubmit = Array.isArray(metadata.targets_list)
        ? metadata.targets_list
        : !!metadata.targets_list
          ? [metadata.targets_list]
          : [];
      const targetIdsToSubmit = targetsListDB
        .filter((target) => answersToSubmit.includes(target.name))
        .map((target) => target._id);

      //   updateExerciseToSubmit.updateRecordId(infoBarStore.selectedFile.id);
      updateExerciseToSubmit.addFile({
        fileName: infoBarStore.selectedFile.name,
        bucket: BucketsNames.RECORDS,
      });
      updateExerciseToSubmit.updateRecordLength(Number(metadata.record_length));
      updateExerciseToSubmit.updateSonolistFiles(
        metadata.sonograms_ids && metadata.sonograms_ids.length > 0
          ? metadata.sonograms_ids
          : []
      );
      updateExerciseToSubmit.updateTargetsList(targetIdsToSubmit);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [infoBarStore.selectedFile]);

  const TABLE_HEAD: TableHead[] = [
    { key: 'name', label: 'Name' },
    { key: 'difficulty_level', label: 'Difficulty level' },
    { key: 'targets_list', label: 'Targets list' },
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
          headers={TABLE_HEAD}
          rows={tableData}
          onSelect={handleSelectTableRow}
          selectedRowIndex={
            filesList && filesList.length > 0
              ? recordsData
                  .map((record) => record.name)
                  .indexOf(filesList[0].fileName)
              : undefined
          }
          //   isSelectable={
          //     selectedFile
          //       ? recordsData
          //           .map((record) => record.name)
          //           .includes(selectedFile.name)
          //       : true
          //   }
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
            filesTypes={'images/*'}
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
