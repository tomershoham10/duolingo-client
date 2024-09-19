import { ReactNode } from 'react';
import Link from 'next/link';
import { FaRegImages } from 'react-icons/fa';
import { formatNumberToMinutes } from '@/app/_utils/functions/formatNumberToMinutes';

interface MetadataSectionProps {
  children: ReactNode;
  fileName: string;
  metadata: Partial<Metadata>;
}
const MetadataSection: React.FC<MetadataSectionProps> = (props) => {
  const { children, fileName, metadata } = props;

  const regexFilesEnding = new RegExp('.wav|\\.jpg|\\.jpeg', 'g');

  return (
    <div className='mx-auto flex h-full w-full flex-col justify-between items-center'>
      <ul className='w-full my-4 rounded-lg border-2 px-6 py-4 dark:border-duoGrayDark-light'>
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
          {fileName.endsWith('.wav') ? (
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
      </ul>
      {children}
    </div>
  );
};

export default MetadataSection;
