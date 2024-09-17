import { useStore } from 'zustand';
import { useInfoBarStore } from '@/app/store/stores/useInfoBarStore';
import { formatNumberToMinutes } from '@/app/_utils/functions/formatNumberToMinutes';
import Link from 'next/link';
import { FaRegImages } from 'react-icons/fa';

const FilesInfo = () => {
  const selectedFile = useStore(useInfoBarStore, (state) => state.selectedFile);
  const selectedModel = useStore(
    useInfoBarStore,
    (state) => state.selectedModel
  );
  const regexFilesEnding = new RegExp('.wav|\\.jpg|\\.jpeg', 'g');

  return (
    <>
      {selectedModel === null ? (
        <section>Please select a model</section>
      ) : (
        <>
          <p>{selectedModel.name}</p>
          {selectedFile && (
            <div className='mx-auto flex w-[90%] flex-col'>
              <ul className='my-4 rounded-lg border-2 px-6 py-4 dark:border-duoGrayDark-light'>
                <li className='w-full border-b-2 text-center text-duoGreen-default dark:border-duoGrayDark-light dark:text-duoBlueDark-text'>
                  INFORMATION
                </li>
                {selectedFile.name && (
                  <li className='my-1 scale-105 text-center font-extrabold opacity-70 dark:text-duoBlueDark-text'>
                    {selectedFile.name
                      .toLocaleLowerCase()
                      .replace(regexFilesEnding, '')}
                  </li>
                )}

                {!!selectedFile.metadata &&
                  Object.values(selectedFile.metadata).map(
                    (meta, metaIndex) => (
                      <section key={metaIndex}>
                        {meta !== undefined && !!selectedFile.metadata && (
                          <li key={metaIndex} className='my-1'>
                            <span className=''>
                              {Object.keys(selectedFile.metadata)[metaIndex] !==
                                'content-type' &&
                              Object.keys(selectedFile.metadata)[metaIndex] !==
                                'sonograms_names'
                                ? `${
                                    Object.keys(selectedFile.metadata)[
                                      metaIndex
                                    ]
                                  }: `
                                : null}
                            </span>
                            {Object.keys(selectedFile.metadata)[metaIndex] ===
                            'record_length'
                              ? formatNumberToMinutes(Number(meta))
                              : Object.keys(selectedFile.metadata)[
                                    metaIndex
                                  ] !== 'content-type' &&
                                  Object.keys(selectedFile.metadata)[
                                    metaIndex
                                  ] !== 'sonograms_names'
                                ? String(meta)
                                : null}
                          </li>
                        )}
                      </section>
                    )
                  )}
                <li>
                  {selectedFile &&
                  selectedFile.name &&
                  selectedFile.name.endsWith('.wav') ? (
                    !!selectedFile.metadata &&
                    'sonograms_names' in selectedFile.metadata &&
                    selectedFile.metadata.sonograms_names &&
                    selectedFile.metadata.sonograms_names.length > 0 ? (
                      <Link
                        className='flex w-fit cursor-pointer flex-row items-center justify-start gap-2 text-duoBlue-default hover:text-duoBlue-default dark:text-duoPurpleDark-default dark:hover:opacity-90'
                        href={`${`/sonolist/${selectedFile.name}`}`}
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
            </div>
          )}
        </>
      )}
    </>
  );
};

export default FilesInfo;