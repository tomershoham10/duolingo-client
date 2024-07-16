'use client';
import { useState, useEffect, lazy, useCallback } from 'react';
import pRetry from 'p-retry';
import { useStore } from 'zustand';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faArrowUpFromBracket } from '@fortawesome/free-solid-svg-icons';

import { useInfoBarStore } from '@/app/store/stores/useInfoBarStore';

import {
  BucketsNames,
  getFileByBucketName,
} from '@/app/API/files-service/functions';
import Table, { TableHead, TableRow } from '@/components/Table/page';
import Button, { ButtonColors, ButtonTypes } from '@/components/Button/page';
import { useCreateExerciseStore } from '@/app/store/stores/useCreateExerciseStore';
import { PopupsTypes, usePopupStore } from '@/app/store/stores/usePopupStore';
import { useTargetStore } from '@/app/store/stores/useTargetStore';
import { AlertSizes, useAlertStore } from '@/app/store/stores/useAlertStore';
import { getTargetsList } from '@/app/API/classes-service/targets/functions';
import { useSourceStore } from '@/app/store/stores/useSourceStore';
import { getSourcesList } from '@/app/API/classes-service/sources/functions';
import { isFSAMetadata } from '@/app/utils/functions/filesMetadata/functions';
const UploadFilePopup = lazy(
  () => import('@/app/_popups/UploadFilePopup/page')
);

library.add(faArrowUpFromBracket);

const AcintDataSection: React.FC = () => {
  const infoBarStore = {
    selectedFile: useStore(useInfoBarStore, (state) => state.selectedFile),
    updateSelectedFile: useInfoBarStore.getState().updateSelectedFile,
  };
  const targetsListDB = useStore(useTargetStore, (state) => state.targets);
  //   console.log('targetsListDB', targetsListDB);
  const sourcesListDB = useStore(useSourceStore, (state) => state.sources);
  const updateSelectedPopup = usePopupStore.getState().updateSelectedPopup;
  const addAlert = useAlertStore.getState().addAlert;

  const fetchSources = useCallback(async () => {
    try {
      await pRetry(getSourcesList, {
        retries: 5,
      });
    } catch (error) {
      console.error(error);
      addAlert(`${error}`, AlertSizes.small);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTargets = useCallback(async () => {
    try {
      await pRetry(getTargetsList, {
        retries: 5,
      });
    } catch (error) {
      console.error(error);
      addAlert(`${error}`, AlertSizes.small);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (targetsListDB.length === 0) {
      fetchTargets();
    }
    if (sourcesListDB.length === 0) {
      fetchSources();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourcesListDB, targetsListDB]);

  const updateExerciseToSubmit = {
    addFile: useCreateExerciseStore.getState().addFile,
    updateRecordLength: useCreateExerciseStore.getState().updateRecordLength,
    updateSonolistFiles: useCreateExerciseStore.getState().updateSonolistFiles,
    updateTargetsList: useCreateExerciseStore.getState().updateTargetsList,
  };

  const filesList = useStore(useCreateExerciseStore, (state) => state.files);

  const [recordsData, setRecordsData] = useState<FileType[]>([]);
  const [tableData, setTableData] = useState<TableRow[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = (await pRetry(
        () => getFileByBucketName(BucketsNames.RECORDS),
        {
          retries: 5,
        }
      )) as FileType[];

      !!res ? setRecordsData(res) : null;
    };
    fetchData();
  }, []);

  useEffect(() => {
    console.log('recordsData', recordsData);
    setTableData(recordsData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filesList, recordsData]);

  useEffect(() => {
    console.log('tableData', tableData);
  }, [tableData]);

  const handleSelectTableRow = (item: any) => {
    console.log('item', item);
    const record = tableData.filter((record) => record.name === item.name)[0];
    console.log('handleSelectTableRow', record);

    const modifiedRecord = {
      id: record.id,
      name: record.name,
      exerciseType: record.exerciseType,
      metadata: {
        record_length: record.record_length,
        sonograms_names: record.sonograms_names,
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

  useEffect(() => {
    if (
      infoBarStore.selectedFile &&
      infoBarStore.selectedFile.name &&
      infoBarStore.selectedFile.name.endsWith('wav')
    ) {
      const metadata = infoBarStore.selectedFile.metadata as Partial<Metadata>;

      if (isFSAMetadata(metadata)) {
        const answersToSubmit = Array.isArray(metadata.targets_ids_list)
          ? metadata.targets_ids_list
          : !!metadata.targets_ids_list
            ? [metadata.targets_ids_list]
            : [];
        const targetIdsToSubmit = targetsListDB
          .filter((target) => answersToSubmit.includes(target.name))
          .map((target) => target._id);

        updateExerciseToSubmit.addFile({
          fileName: infoBarStore.selectedFile.name,
          bucket: BucketsNames.RECORDS,
        });
        updateExerciseToSubmit.updateRecordLength(
          Number(metadata.record_length)
        );
        updateExerciseToSubmit.updateSonolistFiles(
          metadata.sonograms_names && metadata.sonograms_names.length > 0
            ? metadata.sonograms_names
            : []
        );
        updateExerciseToSubmit.updateTargetsList(targetIdsToSubmit);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [infoBarStore.selectedFile]);

  const TABLE_HEAD: TableHead[] = [
    { key: 'name', label: 'Name' },
    { key: 'exerciseType', label: 'Exercise Type' },
    { key: 'recordLength', label: 'Record Length' },
  ];

  return (
    <section className='h-full  text-duoGray-darkest dark:text-duoGrayDark-lightest'>
      <UploadFilePopup />
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
        />
      </section>

      <div className='relative flex items-center justify-center py-8'>
        <Button
          label={'UPLOAD'}
          buttonType={ButtonTypes.SUBMIT}
          color={ButtonColors.BLUE}
          icon={faArrowUpFromBracket}
          //   loadingLabel={'Uploading...'}
          onClick={() => updateSelectedPopup(PopupsTypes.UPLOAD_RECORD)}
        />
        {/* </form> */}
      </div>
    </section>
  );
};
export default AcintDataSection;
