'use client';
import { useCallback, useEffect, useState } from 'react';

import { PopupsTypes } from '@/app/store/stores/usePopupStore';
import pRetry from 'p-retry';
import PopupHeader, { PopupSizes } from '../PopupHeader/page';
import { BucketsNames, getFileByName } from '@/app/API/files-service/functions';
import AudioPlayer, { AudioPlayerSizes } from '@/components/AudioPlayer/page';

interface PreviewProps {
  bucketName: BucketsNames;
  exerciseType: ExercisesTypes;
  objectName: string | undefined;
}

const Preview: React.FC<PreviewProps> = (props) => {
  const { bucketName, exerciseType, objectName } = props;
  const [url, setUrl] = useState<string | null>(null);

  const getFile = useCallback(async () => {
    try {
      if (objectName) {
        const responseUrl = await pRetry(
          () =>
            // bucketName &&
            // exerciseType &&
            objectName && getFileByName(bucketName, exerciseType, objectName),
          {
            retries: 5,
          }
        );
        setUrl(responseUrl);
      }
    } catch (err) {
      console.error('getFile error:', err);
    }
  }, [bucketName, exerciseType, objectName]);

  useEffect(() => {
    getFile();
  }, [getFile]);

  return (
    <PopupHeader
      popupType={PopupsTypes.PREVIEW}
      header='preview'
      size={PopupSizes.LARGE}
    >
      <div className='mx-4 mt-8 flex h-full flex-none flex-col items-center justify-center'>
        {url ? (
          bucketName === BucketsNames.RECORDS ? (
            <AudioPlayer
              src={url}
              size={AudioPlayerSizes.SMALL}
              isPauseable={true}
            />
          ) : (
            <p>image</p>
          )
        ) : (
          <p>loading...</p>
        )}
      </div>
    </PopupHeader>
  );
};

export default Preview;
