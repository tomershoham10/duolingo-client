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

  const syllabusFieldToEdit = useInfoBarStore.getState().syllabusFieldToEdit;
  const syllabusFieldId = useInfoBarStore.getState().syllabusFieldId;
  const updateSelectedPopup = usePopupStore.getState().updateSelectedPopup;

  const selectedRecord = useStore(
    useInfoBarStore,
    (state) => state.selectedRecord
  );

  useEffect(() => {
    console.log('selectedRecord', selectedRecord);
  }, [selectedRecord]);

  return (
    <div className='flex h-full w-[35%] flex-col items-center justify-start border-l-2 border-duoGray-light font-extrabold tracking-wide text-duoGray-darkest dark:border-duoGrayDark-light dark:text-duoGrayDark-lightest 3xl:w-[15%]'>
      {pathname.includes('syllabus') ? (
        <div>
          <div>{courseName}</div>
          {syllabusFieldToEdit ? (
            <div>
              <span>
                {syllabusFieldToEdit} {syllabusFieldId}
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
          {selectedRecord ? (
            <div className='flex flex-col'>
              <ul className='my-4 rounded-lg border-2 px-6 py-4 dark:border-duoGrayDark-light'>
                <li className='w-full border-b-2 text-center dark:border-duoGrayDark-light dark:dark:text-duoBlueDark-text'>
                  INFORMATION
                </li>
                <li className='my-1'>
                  name: {selectedRecord.name.replace('.wav', '')}
                </li>

                {Object.values(selectedRecord.metadata).map(
                  (meta, metaIndex) => (
                    <li key={metaIndex} className='my-1'>
                      {Object.keys(selectedRecord.metadata)[metaIndex] !==
                        'content-type' &&
                      Object.keys(selectedRecord.metadata)[metaIndex] !==
                        'sonograms_ids'
                        ? `${Object.keys(selectedRecord.metadata)[metaIndex]}: `
                        : null}
                      {Object.keys(selectedRecord.metadata)[metaIndex] !==
                        'content-type' &&
                      Object.keys(selectedRecord.metadata)[metaIndex] !==
                        'sonograms_ids'
                        ? meta
                        : null}
                    </li>
                  )
                )}
                <li>
                  {selectedRecord.metadata.sonograms_ids &&
                  selectedRecord.metadata.sonograms_ids.length > 0 ? (
                    <Link
                      className='flex w-fit cursor-pointer flex-row items-center justify-start gap-2 hover:text-duoBlue-default
                       dark:text-duoBlueDark-text dark:hover:text-duoBlueDark-textHover'
                      href={`${`/sonolist/${selectedRecord.name}`}`}
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
                  )}
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
