import { useState, useCallback } from 'react';
import pRetry from 'p-retry';
import { getModelsFiles } from '@/app/API/files-service/functions';

export const useFetchModelFiles = (
  mainTypeId: string | null,
  subTypeId: string | null,
  modelId: string | null,
  fileType?: FileTypes
) => {
  const [filesData, setFilesData] = useState<FileType[] | null>(null);

  const fetchData = useCallback(async () => {
    try {
      if (mainTypeId && subTypeId && modelId) {
        const res = await pRetry(
          () =>
            mainTypeId && subTypeId && modelId
              ? getModelsFiles(mainTypeId, subTypeId, modelId, fileType)
              : null,
          { retries: 5 }
        );
        console.log(
          'useFetchModelFiles fetchData',
          { mainTypeId, subTypeId, modelId },
          res,
          res &&
            Object.values(res).length > 0 &&
            res[subTypeId] &&
            res[subTypeId][mainTypeId]
        );

        if (
          res &&
          Object.values(res).length > 0 &&
          res[subTypeId] &&
          res[subTypeId][modelId]
        ) {
          const imagesData = res[subTypeId][modelId]['images'];
          const recordsData = res[subTypeId][modelId]['records'];
          const comboData = [
            ...recordsData.map((rec) => ({ ...rec, type: 'record' })),
            ...imagesData.map((img) => ({ ...img, type: 'image' })),
          ];

          console.log(
            'hasMetadata',
            comboData.map((file) =>
              Object.keys(file.metadata).filter(
                (meta) =>
                  meta !== 'record_length' && meta !== 'number_of_channels'
              )
            )
          );

          setFilesData(
            comboData.map((file) => ({
              ...file,
              hasMetadata:
                Object.keys(file.metadata).filter(
                  (meta) =>
                    meta !== 'record_length' && meta !== 'number_of_channels'
                ).length > 0
                  ? 'yes'
                  : 'no',
            }))
          );
        } else {
          setFilesData([]);
        }
      }
    } catch (error) {
      console.error('Failed to fetch records:', error);
      setFilesData([]);
    }
  }, [fileType, mainTypeId, modelId, subTypeId]);

  return { filesData, fetchData };
};
