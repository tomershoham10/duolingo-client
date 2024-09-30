'use client';
import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';

import { PopupsTypes } from '@/app/store/stores/usePopupStore';
import pRetry from 'p-retry';
import PopupHeader, { PopupSizes } from '../PopupHeader/page';
import { FileTypes, getFileByName } from '@/app/API/files-service/functions';
import AudioPlayer, { AudioPlayerSizes } from '@/components/AudioPlayer/page';

interface PreviewProps {
  mainId: string;
  subtypeId: string;
  modelId: string;
  fileType: FileTypes;
  objectName: string;
}

const Preview: React.FC<PreviewProps> = (props) => {
  const { mainId, subtypeId, modelId, fileType, objectName } = props;
  const [url, setUrl] = useState<string | null>(null);

  const getFile = useCallback(async () => {
    try {
      if (objectName) {
        const responseUrl = await pRetry(
          () => getFileByName(mainId, subtypeId, modelId, fileType, objectName),
          {
            retries: 5,
          }
        );
        setUrl(responseUrl);
      }
    } catch (err) {
      console.error('getFile error:', err);
    }
  }, [fileType, mainId, modelId, objectName, subtypeId]);

  useEffect(() => {
    getFile();
  }, [getFile]);

  return (
    <PopupHeader
      popupType={PopupsTypes.PREVIEW}
      header='preview'
      size={PopupSizes.LARGE}
    >
      <div className='mx-4 mt-8 flex h-full w-full flex-col items-center justify-center'>
        {url ? (
          fileType === FileTypes.RECORDS ? (
            <AudioPlayer
              src={url}
              size={AudioPlayerSizes.SMALL}
              isPauseable={true}
            />
          ) : (
            <div className='relative h-full w-full'>
              <Image
                src={url}
                alt='Sonogram'
                layout='fill'
                objectFit='contain'
                unoptimized={true}
              />
            </div>
          )
        ) : (
          <p>loading...</p>
        )}
      </div>
    </PopupHeader>
  );
};

export default Preview;
