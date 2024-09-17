'use client';
import { usePopupStore } from '@/app/store/stores/usePopupStore';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import SwitchButton from '@/components/SwitchButton/page';

import Dropdown, { DropdownSizes } from '@/components/Dropdown';
import { SignatureTypes } from '@/app/API/files-service/functions';
import Input, { InputTypes } from '@/components/Input/page';
import Slider from '@/components/Slider/page';

library.add(faXmark);

const FSARecMetaPopup: React.FC = () => {
  const handleRangeChange = (event: React.ChangeEvent<HTMLInputElement>) => {};

  return (
    <div className='w-full items-start justify-start'>
      <div className='mt-12 grid w-full grid-cols-2 grid-rows-5 gap-x-12 gap-y-2 px-4 py-4 3xl:gap-y-12'>
        <div className='col-span-1 flex items-center justify-between'>
          <span className='text-lg font-bold opacity-80 3xl:text-xl'>
            Does the record included in Italkia?
          </span>

          <SwitchButton onSwitch={(isChecked) => {}} />
        </div>

        <div className='col-span-1 flex items-center justify-start gap-4 2xl:justify-between'>
          <span className='text-lg font-bold opacity-80 3xl:text-xl'>
            Record length:
          </span>
          <span className='text-xl font-bold tracking-wide 3xl:text-2xl'>
            00:00:00
          </span>
        </div>

        <div className='col-span-1 flex items-center justify-between'>
          <span className='text-lg font-bold opacity-80 3xl:text-xl'>
            Signature type:
          </span>
          <div className='w-[12rem]'>
            <Dropdown
              isSearchable={false}
              placeholder={'Signature'}
              items={Object.values(SignatureTypes)}
              onChange={(trans) => {}}
              size={DropdownSizes.SMALL}
            />
          </div>
        </div>

        <div className='col-span-1 flex items-center justify-between'>
          <span className='text-lg font-bold opacity-80 3xl:text-xl'>
            Sonar system:
          </span>
          <div className='w-[12rem]'>
            <Dropdown
              isSearchable={false}
              placeholder={'S. system'}
              items={['demon', 'lofar']}
              onChange={(sonarSys) => {}}
              size={DropdownSizes.SMALL}
            />
          </div>
        </div>

        <div className='col-span-1 flex items-center justify-between'>
          <span className='text-lg font-bold opacity-80 3xl:text-xl'>
            No. of channels:
          </span>
          <div className='w-[12rem]'>
            <Dropdown
              isSearchable={false}
              placeholder={'channels'}
              items={['Mono', 'Stereo']}
              onChange={(channel) => {}}
              size={DropdownSizes.SMALL}
            />
          </div>
        </div>

        <div className='col-span-1 flex items-center justify-between'>
          <span className='text-lg font-bold opacity-80 3xl:text-xl'>
            Target:
          </span>
          <div className='w-[12rem]'>
            <Dropdown
              isSearchable={true}
              placeholder={'Targets'}
              items={[]}
              onChange={(targetName) => {}}
              size={DropdownSizes.SMALL}
            />
          </div>
        </div>
        <div className='col-span-1 flex items-center justify-between'>
          <span className='text-lg font-bold opacity-80 3xl:text-xl'>
            Source:
          </span>
          <div className='w-[12rem]'>
            <Dropdown
              isSearchable={true}
              placeholder={'Source'}
              items={[]}
              onChange={(sourceName) => {}}
              size={DropdownSizes.SMALL}
            />
          </div>
        </div>
        <div className='col-span-1 flex items-center justify-between'>
          <span className='text-lg font-bold opacity-80 3xl:text-xl'>
            Operation name:
          </span>
          <div className='w-[12rem]'>
            <Input
              type={InputTypes.TEXT}
              value={''}
              onChange={(text: string) => {}}
            />
          </div>
        </div>

        <div className='col-span-2 flex flex-row items-center justify-between gap-4 3xl:py-10'>
          <span className='min-w-fit text-lg font-bold opacity-80 3xl:text-xl'>
            difficulty level:
          </span>
          <div className='relative my-5 w-full'>
            <Slider
              isMultiple={false}
              min={0}
              max={10}
              step={0.5}
              value={5}
              onChange={handleRangeChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FSARecMetaPopup;
