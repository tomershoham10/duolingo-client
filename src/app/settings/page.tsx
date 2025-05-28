'use client';
import { lazy, useCallback, useEffect, useState } from 'react';
import { useInfoBarStore } from '@/app/store/stores/useInfoBarStore';
import Table, { TableHead } from '@/components/Table/page';
import { useFetchTargets } from '@/app/_utils/hooks/(dropdowns)/useFechTargets';
// import useModelsTableData from '@/app/_utils/hooks/useModelsTableData';
import Button, {
  ButtonColors,
  ButtonTypes,
} from '@/components/(buttons)/Button/page';
import { faArrowUpFromBracket } from '@fortawesome/free-solid-svg-icons';
import { PopupsTypes, usePopupStore } from '@/app/store/stores/usePopupStore';
import TargetsDropdowns from '@/components/TargetsDropdowns';
import { useStore } from 'zustand';
import { useDropdownSelections } from '@/app/_utils/hooks/(dropdowns)/useDropdownSelections';
import TableSkeleton from '@/components/Table/TableSkeleton';
import { HiCog } from 'react-icons/hi';


const Settings: React.FC = () => {
  const targetsList = useFetchTargets();

  const [selectedSettingsRowIndex, setSelectedSettingsRowIndex] =
    useState<number>(-1);


  return (
    <section className='flex h-full w-full flex-col px-6 pb-4 text-duoGray-darkest dark:text-duoGrayDark-lightest'>
      <div className='flex flex-col gap-3 py-6'>
        {/* Header Section */}
        <section className='flex w-full items-center justify-between'>
          <div className='flex items-center gap-4'>
            <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-duoBlue-default dark:bg-duoBlueDark-default'>
              <HiCog className='h-7 w-7 text-white' />
            </div>
            <div>
              <h1 className='text-3xl font-extrabold text-duoGray-darkest dark:text-duoGrayDark-lightest'>
                Settings
              </h1>
              <p className='text-duoGray-dark dark:text-duoGrayDark-light'>
                Manage your application settings
              </p>
            </div>
          </div>
        </section>
      </div>
      
    </section>
  );
};
export default Settings;
