'use client';
import { useCallback, useMemo, useReducer } from 'react';
import pRetry from 'p-retry';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import Slider from '@/components/Slider/page';
import Input, { InputTypes } from '@/components/Input/page';
import SwitchButton from '@/components/(buttons)/SwitchButton/page';
import Dropdown, { DropdownSizes } from '@/components/Dropdown';
import {
  FileTypes,
  NumberOfChannels,
  SignatureTypes,
  SonarSystem,
  updateMetadata,
} from '@/app/API/files-service/functions';
import Button, {
  ButtonColors,
  ButtonTypes,
} from '@/components/(buttons)/Button/page';
import {
  EditRecordMetadataAction,
  editRecordMetadataReducer,
} from '@/reducers/adminView/(popups)/(metadata)/editRecordMetadataReducer';
import { formatNumberToMinutes } from '@/app/_utils/functions/formatNumberToMinutes';

library.add(faXmark);

interface RecordsMetadataPopupProps {
  mainTypeId: string;
  subTypeId: string;
  model: TargetType;
  selectedFile: Partial<FileType>;
}

const RecordsMetadataPopup: React.FC<RecordsMetadataPopupProps> = (props) => {
  const { mainTypeId, subTypeId, model, selectedFile } = props;
  console.log('RecordsMetadataPopup', selectedFile);
  const metadata = useMemo(() => {
    return selectedFile.metadata as Partial<RecordMetadata>;
  }, [selectedFile]);
  const handleRangeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    recordMetadataDispatch({
      type: EditRecordMetadataAction.SET_DIFFICULTY_LEVEL,
      payload: Number(event.target.value),
    });
  };

  const initialRecordMetadataState = {
    difficulty_level: metadata.difficulty_level || null,
    number_of_channels: metadata.number_of_channels || null,
    sonograms_names: metadata.sonograms_names || [],
    targets_ids_list: metadata.targets_ids_list || [],
    operation: metadata.operation || null,
    source_id: metadata.source_id || null,
    is_in_italy: metadata.is_in_italy || null,
    aux: metadata.aux || null,
    is_backround_vessels: metadata.is_backround_vessels || null,
    signature_type: metadata.signature_type || null,
    sonar_system: metadata.sonar_system || null,
  };

  const [recordMetadataState, recordMetadataDispatch] = useReducer(
    editRecordMetadataReducer,
    initialRecordMetadataState
  );

  const submitMetadata = useCallback(async () => {
    const updateMetadataObj = Object.fromEntries(
      Object.entries(recordMetadataState).filter(
        ([_, value]) => value !== null && value !== undefined
      )
    );
    const response = await pRetry(
      () => {
        console.log('filtered metadata', updateMetadataObj);
        selectedFile.name &&
          updateMetadata(
            mainTypeId,
            subTypeId,
            model._id,
            FileTypes.RECORDS,
            selectedFile.name,
            updateMetadataObj
          );
      },
      {
        retries: 5,
      }
    );
    console.log('submitMetadata response', response);
  }, [
    mainTypeId,
    model._id,
    recordMetadataState,
    selectedFile.name,
    subTypeId,
  ]);

  return (
    <section className='h-full w-full items-start justify-start px-4 py-4'>
      <div className='grid w-full grid-cols-2 grid-rows-5 gap-x-12 gap-y-2 3xl:gap-y-12'>
        <div className='col-span-1 flex items-center justify-between'>
          <span className='text-lg font-bold opacity-80 3xl:text-xl'>
            Does the record included in Italkia?
          </span>

          <SwitchButton
            state={recordMetadataState.is_in_italy || false}
            onSwitch={(isChecked) => {
              recordMetadataDispatch({
                type: EditRecordMetadataAction.SET_ITALY_STATUS,
                payload: !isChecked,
              });
            }}
          />
        </div>

        <div className='col-span-1 flex items-center justify-start gap-4 2xl:justify-between'>
          <span className='text-lg font-bold opacity-80 3xl:text-xl'>
            Record length:
          </span>
          <span className='text-xl font-bold tracking-wide 3xl:text-2xl'>
            {metadata.record_length
              ? formatNumberToMinutes(metadata.record_length)
              : 'NaN'}
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
                recordMetadataDispatch({
                  type: EditRecordMetadataAction.SET_SIGNATURE_TYPE,
                  payload: trans as SignatureTypes,
                });
              }}
              size={DropdownSizes.SMALL}
              value={recordMetadataState.signature_type || undefined}
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
                recordMetadataDispatch({
                  type: EditRecordMetadataAction.SET_SONAR_SYSTEM,
                  payload: sonarSys as SonarSystem,
                });
              }}
              size={DropdownSizes.SMALL}
              value={recordMetadataState.sonar_system || undefined}
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
              placeholder={
                recordMetadataState.number_of_channels
                  ? recordMetadataState.number_of_channels === 1
                    ? NumberOfChannels.MONO
                    : recordMetadataState.number_of_channels === 2
                      ? NumberOfChannels.STEREO
                      : 'channels'
                  : 'channels'
              }
              items={Object.values(NumberOfChannels)}
              onChange={(channel) => {
                let noOfChannel: number =
                  recordMetadataState.number_of_channels || 1;
                switch (channel) {
                  case NumberOfChannels.MONO:
                    noOfChannel = 1;
                    break;
                  case NumberOfChannels.STEREO:
                    noOfChannel = 2;
                    break;
                  default:
                    noOfChannel = recordMetadataState.number_of_channels || 1;
                    break;
                }
                recordMetadataDispatch({
                  type: EditRecordMetadataAction.SET_NUMBER_OF_CHANNELS,
                  payload: noOfChannel,
                });
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
              value={recordMetadataState.source_id || undefined}
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
              onChange={(text: string) => {}}
              value={recordMetadataState.operation || undefined}
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
              value={recordMetadataState.difficulty_level || 0}
              onChange={handleRangeChange}
            />
          </div>
        </div>
      </div>
      <section className='flex w-full justify-end'>
        <Button
          label={'Update'}
          buttonType={ButtonTypes.SUBMIT}
          color={ButtonColors.BLUE}
          onClick={submitMetadata}
          className='w-[8rem]'
        />
      </section>
    </section>
  );
};

export default RecordsMetadataPopup;
