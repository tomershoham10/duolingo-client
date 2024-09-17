'use client';
import { useStore } from 'zustand';
import Upload from '@/components/Upload/page';
import Slider from '@/components/Slider/page';
import SwitchButton from '@/components/SwitchButton/page';
import Dropdown, { DropdownSizes } from '@/components/Dropdown';
import { ExercisesTypes } from '@/app/API/classes-service/exercises/functions';
import { BucketsNames } from '@/app/API/files-service/functions';
import { isFSAMetadata } from '@/app/_utils/functions/filesMetadata/functions';
import { formatNumberToMinutes } from '@/app/_utils/functions/formatNumberToMinutes';
import { useFetchTargets } from '@/app/_utils/hooks/(dropdowns)/useFechTargets';

interface SoptreccRecordMetaProps {
  file: File | null;
  metadata: Partial<FSAMetadata>;
  fileType: BucketsNames;
  handleFileChange: (files: File | File[] | null) => void;
  handleFileRemoved: (fileIndex: number | undefined) => void;
  handleFileLength: (time: number | null) => void;
  updateMetadata: (field: string, val: any) => void;
}
const SoptreccRecordMetadata: React.FC<SoptreccRecordMetaProps> = (props) => {
  const {
    file,
    metadata,
    fileType,
    handleFileChange,
    handleFileRemoved,
    handleFileLength,
    updateMetadata,
  } = props;

  console.log('SoptreccRecordMetadata', metadata, isFSAMetadata(metadata));

  const targetsList = useFetchTargets();

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
                  fileLength={handleFileLength}
                />
              </section>
              {file?.name ? (
                <div className='text-lg font-extrabold opacity-60'>
                  {file.name}
                </div>
              ) : null}
            </section>
          </section>
          <div className='col-span-1 flex items-center justify-between'>
            <span className='text-lg font-bold opacity-80 3xl:text-xl'>
              Does the record included in Italkia?
            </span>

            <SwitchButton
              onSwitch={(isChecked) => {
                updateMetadata('is_in_italy', !isChecked);
                console.log(!isChecked);
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
                onChange={handleRangeChange}
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default SoptreccRecordMetadata;
