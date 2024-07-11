'use client';
import { useState } from 'react';
import { useStore } from 'zustand';
import Upload from '@/components/Upload/page';
import Slider from '@/components/Slider/page';
import SwitchButton from '@/components/SwitchButton/page';
import Dropdown, { DropdownSizes } from '@/components/Dropdown/page';
import { ExercisesTypes } from '@/app/API/classes-service/exercises/functions';
import { BucketsNames } from '@/app/API/files-service/functions';
import { isFSAMetadata } from '@/app/utils/functions/filesMetadata/functions';
import { formatNumberToMinutes } from '@/app/utils/functions/formatNumberToMinutes';
import { useTargetStore } from '@/app/store/stores/useTargetStore';

interface SoptreccRecordMetaProps {
  file: Partial<FileType>;
  fileType: BucketsNames;
  handleFileChange: (files: File | File[] | null) => void;
  handleFileRemoved: (fileIndex: number | undefined) => void;
  handleFileLength: (time: number | null) => void;
}
const SoptreccRecordMetadata: React.FC<SoptreccRecordMetaProps> = (props) => {
  const {
    file,
    fileType,
    handleFileChange,
    handleFileRemoved,
    handleFileLength,
  } = props;
  const targetsList = useStore(useTargetStore, (state) => state.targets);

  const [rangeVal, setRangeVal] = useState<number>(0);

  const handleRangeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // recordMetaDispatch({
    //   type: recordMetaAction.SET_DIFFICULTY_LEVEL,
    //   payload: Number(event.target.value),
    // });
    setRangeVal(Number(event.target.value));
    console.log(Number(event.target.value));
  };

  return (
    <>
      {isFSAMetadata(file.metadata) ? (
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
                    exerciseType: ExercisesTypes.FSA,
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
              {file.name ? (
                <div className='text-lg font-extrabold opacity-60'>
                  {file.name}
                </div>
              ) : null}
            </section>
          </section>
          {/* <div className='mt-12 grid w-full grid-cols-2 grid-rows-5 gap-x-12 gap-y-2 px-4 py-4 3xl:gap-y-12'> */}
          <div className='col-span-1 flex items-center justify-between'>
            <span className='text-lg font-bold opacity-80 3xl:text-xl'>
              Does the record included in Italkia?
            </span>

            <SwitchButton
              onSwitch={(isChecked) =>
                //   recordMetaDispatch({
                //     type: recordMetaAction.SET_ITALY_STATUS,
                //     payload: isChecked,
                //   })

                console.log(isChecked)
              }
            />
          </div>

          <div className='col-span-1 flex items-center justify-start gap-4 2xl:justify-between'>
            <span className='text-lg font-bold opacity-80 3xl:text-xl'>
              Record length:
            </span>
            <span className='text-xl font-bold tracking-wide 3xl:text-2xl'>
              {!!file.metadata.record_length
                ? formatNumberToMinutes(file.metadata.record_length)
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
                onChange={(targetName) =>
                  // recordMetaDispatch({
                  //   type: recordMetaAction.SET_TARGETS_IDS,
                  //   payload: [
                  //     targetsList
                  //       ? targetsList.filter(
                  //           (target) => target.name === targetName
                  //         )[0]._id
                  //       : '',
                  //   ],
                  // })
                  console.log(targetName)
                }
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
                //   value={recordMetaState.difficulty_level}
                value={rangeVal}
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

export default SoptreccRecordMetadata;
