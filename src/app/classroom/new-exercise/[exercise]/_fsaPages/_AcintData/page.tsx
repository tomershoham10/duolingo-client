'use client';
import { useState, useEffect, lazy, useCallback, useMemo } from 'react';
import pRetry from 'p-retry';
import { useStore } from 'zustand';

import { library } from '@fortawesome/fontawesome-svg-core';

import { useInfoBarStore } from '@/app/store/stores/useInfoBarStore';

import {
  BucketsNames,
  getFileByBucketAndType,
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
import { isFSAMetadata } from '@/app/_utils/functions/filesMetadata/functions';
import { ExercisesTypes } from '@/app/API/classes-service/exercises/functions';
import { faArrowUpFromBracket } from '@fortawesome/free-solid-svg-icons';
const UploadFilePopup = lazy(
  () => import('@/app/(popups)/UploadFilePopup/page')
);

library.add(faArrowUpFromBracket);

export interface AcintDataSectionProps {
  exerciseType?: ExercisesTypes;
}

const AcintDataSection: React.FC<AcintDataSectionProps> = (props) => {
  const { exerciseType } = props;

  const selectedFile = useStore(useInfoBarStore, (state) => state.selectedFile);
  const updateSelectedFile = useInfoBarStore.getState().updateSelectedFile;

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
      try {
        const res = (await pRetry(
          () =>
            exerciseType
              ? getFileByBucketAndType(BucketsNames.RECORDS, exerciseType)
              : getFileByBucketName(BucketsNames.RECORDS),
          { retries: 5 }
        )) as FileType[];
        setRecordsData(res || []);
      } catch (error) {
        console.error('Failed to fetch records:', error);
      }
    };

    fetchData();
  }, [exerciseType]);

  useEffect(() => {
    console.log('recordsData triggered', recordsData);
    setTableData(
      recordsData.map((data) => {
        return {
          ...data,
          fileType: data.name.endsWith('wav')
            ? BucketsNames.RECORDS
            : BucketsNames.IMAGES,
        };
      })
    );
  }, [recordsData]);

  useEffect(() => {
    console.log('tableData', tableData);
  }, [tableData]);

  const handleSelectTableRow = useCallback(
    (item: any) => {
      console.log('item', item);

      const modifiedRecord = {
        id: item.id,
        name: item.name,
        exerciseType: item.exerciseType,
        metadata: { ...item.metadata },
      };

      console.log('modifiedRecord', modifiedRecord);
      updateSelectedFile(modifiedRecord);
    },
    [updateSelectedFile]
  );

  const selectedRowIndex = useMemo(() => {
    if (filesList && filesList.length > 0) {
      const index = recordsData
        .map((record) => record.name)
        .indexOf(filesList[0].fileName);
      return index;
    }
    return undefined;
  }, [filesList, recordsData]);

  //   useEffect(() => {
  //     if (
  //       infoBarStore.selectedFile &&
  //       infoBarStore.selectedFile.name &&
  //       infoBarStore.selectedFile.name.endsWith('wav')
  //     ) {
  //       const metadata = infoBarStore.selectedFile.metadata as Partial<Metadata>;

  //       if (isFSAMetadata(metadata)) {
  //         const answersToSubmit = Array.isArray(metadata.targets_ids_list)
  //           ? metadata.targets_ids_list
  //           : !!metadata.targets_ids_list
  //             ? [metadata.targets_ids_list]
  //             : [];
  //         const targetIdsToSubmit = targetsListDB
  //           .filter((target) => answersToSubmit.includes(target.name))
  //           .map((target) => target._id);

  //         updateExerciseToSubmit.addFile({
  //           fileName: infoBarStore.selectedFile.name,
  //           bucket: BucketsNames.RECORDS,
  //         });
  //         updateExerciseToSubmit.updateRecordLength(
  //           Number(metadata.record_length)
  //         );
  //         updateExerciseToSubmit.updateSonolistFiles(
  //           metadata.sonograms_names && metadata.sonograms_names.length > 0
  //             ? metadata.sonograms_names
  //             : []
  //         );
  //         updateExerciseToSubmit.updateTargetsList(targetIdsToSubmit);
  //       }
  //     }
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, [infoBarStore.selectedFile]);

  const TABLE_HEAD: TableHead[] = [
    { key: 'name', label: 'Name' },
    { key: 'exerciseType', label: 'Exercise Type' },
    { key: 'fileType', label: 'File Type' },
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
          selectedRowIndex={selectedRowIndex}
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
