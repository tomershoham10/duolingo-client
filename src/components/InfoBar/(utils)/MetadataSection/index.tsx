import { lazy, ReactNode } from 'react';
import Link from 'next/link';
import { FaRegImages } from 'react-icons/fa';
import { formatNumberToMinutes } from '@/app/_utils/functions/formatNumberToMinutes';
import { PopupsTypes, usePopupStore } from '@/app/store/stores/usePopupStore';
import { FileTypes } from '@/app/API/files-service/functions';
const Preview = lazy(() => import('@/app/(popups)/Preview/page'));

interface MetadataSectionProps {
  children?: ReactNode;
  mainId: string;
  subtypeId: string;
  modelId: string;
  fileType: FileTypes;
  fileName: string;
  metadata: Partial<Metadata>;
}
const MetadataSection: React.FC<MetadataSectionProps> = (props) => {
  const { children, mainId, subtypeId, modelId, fileType, fileName, metadata } =
    props;
  const updateSelectedPopup = usePopupStore.getState().updateSelectedPopup;

  const regexFilesEnding = new RegExp('.wav|\\.jpg|\\.jpeg', 'g');

  return (
    <div className='mx-auto flex h-full w-full flex-col items-center justify-between'>
      <ul className='my-4 w-full rounded-lg border-2 px-6 py-4 dark:border-duoGrayDark-light'>
        <li className='w-full border-b-2 text-center text-duoGreen-default dark:border-duoGrayDark-light dark:text-duoBlueDark-text'>
          INFORMATION
        </li>
        <li className='my-1 scale-105 text-center font-extrabold opacity-70 dark:text-duoBlueDark-text'>
          {fileName.toLocaleLowerCase().replace(regexFilesEnding, '')}
        </li>

        {Object.values(metadata).map((meta, metaIndex) => (
          <section key={metaIndex}>
            {meta !== undefined && !!metadata && (
              <li key={metaIndex} className='my-1'>
                <span className=''>
                  {Object.keys(metadata)[metaIndex] !== 'content-type' &&
                  Object.keys(metadata)[metaIndex] !== 'sonograms_names'
                    ? `${Object.keys(metadata)[metaIndex]}: `
                    : null}
                </span>
                {Object.keys(metadata)[metaIndex] === 'record_length'
                  ? formatNumberToMinutes(Number(meta))
                  : Object.keys(metadata)[metaIndex] !== 'content-type' &&
                      Object.keys(metadata)[metaIndex] !== 'sonograms_names'
                    ? String(meta)
                    : null}
              </li>
            )}
          </section>
        ))}
        <li>
          {fileType === FileTypes.RECORDS ? (
            'sonograms_names' in metadata &&
            metadata.sonograms_names &&
            metadata.sonograms_names.length > 0 ? (
              <Link
                className='flex w-fit cursor-pointer flex-row items-center justify-start gap-2 text-duoBlue-default hover:text-duoBlue-default dark:text-duoPurpleDark-default dark:hover:opacity-90'
                href={`${`/sonolist/${fileName}`}`}
                target='_blank'
              >
                <FaRegImages />
                sonolist
              </Link>
            ) : (
              <span className='flex w-fit cursor-default flex-row items-center justify-start gap-2 text-duoBlue-default opacity-60 dark:text-duoBlueDark-text'>
                <FaRegImages />
                sonolist
              </span>
            )
          ) : null}
        </li>
        <li>
          <button
            className='font-bold text-duoBlueDark-default'
            onClick={() => updateSelectedPopup(PopupsTypes.PREVIEW)}
          >
            preview
          </button>
        </li>
      </ul>
      <Preview
        mainId={mainId}
        subtypeId={subtypeId}
        modelId={modelId}
        fileType={fileType}
        objectName={fileName}
      />
      {children}
    </div>
  );
};

export default MetadataSection;
