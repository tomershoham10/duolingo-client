'use client';
import { useEffect } from 'react';
import useStore from '@/app/store/useStore';
import { useInfoBarStore } from '@/app/store/stores/useInfoBarStore';
import { FaRegImages } from 'react-icons/fa';
import Link from 'next/link';
import { formatNumberToMinutes } from '@/app/utils/functions/formatNumberToMinutes';

const RecordsInfo: React.FC = () => {
  const infoBarStore = {
    selectedFile: useStore(useInfoBarStore, (state) => state.selectedFile),
  };

  return (
    <>
      {!!infoBarStore.selectedFile ? (
        <div
          className='flex w-[90%] flex-col
            '
        >
          <ul className='my-4 rounded-lg border-2 px-6 py-4 dark:border-duoGrayDark-light'>
            <li className='w-full border-b-2 text-center text-duoGreen-default dark:border-duoGrayDark-light dark:text-duoBlueDark-text'>
              INFORMATION
            </li>
          </ul>
        </div>
      ) : null}
    </>
  );
};

export default RecordsInfo;
