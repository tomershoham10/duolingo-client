'use client';
import { lazy, useCallback, useEffect, useMemo, useState } from 'react';
import pRetry from 'p-retry';
import { useInfoBarStore } from '@/app/store/stores/useInfoBarStore';
import Table, { TableHead } from '@/components/Table/page';
import { useFetchTargets } from '@/app/_utils/hooks/(dropdowns)/useFechTargets';
// import useModelsTableData from '@/app/_utils/hooks/useModelsTableData';
import Button, { ButtonColors, ButtonTypes } from '@/components/(buttons)/Button/page';
import { faArrowUpFromBracket } from '@fortawesome/free-solid-svg-icons';
import { PopupsTypes, usePopupStore } from '@/app/store/stores/usePopupStore';
import { getModelsFiles } from '@/app/API/files-service/functions';
import TargetsDropdowns from '@/components/TargetsDropdowns';
import { useStore } from 'zustand';

const UploadFilePopup = lazy(
  () => import('@/app/(popups)/(upload)/UploadFilesPopup/page')
);
const EditMetadataPopup = lazy(
  () => import('@/app/(popups)/(edit)/EditMetadata')
);

const Files: React.FC = () => {
  const targetsList = useFetchTargets();

  const [selectedFilesRowIndex, setSelectedFilesRowIndex] =
    useState<number>(-1);

  const [filesData, setFilesData] = useState<FileType[]>([]);

  const selectedMainTypeId = useStore(
    useInfoBarStore,
    (state) => state.selectedMainTypeId
  );
  const selectedSubTypeId = useStore(
    useInfoBarStore,
    (state) => state.selectedSubTypeId
  );
  const selectedModel = useStore(
    useInfoBarStore,
    (state) => state.selectedModel
  );

  const updateSelectedMainTypeId =
    useInfoBarStore.getState().updateSelectedMainTypeId;
  const updateSelectedSubTypeId =
    useInfoBarStore.getState().updateSelectedSubTypeId;
  const updateSelectedModel = useInfoBarStore.getState().updateSelectedModel;

  const updateSelectedFile = useInfoBarStore.getState().updateSelectedFile;

  const updateSelectedPopup = usePopupStore.getState().updateSelectedPopup;

  const filesTableHead: TableHead[] = [
    { key: 'name', label: 'File name' },
    { key: 'type', label: 'File type' },
    { key: 'hasMetadata', label: 'Has metadata' },
  ];

  const fetchModelFiles = useCallback(
    async (mainId: string, subTypeId: string, modelId: string) => {
      const res = await pRetry(
        () => getModelsFiles(mainId, subTypeId, modelId),
        {
          retries: 5,
        }
      );
      console.log('fetchModelFiles1', res);
      if (res) {
        if (Object.values(res).length > 0) {
          // else - model has no files
          const imagesData = res[subTypeId][modelId]['images'];
          const recordsData = res[subTypeId][modelId]['records'];
          const comboData = [
            ...recordsData.map((rec) => {
              return { ...rec, type: 'record' };
            }),
            ...imagesData.map((img) => {
              return { ...img, type: 'image' };
            }),
          ];
          setFilesData(
            comboData.map((file) => {
              return {
                ...file,
                hasMetadata:
                  Object.values(file.metadata).length > 0 ? 'yes' : 'no',
              };
            })
          );
          console.log('fetchModelFiles2', imagesData, recordsData, [
            ...recordsData,
            ...imagesData,
          ]);
        } else {
          setFilesData([]);
        }
      } else {
        alert('error');
        setFilesData([]);
      }
    },
    []
  );

  const handleSelectFilesRow = useCallback(
    (row: any, index: number) => {
      console.log('handleSelectFilesRow', row);
      setSelectedFilesRowIndex(index);
      updateSelectedFile(row);
    },
    [updateSelectedFile]
  );

  const handleMainTypeSelected = useCallback(
    (main: TargetType | null) => {
      //   setSelectedMainTypeId(main?._id || null);
      updateSelectedMainTypeId(main?._id || null);
    },
    [updateSelectedMainTypeId]
  );

  const handleSubTypeSelected = useCallback(
    (subType: TargetType | null) => {
      //   setSelectedSubTypeId(subType?._id || null);
      updateSelectedSubTypeId(subType?._id || null);
    },
    [updateSelectedSubTypeId]
  );

  const handleModelSelected = useCallback(
    (model: TargetType | null) => {
      //   setSelectedModel(model);
      updateSelectedModel(model);
      if (model) {
        if (selectedSubTypeId === null) {
          //   setSelectedSubTypeId(model.father || null);
          updateSelectedSubTypeId(model.father || null);
        }
      }
    },
    [selectedSubTypeId, updateSelectedModel, updateSelectedSubTypeId]
  );

  useEffect(() => {
    if (targetsList && selectedSubTypeId && selectedMainTypeId === null) {
      const selectedSubTypeOnj = targetsList.find((target) => {
        console.log(target, target._id === selectedSubTypeId);
        target._id === selectedSubTypeId;
      });
      console.log('check', selectedSubTypeId, selectedSubTypeOnj);
      //   setSelectedMainTypeId(selectedSubTypeOnj?.father || null);
      updateSelectedMainTypeId(selectedSubTypeOnj?.father || null);
    }
  }, [
    selectedMainTypeId,
    selectedSubTypeId,
    targetsList,
    updateSelectedMainTypeId,
  ]);

  useEffect(() => {
    if (selectedMainTypeId && selectedModel?._id && selectedSubTypeId) {
      fetchModelFiles(
        selectedMainTypeId,
        selectedSubTypeId,
        selectedModel?._id
      );
    }
  }, [
    fetchModelFiles,
    selectedMainTypeId,
    selectedModel?._id,
    selectedSubTypeId,
  ]);

  // #region models table option

  //   const modelsTableData = useModelsTableData();
  //   const [selectedModelsRowIndex, setSelectedModelsRowIndex] =
  //     useState<number>(-1);

  //   const modelsTableHead: TableHead[] = [
  //     { key: 'country', label: 'Country' },
  //     { key: 'organization', label: 'Organization' },
  //     { key: 'mainTypeName', label: 'main type' },
  //     { key: 'subTypeName', label: 'sub type' },
  //     { key: 'modelName', label: 'name' },
  //   ];

  //   const handleSelectModelsRow = useCallback(
  //     (row: any, index: number) => {
  //       updateSelectedFile(undefined);
  //       setSelectedFilesRowIndex(-1);
  //       console.log('handleSelectModelsRow', row);
  //       fetchModelFiles(row.mainTypeId, row.subTypeId, row.modelId);
  //       updateSelectedMainTypeId(row.mainTypeId);
  //       updateSelectedSubTypeId(row.subTypeId);

  //       const model = targetsList?.find((target) => target._id === row.modelId);

  //       updateSelectedModel(model || null);
  //       setSelectedModelsRowIndex(index);
  //     },
  //     [
  //       fetchModelFiles,
  //       targetsList,
  //       updateSelectedFile,
  //       updateSelectedMainTypeId,
  //       updateSelectedModel,
  //       updateSelectedSubTypeId,
  //     ]
  //   );

  //   const isModelsTableLoading = useMemo(() => {
  //     if (targetsList === null) {
  //       return true;
  //     } else return false;
  //   }, [targetsList]);

  // #endregion

  return (
    <section className='mx-auto flex h-full w-fit flex-col px-6 pb-4 text-duoGray-darkest dark:text-duoGrayDark-lightest'>
      <UploadFilePopup />
      <EditMetadataPopup />
      <div className='flex flex-col gap-3 py-6'>
        <span className='text-3xl font-bold'>Select a model</span>
        <TargetsDropdowns
          onMainSelected={handleMainTypeSelected}
          onSubTypeSelected={handleSubTypeSelected}
          onModelSelected={handleModelSelected}
        />

        <div className='relative flex items-center justify-start pt-2'>
          <Button
            label={'UPLOAD'}
            buttonType={ButtonTypes.SUBMIT}
            color={ButtonColors.BLUE}
            icon={faArrowUpFromBracket}
            isDisabled={selectedModel === null}
            onClick={() => updateSelectedPopup(PopupsTypes.UPLOAD_FILES)}
          />
        </div>

        {/* <Table
          headers={modelsTableHead}
          rows={modelsTableData}
          onSelect={handleSelectModelsRow}
          selectedRowIndex={selectedModelsRowIndex}
          maxHight={'max-h-[306px]'}
          isLoading={isModelsTableLoading}
        /> */}
      </div>

      {/* {selectedModelsRowIndex > -1 && filesData.length > 0 && ( */}

      {selectedMainTypeId &&
        selectedSubTypeId &&
        selectedModel &&
        filesData.length > 0 && (
          <div className='flex w-fit flex-col gap-3'>
            <span className='text-xl font-bold opacity-70'>Files table</span>
            <Table
              headers={filesTableHead}
              rows={filesData}
              onSelect={handleSelectFilesRow}
              selectedRowIndex={selectedFilesRowIndex}
              maxHight={'max-h-[306px]'}
              isLoading={false}
            />
          </div>
        )}
      {/* <div className='relative flex items-center justify-start py-8'>
        <Button
          label={'UPLOAD'}
          buttonType={ButtonTypes.SUBMIT}
          color={ButtonColors.BLUE}
          icon={faArrowUpFromBracket}
          //   loadingLabel={'Uploading...'}
          isDisabled={selectedModelsRowIndex < 0}
          onClick={() => updateSelectedPopup(PopupsTypes.EDIT_METADATA)}
        />
      </div> */}
    </section>
  );
};
export default Files;
