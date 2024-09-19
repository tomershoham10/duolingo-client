'use client';
import { lazy, useState } from 'react';
import Upload from '@/components/Upload/page';
import Button, { ButtonColors } from '@/components/(buttons)/Button/page';
import { ExercisesTypes } from '@/app/API/classes-service/exercises/functions';
import {
  BucketsNames,
  SignatureTypes,
  SonarSystem,
} from '@/app/API/files-service/functions';
import SwitchButton from '@/components/(buttons)/SwitchButton/page';
import { isFSAMetadata } from '@/app/_utils/functions/filesMetadata/functions';
import { formatNumberToMinutes } from '@/app/_utils/functions/formatNumberToMinutes';
import Dropdown, { DropdownSizes } from '@/components/Dropdown';
import { useStore } from 'zustand';
import { useSourceStore } from '@/app/store/stores/useSourceStore';
import Input, { InputTypes } from '@/components/Input/page';
import Slider from '@/components/Slider/page';
import { useFetchTargets } from '@/app/_utils/hooks/(dropdowns)/useFechTargets';
const Sonograms = lazy(() => import('./Sonograms/page'));

interface FSAMetaProps {
  file: File | null;
  metadata: Partial<FSAMetadata>;
  fileType: BucketsNames;
  handleFileChange: (files: File | File[] | null) => void;
  handleFileRemoved: (fileIndex: number | undefined) => void;
  handleFileLength: (time: number | null) => void;
  updateMetadata: (field: string, val: any) => void;
}
const FSAMetadata: React.FC<FSAMetaProps> = (props) => {
  const {
    file,
    metadata,
    fileType,
    handleFileChange,
    handleFileRemoved,
    handleFileLength,
    updateMetadata,
  } = props;
  const sourcesList = useStore(useSourceStore, (state) => state.sources);
  const targetsList = useFetchTargets();

  const [inFsaSelectSonogram, setInFsaSelectSonogram] =
    useState<boolean>(false);

  const handleRangeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateMetadata('difficulty_level', Number(event.target.value));

    console.log(Number(event.target.value));
  };

  return (
    <>
      {isFSAMetadata(metadata) ? (
        <div className='mt-8 grid w-full grid-cols-2 gap-x-6 gap-y-4 px-4 py-4 3xl:gap-y-12'>
          <section className='col-span-2 grid grid-cols-2 gap-x-4 border-b-2 border-duoGrayDark-light'>
            <section className='flex flex-row items-center justify-start gap-4'>
              <section className='w-fit'>
                <Upload
                  label={'Add record'}
                  filesTypes='.wav'
                  isMultiple={false}
                  bucketName={BucketsNames.RECORDS}
                  exerciseType={ExercisesTypes.FSA}
                  showMode={false}
                  files={{
                    name: file?.name || '',
                    metadata: {},
                  }}
                  onFileChange={handleFileChange}
                  onFileRemoved={handleFileRemoved}
                  fileLength={(time) => {
                    fileType === BucketsNames.RECORDS
                      ? handleFileLength(time)
                      : null;
                  }}
                />
              </section>
              {file?.name ? (
                <div className='text-lg font-extrabold opacity-60'>
                  {file.name}
                </div>
              ) : null}
            </section>
            <div className='flex flex-row items-center justify-start'>
              <Button
                color={ButtonColors.WHITE}
                label='add sonogram'
                onClick={() => setInFsaSelectSonogram(true)}
              />
              {inFsaSelectSonogram ? (
                <Sonograms onClose={() => setInFsaSelectSonogram(false)} />
              ) : null}
            </div>
          </section>
          <div className='col-span-1 flex items-center justify-between'>
            <span className='text-lg font-bold opacity-80 3xl:text-xl'>
              Does the record included in Italkia?
            </span>

            <SwitchButton
              onSwitch={(isChecked) => {
                updateMetadata('is_in_italy', isChecked);

                console.log(isChecked);
              }}
            />
          </div>

          <div className='col-span-1 flex items-center justify-start gap-4 2xl:justify-between'>
            <span className='text-lg font-bold opacity-80 3xl:text-xl'>
              Record length:
            </span>
            <span className='text-xl font-bold tracking-wide 3xl:text-2xl'>
              {!!metadata.record_length
                ? formatNumberToMinutes(metadata.record_length)
                : '00:00:00'}
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
                onChange={(trans) => {
                  updateMetadata('signature_type', trans);

                  console.log(trans);
                }}
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
                items={Object.values(SonarSystem)}
                onChange={(sonarSys) => {
                  updateMetadata('sonar_system', sonarSys);

                  console.log(sonarSys);
                }}
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
                onChange={(channel) => {
                  updateMetadata('channels_number', channel);

                  console.log(channel);
                }}
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
                items={
                  targetsList ? targetsList.map((target) => target.name) : []
                }
                onChange={(targetName) => {
                  updateMetadata(
                    'targets_ids_list',
                    targetsList
                      ? targetsList.filter(
                          (target) => target.name === targetName
                        )[0]._id
                      : ''
                  );

                  console.log(targetName);
                }}
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
                items={
                  sourcesList ? sourcesList.map((source) => source.name) : []
                }
                onChange={(sourceName) => {
                  if (sourcesList) {
                    const sourceId = sourcesList.filter(
                      (source) => source.name === sourceName
                    )[0]._id;
                    console.log(sourceId);
                    updateMetadata('source_id', sourceId);
                  }
                }}
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
                value={metadata.operation || ''}
                onChange={(text: string) => {
                  updateMetadata('operation', text);

                  console.log(text);
                }}
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
                value={metadata.difficulty_level || 0}
                // value={rangeVal}
                onChange={handleRangeChange}
              />
            </div>
          </div>
        </div>
      ) : // </div>
      null}
    </>
  );
};

export default FSAMetadata;
