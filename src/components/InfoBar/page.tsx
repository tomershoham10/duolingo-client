'use client';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';

import useStore from '@/app/store/useStore';
import { useUserStore } from '@/app/store/stores/useUserStore';
import { usePathname } from 'next/navigation';
import { useCourseStore } from '@/app/store/stores/useCourseStore';
import { useInfoBarStore } from '@/app/store/stores/useInfoBarStore';
import { usePopupStore } from '@/app/store/stores/usePopupStore';
import { FaRegImages } from 'react-icons/fa';
import Link from 'next/link';

const InfoBar: React.FC = () => {
  const pathname = usePathname();

  const userName = useStore(useUserStore, (state) => state.userName);
  const courseName = useStore(useCourseStore, (state) => state.name);

  const useInfoBarStoreObj = {
    syllabusFieldToEdit: useStore(
      useInfoBarStore,
      (state) => state.syllabusFieldToEdit
    ),
    syllabusFieldId: useStore(
      useInfoBarStore,
      (state) => state.syllabusFieldId
    ),
    selectedFile: useStore(useInfoBarStore, (state) => state.selectedFile),
  };

  const updateSelectedPopup = usePopupStore.getState().updateSelectedPopup;

  useEffect(() => {
    console.log('selectedFile', useInfoBarStoreObj.selectedFile);
  }, [useInfoBarStoreObj.selectedFile]);
  const regexFilesEnding = new RegExp('.wav|\\.jpg|\\.jpeg', 'g');

  return (
    <div className='flex h-full w-full flex-col items-center justify-start border-l-2 border-duoGray-light font-extrabold tracking-wide text-duoGray-darkest dark:border-duoGrayDark-light dark:text-duoGrayDark-lightest 2xl:text-xl'>
      {pathname.includes('syllabus') ? (
        <div>
          <div>{courseName}</div>
          {useInfoBarStoreObj.syllabusFieldToEdit ? (
            <div>
              <span>
                {useInfoBarStoreObj.syllabusFieldToEdit}{' '}
                {useInfoBarStoreObj.syllabusFieldId}
              </span>
              <button
                onClick={() => {
                  updateSelectedPopup(PopupsTypes.ADMINEDIT);
                }}
              >
                edit
              </button>
            </div>
          ) : null}
        </div>
      ) : pathname.includes('new-exercise') ? (
        <>
          {!!useInfoBarStoreObj.selectedFile ? (
            <div className='flex flex-col'>
              <ul className='my-4 rounded-lg border-2 px-6 py-4 dark:border-duoGrayDark-light'>
                <li className='w-full border-b-2 text-center dark:border-duoGrayDark-light dark:dark:text-duoBlueDark-text'>
                  INFORMATION
                </li>
                <li className='my-1'>
                  name:{' '}
                  {useInfoBarStoreObj.selectedFile.name
                    .toLocaleLowerCase()
                    .replace(regexFilesEnding, '')}
                </li>

                {!!useInfoBarStoreObj.selectedFile.metadata &&
                  Object.values(useInfoBarStoreObj.selectedFile.metadata).map(
                    (meta, metaIndex) => (
                      <section key={metaIndex}>
                        {!!useInfoBarStoreObj.selectedFile ? (
                          <li key={metaIndex} className='my-1'>
                            {Object.keys(
                              useInfoBarStoreObj.selectedFile.metadata
                            )[metaIndex] !== 'content-type' &&
                            Object.keys(
                              useInfoBarStoreObj.selectedFile.metadata
                            )[metaIndex] !== 'sonograms_ids'
                              ? `${
                                  Object.keys(
                                    useInfoBarStoreObj.selectedFile.metadata
                                  )[metaIndex]
                                }: `
                              : null}
                            {Object.keys(
                              useInfoBarStoreObj.selectedFile.metadata
                            )[metaIndex] !== 'content-type' &&
                            Object.keys(
                              useInfoBarStoreObj.selectedFile.metadata
                            )[metaIndex] !== 'sonograms_ids'
                              ? meta
                              : null}
                          </li>
                        ) : null}
                      </section>
                    )
                  )}
                <li>
                  {useInfoBarStoreObj.selectedFile.name.endsWith('.wav') ? (
                    !!useInfoBarStoreObj.selectedFile.metadata &&
                    'sonograms_ids' in
                      useInfoBarStoreObj.selectedFile.metadata &&
                    useInfoBarStoreObj.selectedFile.metadata.sonograms_ids &&
                    useInfoBarStoreObj.selectedFile.metadata.sonograms_ids
                      .length > 0 ? (
                      <Link
                        className='flex w-fit cursor-pointer flex-row items-center justify-start gap-2 hover:text-duoBlue-default
                       dark:text-duoBlueDark-text dark:hover:text-duoBlueDark-textHover'
                        href={`${`/sonolist/${useInfoBarStoreObj.selectedFile.name}`}`}
                        target='_blank'
                      >
                        <FaRegImages />
                        sonolist
                      </Link>
                    ) : (
                      <span
                        className='flex w-fit cursor-default flex-row items-center justify-start gap-2
                       opacity-60 dark:text-duoBlueDark-text'
                      >
                        <FaRegImages />
                        sonolist
                      </span>
                    )
                  ) : null}
                </li>
              </ul>
            </div>
          ) : null}
        </>
      ) : (
        <ul className='flex-grow'>
          <li className='text-xl uppercase'>hello {userName}!</li>
        </ul>
      )}
    </div>
  );
};

export default InfoBar;
